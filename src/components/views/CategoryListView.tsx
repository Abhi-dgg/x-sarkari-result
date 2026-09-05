import React, { useState, useEffect } from 'react';
import { 
  Job, 
  ResultItem, 
  AdmitCardItem, 
  AnswerKeyItem, 
  SyllabusItem 
} from '../../types';
import { Search, Filter, ChevronRight, Briefcase, Award, CreditCard, KeyRound, BookOpen, MapPin, Calendar } from 'lucide-react';

interface CategoryListViewProps {
  type: 'jobs' | 'results' | 'admit-card' | 'answer-key' | 'syllabus' | 'admission' | 'scholarship';
  onNavigate: (route: string) => void;
}

export const CategoryListView: React.FC<CategoryListViewProps> = ({ type, onNavigate }) => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const titleConfig = {
    jobs: { title: 'Latest Government Jobs 2026', subtitle: 'Browse all active online recruitment applications and government job vacancies.', icon: Briefcase, color: 'text-emerald-700' },
    results: { title: 'Government Examination Results 2026', subtitle: 'Check declared scorecards, merit lists, and cut-off marks.', icon: Award, color: 'text-blue-700' },
    'admit-card': { title: 'Exam Admit Cards & Hall Tickets', subtitle: 'Download examination call letters, city intimation slips, and test schedules.', icon: CreditCard, color: 'text-amber-700' },
    'answer-key': { title: 'Official Answer Keys & Objections', subtitle: 'Download official answer keys and submit challenge representations.', icon: KeyRound, color: 'text-purple-700' },
    syllabus: { title: 'Exam Syllabus & Pattern', subtitle: 'Comprehensive subject-wise syllabus, exam schemes, and marking systems.', icon: BookOpen, color: 'text-teal-700' },
    admission: { title: 'Entrance Exams & College Admissions', subtitle: 'University entrance tests, diploma, and polytechnic application forms.', icon: BookOpen, color: 'text-rose-700' },
    scholarship: { title: 'Government Scholarships 2026', subtitle: 'State and National Scholarship schemes for pre-matric, post-matric, and higher studies.', icon: Award, color: 'text-indigo-700' },
  };

  const currentConfig = titleConfig[type] || titleConfig.jobs;
  const Icon = currentConfig.icon;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch categories and states
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/states').then(r => r.json())
    ]).then(([cats, sts]) => {
      setCategories(cats || []);
      setStates(sts || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    let endpoint = `/api/jobs?limit=100`;
    if (type === 'results') endpoint = `/api/results?limit=100`;
    else if (type === 'admit-card') endpoint = `/api/admit-cards?limit=100`;
    else if (type === 'answer-key') endpoint = `/api/answer-keys?limit=100`;
    else if (type === 'syllabus') endpoint = `/api/syllabus?limit=100`;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.items || [];
        setItems(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type]);

  // Filtering
  const filtered = items.filter(item => {
    if (selectedCategory !== 'All' && item.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedState !== 'All India' && item.state && item.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchOrg = item.organization?.toLowerCase().includes(q);
      return matchTitle || matchOrg;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-6 h-6 ${currentConfig.color}`} />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {currentConfig.title}
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          {currentConfig.subtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={`Search in ${currentConfig.title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* State Selector */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All India">All States</option>
            {states.filter(s => s !== 'All India').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Quick Filter Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 font-semibold shrink-0">Filter:</span>
          {['All', 'SSC', 'Railway', 'UPSC', 'Banking', 'Police', 'Teaching', 'Defence'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List Results */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-semibold text-sm">Loading announcements...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl p-8">
          <p className="text-gray-500 text-sm">No notifications match the selected criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedState('All India'); setSearchQuery(''); }}
            className="mt-3 text-xs text-amber-700 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs divide-y divide-gray-100 overflow-hidden">
          {filtered.map((item, idx) => {
            const isJob = type === 'jobs';
            const isResult = type === 'results';
            const isAdmitCard = type === 'admit-card';
            const isAnswerKey = type === 'answer-key';

            let route = `job:${item.slug}`;
            if (isResult) route = `result:${item.slug}`;
            else if (isAdmitCard) route = `admit-card:${item.slug}`;
            else if (isAnswerKey) route = `answer-key:${item.slug}`;
            else if (type === 'syllabus') route = `syllabus:${item.slug}`;

            return (
              <div
                key={item.id || idx}
                onClick={() => onNavigate(route)}
                className="p-4 sm:p-5 hover:bg-amber-50/40 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                      {item.organization || item.organizationSlug?.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {item.category}
                    </span>
                    {item.totalVacancy && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {item.totalVacancy} Posts
                      </span>
                    )}
                    {idx < 2 && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-600 text-white animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-amber-800 leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                    {item.state && <span>State: <strong>{item.state}</strong></span>}
                    {item.resultDate && <span>Declared: {item.resultDate}</span>}
                    {item.examDate && <span>Exam: {item.examDate}</span>}
                    {item.importantDates && item.importantDates[1] && (
                      <span>Last Date: <strong className="text-gray-800">{item.importantDates[1].date}</strong></span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 group-hover:text-amber-900 flex items-center gap-0.5">
                    View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
