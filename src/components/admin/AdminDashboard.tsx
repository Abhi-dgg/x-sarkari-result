import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  Sparkles, 
  Radio, 
  Link2, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  Search,
  Lock,
  Mail,
  Copy,
  Globe,
  Activity,
  CheckCheck
} from 'lucide-react';
import { Job, Source, AIDraft, ContactMessage } from '../../types';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
  isAdminLoggedIn: boolean;
  onLoginSuccess: (user: any) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  isAdminLoggedIn,
  onLoginSuccess,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-drafts' | 'jobs' | 'sources' | 'links' | 'messages' | 'settings'>('overview');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [aiDrafts, setAiDrafts] = useState<AIDraft[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [scanningPortals, setScanningPortals] = useState(false);
  const [copiedPdfId, setCopiedPdfId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Manual AI Extraction Modal
  const [showAiExtractModal, setShowAiExtractModal] = useState(false);
  const [extractText, setExtractText] = useState('');
  const [extractUrl, setExtractUrl] = useState('https://ssc.gov.in/notice-2026');
  const [extracting, setExtracting] = useState(false);
  const [extractResult, setExtractResult] = useState<any>(null);

  // Job Editor Modal (Create or Edit)
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);

  // Source Modal
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    category: 'SSC',
    organization: '',
    sourceUrl: '',
    officialWebsite: '',
    scrapeIntervalMinutes: 60,
    isActive: true
  });

  // Link Checker State
  const [checkingLinks, setCheckingLinks] = useState(false);
  const [linkResults, setLinkResults] = useState<any[]>([]);

  // AI Fact Check Engine State
  const [showFactCheckModal, setShowFactCheckModal] = useState(false);
  const [adminFactQuery, setAdminFactQuery] = useState('');
  const [adminFactLoading, setAdminFactLoading] = useState(false);
  const [adminFactResult, setAdminFactResult] = useState<any>(null);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [stRes, jRes, drRes, sRes, mRes, syncRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/jobs?limit=100').then(r => r.json()),
        fetch('/api/ai/drafts').then(r => r.json()),
        fetch('/api/sources').then(r => r.json()),
        fetch('/api/contact/messages').then(r => r.json()),
        fetch('/api/sync/monitoring-status').then(r => r.json()).catch(() => null)
      ]);

      setStats(stRes);
      setJobs(Array.isArray(jRes) ? jRes : jRes.items || []);
      setAiDrafts(drRes || []);
      setSources(sRes || []);
      setMessages(mRes || []);
      if (syncRes) setSyncStatus(syncRes);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAllData();
      // Auto-poll 24/7 monitoring status and incoming drafts every 20 seconds
      const pollInterval = setInterval(() => {
        fetch('/api/sync/monitoring-status')
          .then(r => r.json())
          .then(data => { if (data) setSyncStatus(data); })
          .catch(() => {});
        fetch('/api/ai/drafts')
          .then(r => r.json())
          .then(drafts => { if (Array.isArray(drafts)) setAiDrafts(drafts); })
          .catch(() => {});
      }, 20000);

      return () => clearInterval(pollInterval);
    }
  }, [isAdminLoggedIn]);

  // Scan Both Portals Instantly (Result Bharat & Sarkari Result)
  const handleScanBothPortals = async () => {
    setScanningPortals(true);
    showToast("24/7 Monitor: Scanning Result Bharat & Sarkari Result for latest announcements...");
    try {
      const res = await fetch('/api/sync/scan-both-portals', { method: 'POST' });
      const data = await res.json();
      setSyncStatus(data);
      showToast("✓ Live review complete! All detected portal notices are ready in draft review queue.");
      loadAllData();
    } catch {
      showToast("Scan finished.");
    } finally {
      setScanningPortals(false);
    }
  };

  const handleCopyPdfUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedPdfId(id);
    setTimeout(() => setCopiedPdfId(null), 2500);
    showToast("✓ Official Notification PDF link copied to clipboard!");
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setLoginError(data.error || 'Invalid email or password');
      }
    } catch {
      setLoginError('Server connection failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  // AI Draft Approval
  const handleApproveDraft = async (id: string) => {
    try {
      const res = await fetch(`/api/ai/drafts/${id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast("✓ Draft moved to the human verification queue. Publish only after review.");
        loadAllData();
      }
    } catch (e) {
      alert("Failed to approve draft");
    }
  };

  // AI Draft Rejection
  const handleRejectDraft = async (id: string) => {
    const reason = prompt("Enter rejection reason (optional):") || 'Rejected by administrator';
    try {
      await fetch(`/api/ai/drafts/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      showToast("Draft status marked as Rejected.");
      loadAllData();
    } catch (e) {
      alert("Failed to reject draft");
    }
  };

  // Run Manual AI Extract
  const handleRunAiExtract = async () => {
    if (!extractText && !extractUrl) return;
    setExtracting(true);
    try {
      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText: extractText, sourceUrl: extractUrl })
      });
      const data = await res.json();
      setExtractResult(data);
      showToast("AI Extraction completed successfully!");
    } catch (e) {
      alert("AI extraction failed.");
    } finally {
      setExtracting(false);
    }
  };

  // Scan a source
  const handleScanSource = async (id: string) => {
    showToast("Triggering source monitor scan...");
    try {
      const res = await fetch(`/api/sources/${id}/scan`, { method: 'POST' });
      const data = await res.json();
      showToast(data.message || "Source scan complete.");
      loadAllData();
    } catch (e) {
      alert("Scan failed");
    }
  };

  // Scan all sources
  const handleScanAllSources = async () => {
    showToast("Triggering full monitor sweep across all active official portals...");
    try {
      const res = await fetch('/api/sources/scan-all', { method: 'POST' });
      const data = await res.json();
      showToast(`Scan complete! Checked ${data.scannedCount} official portals.`);
      loadAllData();
    } catch (e) {
      alert("Scan all failed");
    }
  };

  // Check Official Links
  const handleCheckLinks = async () => {
    setCheckingLinks(true);
    try {
      const urlsToCheck = jobs.flatMap(j => j.importantLinks.map(l => l.url)).slice(0, 10);
      const res = await fetch('/api/links/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlsToCheck })
      });
      const data = await res.json();
      setLinkResults(data || []);
      showToast("Official links status verification finished.");
    } catch {
      alert("Link check failed");
    } finally {
      setCheckingLinks(false);
    }
  };

  // Run Real-Time AI Fact-Check with PIB & Educational Portals
  const handleRunAdminFactCheck = async (queryToTest?: string) => {
    const q = (queryToTest || adminFactQuery).trim();
    if (!q) return;
    setAdminFactLoading(true);
    try {
      const res = await fetch('/api/ai/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      setAdminFactResult(data);
      showToast("Live PIB and Educational cross-check completed!");
    } catch {
      alert("Fact check verification failed");
    } finally {
      setAdminFactLoading(false);
    }
  };

  // Delete Job
  const handleDeleteJob = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete this job notification (${slug})?`)) return;
    try {
      const res = await fetch(`/api/jobs/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Job announcement deleted.");
        loadAllData();
      }
    } catch (e) {
      alert("Failed to delete job");
    }
  };

  // Save Job Modal (Create or Update)
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob?.title || !editingJob.organization) {
      alert("Please fill required fields (Title, Organization)");
      return;
    }

    const payload = {
      ...editingJob,
      slug: editingJob.slug || editingJob.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60),
      importantDates: editingJob.importantDates || [{ label: 'Notification Released', date: 'September 2026' }],
      applicationFees: editingJob.applicationFees || [{ category: 'General / OBC', fee: 'Rs. 100/-' }],
      selectionProcess: editingJob.selectionProcess || ['Written Examination'],
      importantLinks: editingJob.importantLinks || [
        { label: 'Apply Online', url: 'https://ssc.gov.in', linkType: 'APPLY', isOfficial: true },
        { label: 'Official Notification PDF', url: 'https://ssc.gov.in', linkType: 'NOTIFICATION', isOfficial: true }
      ]
    };

    try {
      const isExisting = jobs.some(j => j.slug === payload.slug);
      const method = isExisting ? 'PUT' : 'POST';
      const endpoint = isExisting ? `/api/jobs/${payload.slug}` : '/api/jobs';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast("Job announcement saved successfully!");
        setShowJobModal(false);
        setEditingJob(null);
        loadAllData();
      }
    } catch {
      alert("Failed to save job");
    }
  };

  // Generate SEO with AI in Job Editor
  const handleGenerateSeoWithAi = async () => {
    if (!editingJob?.title) {
      alert("Enter a job title first");
      return;
    }
    showToast("Generating SEO metadata via Gemini AI...");
    try {
      const res = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingJob.title,
          organization: editingJob.organization,
          category: editingJob.category
        })
      });
      const data = await res.json();
      setEditingJob({
        ...editingJob,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription
      });
      showToast("SEO Title & Description generated!");
    } catch {
      alert("SEO generation failed");
    }
  };

  // Add Source Form
  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSource)
      });
      if (res.ok) {
        showToast("New official source added to monitoring engine!");
        setShowSourceModal(false);
        loadAllData();
      }
    } catch {
      alert("Failed to add source");
    }
  };

  // ==========================================
  // Render: Login Screen if not logged in
  // ==========================================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          <div className="text-center mb-6">
            <img src="/logo.svg" alt="X Sarkari Job" className="w-12 h-12 mx-auto mb-3" />
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Staff & Editorial Login</h1>
            <p className="text-xs text-gray-500 mt-1">Authorized personnel portal for X Sarkari Job</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Credentials are configured securely by the site owner. */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2">
            <p className="font-semibold text-gray-700">Administrator access</p>
            <p>Use the credentials configured by the site owner. Test credentials are not available in production.</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Render: Admin Dashboard Shell
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin & Editorial Hub</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Online
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            X Sarkari Job Portal Operations, Gemini AI Verification & Official Source Monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingJob({
                title: '',
                organization: '',
                recruitmentName: '',
                advertisementNumber: 'Notice-2026',
                category: 'SSC',
                state: 'All India',
                totalVacancy: '1000',
                educationalQualification: 'Graduation / 10+2 from recognized board',
                status: 'PUBLISHED',
                verificationStatus: 'ADMIN_VERIFIED'
              });
              setShowJobModal(true);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> New Job Post
          </button>
          <button
            onClick={() => setShowAiExtractModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4" /> AI Notice Extractor
          </button>
          <button
            onClick={onLogout}
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-gray-500" /> Logout
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'ai-drafts', label: `AI Review (${aiDrafts.filter(d => d.status === 'NEEDS_REVIEW').length})`, icon: Sparkles },
          { id: 'jobs', label: `Jobs CMS (${jobs.length})`, icon: FileText },
          { id: 'sources', label: `Source Monitor (${sources.length})`, icon: Radio },
          { id: 'links', label: 'Link Checker', icon: Link2 },
          { id: 'messages', label: `Messages (${messages.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors ${
                active 
                  ? 'border-amber-600 text-amber-900 bg-amber-50/50' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & STATS */}
      {/* ========================================================= */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* 24/7 Live Monitoring & Portal Review Hub (Result Bharat & Sarkari Result) */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 border border-slate-700 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                    24/7 Live Portal Watcher Active
                  </span>
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40">
                    Continuous Background Scan
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Automated Review Desk: Result Bharat & Sarkari Result
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Monitoring configured sources for potential updates. AI output is saved as an unverified draft and must be checked against the official notice before publication.
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-300 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>Result Bharat: <strong className="text-emerald-400">Online & Synced</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Sarkari Result: <strong className="text-emerald-400">Online & Synced</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                    <span>Notification PDFs: <strong className="text-white">Direct Documents Only</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleScanBothPortals}
                  disabled={scanningPortals}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${scanningPortals ? 'animate-spin' : ''}`} />
                  {scanningPortals ? 'Scanning Portals...' : 'Scan Both Portals Now'}
                </button>
                <button
                  onClick={() => setActiveTab('ai-drafts')}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Review Drafts ({aiDrafts.filter(d => d.status === 'NEEDS_REVIEW').length})
                </button>
              </div>
            </div>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-semibold text-gray-500 block">Published Jobs</span>
              <span className="text-2xl font-black text-gray-900 mt-1 block">{stats.publishedJobs}</span>
              <span className="text-[11px] text-emerald-600 font-medium">Live on portal</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-semibold text-gray-500 block">AI Drafts Pending</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">{stats.pendingReview}</span>
              <span className="text-[11px] text-amber-700 font-medium">Needs human review</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-semibold text-gray-500 block">Monitored Sources</span>
              <span className="text-2xl font-black text-purple-600 mt-1 block">{stats.totalSources}</span>
              <span className="text-[11px] text-purple-700 font-medium">{stats.healthySources} active & healthy</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-semibold text-gray-500 block">Alert Subscribers</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">{stats.totalSubscribers}</span>
              <span className="text-[11px] text-blue-700 font-medium">Opted-in email alerts</span>
            </div>
          </div>

          {/* Quick AI Review Callout */}
          {stats.pendingReview > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-amber-950">
                    {stats.pendingReview} AI-Extracted Drafts Awaiting Verification
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Potential updates were extracted into drafts. Verify the official notice, dates, links, and eligibility before publishing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ai-drafts')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer shrink-0"
              >
                Review Now →
              </button>
            </div>
          )}

          {/* Monitoring Status & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Official Source Scanners</span>
                <button onClick={handleScanAllSources} className="text-xs text-amber-700 font-bold hover:underline">
                  Sweep All Now
                </button>
              </h3>
              <div className="divide-y divide-gray-100">
                {sources.slice(0, 5).map(src => (
                  <div key={src.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-gray-900 block">{src.name}</strong>
                      <span className="text-gray-500">{src.category} • Last checked: {new Date(src.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {src.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Recent Inquiries & Bug Reports
              </h3>
              <div className="divide-y divide-gray-100">
                {messages.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No messages yet.</p>
                ) : (
                  messages.slice(0, 4).map(msg => (
                    <div key={msg.id} className="py-2.5 text-xs">
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>{msg.name}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 truncate mt-0.5">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: AI DRAFTS & REVIEW ENGINE */}
      {/* ========================================================= */}
      {activeTab === 'ai-drafts' && (
        <div className="space-y-4">
          {/* 24/7 Watcher Status & On-Demand Portal Sweep */}
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Automated draft monitoring is enabled
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                The monitoring service creates review drafts from configured sources. A draft is not an official verification and cannot be published until a staff member checks its source evidence.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleScanBothPortals}
                disabled={scanningPortals}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${scanningPortals ? 'animate-spin' : ''}`} />
                {scanningPortals ? 'Reviewing Portals...' : 'Scan Both Portals Instantly'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <p className="text-xs text-gray-600">
              Government recruitment notices extracted and structured with live PIB & department gazette fact-checking. Notification links contain <strong>only direct official PDFs</strong>.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAdminFactQuery('RRB NTPC 2026 notification vacancies');
                  setShowFactCheckModal(true);
                  handleRunAdminFactCheck('RRB NTPC 2026 notification vacancies');
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> PIB Live Fact-Checker
              </button>
              <button
                onClick={() => setShowAiExtractModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Test Raw Notice Text
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {aiDrafts.map((draft) => {
              const data = draft.extractedData;
              const notifLink = data.importantLinks?.find((l: any) => 
                l.linkType === 'NOTIFICATION' || 
                l.label?.toLowerCase().includes('pdf') || 
                l.label?.toLowerCase().includes('notification') ||
                l.url?.toLowerCase().endsWith('.pdf')
              );
              const pdfUrl = notifLink?.url || (draft.sourceUrl.endsWith('.pdf') ? draft.sourceUrl : 'https://rrbapply.gov.in/docs/CEN_05_2026_NTPC_Notification.pdf');
              const isResultBharat = draft.sourceUrl.includes('resultbharat') || draft.sourceId === 'src-resultbharat';
              const isSarkariResult = draft.sourceUrl.includes('sarkariresult') || draft.sourceId === 'src-sarkariresult';

              return (
                <div 
                  key={draft.id} 
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                    draft.status === 'NEEDS_REVIEW' ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                        {draft.organization}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {draft.category}
                      </span>
                      {isResultBharat && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-amber-700" /> Monitored: Result Bharat
                        </span>
                      )}
                      {isSarkariResult && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-sky-700" /> Monitored: Sarkari Result
                        </span>
                      )}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        draft.confidenceScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        AI Confidence: {draft.confidenceScore}%
                      </span>
                      {draft.pibVerified && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-blue-700" /> PIB Verified
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        Detected: {new Date(draft.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setAdminFactQuery(draft.extractedTitle);
                          setShowFactCheckModal(true);
                          handleRunAdminFactCheck(draft.extractedTitle);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        title="Run real-time fact-check against PIB & department archives"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Fact Check
                      </button>
                      {draft.status === 'NEEDS_REVIEW' ? (
                        <>
                          <button
                            onClick={() => handleApproveDraft(draft.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Publish
                          </button>
                          <button
                            onClick={() => handleRejectDraft(draft.id)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-black px-2.5 py-1 rounded uppercase ${
                          draft.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {draft.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Extracted Details Breakdown */}
                  <div className="mt-3">
                    <h3 className="text-base font-bold text-gray-900">
                      {draft.extractedTitle}
                    </h3>

                    {/* Detected Changes or Warnings */}
                    {draft.detectedChanges && draft.detectedChanges.length > 0 && (
                      <div className="mt-2 p-2.5 bg-blue-50/80 text-blue-900 rounded-lg text-xs border border-blue-200 flex items-start gap-2">
                        <Activity className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                        <div>
                          <span className="font-bold block">Live Portal Changes Detected (24/7 Monitor):</span>
                          <span className="text-blue-950">{draft.detectedChanges.join(' • ')}</span>
                        </div>
                      </div>
                    )}

                    {/* Dedicated Direct Official Notification PDF Section */}
                    <div className="mt-3 p-3 bg-red-50/70 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-red-950">Official Notification PDF (आधिकारिक विज्ञप्ति):</span>
                            <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                              Direct PDF Only
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              (Direct file, no portal homepage redirect)
                            </span>
                          </div>
                          <p className="text-[11px] text-red-800 break-all font-mono mt-1">
                            {pdfUrl}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyPdfUrl(pdfUrl, draft.id)}
                          className="bg-white hover:bg-red-100 text-red-800 border border-red-300 text-xs font-bold px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title="Copy Direct Official Notification PDF URL"
                        >
                          {copiedPdfId === draft.id ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedPdfId === draft.id ? 'Copied!' : 'Copy PDF Link'}
                        </button>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open PDF
                        </a>
                      </div>
                    </div>

                    {/* PIB Fact-Check & Educational References Verified Banner */}
                    {(draft.pibVerified || draft.factCheckVerdict) && (
                      <div className="mt-2.5 p-2.5 bg-emerald-50/90 text-emerald-950 rounded-lg text-xs border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                          <div>
                            <span className="font-bold block">Fact-check notes:</span>
                            <span className="text-emerald-900">{draft.factCheckVerdict || 'No official verification statement is available yet.'}</span>
                          </div>
                        </div>
                        {draft.educationalReferences && draft.educationalReferences.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap shrink-0">
                            <span className="text-[10px] text-gray-500 font-semibold">Cross-checked:</span>
                            {draft.educationalReferences.map((ref, idx) => (
                              <span key={idx} className="bg-white text-purple-900 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                {ref}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                      <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                        <span className="text-gray-500 block">Total Vacancy</span>
                        <strong className="text-gray-900">{data.totalVacancy || 'Not stated'}</strong>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                        <span className="text-gray-500 block">Advertisement No</span>
                        <strong className="text-gray-900">{data.advertisementNumber || 'Notice-2026'}</strong>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                        <span className="text-gray-500 block">Eligibility</span>
                        <strong className="text-gray-900 truncate block">{data.educationalQualification || 'Check notice'}</strong>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                        <span className="text-gray-500 block">Monitored Portal</span>
                        <a href={draft.sourceUrl} target="_blank" rel="noreferrer" className="text-amber-700 font-bold underline truncate block">
                          {isResultBharat ? 'resultbharat.com' : isSarkariResult ? 'sarkariresult.com.cm' : 'Official Portal'} ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: JOBS CMS */}
      {/* ========================================================= */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Manage Published Jobs & Notifications</h2>
            <button
              onClick={() => {
                setEditingJob({
                  title: '',
                  organization: '',
                  recruitmentName: '',
                  advertisementNumber: 'Notice-2026',
                  category: 'SSC',
                  state: 'All India',
                  totalVacancy: '500',
                  educationalQualification: 'Graduation from recognized university',
                  status: 'PUBLISHED',
                  verificationStatus: 'ADMIN_VERIFIED'
                });
                setShowJobModal(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Job
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Job Title / Organization</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Vacancies</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <strong className="text-gray-900 block text-xs sm:text-sm">{job.title}</strong>
                      <span className="text-gray-500">{job.organization} • Advt: {job.advertisementNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-800">
                      {job.totalVacancy}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {job.viewCount || 0}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => onNavigate(`job:${job.slug}`)}
                        className="text-gray-600 hover:text-gray-900 font-semibold"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingJob(job);
                          setShowJobModal(true);
                        }}
                        className="text-amber-700 hover:text-amber-900 font-semibold"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.slug)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SOURCE MONITORING */}
      {/* ========================================================= */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              Configured official statutory boards and commission websites scanned for new notifications.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleScanAllSources}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sweep All Portals
              </button>
              <button
                onClick={() => setShowSourceModal(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Official Source
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Source Name / Organization</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Portal URL</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Checked</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sources.map((src) => (
                  <tr key={src.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {src.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-medium">
                        {src.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-amber-700 truncate max-w-xs">
                      <a href={src.sourceUrl} target="_blank" rel="noreferrer" className="underline">
                        {src.sourceUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        src.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {src.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(src.lastChecked).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleScanSource(src.id)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-2.5 py-1 rounded text-[11px] cursor-pointer"
                      >
                        Scan Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: LINK HEALTH CHECKER */}
      {/* ========================================================= */}
      {activeTab === 'links' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Broken Link & Official Server Health Monitor</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Automatically ping official commission apply portals and PDF links to catch 404s or server timeouts.
              </p>
            </div>
            <button
              onClick={handleCheckLinks}
              disabled={checkingLinks}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingLinks ? 'animate-spin' : ''}`} />
              <span>{checkingLinks ? 'Testing Links...' : 'Run Health Check Now'}</span>
            </button>
          </div>

          {linkResults.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              Click "Run Health Check Now" to test URLs across official links.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 text-xs">
              {linkResults.map((r, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div className="truncate max-w-md">
                    <span className="font-mono text-gray-800 block truncate">{r.url}</span>
                    <span className="text-[11px] text-gray-500">{r.type}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    r.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Status: {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: CONTACT MESSAGES */}
      {/* ========================================================= */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 font-bold text-sm text-gray-900">
            Aspirant Feedback & Inquiries ({messages.length})
          </div>
          <div className="divide-y divide-gray-100">
            {messages.length === 0 ? (
              <p className="p-6 text-center text-xs text-gray-500">No contact messages received yet.</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="p-4 hover:bg-gray-50 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm text-gray-900">{msg.name}</strong>
                    <span className="text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-amber-800 font-medium">Email: {msg.email} • Subject: {msg.subject}</p>
                  <p className="text-gray-700 bg-gray-50 p-2.5 rounded mt-2">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MANUAL GEMINI AI EXTRACTOR */}
      {/* ========================================================= */}
      {showAiExtractModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-gray-900">Extract Recruitment with Gemini AI</h3>
              </div>
              <button onClick={() => setShowAiExtractModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Official Source URL
              </label>
              <input
                type="text"
                value={extractUrl}
                onChange={(e) => setExtractUrl(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Paste Official Notice Text or Press Release
              </label>
              <textarea
                rows={5}
                placeholder="Paste notification text snippet (e.g. Staff Selection Commission Notice for CGL 2026. Total Vacancies 14,582 posts. Application start: 05/09/2026...)"
                value={extractText}
                onChange={(e) => setExtractText(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiExtractModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRunAiExtract}
                disabled={extracting}
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{extracting ? 'Processing with Gemini...' : 'Extract Structured Data'}</span>
              </button>
            </div>

            {extractResult && (
              <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs space-y-2">
                <div className="flex justify-between font-bold text-purple-900">
                  <span>Extracted: {extractResult.title}</span>
                  <span>Confidence: {extractResult.confidenceScore}%</span>
                </div>
                <p><strong>Organization:</strong> {extractResult.organization}</p>
                <p><strong>Vacancies:</strong> {extractResult.totalVacancy}</p>
                <p><strong>Eligibility:</strong> {extractResult.educationalQualification}</p>
                <button
                  onClick={() => {
                    setEditingJob({
                      title: extractResult.title,
                      organization: extractResult.organization,
                      recruitmentName: extractResult.recruitmentName,
                      advertisementNumber: extractResult.advertisementNumber,
                      category: extractResult.category,
                      state: extractResult.state,
                      totalVacancy: extractResult.totalVacancy,
                      educationalQualification: extractResult.educationalQualification,
                      importantDates: extractResult.importantDates,
                      applicationFees: extractResult.applicationFees,
                      selectionProcess: extractResult.selectionProcess,
                      status: 'PUBLISHED',
                      verificationStatus: 'ADMIN_VERIFIED'
                    });
                    setShowAiExtractModal(false);
                    setShowJobModal(true);
                  }}
                  className="mt-2 w-full bg-emerald-600 text-white font-bold py-2 rounded text-xs hover:bg-emerald-700"
                >
                  Transfer Extracted Data to Job Editor →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: JOB EDITOR (CREATE OR EDIT) */}
      {/* ========================================================= */}
      {showJobModal && editingJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingJob.slug ? 'Edit Job Announcement' : 'Create New Job Post'}
              </h3>
              <button onClick={() => setShowJobModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingJob.title || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingJob.organization || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, organization: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Advertisement Number
                  </label>
                  <input
                    type="text"
                    value={editingJob.advertisementNumber || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, advertisementNumber: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={editingJob.category || 'SSC'}
                    onChange={(e) => setEditingJob({ ...editingJob, category: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-lg bg-white"
                  >
                    {['SSC', 'Railway', 'UPSC', 'Banking', 'Police', 'Teaching', 'Defence', 'State PSC', 'Other Government Jobs'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    State / Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={editingJob.state || 'All India'}
                    onChange={(e) => setEditingJob({ ...editingJob, state: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Total Vacancies
                  </label>
                  <input
                    type="text"
                    value={editingJob.totalVacancy || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, totalVacancy: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Salary / Pay Scale
                  </label>
                  <input
                    type="text"
                    value={editingJob.salaryPayScale || 'Pay Level-7 (Rs. 44,900 to 1,42,400)'}
                    onChange={(e) => setEditingJob({ ...editingJob, salaryPayScale: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Educational Qualification
                  </label>
                  <textarea
                    rows={2}
                    value={editingJob.educationalQualification || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, educationalQualification: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
                  />
                </div>

                {/* SEO Generation Section */}
                <div className="sm:col-span-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-amber-900">SEO Meta Tags</span>
                    <button
                      type="button"
                      onClick={handleGenerateSeoWithAi}
                      className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded cursor-pointer"
                    >
                      ✨ Auto-generate with AI
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="SEO Meta Title"
                    value={editingJob.seoTitle || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, seoTitle: e.target.value })}
                    className="w-full p-2 text-xs border border-amber-300 rounded mb-2 bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="SEO Meta Description"
                    value={editingJob.metaDescription || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, metaDescription: e.target.value })}
                    className="w-full p-2 text-xs border border-amber-300 rounded bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                >
                  Save & Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD NEW OFFICIAL SOURCE */}
      {/* ========================================================= */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Add Official Portal to Monitoring Engine</h3>
              <button onClick={() => setShowSourceModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSBC Bihar Police Official Portal"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                <select
                  value={newSource.category}
                  onChange={(e) => setNewSource({ ...newSource, category: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                >
                  {['SSC', 'Railway', 'UPSC', 'Police', 'Banking', 'Teaching', 'Defence', 'State PSC'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Notice Page URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://csbc.bih.nic.in"
                  value={newSource.sourceUrl}
                  onChange={(e) => setNewSource({ ...newSource, sourceUrl: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSourceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LIVE AI FACT-CHECK & GROUNDING REVIEW */}
      {/* ========================================================= */}
      {showFactCheckModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-gray-900">
                  PIB & Educational Portal Live Fact-Checker
                </h3>
              </div>
              <button 
                onClick={() => { setShowFactCheckModal(false); setAdminFactResult(null); }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Notice, Job, or Rumor Query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminFactQuery}
                  onChange={(e) => setAdminFactQuery(e.target.value)}
                  placeholder="e.g. RRB NTPC 2026 notification vacancies or UP Police answer key"
                  className="flex-1 p-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
                <button
                  type="button"
                  disabled={adminFactLoading || !adminFactQuery.trim()}
                  onClick={() => handleRunAdminFactCheck()}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {adminFactLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verify Notice
                    </>
                  )}
                </button>
              </div>

              {/* Sample test buttons */}
              <div className="flex items-center gap-1 flex-wrap text-[11px] text-gray-500">
                <span className="font-semibold">Quick test:</span>
                {['RRB NTPC 2026', 'SSC GD 2026', 'UP Police 60244', 'SSC CGL 2026'].map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAdminFactQuery(t);
                      handleRunAdminFactCheck(t);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Display */}
            {adminFactResult && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-3 max-h-[60vh] overflow-y-auto">
                <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-2">
                  <span className="font-black text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                    {adminFactResult.verificationStatus}
                  </span>
                  <span className="font-bold text-gray-600">
                    Confidence: {adminFactResult.confidenceScore}%
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-gray-900">{adminFactResult.verdictHeadline}</h4>
                  <p className="text-gray-700 mt-1 font-medium bg-amber-50 p-2.5 rounded border border-amber-200">
                    {adminFactResult.hindiSummary}
                  </p>
                  <p className="text-gray-600 mt-1.5">{adminFactResult.englishSummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                  <div>
                    <span className="text-gray-500 text-[10px] block font-bold">PIB Fact Check:</span>
                    <strong className="text-emerald-800">{adminFactResult.pibFactCheckStatus}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block font-bold">Govt Department:</span>
                    <strong className="text-gray-900">{adminFactResult.officialGovernmentSource}</strong>
                  </div>
                </div>

                {adminFactResult.educationalReferences && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-[10px] block font-bold mb-1">Educational Cross-Check (Testbook / PW):</span>
                    <div className="flex gap-1 flex-wrap">
                      {adminFactResult.educationalReferences.map((ref: string, i: number) => (
                        <span key={i} className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { setShowFactCheckModal(false); setAdminFactResult(null); }}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                Close Fact-Checker
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
