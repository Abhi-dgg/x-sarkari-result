import React, { useState } from 'react';
import { Search, ChevronRight, TrendingUp } from 'lucide-react';

interface HeroSearchProps {
  categories: string[];
  states: string[];
  onSearch: (query: string, category?: string, state?: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectState: (state: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  categories,
  states,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, selectedCategory === 'All' ? undefined : selectedCategory, selectedState === 'All India' ? undefined : selectedState);
  };

  const popularPills = ['RRB NTPC 2026', 'SSC GD 2026', 'UP Police', 'BPSC 70th', 'UPSC CSE', 'Bihar Police', 'IBPS PO', 'Agniveer'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      {/* High-Density Result Bharat Search Bar */}
      <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-lg p-2.5 sm:p-3 shadow-xs transition-colors">
        <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row items-center gap-2">
          
          {/* Main Search Input */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Sarkari Naukri, Admit Card, Result, Exam (e.g. SSC, Railway, Police, BPSC)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded focus:outline-hidden focus:border-[#1e3a8a] text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-2.5 text-xs text-gray-800 dark:text-slate-200 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded focus:outline-hidden focus:border-[#1e3a8a] cursor-pointer font-medium"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* State Dropdown */}
          <div className="w-full md:w-44">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2 px-2.5 text-xs text-gray-800 dark:text-slate-200 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded focus:outline-hidden focus:border-[#1e3a8a] cursor-pointer font-medium"
            >
              <option value="All India">All India</option>
              {states.filter(s => s !== 'All India').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Search Button (Royal Navy & Sapphire Theme) */}
          <button
            type="submit"
            className="w-full md:w-auto bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-black px-6 py-2 rounded text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 uppercase tracking-wider shadow-xs"
          >
            <span>Search</span>
            <ChevronRight className="w-4 h-4 text-yellow-300" />
          </button>
        </form>

        {/* Quick Keyword Trending Pills */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-extrabold text-[#1e40af] dark:text-blue-400 text-[11px] uppercase mr-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Trending:
          </span>
          {popularPills.map((p) => (
            <button
              key={p}
              onClick={() => {
                setSearchTerm(p);
                onSearch(p);
              }}
              className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 hover:bg-[#1e40af] dark:hover:bg-blue-600 hover:text-white dark:text-slate-200 text-gray-800 text-[11px] font-semibold transition-colors cursor-pointer border border-gray-200 dark:border-slate-700"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
