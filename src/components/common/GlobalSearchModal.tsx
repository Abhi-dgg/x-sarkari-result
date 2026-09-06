import React, { useState, useEffect } from 'react';
import { Search, X, ChevronRight, Briefcase, Award, CreditCard } from 'lucide-react';
import { Job, ResultItem, AdmitCardItem } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  initialQuery?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate, initialQuery = '' }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    jobs: Job[];
    results: ResultItem[];
    admitCards: AdmitCardItem[];
  }>({ jobs: [], results: [], admitCards: [] });

  useEffect(() => {
    if (!isOpen) return;
    setQuery(initialQuery);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, initialQuery]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ jobs: [], results: [], admitCards: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults({
            jobs: data.jobs || [],
            results: data.results || [],
            admitCards: data.admitCards || []
          });
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-950/60">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type exam, job, result name (e.g. CGL, NTPC, UPSC, Police)..."
            className="w-full bg-transparent text-gray-900 dark:text-slate-100 text-sm sm:text-base font-medium focus:outline-hidden placeholder-gray-400 dark:placeholder-gray-500"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-xs bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 px-2 py-1 rounded font-semibold cursor-pointer shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="text-center py-6 text-sm text-gray-500 dark:text-slate-400">
              Searching database...
            </div>
          )}

          {!loading && !query && (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-slate-400">
              <p className="font-semibold text-gray-700 dark:text-slate-300 mb-2">Quick Search Suggestions</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {['SSC CGL 2026', 'RRB NTPC', 'UPSC IAS', 'Bihar Police', 'UP Police', 'IBPS PO'].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="px-2.5 py-1 text-xs rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/80 text-gray-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-200 border border-gray-200 dark:border-slate-700 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && query && results.jobs.length === 0 && results.results.length === 0 && results.admitCards.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500 dark:text-slate-400">
              No matching updates found for "{query}". Try checking the spelling or searching by category.
            </div>
          )}

          {/* Job matches */}
          {results.jobs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                Latest Jobs ({results.jobs.length})
              </div>
              <div className="divide-y divide-gray-100 dark:divide-slate-800 bg-gray-50/50 dark:bg-slate-850/50 rounded-lg border border-gray-100 dark:border-slate-800">
                {results.jobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => {
                      onNavigate(`job:${job.slug}`);
                      onClose();
                    }}
                    className="p-3 hover:bg-emerald-50/60 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                        {job.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {job.organization} • {job.totalVacancy} Posts
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result matches */}
          {results.results.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                Exam Results ({results.results.length})
              </div>
              <div className="divide-y divide-gray-100 dark:divide-slate-800 bg-gray-50/50 dark:bg-slate-850/50 rounded-lg border border-gray-100 dark:border-slate-800">
                {results.results.map(res => (
                  <div
                    key={res.id}
                    onClick={() => {
                      onNavigate(`result:${res.slug}`);
                      onClose();
                    }}
                    className="p-3 hover:bg-blue-50/60 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                        {res.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {res.organization} • Released {res.resultDate}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admit Card matches */}
          {results.admitCards.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                Admit Cards ({results.admitCards.length})
              </div>
              <div className="divide-y divide-gray-100 dark:divide-slate-800 bg-gray-50/50 dark:bg-slate-850/50 rounded-lg border border-gray-100 dark:border-slate-800">
                {results.admitCards.map(ac => (
                  <div
                    key={ac.id}
                    onClick={() => {
                      onNavigate(`admit-card:${ac.slug}`);
                      onClose();
                    }}
                    className="p-3 hover:bg-amber-50/60 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                        {ac.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {ac.organization} • Exam Date {ac.examDate}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-100 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 flex justify-between items-center transition-colors">
          <span>Search verified recruitment notifications</span>
          <button 
            onClick={() => {
              onNavigate(`jobs`);
              onClose();
            }} 
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
          >
            Open All Jobs →
          </button>
        </div>

      </div>
    </div>
  );
};
