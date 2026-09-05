import React, { useState } from 'react';
import { Search, MapPin, Briefcase, ChevronRight, Check } from 'lucide-react';

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

  const popularPills = ['SSC CGL', 'Railway NTPC', 'UPSC IAS', 'UP Police', 'Bihar Police', 'IBPS PO', 'Teaching'];

  return (
    <div className="bg-linear-to-b from-gray-900 to-gray-950 text-white py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle decorative grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Verification Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 border border-gray-700 text-amber-400 mb-4 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          Direct Official Notification & Result Verification
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
          Search Jobs, Results, Admit Cards & Exams
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-6">
          Find verified government job recruitment notices, examination schedules, scorecards, and admit cards with official source citations.
        </p>

        {/* Big Search Input Form */}
        <form onSubmit={handleFormSubmit} className="bg-white p-2 sm:p-2.5 rounded-xl shadow-xl flex flex-col md:flex-row gap-2 items-center text-gray-900">
          
          {/* Main Keyword Input */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search e.g. SSC CGL, RRB NTPC, UPSC, Constable..."
              className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base font-medium rounded-lg text-gray-900 focus:outline-hidden placeholder-gray-400"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-44 border-t md:border-t-0 md:border-l border-gray-200 pl-0 md:pl-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-2 text-xs sm:text-sm text-gray-700 bg-transparent rounded-lg focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* State Dropdown */}
          <div className="w-full md:w-44 border-t md:border-t-0 md:border-l border-gray-200 pl-0 md:pl-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2.5 px-2 text-xs sm:text-sm text-gray-700 bg-transparent rounded-lg focus:outline-hidden cursor-pointer"
            >
              <option value="All India">All India</option>
              {states.filter(s => s !== 'All India').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-6 py-2.5 rounded-lg text-sm sm:text-base transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Search</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Popular Keyword Tags */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
          <span className="font-semibold text-gray-300">Popular:</span>
          {popularPills.map((p) => (
            <button
              key={p}
              onClick={() => {
                setSearchTerm(p);
                onSearch(p);
              }}
              className="px-2.5 py-1 rounded-md bg-gray-800/80 hover:bg-gray-700 text-gray-300 transition-colors cursor-pointer border border-gray-700/60"
            >
              {p}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
