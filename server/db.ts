import { 
  Job, 
  ResultItem, 
  AdmitCardItem, 
  AnswerKeyItem, 
  SyllabusItem, 
  NoticeItem, 
  Source, 
  AIDraft, 
  User, 
  ContactMessage, 
  SiteSettings 
} from '../src/types';
import { 
  initialCategories, 
  initialStates, 
  initialOrganizations, 
  initialUsers, 
  initialNotices, 
  initialJobs, 
  initialResults, 
  initialAdmitCards, 
  initialAnswerKeys, 
  initialSyllabus, 
  initialSources, 
  initialAIDrafts, 
  initialSiteSettings, 
  initialContactMessages 
} from './data/seedData';

// In-Memory storage engine ensuring full interactive operations
let categories = [...initialCategories];
let states = [...initialStates];
let organizations = [...initialOrganizations];
let users = [...initialUsers];
let notices = [...initialNotices];
let jobs = [...initialJobs];
let results = [...initialResults];
let admitCards = [...initialAdmitCards];
let answerKeys = [...initialAnswerKeys];
let syllabusList = [...initialSyllabus];
let sources = [...initialSources];
let aiDrafts = [...initialAIDrafts];
let contactMessages = [...initialContactMessages];
let siteSettings: SiteSettings = { ...initialSiteSettings };
let subscribers: { id: string; email: string; categories: string[]; createdAt: string }[] = [
  { id: 'sub-1', email: 'aspirant.rahul@example.com', categories: ['SSC', 'Railway'], createdAt: '2026-09-01T00:00:00.000Z' }
];

