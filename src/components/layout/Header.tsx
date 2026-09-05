import React, { useState } from 'react';
import { Search, Menu, X, ShieldAlert, Sparkles, User, ExternalLink, Calendar, Calculator, BookOpen, CheckCircle, FileText } from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Home', route: 'home' },
    { label: 'Latest Jobs', route: 'jobs' },
    { label: 'Results', route: 'results' },
    { label: 'Admit Card', route: 'admit-card' },
    { label: 'Answer Key', route: 'answer-key' },
    { label: 'Syllabus', route: 'syllabus' },
    { label: 'Admission', route: 'admission' },
  ];

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Top micro-bar: Verified notice & Fast Alert */}
      <div className="bg-gray-900 text-gray-200 text-xs px-4 py-1.5 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-gray-950 uppercase tracking-wider">
            Verified Portal
          </span>
          <span className="hidden sm:inline text-gray-300">
            India's Trusted Government Jobs, Results & Exam Information Network
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <button 
            onClick={() => handleNav('disclaimer')} 
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Disclaimer
          </button>
          <span className="text-gray-700">|</span>
          <button 
            onClick={() => handleNav('contact')} 
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Help & Contact
          </button>
          <span className="text-gray-700">|</span>
          <button 
            onClick={() => handleNav('admin')} 
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            <User className="w-3 h-3" />
            {isAdminLoggedIn ? 'Admin Panel' : 'Staff Login'}
          </button>
        </div>
      </div>

      {/* Main Brand & Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
            id="brand-logo-button"
          >
            <img 
              src="/logo.svg" 
              alt="X Sarkari Job Logo" 
              className="w-11 h-11 transition-transform group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-gray-900">
                  <span className="text-amber-600">X</span> SARKARI JOB
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-500 leading-tight">
                Official Exam & Recruitment Information
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-gray-700">
            {navItems.map(item => {
              const active = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-${item.route}`}
                  onClick={() => handleNav(item.route)}
                  className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
                    active 
                      ? 'text-amber-700 bg-amber-50 font-bold' 
                      : 'hover:text-gray-950 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                id="nav-tools-dropdown"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className="px-3 py-2 rounded-md hover:text-gray-950 hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
              >
                Tools
                <span className="text-xs text-gray-500">▾</span>
              </button>
              {toolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => handleNav('age-calculator')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-amber-600" />
                    Age Calculator
                  </button>
                  <button
                    onClick={() => handleNav('percentage-calculator')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-amber-600" />
                    Percentage Calculator
                  </button>
                  <button
                    onClick={() => handleNav('exam-calendar')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-amber-600" />
                    Exam Calendar 2026
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Quick Search Action */}
          <div className="flex items-center gap-2">
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300/80 transition-all cursor-pointer shadow-2xs"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <span className="hidden sm:inline">Search Jobs, Results...</span>
              <kbd className="hidden sm:inline-block bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[10px] text-gray-500 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <div className="mb-3">
            <button
              onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 rounded-lg text-sm text-gray-700 font-medium border border-gray-300"
            >
              <Search className="w-4 h-4" />
              Search all exams & jobs...
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 py-1">
            {navItems.map(item => (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`py-2 px-3 text-left rounded-md text-sm font-semibold cursor-pointer ${
                  currentRoute === item.route 
                    ? 'text-amber-800 bg-amber-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3 mt-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
              Useful Calculators & Tools
            </p>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleNav('age-calculator')}
                className="py-1.5 px-3 text-left text-xs font-medium text-gray-600 hover:text-gray-950 flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-600" />
                Age Calculator
              </button>
              <button
                onClick={() => handleNav('percentage-calculator')}
                className="py-1.5 px-3 text-left text-xs font-medium text-gray-600 hover:text-gray-950 flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-600" />
                Percentage Calc
              </button>
              <button
                onClick={() => handleNav('exam-calendar')}
                className="py-1.5 px-3 text-left text-xs font-medium text-gray-600 hover:text-gray-950 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Exam Calendar
              </button>
              <button
                onClick={() => handleNav('admin')}
                className="py-1.5 px-3 text-left text-xs font-semibold text-amber-700 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
