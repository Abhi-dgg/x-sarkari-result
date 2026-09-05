import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { geminiService } from './server/gemini';
import { monitoringService } from './server/monitoring';

const PORT = 3000;

async function startServer() {
  const app = express();

  // JSON & URL-encoded body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

  app.post('/api/jobs', (req: Request, res: Response) => {
    try {
      const newJob = db.createJob(req.body);
      res.status(201).json(newJob);
    } catch (e: any) {
      res.status(400).json({ error: e?.message || 'Failed to create job' });
    }
  });

  app.put('/api/jobs/:slug', (req: Request, res: Response) => {
    const updated = db.updateJob(req.params.slug, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json(updated);
  });

  app.delete('/api/jobs/:slug', (req: Request, res: Response) => {
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
  // AI & Official Source Monitoring APIs
  // ==========================================
  app.post('/api/ai/extract', async (req: Request, res: Response) => {
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

  app.post('/api/ai/seo', async (req: Request, res: Response) => {
    const { title, organization, category } = req.body;
    try {
      const seo = await geminiService.generateSEO(title || '', organization || '', category || 'Jobs');
      res.json(seo);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'SEO generation failed' });
    }
  });

  app.get('/api/ai/drafts', (req: Request, res: Response) => {
    res.json(db.getAIDrafts());
  });

  app.post('/api/ai/drafts/:id/approve', (req: Request, res: Response) => {
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
      status: 'PUBLISHED',
      verificationStatus: 'ADMIN_VERIFIED',
      verifiedBy: 'Administrator',
      verifiedDate: new Date().toISOString(),
      seoTitle: `${draft.extractedTitle} - Check Details | X Sarkari Job`,
      metaDescription: `Apply for ${draft.extractedTitle} by ${draft.organization}. Check eligibility, dates, and direct links.`,
      canonicalUrl: `https://xsarkarijob.com/jobs/${draftData.slug}`,
      isHot: false
    });

    db.updateAIDraftStatus(req.params.id, 'APPROVED');
    res.json({ success: true, job: publishedJob });
  });

  app.post('/api/ai/drafts/:id/reject', (req: Request, res: Response) => {
    const { reason } = req.body;
    const updated = db.updateAIDraftStatus(req.params.id, 'REJECTED', reason || 'Rejected by Admin');
    if (!updated) {
      res.status(404).json({ error: 'AI Draft not found' });
      return;
    }
    res.json(updated);
  });

  // Source Monitoring Management
  app.get('/api/sources', (req: Request, res: Response) => {
    res.json(db.getSources());
  });

  app.post('/api/sources', (req: Request, res: Response) => {
    const newSrc = db.addSource(req.body);
    res.status(201).json(newSrc);
  });

  app.put('/api/sources/:id', (req: Request, res: Response) => {
    const updated = db.updateSource(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Source not found' });
      return;
    }
    res.json(updated);
  });

  app.delete('/api/sources/:id', (req: Request, res: Response) => {
    const ok = db.deleteSource(req.params.id);
    res.json({ success: ok });
  });

  app.post('/api/sources/:id/scan', async (req: Request, res: Response) => {
    try {
      const result = await monitoringService.scanSource(req.params.id);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Scan failed' });
    }
  });

  app.post('/api/sources/scan-all', async (req: Request, res: Response) => {
    try {
      const results = await monitoringService.scanAllActiveSources();
      res.json({ success: true, scannedCount: results.length, results });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Bulk scan failed' });
    }
  });

  // Broken Link Checker
  app.post('/api/links/check', async (req: Request, res: Response) => {
    const { urls } = req.body;
    if (!Array.isArray(urls)) {
      res.status(400).json({ error: 'Expected array of URLs' });
      return;
    }
    const results = await Promise.all(urls.slice(0, 10).map(u => monitoringService.checkLink(u)));
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

  app.get('/api/contact/messages', (req: Request, res: Response) => {
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
  app.get('/api/settings', (req: Request, res: Response) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  });

  // Admin Dashboard Statistics
  app.get('/api/stats', (req: Request, res: Response) => {
    res.json(db.getStats());
  });

  // ==========================================
  // Simple Secure Admin Authentication
  // ==========================================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Default seeded credentials: admin@xsarkarijob.com / admin123
    if ((email === 'admin@xsarkarijob.com' || email === 'admin') && password === 'admin123') {
      res.json({
        success: true,
        user: {
          id: 'user-admin-1',
          name: 'Super Administrator',
          email: 'admin@xsarkarijob.com',
          role: 'SUPER_ADMIN'
        },
        token: 'xsj-session-token-' + Date.now()
      });
    } else if (email === 'editor@xsarkarijob.com' && password === 'editor123') {
      res.json({
        success: true,
        user: {
          id: 'user-editor-1',
          name: 'Senior Content Editor',
          email: 'editor@xsarkarijob.com',
          role: 'EDITOR'
        },
        token: 'xsj-session-token-' + Date.now()
      });
    } else {
      res.status(401).json({ error: 'Invalid admin email or password' });
    }
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
