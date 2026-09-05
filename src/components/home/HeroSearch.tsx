import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

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
  onSelectCategory,
  onSelectState
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, selectedCategory === 'All' ? undefined : selectedCategory, selectedState === 'All India' ? undefined : selectedState);
  };

  const popularPills = ['SSC CGL', 'RRB NTPC', 'UPSC IAS', 'Bihar Police', 'UP Police', 'IBPS PO', 'Agniveer'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      {/* Compact Result Bharat Search Bar */}
      <div className="bg-white border-2 border-[#800000] rounded-lg p-2.5 sm:p-3 shadow-xs">
        <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row items-center gap-2">
          
          {/* Main Search Input */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Sarkari Naukri, Admit Card, Result, Exam (e.g. SSC, Railway, Police)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium border border-gray-300 rounded focus:outline-hidden focus:border-[#800000] text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-2.5 text-xs text-gray-800 bg-white border border-gray-300 rounded focus:outline-hidden focus:border-[#800000] cursor-pointer font-medium"
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
              className="w-full py-2 px-2.5 text-xs text-gray-800 bg-white border border-gray-300 rounded focus:outline-hidden focus:border-[#800000] cursor-pointer font-medium"
            >
              <option value="All India">All India</option>
              {states.filter(s => s !== 'All India').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Search Button (Result Bharat Maroon) */}
          <button
            type="submit"
            className="w-full md:w-auto bg-[#800000] hover:bg-[#660000] text-white font-bold px-6 py-2 rounded text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 uppercase tracking-wider"
          >
            <span>Search</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Keyword Pills */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-extrabold text-[#800000] text-[11px] uppercase mr-1">Trending:</span>
          {popularPills.map((p) => (
            <button
              key={p}
              onClick={() => {
                setSearchTerm(p);
                onSearch(p);
              }}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-[#800000] hover:text-white text-gray-800 text-[11px] font-semibold transition-colors cursor-pointer border border-gray-200"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
