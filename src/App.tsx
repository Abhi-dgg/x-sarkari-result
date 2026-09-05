import React, { useState, useEffect } from 'react';
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
import { SarkariGrid } from './components/home/SarkariGrid';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { JobDetailView } from './components/views/JobDetailView';
import { ResultDetailView } from './components/views/ResultDetailView';
import { AdmitCardDetailView } from './components/views/AdmitCardDetailView';
import { CategoryListView } from './components/views/CategoryListView';
import { ToolsView } from './components/views/ToolsView';
import { StaticLegalViews } from './components/views/StaticLegalViews';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Home, Briefcase, Award, CreditCard, Search } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  
  // Data caches
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [admitCards, setAdmitCards] = useState<AdmitCardItem[]>([]);
  const [answerKeys, setAnswerKeys] = useState<AnswerKeyItem[]>([]);
  const [syllabusList, setSyllabusList] = useState<SyllabusItem[]>([]);

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
      } else if (path.startsWith('admit-card/')) {
        setCurrentRoute(`admit-card:${path.replace('admit-card/', '')}`);
      } else if (path.startsWith('answer-key/')) {
        setCurrentRoute(`answer-key:${path.replace('answer-key/', '')}`);
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

  // Fetch initial portal data
  useEffect(() => {
    Promise.all([
      fetch('/api/notices').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/states').then(r => r.json()),
      fetch('/api/jobs?limit=12').then(r => r.json()),
      fetch('/api/results?limit=8').then(r => r.json()),
      fetch('/api/admit-cards?limit=8').then(r => r.json()),
      fetch('/api/answer-keys?limit=6').then(r => r.json()),
      fetch('/api/syllabus?limit=6').then(r => r.json())
    ]).then(([n, c, s, j, r, a, ak, syl]) => {
      setNotices(n || []);
      setCategories(c || []);
      setStates(s || []);
      setJobs(Array.isArray(j) ? j : j.items || []);
      setResults(r || []);
      setAdmitCards(a || []);
      setAnswerKeys(ak || []);
      setSyllabusList(syl || []);
    }).catch(err => console.error("Initial load error:", err));
  }, []);

  // Custom Navigation Handler
  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    let path = `/${route}`;
    if (route === 'home') path = '/';
    else if (route.startsWith('job:')) path = `/jobs/${route.replace('job:', '')}`;
    else if (route.startsWith('result:')) path = `/results/${route.replace('result:', '')}`;
    else if (route.startsWith('admit-card:')) path = `/admit-card/${route.replace('admit-card:', '')}`;
    else if (route.startsWith('answer-key:')) path = `/answer-key/${route.replace('answer-key:', '')}`;
    else if (route.startsWith('syllabus:')) path = `/syllabus/${route.replace('syllabus:', '')}`;

    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (query: string, category?: string, state?: string) => {
    setSearchModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100/60 font-sans text-gray-900 pb-16 lg:pb-0">
      
      {/* Breaking Notice Ticker */}
      <BreakingTicker notices={notices} onNavigate={handleNavigate} />

      {/* Main Brand Navigation Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
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
          currentRoute === 'admit-card' || 
          currentRoute === 'answer-key' || 
          currentRoute === 'syllabus' || 
          currentRoute === 'admission' || 
          currentRoute === 'scholarship') && (
          <CategoryListView
            type={currentRoute as any}
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
      />

      {/* Professional Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Sticky Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold ${
            currentRoute === 'home' ? 'text-[#800000]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => handleNavigate('jobs')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold ${
            currentRoute === 'jobs' ? 'text-[#800000]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Jobs</span>
        </button>
        <button
          onClick={() => handleNavigate('results')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold ${
            currentRoute === 'results' ? 'text-[#800000]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Results</span>
        </button>
        <button
          onClick={() => handleNavigate('admit-card')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold ${
            currentRoute === 'admit-card' ? 'text-[#800000]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Admit Card</span>
        </button>
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-bold text-gray-500 hover:text-gray-900"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>

    </div>
  );
}
