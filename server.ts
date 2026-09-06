import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { geminiService } from './server/gemini';
import { aiService, AI_MODELS } from './server/aiService';
import { monitoringService } from './server/monitoring';
import { syncService } from './server/syncService';
import { clearSessionCookie, createSession, requireRole, setSessionCookie, validateOfficialUrl } from './server/security';

const PORT = 3000;

async function startServer() {
  const app = express();

  // JSON & URL-encoded body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.disable('x-powered-by');

  const requestCounts = new Map<string, { count: number; resetAt: number }>();
  app.use('/api', (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const entry = requestCounts.get(key);
    const now = Date.now();
    const state = !entry || entry.resetAt < now ? { count: 0, resetAt: now + 60_000 } : entry;
    state.count += 1;
    requestCounts.set(key, state);
    if (state.count > 60) return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
    next();
  });

  // Basic request logger & security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // ==========================================
  // SEO: Dynamic Robots.txt and Sitemap.xml
  // ==========================================
  app.get('/robots.txt', (req: Request, res: Response) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xsarkarijob.com';
    const robots = `User-agent: *
Allow: /
Allow: /jobs/
Allow: /results/
Allow: /admit-card/
Allow: /answer-key/
Allow: /syllabus/
Allow: /category/
Allow: /state/
Allow: /search
Allow: /about
Allow: /contact
Allow: /privacy-policy
Allow: /terms
Allow: /disclaimer

Disallow: /admin
Disallow: /api/
Disallow: /drafts/

Sitemap: ${siteUrl}/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(robots);
  });

  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xsarkarijob.com';
    const currentDate = new Date().toISOString().split('T')[0];

    const staticPages = [
      '',
      '/jobs',
      '/results',
      '/admit-card',
      '/answer-key',
      '/syllabus',
      '/admission',
      '/scholarship',
      '/search',
      '/tools/age-calculator',
      '/tools/percentage-calculator',
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms',
      '/disclaimer',
      '/cookie-policy'
    ];

    const jobs = db.getJobs({ limit: 100 }).items;
    const results = db.getResults({ limit: 50 });
    const admitCards = db.getAdmitCards({ limit: 50 });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const p of staticPages) {
      xml += `
  <url>
    <loc>${siteUrl}${p}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    }

    for (const job of jobs) {
      xml += `
  <url>
    <loc>${siteUrl}/jobs/${job.slug}</loc>
    <lastmod>${job.updatedAt.split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    }

    for (const r of results) {
      xml += `
  <url>
    <loc>${siteUrl}/results/${r.slug}</loc>
    <lastmod>${r.updatedAt.split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    for (const ac of admitCards) {
      xml += `
  <url>
    <loc>${siteUrl}/admit-card/${ac.slug}</loc>
    <lastmod>${ac.updatedAt.split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // ==========================================
  // Public & Content APIs
  // ==========================================
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      platform: 'X Sarkari Job API',
      geminiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // Real-Time 24/7 Sync with Result Bharat & Sarkari Result
  app.get('/api/sync/live', (req: Request, res: Response) => {
    res.json(syncService.getStatus());
  });

  app.get('/api/sync/monitoring-status', (req: Request, res: Response) => {
    res.json(syncService.getStatus());
  });

  app.post('/api/sync/live', requireRole('SUPER_ADMIN', 'EDITOR'), (req: Request, res: Response) => {
    const result = syncService.triggerSync();
    res.json(result);
  });

  app.post('/api/sync/scan-both-portals', requireRole('SUPER_ADMIN', 'EDITOR'), (req: Request, res: Response) => {
    const result = syncService.triggerSync();
    res.json(result);
  });

  app.get('/api/sync/resultbharat', (req: Request, res: Response) => {
    res.json(syncService.getStatus());
  });

  // Breaking notices ticker
  app.get('/api/notices', (req: Request, res: Response) => {
    res.json(db.getNotices());
  });

  // Taxonomy: Categories, States, Organizations
  app.get('/api/categories', (req: Request, res: Response) => {
    res.json(db.getCategories());
  });

  app.get('/api/states', (req: Request, res: Response) => {
    res.json(db.getStates());
  });

  app.get('/api/organizations', (req: Request, res: Response) => {
    res.json(db.getOrganizations());
  });

  // Global Search across jobs, results, admit cards, syllabus
  app.get('/api/search', (req: Request, res: Response) => {
    const q = ((req.query.q as string) || '').toLowerCase().trim();
    const category = req.query.category as string;
    const state = req.query.state as string;
    const type = (req.query.type as string) || 'all';

    const jobsResult = db.getJobs({ search: q, category, state });
    const results = db.getResults({ category }).filter(r => 
      !q || r.title.toLowerCase().includes(q) || r.examName.toLowerCase().includes(q)
    );
    const admitCards = db.getAdmitCards({ category }).filter(a => 
      !q || a.title.toLowerCase().includes(q) || a.examName.toLowerCase().includes(q)
    );
    const answerKeys = db.getAnswerKeys({ category }).filter(ak => 
      !q || ak.title.toLowerCase().includes(q) || ak.examName.toLowerCase().includes(q)
    );
    const syllabus = db.getSyllabusList({ category }).filter(s => 
      !q || s.title.toLowerCase().includes(q) || s.examName.toLowerCase().includes(q)
    );

    res.json({
      query: q,
      totalMatches: jobsResult.total + results.length + admitCards.length + answerKeys.length + syllabus.length,
      jobs: type === 'all' || type === 'jobs' ? jobsResult.items : [],
      results: type === 'all' || type === 'results' ? results : [],
      admitCards: type === 'all' || type === 'admit-cards' ? admitCards : [],
      answerKeys: type === 'all' || type === 'answer-keys' ? answerKeys : [],
      syllabus: type === 'all' || type === 'syllabus' ? syllabus : []
    });
  });

  // Jobs Endpoints
  app.get('/api/jobs', (req: Request, res: Response) => {
    const category = req.query.category as string;
    const state = req.query.state as string;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    const data = db.getJobs({ category, state, status, search, limit, offset });
    res.json(data);
  });

  app.get('/api/jobs/:slug', (req: Request, res: Response) => {
    const slug = req.params.slug;
    const job = db.getJobBySlug(slug);
    if (!job) {
      res.status(404).json({ error: 'Job announcement not found' });
      return;
    }
    db.incrementJobView(slug);

    // Provide contextual related items
    const relatedJobs = db.getJobs({ category: job.category, limit: 4 }).items.filter(j => j.slug !== slug);
    const relatedResults = db.getResults({ category: job.category, limit: 2 });
    const relatedAdmitCards = db.getAdmitCards({ category: job.category, limit: 2 });
    const relatedSyllabus = db.getSyllabusList({ category: job.category, limit: 2 });

    res.json({
      job,
      related: {
        jobs: relatedJobs,
        results: relatedResults,
        admitCards: relatedAdmitCards,
        syllabus: relatedSyllabus
      }
    });
  });

  app.post('/api/jobs', requireRole('SUPER_ADMIN', 'EDITOR'), (req: Request, res: Response) => {
    try {
      if (req.user?.role !== 'SUPER_ADMIN' && (req.body?.status === 'PUBLISHED' || req.body?.verificationStatus === 'ADMIN_VERIFIED')) {
        res.status(403).json({ error: 'Only a super administrator can publish or mark content as admin verified.' });
        return;
      }
      if (!req.body?.slug || !req.body?.title || !req.body?.sourceUrl) {
        res.status(400).json({ error: 'slug, title, and sourceUrl are required.' });
        return;
      }
      const newJob = db.createJob(req.body);
      res.status(201).json(newJob);
    } catch (e: any) {
      res.status(400).json({ error: e?.message || 'Failed to create job' });
    }
  });

  app.put('/api/jobs/:slug', requireRole('SUPER_ADMIN', 'EDITOR'), (req: Request, res: Response) => {
    if (req.user?.role !== 'SUPER_ADMIN' && (req.body.status === 'PUBLISHED' || req.body.verificationStatus === 'ADMIN_VERIFIED')) {
      res.status(403).json({ error: 'Only a super administrator can publish or mark content as admin verified.' });
      return;
    }
    const updated = db.updateJob(req.params.slug, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json(updated);
  });

  app.delete('/api/jobs/:slug', requireRole('SUPER_ADMIN'), (req: Request, res: Response) => {
    const ok = db.deleteJob(req.params.slug);
    if (!ok) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json({ success: true });
  });

  // Results Endpoints
  app.get('/api/results', (req: Request, res: Response) => {
    const category = req.query.category as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    res.json(db.getResults({ category, limit }));
  });

  app.get('/api/results/:slug', (req: Request, res: Response) => {
    const result = db.getResultBySlug(req.params.slug);
    if (!result) {
      res.status(404).json({ error: 'Result not found' });
      return;
    }
    res.json(result);
  });

  // Admit Cards Endpoints
  app.get('/api/admit-cards', (req: Request, res: Response) => {
    const category = req.query.category as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    res.json(db.getAdmitCards({ category, limit }));
  });

  app.get('/api/admit-cards/:slug', (req: Request, res: Response) => {
    const admitCard = db.getAdmitCardBySlug(req.params.slug);
    if (!admitCard) {
      res.status(404).json({ error: 'Admit card not found' });
      return;
    }
    res.json(admitCard);
  });

  // Answer Keys Endpoints
  app.get('/api/answer-keys', (req: Request, res: Response) => {
    const category = req.query.category as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    res.json(db.getAnswerKeys({ category, limit }));
  });

  app.get('/api/answer-keys/:slug', (req: Request, res: Response) => {
    const ak = db.getAnswerKeyBySlug(req.params.slug);
    if (!ak) {
      res.status(404).json({ error: 'Answer key not found' });
      return;
    }
    res.json(ak);
  });

  // Syllabus Endpoints
  app.get('/api/syllabus', (req: Request, res: Response) => {
    const category = req.query.category as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    res.json(db.getSyllabusList({ category, limit }));
  });

  app.get('/api/syllabus/:slug', (req: Request, res: Response) => {
    const item = db.getSyllabusBySlug(req.params.slug);
    if (!item) {
      res.status(404).json({ error: 'Syllabus not found' });
      return;
    }
    res.json(item);
  });

  // ==========================================
  // Official Attachment Link Fallback Redirect
  // ==========================================
  app.get(['/api/attachment/*', '/uploads/*', '*/Notice_GD_2026.pdf', '*/Notice_CGL_2026.pdf'], (req: Request, res: Response) => {
    // Graceful redirect to the live official notice board
    res.redirect(302, 'https://ssc.gov.in/notice-board');
  });

  // ==========================================
  // Multi-Model AI (GPT-4o, Claude 3.5, Grok, Gemini)
  // ==========================================
  app.get('/api/ai/models', (req: Request, res: Response) => {
    res.json(AI_MODELS);
  });

  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const { message, model, context } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    try {
      const response = await aiService.chat(message.trim(), model || 'gpt-4o', context);
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'AI chat request failed' });
    }
  });

  app.post('/api/ai/fact-check', async (req: Request, res: Response) => {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Query is required for fact checking' });
      return;
    }
    try {
      const report = await geminiService.factCheckAndReview(query.trim());
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Fact-checking failed' });
    }
  });

  app.post('/api/ai/extract', requireRole('SUPER_ADMIN', 'EDITOR', 'REVIEWER'), async (req: Request, res: Response) => {
    const { sourceText, sourceUrl } = req.body;
    if (!sourceText && !sourceUrl) {
      res.status(400).json({ error: 'Missing sourceText or sourceUrl' });
      return;
    }
    try {
      const extracted = await geminiService.extractJobData(sourceText || '', sourceUrl || 'https://ssc.gov.in');
      res.json(extracted);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'AI extraction failed' });
    }
  });

  app.post('/api/ai/seo', requireRole('SUPER_ADMIN', 'EDITOR'), async (req: Request, res: Response) => {
    const { title, organization, category } = req.body;
    try {
      const seo = await geminiService.generateSEO(title || '', organization || '', category || 'Jobs');
      res.json(seo);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'SEO generation failed' });
    }
  });

  app.get('/api/ai/drafts', requireRole('SUPER_ADMIN', 'EDITOR', 'REVIEWER'), (req: Request, res: Response) => {
    res.json(db.getAIDrafts());
  });

  app.post('/api/ai/drafts/:id/approve', requireRole('SUPER_ADMIN', 'EDITOR'), (req: Request, res: Response) => {
    const draft = db.getAIDraftById(req.params.id);
    if (!draft) {
      res.status(404).json({ error: 'AI Draft not found' });
      return;
    }

    // Convert draft to published Job
    const draftData = draft.extractedData;
    const publishedJob = db.createJob({
      slug: (draftData.slug || draft.extractedTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60),
      title: draftData.title || draft.extractedTitle,
      shortDescription: draftData.shortDescription || `${draft.organization} official announcement.`,
      organization: draft.organization,
      organizationSlug: draft.organization.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      recruitmentName: draftData.recruitmentName || draft.extractedTitle,
      advertisementNumber: draftData.advertisementNumber || 'Notice-2026',
      category: draft.category || 'Other Government Jobs',
      state: draftData.state || 'All India',
      totalVacancy: draftData.totalVacancy || 'Refer Notification',
      importantDates: draftData.importantDates || [],
      applicationFees: draftData.applicationFees || [],
      paymentMode: draftData.paymentMode || 'Online Payment Gateway',
      ageLimitMin: draftData.ageLimitMin,
      ageLimitMax: draftData.ageLimitMax,
      ageLimitAsOn: draftData.ageLimitAsOn,
      ageRelaxationRules: draftData.ageRelaxationRules,
      educationalQualification: draftData.educationalQualification || 'Check Official Notification',
      postWiseVacancies: draftData.postWiseVacancies || [],
      selectionProcess: draftData.selectionProcess || ['Written Examination'],
      examPattern: draftData.examPattern,
      salaryPayScale: draftData.salaryPayScale,
      requiredDocuments: draftData.requiredDocuments || ['Photo', 'Signature', 'Certificate'],
      howToApply: draftData.howToApply || ['Apply online on official website.'],
      importantInstructions: draftData.importantInstructions || ['Verify all details before submitting.'],
      importantLinks: draftData.importantLinks || [],
      sourceUrl: draft.sourceUrl,
      sourceName: `${draft.organization} Official Release`,
      status: 'NEEDS_REVIEW',
      verificationStatus: 'AI_VERIFIED',
      seoTitle: `${draft.extractedTitle} - Check Details | X Sarkari Job`,
      metaDescription: `Apply for ${draft.extractedTitle} by ${draft.organization}. Check eligibility, dates, and direct links.`,
      canonicalUrl: `https://xsarkarijob.com/jobs/${draftData.slug}`,
      isHot: false
    });

    db.updateAIDraftStatus(req.params.id, 'APPROVED');
    res.json({ success: true, job: publishedJob, message: 'Draft converted to a job awaiting human verification and publication.' });
  });

  app.post('/api/ai/drafts/:id/reject', requireRole('SUPER_ADMIN', 'EDITOR', 'REVIEWER'), (req: Request, res: Response) => {
    const { reason } = req.body;
    const updated = db.updateAIDraftStatus(req.params.id, 'REJECTED', reason || 'Rejected by Admin');
    if (!updated) {
      res.status(404).json({ error: 'AI Draft not found' });
      return;
    }
    res.json(updated);
  });

  // Source Monitoring Management
  app.get('/api/sources', requireRole('SUPER_ADMIN', 'EDITOR', 'REVIEWER'), (req: Request, res: Response) => {
    res.json(db.getSources());
  });

  app.post('/api/sources', requireRole('SUPER_ADMIN', 'EDITOR'), (req: Request, res: Response) => {
    const sourceUrl = validateOfficialUrl(req.body?.sourceUrl);
    const officialWebsite = validateOfficialUrl(req.body?.officialWebsite);
    if (!sourceUrl || !officialWebsite || typeof req.body?.organization !== 'string' || typeof req.body?.category !== 'string') {
      res.status(400).json({ error: 'A valid approved HTTPS government source URL, website, organization, and category are required.' });
      return;
    }
    const newSrc = db.addSource({ ...req.body, sourceUrl, officialWebsite });
    res.status(201).json(newSrc);
  });

  app.put('/api/sources/:id', requireRole('SUPER_ADMIN', 'EDITOR'), (req: Request, res: Response) => {
    if (req.body?.sourceUrl && !validateOfficialUrl(req.body.sourceUrl)) {
      res.status(400).json({ error: 'Source URL must be an approved HTTPS government domain.' });
      return;
    }
    if (req.body?.officialWebsite && !validateOfficialUrl(req.body.officialWebsite)) {
      res.status(400).json({ error: 'Official website must be an approved HTTPS government domain.' });
      return;
    }
    const updated = db.updateSource(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Source not found' });
      return;
    }
    res.json(updated);
  });

  app.delete('/api/sources/:id', requireRole('SUPER_ADMIN'), (req: Request, res: Response) => {
    const ok = db.deleteSource(req.params.id);
    res.json({ success: ok });
  });

  app.post('/api/sources/:id/scan', requireRole('SUPER_ADMIN', 'EDITOR'), async (req: Request, res: Response) => {
    try {
      const result = await monitoringService.scanSource(req.params.id);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Scan failed' });
    }
  });

  app.post('/api/sources/scan-all', requireRole('SUPER_ADMIN', 'EDITOR'), async (req: Request, res: Response) => {
    try {
      const results = await monitoringService.scanAllActiveSources();
      res.json({ success: true, scannedCount: results.length, results });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Bulk scan failed' });
    }
  });

  // Broken Link Checker
  app.post('/api/links/check', requireRole('SUPER_ADMIN', 'EDITOR', 'REVIEWER'), async (req: Request, res: Response) => {
    const { urls } = req.body;
    if (!Array.isArray(urls)) {
      res.status(400).json({ error: 'Expected array of URLs' });
      return;
    }
    const safeUrls = urls.slice(0, 10).map(validateOfficialUrl);
    if (safeUrls.some(url => !url)) return res.status(400).json({ error: 'Only approved HTTPS government URLs can be checked.' });
    const results = await Promise.all(safeUrls.map(url => monitoringService.checkLink(url!)));
    res.json(results);
  });

  // ==========================================
  // Contact & Notification Subscriptions
  // ==========================================
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, subject, message, honeypot } = req.body;

    // Spam honeypot protection: bots fill invisible field
    if (honeypot) {
      res.status(200).json({ success: true, message: 'Message sent.' });
      return;
    }

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Please provide name, email, and message.' });
      return;
    }

    const saved = db.addContactMessage({ name, email, subject: subject || 'General Inquiry', message });
    res.status(201).json({ success: true, id: saved.id, message: 'Your message has been received securely.' });
  });

  app.get('/api/contact/messages', requireRole('SUPER_ADMIN', 'EDITOR'), (req: Request, res: Response) => {
    res.json(db.getContactMessages());
  });

  app.post('/api/subscribe', (req: Request, res: Response) => {
    const { email, categories: userCats } = req.body;
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Valid email address required.' });
      return;
    }
    const sub = db.addSubscriber(email, userCats || []);
    res.status(201).json({ success: true, message: 'Successfully subscribed to exam alerts!', subscriber: sub });
  });

  // Site Settings
  app.get('/api/settings', requireRole('SUPER_ADMIN'), (req: Request, res: Response) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', requireRole('SUPER_ADMIN'), (req: Request, res: Response) => {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  });

  // Admin Dashboard Statistics
  app.get('/api/stats', requireRole('SUPER_ADMIN', 'EDITOR', 'REVIEWER'), (req: Request, res: Response) => {
    res.json(db.getStats());
  });

  // ==========================================
  // Simple Secure Admin Authentication
  // ==========================================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      res.status(503).json({ error: 'Admin authentication is not configured.' });
      return;
    }
    if (email === adminEmail && password === adminPassword) {
      const token = createSession(adminEmail, 'SUPER_ADMIN');
      setSessionCookie(res, token);
      res.json({
        success: true,
        user: {
          id: 'user-admin-1',
          name: 'Super Administrator',
          email: adminEmail,
          role: 'SUPER_ADMIN'
        },
        token: undefined
      });
    } else {
      res.status(401).json({ error: 'Invalid admin email or password' });
    }
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    clearSessionCookie(res);
    res.status(204).end();
  });

  // ==========================================
  // Vite Integration (SPA Fallback)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`X Sarkari Job server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
