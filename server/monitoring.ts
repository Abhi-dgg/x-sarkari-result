import { db } from './db';
import { geminiService } from './gemini';
import { validateOfficialUrl } from './security';

export interface SourceScanResult {
  sourceId: string;
  sourceUrl: string;
  scannedAt: string;
  status: 'HEALTHY' | 'CHANGED_DETECTED' | 'ERROR';
  message: string;
  draftCreated?: boolean;
  draftId?: string;
}

export const monitoringService = {
  /**
   * Scan a specific configured official source
   */
  async scanSource(sourceId: string): Promise<SourceScanResult> {
    const source = db.getSourceById(sourceId);
    if (!source) {
      throw new Error(`Source not found with ID: ${sourceId}`);
    }
    if (!validateOfficialUrl(source.sourceUrl)) {
      throw new Error('Source URL must be an approved HTTPS government domain');
    }

    try {
      // Fetch only a bounded HTML response from an approved official source.
      let rawNoticeText = '';
      try {
        const res = await fetch(source.sourceUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 X-Sarkari-Job-Monitor/1.0'
          },
          signal: AbortSignal.timeout(8000)
        });

        if (!res.ok) throw new Error(`Official source returned HTTP ${res.status}`);
        if (!res.headers.get('content-type')?.includes('text/html')) throw new Error('Official source did not return HTML');
        const html = await res.text();
        // Extract text snippet
        rawNoticeText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 5000);
      } catch (fetchErr) {
        db.updateSource(sourceId, { lastChecked: new Date().toISOString(), status: 'ERROR' });
        return { sourceId, sourceUrl: source.sourceUrl, scannedAt: new Date().toISOString(), status: 'ERROR', message: 'Official source could not be fetched; no draft was created.' };
      }

      // Check for duplicate notice
      const existingJobs = db.getAllAdminJobs();
      const extracted = await geminiService.extractJobData(rawNoticeText, source.sourceUrl);
      
      const duplicateCheck = geminiService.detectDuplicate(
        extracted.title,
        extracted.organization,
        extracted.advertisementNumber,
        existingJobs
      );

      if (duplicateCheck.isDuplicate && duplicateCheck.matchedJob) {
        // Flag change detection instead of duplicate spam
        const changes = await geminiService.detectChanges(duplicateCheck.matchedJob, rawNoticeText);
        db.updateSource(sourceId, {
          lastChecked: new Date().toISOString(),
          status: 'CHANGED_DETECTED'
        });

        return {
          sourceId,
          sourceUrl: source.sourceUrl,
          scannedAt: new Date().toISOString(),
          status: 'CHANGED_DETECTED',
          message: `Notice already tracked in "${duplicateCheck.matchedJob.title}". Detected updates: ${changes.join(', ')}`
        };
      }

      // Create an AI draft for Admin Review
      const draft = db.addAIDraft({
        sourceId: source.id,
        sourceUrl: source.sourceUrl,
        sourceTitle: extracted.title,
        organization: extracted.organization,
        category: extracted.category || source.category,
        extractedTitle: extracted.title,
        extractedData: {
          slug: extracted.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
          title: extracted.title,
          shortDescription: `AI-extracted details from ${source.organization}. A reviewer must verify the official notice before publication.`,
          organization: extracted.organization,
          organizationSlug: source.organization.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          recruitmentName: extracted.recruitmentName,
          advertisementNumber: extracted.advertisementNumber,
          category: extracted.category,
          state: extracted.state,
          totalVacancy: extracted.totalVacancy,
          educationalQualification: extracted.educationalQualification,
          ageLimitMin: extracted.ageLimitMin,
          ageLimitMax: extracted.ageLimitMax,
          ageLimitAsOn: extracted.ageLimitAsOn,
          salaryPayScale: extracted.salaryPayScale,
          importantDates: extracted.importantDates,
          applicationFees: extracted.applicationFees,
          selectionProcess: extracted.selectionProcess,
          postWiseVacancies: [],
          requiredDocuments: [],
          howToApply: [],
          importantInstructions: ['AI-generated draft: verify all fields against the official notice before publication.'],
          importantLinks: [
            { label: 'Apply Online Link', url: extracted.applyUrl || source.officialWebsite, linkType: 'APPLY', isOfficial: true },
            { label: 'Official Notification PDF', url: extracted.officialNotificationUrl || source.sourceUrl, linkType: 'NOTIFICATION', isOfficial: true },
            { label: 'Official Commission Portal', url: source.officialWebsite, linkType: 'OFFICIAL_WEBSITE', isOfficial: true }
          ],
          sourceUrl: source.sourceUrl,
          sourceName: `${source.organization} Official Portal`,
          status: 'NEEDS_REVIEW',
          verificationStatus: 'AI_VERIFIED'
        },
        confidenceScore: extracted.confidenceScore,
        suspiciousFields: extracted.suspiciousFields,
        detectedChanges: ['Potential update detected; human verification is required before publication.'],
        status: 'NEEDS_REVIEW'
      });

      db.updateSource(sourceId, {
        lastChecked: new Date().toISOString(),
        status: 'HEALTHY'
      });

      return {
        sourceId,
        sourceUrl: source.sourceUrl,
        scannedAt: new Date().toISOString(),
        status: 'HEALTHY',
        message: `Draft created with an AI confidence score of ${extracted.confidenceScore}%. It is not published or officially verified.`,
        draftCreated: true,
        draftId: draft.id
      };
    } catch (err: any) {
      db.updateSource(sourceId, {
        lastChecked: new Date().toISOString(),
        status: 'ERROR'
      });
      return {
        sourceId,
        sourceUrl: source.sourceUrl,
        scannedAt: new Date().toISOString(),
        status: 'ERROR',
        message: `Scan failed: ${err?.message || 'Network timeout or blocked request'}`
      };
    }
  },

  /**
   * Scan all active sources
   */
  async scanAllActiveSources(): Promise<SourceScanResult[]> {
    const sources = db.getSources().filter(s => s.isActive);
    const results: SourceScanResult[] = [];
    for (const src of sources) {
      const res = await this.scanSource(src.id);
      results.push(res);
    }
    return results;
  },

  /**
   * Check link status for a single URL or multiple URLs
   */
  async checkLink(url: string): Promise<{ url: string; status: number; ok: boolean; type: string }> {
    if (!url || !url.startsWith('http')) {
      return { url, status: 0, ok: false, type: 'INVALID' };
    }
    try {
      const res = await fetch(url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'X-Sarkari-Job-LinkChecker/1.0' },
        signal: AbortSignal.timeout(5000)
      });
      return {
        url,
        status: res.status,
        ok: res.ok,
        type: res.status >= 200 && res.status < 300 ? '200 OK' : res.status >= 300 && res.status < 400 ? 'Redirect' : 'Client/Server Error'
      };
    } catch (e: any) {
      return {
        url,
        status: 504,
        ok: false,
        type: 'Connection Timeout / Unreachable'
      };
    }
  }
};