export const db = {
  // Categories & States
  getCategories: () => categories,
  getStates: () => states,
  getOrganizations: () => organizations,

  // Notices / Ticker
  getNotices: () => notices.filter(n => n.status === 'PUBLISHED'),
  getAllNotices: () => notices,
  addNotice: (notice: NoticeItem) => {
    notices.unshift(notice);
    return notice;
  },

  // Jobs
  getJobs: (options?: { 
    category?: string; 
    state?: string; 
    status?: string; 
    search?: string; 
    limit?: number; 
    offset?: number 
  }) => {
    let list = [...jobs];
    if (options?.status) {
      list = list.filter(j => j.status === options.status);
    } else {
      list = list.filter(j => j.status === 'PUBLISHED');
    }
    if (options?.category && options.category !== 'All') {
      list = list.filter(j => j.category.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.state && options.state !== 'All India') {
      list = list.filter(j => j.state.toLowerCase() === options.state?.toLowerCase());
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.organization.toLowerCase().includes(q) || 
        j.recruitmentName.toLowerCase().includes(q) ||
        j.advertisementNumber.toLowerCase().includes(q)
      );
    }
    const total = list.length;
    if (options?.offset) list = list.slice(options.offset);
    if (options?.limit) list = list.slice(0, options.limit);
    return { items: list, total };
  },

  getAllAdminJobs: () => jobs,

  getJobBySlug: (slug: string) => {
    return jobs.find(j => j.slug === slug);
  },

  createJob: (jobData: Omit<Job, 'id' | 'viewCount' | 'publishedAt' | 'updatedAt'> & { id?: string }) => {
    const newJob: Job = {
      ...jobData,
      id: jobData.id || `job-${Date.now()}`,
      viewCount: 0,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    jobs.unshift(newJob);
    return newJob;
  },

  updateJob: (slug: string, updates: Partial<Job>) => {
    const index = jobs.findIndex(j => j.slug === slug);
    if (index === -1) return null;
    jobs[index] = {
      ...jobs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return jobs[index];
  },

  deleteJob: (slugOrId: string) => {
    const target = (slugOrId || '').trim();
    const index = jobs.findIndex(j => 
      j.slug === target || 
      j.id === target || 
      j.slug.toLowerCase() === target.toLowerCase()
    );
    if (index === -1) return false;
    jobs.splice(index, 1);
    return true;
  },

  incrementJobView: (slug: string) => {
    const job = jobs.find(j => j.slug === slug);
    if (job) {
      job.viewCount = (job.viewCount || 0) + 1;
    }
  },

  // Results
  getResults: (options?: { category?: string; limit?: number }) => {
    let list = results.filter(r => r.status === 'PUBLISHED');
    if (options?.category && options.category !== 'All') {
      list = list.filter(r => r.category.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.limit) list = list.slice(0, options.limit);
    return list;
  },
  getResultBySlug: (slug: string) => results.find(r => r.slug === slug),
  createResult: (item: ResultItem) => {
    results.unshift(item);
    return item;
  },
  deleteResult: (slugOrId: string) => {
    const target = (slugOrId || '').trim();
    const index = results.findIndex(r => r.slug === target || r.id === target);
    if (index === -1) return false;
    results.splice(index, 1);
    return true;
  },

  // Admit Cards
  getAdmitCards: (options?: { category?: string; limit?: number }) => {
    let list = admitCards.filter(a => a.status === 'PUBLISHED');
    if (options?.category && options.category !== 'All') {
      list = list.filter(a => a.category.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.limit) list = list.slice(0, options.limit);
    return list;
  },
  getAdmitCardBySlug: (slug: string) => admitCards.find(a => a.slug === slug),
  createAdmitCard: (item: AdmitCardItem) => {
    admitCards.unshift(item);
    return item;
  },
  deleteAdmitCard: (slugOrId: string) => {
    const target = (slugOrId || '').trim();
    const index = admitCards.findIndex(a => a.slug === target || a.id === target);
    if (index === -1) return false;
    admitCards.splice(index, 1);
    return true;
  },

  // Answer Keys
  getAnswerKeys: (options?: { category?: string; limit?: number }) => {
    let list = answerKeys.filter(ak => ak.status === 'PUBLISHED');
    if (options?.category && options.category !== 'All') {
      list = list.filter(ak => ak.category.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.limit) list = list.slice(0, options.limit);
    return list;
  },
  getAnswerKeyBySlug: (slug: string) => answerKeys.find(ak => ak.slug === slug),
  createAnswerKey: (item: AnswerKeyItem) => {
    answerKeys.unshift(item);
    return item;
  },
  deleteAnswerKey: (slugOrId: string) => {
    const target = (slugOrId || '').trim();
    const index = answerKeys.findIndex(ak => ak.slug === target || ak.id === target);
    if (index === -1) return false;
    answerKeys.splice(index, 1);
    return true;
  },
  // Syllabus
  getSyllabusList: (options?: { category?: string; limit?: number }) => {
    let list = syllabusList.filter(s => s.status === 'PUBLISHED');
    if (options?.category && options.category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.limit) list = list.slice(0, options.limit);
    return list;
  },
  getSyllabusBySlug: (slug: string) => syllabusList.find(s => s.slug === slug),
  createSyllabus: (item: SyllabusItem) => {
    syllabusList.unshift(item);
    return item;
  },

  // Sources & Monitoring
  getSources: () => sources,
  getSourceById: (id: string) => sources.find(s => s.id === id),
  addSource: (source: Omit<Source, 'id'>) => {
    const newSource: Source = {
      ...source,
      id: `src-${Date.now()}`
    };
    sources.unshift(newSource);
    return newSource;
  },
  updateSource: (id: string, updates: Partial<Source>) => {
    const index = sources.findIndex(s => s.id === id);
    if (index === -1) return null;
    sources[index] = { ...sources[index], ...updates };
    return sources[index];
  },
  deleteSource: (id: string) => {
    const index = sources.findIndex(s => s.id === id);
    if (index === -1) return false;
    sources.splice(index, 1);
    return true;
  },

  // AI Drafts
  getAIDrafts: () => aiDrafts,
  getAIDraftById: (id: string) => aiDrafts.find(d => d.id === id),
  addAIDraft: (draft: Omit<AIDraft, 'id' | 'createdAt'>) => {
    const newDraft: AIDraft = {
      ...draft,
      id: `aidraft-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    aiDrafts.unshift(newDraft);
    return newDraft;
  },
  updateAIDraftStatus: (id: string, status: 'NEEDS_REVIEW' | 'APPROVED' | 'REJECTED', reason?: string) => {
    const draft = aiDrafts.find(d => d.id === id);
    if (!draft) return null;
    draft.status = status;
    if (reason) draft.rejectionReason = reason;
    return draft;
  },

  // Contact Messages
  getContactMessages: () => contactMessages,
  addContactMessage: (data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const message: ContactMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      status: 'UNREAD',
      createdAt: new Date().toISOString()
    };
    contactMessages.unshift(message);
    return message;
  },
  updateContactMessageStatus: (id: string, status: ContactMessage['status']) => {
    const msg = contactMessages.find(m => m.id === id);
    if (msg) msg.status = status;
    return msg;
  },

  // Subscribers
  addSubscriber: (email: string, userCategories: string[]) => {
    const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.categories = Array.from(new Set([...existing.categories, ...userCategories]));
      return existing;
    }
    const newSub = {
      id: `sub-${Date.now()}`,
      email,
      categories: userCategories.length > 0 ? userCategories : ['SSC', 'Railway', 'UPSC', 'Banking'],
      createdAt: new Date().toISOString()
    };
    subscribers.push(newSub);
    return newSub;
  },
  getSubscribersCount: () => subscribers.length,

  // Settings
  getSettings: () => siteSettings,
  updateSettings: (updates: Partial<SiteSettings>) => {
    siteSettings = { ...siteSettings, ...updates };
    return siteSettings;
  },

  // Users
  getUserByEmail: (email: string) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getUsers: () => users,

  // Admin Dashboard Statistics
  getStats: () => {
    const totalJobs = jobs.length;
    const publishedJobs = jobs.filter(j => j.status === 'PUBLISHED').length;
    const draftJobs = jobs.filter(j => j.status === 'DRAFT').length;
    const pendingReview = aiDrafts.filter(d => d.status === 'NEEDS_REVIEW').length;
    const totalResults = results.length;
    const totalAdmitCards = admitCards.length;
    const totalAnswerKeys = answerKeys.length;
    const totalSyllabus = syllabusList.length;
    const totalSources = sources.length;
    const healthySources = sources.filter(s => s.status === 'HEALTHY').length;
    const unreadMessages = contactMessages.filter(m => m.status === 'UNREAD').length;
    const totalSubscribers = subscribers.length;

    return {
      totalJobs,
      publishedJobs,
      draftJobs,
      pendingReview,
      totalResults,
      totalAdmitCards,
      totalAnswerKeys,
      totalSyllabus,
      totalSources,
      healthySources,
      unreadMessages,
      totalSubscribers
    };
  }
};
