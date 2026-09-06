import React, { useState, useEffect, useCallback } from 'react';
import { 
  Job, 
  ResultItem, 
  AdmitCardItem, 
  AnswerKeyItem, 
  SyllabusItem, 
  NoticeItem 
} from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BreakingTicker } from './components/home/BreakingTicker';
import { HeroSearch } from './components/home/HeroSearch';
import { QuickActionCards } from './components/home/QuickActionCards';
import { AIFactCheckSection } from './components/home/AIFactCheckSection';
import { SarkariGrid } from './components/home/SarkariGrid';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { JobDetailView } from './components/views/JobDetailView';
import { ResultDetailView } from './components/views/ResultDetailView';
import { AdmitCardDetailView } from './components/views/AdmitCardDetailView';
import { CategoryListView } from './components/views/CategoryListView';
import { ToolsView } from './components/views/ToolsView';
import { StaticLegalViews } from './components/views/StaticLegalViews';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';
import { Home, Briefcase, Award, CreditCard, Search, CheckCircle2, Zap, Bot } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  
  // Theme State: Light / Dark Mode for Students
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xsj_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply Theme class to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('xsj_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Data caches
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [admitCards, setAdmitCards] = useState<AdmitCardItem[]>([]);
  const [answerKeys, setAnswerKeys] = useState<AnswerKeyItem[]>([]);
  const [syllabusList, setSyllabusList] = useState<SyllabusItem[]>([]);

  // Live Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Just now');

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Sync initial URL path
  useEffect(() => {
    const syncRouteFromPath = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (!path) {
        setCurrentRoute('home');
      } else if (path.startsWith('jobs/')) {
        setCurrentRoute(`job:${path.replace('jobs/', '')}`);
      } else if (path.startsWith('results/')) {
        setCurrentRoute(`result:${path.replace('results/', '')}`);
      } else if (path.startsWith('result/')) {
        setCurrentRoute(`result:${path.replace('result/', '')}`);
      } else if (path.startsWith('admit-card/')) {
        setCurrentRoute(`admit-card:${path.replace('admit-card/', '')}`);
      } else if (path.startsWith('admit-cards/')) {
        setCurrentRoute(`admit-card:${path.replace('admit-cards/', '')}`);
      } else if (path === 'admit-cards' || path === 'admit-card') {
        setCurrentRoute('admit-card');
      } else if (path === 'result' || path === 'results') {
        setCurrentRoute('results');
      } else if (path === 'answer-keys' || path === 'answer-key') {
        setCurrentRoute('answer-key');
      } else if (path.startsWith('answer-key/')) {
        setCurrentRoute(`answer-key:${path.replace('answer-key/', '')}`);
      } else if (path.startsWith('answer-keys/')) {
        setCurrentRoute(`answer-key:${path.replace('answer-keys/', '')}`);
      } else if (path.startsWith('syllabus/')) {
        setCurrentRoute(`syllabus:${path.replace('syllabus/', '')}`);
      } else {
        setCurrentRoute(path);
      }
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, []);

  // Fetch portal data
  const fetchPortalData = useCallback(() => {
    return Promise.all([
      fetch('/api/notices').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/states').then(r => r.json()),
      fetch('/api/jobs?limit=12').then(r => r.json()),
      fetch('/api/results?limit=8').then(r => r.json()),
      fetch('/api/admit-cards?limit=8').then(r => r.json()),
      fetch('/api/answer-keys?limit=6').then(r => r.json()),
      fetch('/api/syllabus?limit=6').then(r => r.json()),
      fetch('/api/sync/live').then(r => r.json()).catch(() => null)
    ]).then(([n, c, s, j, r, a, ak, syl, sync]) => {
      setNotices(n || []);
      setCategories(c || []);
      setStates(s || []);
      setJobs(Array.isArray(j) ? j : j.items || []);
      setResults(r || []);
      setAdmitCards(a || []);
      setAnswerKeys(ak || []);
      setSyllabusList(syl || []);
      if (sync?.lastSyncedAt) {
        setLastSyncedAt(new Date(sync.lastSyncedAt).toLocaleTimeString());
      }
    }).catch(err => console.error("Initial load error:", err));
  }, []);

  // Initial load
  useEffect(() => {
    fetchPortalData();
  }, [fetchPortalData]);

  // Periodic Auto-Sync with Result Bharat & Official Portals (every 45s)
  useEffect(() => {
    const timer = setInterval(() => {
      fetch('/api/sync/live')
        .then(r => r.json())
        .then(data => {
          if (data?.lastSyncedAt) {
            setLastSyncedAt(new Date(data.lastSyncedAt).toLocaleTimeString());
          }
        })
        .catch(() => {});
    }, 45000);

    return () => clearInterval(timer);
  }, []);

  // Manual Triggered Live Sync
  const handleLiveSync = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/sync/live', { method: 'POST' });
      await fetchPortalData();
      setSyncToast('⚡ Live Synced with Result Bharat & National Portals! All releases are current.');
      setTimeout(() => setSyncToast(null), 4000);
    } catch {
      setSyncToast('Portal refreshed. You have the latest notifications.');
      setTimeout(() => setSyncToast(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Custom Navigation Handler with smart route normalization
  const handleNavigate = (route: string) => {
    let cleanRoute = route.startsWith('/') ? route.slice(1) : route;
    if (cleanRoute.startsWith('jobs:')) cleanRoute = cleanRoute.replace('jobs:', 'job:');
    else if (cleanRoute.startsWith('jobs/')) cleanRoute = `job:${cleanRoute.replace('jobs/', '')}`;
    else if (cleanRoute.startsWith('results:')) cleanRoute = cleanRoute.replace('results:', 'result:');
    else if (cleanRoute.startsWith('results/')) cleanRoute = `result:${cleanRoute.replace('results/', '')}`;
    else if (cleanRoute.startsWith('admit-cards:')) cleanRoute = cleanRoute.replace('admit-cards:', 'admit-card:');
    else if (cleanRoute.startsWith('admit-cards/')) cleanRoute = `admit-card:${cleanRoute.replace('admit-cards/', '')}`;
    else if (cleanRoute.startsWith('admit-card/')) cleanRoute = `admit-card:${cleanRoute.replace('admit-card/', '')}`;
    else if (cleanRoute.startsWith('answer-keys:')) cleanRoute = cleanRoute.replace('answer-keys:', 'answer-key:');
    else if (cleanRoute.startsWith('answer-keys/')) cleanRoute = `answer-key:${cleanRoute.replace('answer-keys/', '')}`;
    else if (cleanRoute.startsWith('answer-key/')) cleanRoute = `answer-key:${cleanRoute.replace('answer-key/', '')}`;

    if (cleanRoute === 'admit-cards') cleanRoute = 'admit-card';
    if (cleanRoute === 'result') cleanRoute = 'results';
    if (cleanRoute === 'answer-keys') cleanRoute = 'answer-key';

    setCurrentRoute(cleanRoute);
    let path = `/${cleanRoute}`;
    if (cleanRoute === 'home') path = '/';
    else if (cleanRoute.startsWith('job:')) path = `/jobs/${cleanRoute.replace('job:', '')}`;
    else if (cleanRoute.startsWith('result:')) path = `/results/${cleanRoute.replace('result:', '')}`;
    else if (cleanRoute.startsWith('admit-card:')) path = `/admit-card/${cleanRoute.replace('admit-card:', '')}`;
    else if (cleanRoute.startsWith('answer-key:')) path = `/answer-key/${cleanRoute.replace('answer-key:', '')}`;
    else if (cleanRoute.startsWith('syllabus:')) path = `/syllabus/${cleanRoute.replace('syllabus:', '')}`;

    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (query: string, category?: string, state?: string) => {
    setSearchQuery([query, category, state].filter(Boolean).join(' '));
    setSearchModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100/70 dark:bg-slate-950 font-sans text-gray-900 dark:text-slate-100 pb-16 lg:pb-0 transition-colors duration-200">
      
      {/* Toast Notification when Real-Time Sync Completes */}
      {syncToast && (
        <div className="fixed top-3 right-3 z-50 bg-[#0f2347] dark:bg-blue-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-yellow-400/40 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Zap className="w-4 h-4 text-yellow-300 fill-current" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Breaking Notice Ticker */}
      <BreakingTicker notices={notices} onNavigate={handleNavigate} />

      {/* Main Brand Navigation Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLiveSync={handleLiveSync}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
      />

      {/* Main Page View Router */}
      <main className="flex-1">
        {/* Home Page */}
        {currentRoute === 'home' && (
          <>
            <HeroSearch
              categories={categories}
              states={states}
              onSearch={handleHeroSearch}
              onSelectCategory={(cat) => handleNavigate('jobs')}
              onSelectState={(st) => handleNavigate('jobs')}
            />
            <QuickActionCards
              onNavigate={handleNavigate}
              counts={{
                jobs: jobs.length,
                results: results.length,
                admitCards: admitCards.length,
                answerKeys: answerKeys.length
              }}
            />
            <SarkariGrid
              jobs={jobs}
              results={results}
              admitCards={admitCards}
              answerKeys={answerKeys}
              syllabusList={syllabusList}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {/* Dedicated AI Fact-Check Route */}
        {currentRoute === 'fact-check' && (
          <div className="py-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
            <AIFactCheckSection />
            <SarkariGrid
              jobs={jobs}
              results={results}
              admitCards={admitCards}
              answerKeys={answerKeys}
              syllabusList={syllabusList}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* Job Detail Route */}
        {currentRoute.startsWith('job:') && (
          <JobDetailView
            slug={currentRoute.replace('job:', '')}
            onNavigate={handleNavigate}
          />
        )}

        {/* Result Detail Route */}
        {currentRoute.startsWith('result:') && (
          <ResultDetailView
            slug={currentRoute.replace('result:', '')}
            onNavigate={handleNavigate}
          />
        )}

        {/* Admit Card Detail Route */}
        {currentRoute.startsWith('admit-card:') && (
          <AdmitCardDetailView
            slug={currentRoute.replace('admit-card:', '')}
            onNavigate={handleNavigate}
          />
        )}

        {/* Category & Section Lists */}
        {(currentRoute === 'jobs' || 
          currentRoute === 'results' || 
          currentRoute === 'result' ||
          currentRoute === 'admit-card' || 
          currentRoute === 'admit-cards' ||
          currentRoute === 'answer-key' || 
          currentRoute === 'answer-keys' ||
          currentRoute === 'syllabus' || 
          currentRoute === 'admission' || 
          currentRoute === 'scholarship') && (
          <CategoryListView
            type={
              (currentRoute === 'result' || currentRoute === 'results') ? 'results' :
              (currentRoute === 'admit-cards' || currentRoute === 'admit-card') ? 'admit-card' :
              (currentRoute === 'answer-keys' || currentRoute === 'answer-key') ? 'answer-key' :
              currentRoute as any
            }
            onNavigate={handleNavigate}
          />
        )}

        {/* Interactive Utility Tools */}
        {(currentRoute === 'age-calculator' || 
          currentRoute === 'percentage-calculator' || 
          currentRoute === 'exam-calendar') && (
          <ToolsView
            toolType={currentRoute as any}
            onNavigate={handleNavigate}
          />
        )}

        {/* Legal & Static Pages */}
        {(currentRoute === 'about' || 
          currentRoute === 'contact' || 
          currentRoute === 'disclaimer' || 
          currentRoute === 'privacy-policy' || 
          currentRoute === 'terms' || 
          currentRoute === 'cookie-policy') && (
          <StaticLegalViews
            viewType={currentRoute as any}
            onNavigate={handleNavigate}
          />
        )}

        {/* Staff & Admin Dashboard */}
        {currentRoute === 'admin' && (
          <AdminDashboard
            onNavigate={handleNavigate}
            isAdminLoggedIn={isAdminLoggedIn}
            onLoginSuccess={(user) => {
              setIsAdminLoggedIn(true);
              setAdminUser(user);
            }}
            onLogout={() => {
              fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
              setIsAdminLoggedIn(false);
              setAdminUser(null);
            }}
          />
        )}
      </main>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleNavigate}
        initialQuery={searchQuery}
      />

      {/* Professional Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Sticky Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors">
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold ${
            currentRoute === 'home' ? 'text-[#1e40af] dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => handleNavigate('jobs')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold ${
            currentRoute === 'jobs' ? 'text-[#1e40af] dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Jobs</span>
        </button>
        <button
          onClick={() => handleNavigate('results')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold ${
            currentRoute === 'results' ? 'text-[#1e40af] dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Results</span>
        </button>
        <button
          onClick={() => handleNavigate('admit-card')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold ${
            currentRoute === 'admit-card' ? 'text-[#1e40af] dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Admit Card</span>
        </button>
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700"
        >
          <Bot className="w-4 h-4" />
          <span>AI Help</span>
        </button>
      </div>

      {/* Floating Ask AI Button (GPT-4o / Claude 3.5 / Grok / Gemini) */}
      <button
        id="floating-ai-assistant-btn"
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl hover:shadow-2xl px-3.5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 border border-blue-400/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Ask AI Exam Questions (GPT-4o, Claude 3.5, Grok)"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
        </span>
        <Bot className="w-4 h-4 text-yellow-300" />
        <span className="font-extrabold tracking-wide">Ask AI</span>
        <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.2 rounded font-black hidden md:inline">
          GPT • Claude • Grok
        </span>
      </button>

      {/* Multi-Model AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

    </div>
  );
}
