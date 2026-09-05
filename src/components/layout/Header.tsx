import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Calendar, 
  Calculator, 
  MessageCircle, 
  Send, 
  Youtube, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';

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
    { label: 'HOME', route: 'home' },
    { label: 'RESULT', route: 'results' },
    { label: 'ADMIT CARD', route: 'admit-card' },
    { label: 'LATEST JOBS', route: 'jobs' },
    { label: 'ANSWER KEY', route: 'answer-key' },
    { label: 'SYLLABUS', route: 'syllabus' },
    { label: 'ADMISSION', route: 'admission' },
  ];

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top micro-bar: Verified notice & Fast Alert */}
      <div className="bg-[#1f2937] text-gray-200 text-xs px-4 py-1.5 font-medium flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#dc2626] text-white uppercase tracking-wider">
            Official
          </span>
          <span className="hidden sm:inline text-gray-300 text-[11px]">
            Welcome to <strong className="text-white">X Sarkari Job</strong> — India's Fast & Verified Govt Jobs, Results & Admit Card Portal
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <button 
            onClick={() => handleNav('disclaimer')} 
            className="text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Disclaimer
          </button>
          <span className="text-gray-600">|</span>
          <button 
            onClick={() => handleNav('contact')} 
            className="text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Help & Contact
          </button>
          <span className="text-gray-600">|</span>
          <button 
            onClick={() => handleNav('admin')} 
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            <User className="w-3 h-3" />
            {isAdminLoggedIn ? 'Admin Panel' : 'Staff Login'}
          </button>
        </div>
      </div>

      {/* X Sarkari Job Iconic Header Banner */}
      <div className="bg-white py-3.5 px-4 sm:px-6 border-b border-gray-200 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Centered / Left Logo & Title */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3.5 cursor-pointer select-none group text-center md:text-left"
            id="brand-logo-button"
          >
            <img 
              src="/logo.svg" 
              alt="X Sarkari Job Official Emblem" 
              className="w-14 h-14 rounded-full transition-transform group-hover:scale-105 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#800000] uppercase font-sans flex items-center">
                  <span className="text-[#f59e0b] mr-1">X</span> SARKARI JOB
                </h1>
                <span className="text-[10px] font-extrabold bg-[#800000] text-[#ffeb3b] px-1.5 py-0.5 rounded tracking-wide uppercase">
                  Govt Alerts
                </span>
              </div>
              <p className="text-xs font-bold text-gray-800 tracking-wide mt-0.5">
                www.xsarkarijob.com
              </p>
              <p className="text-[11px] text-gray-600 hidden sm:block">
                Free Job Alert, Sarkari Result, Sarkari Exam, Online Form, Admit Card & Answer Key 2026
              </p>
            </div>
          </div>

          {/* Social Quick-Join Buttons (Signature Result Bharat Feature) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-xs transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Join WhatsApp</span>
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold shadow-xs transition-transform hover:-translate-y-0.5"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Join Telegram</span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FF0000] hover:bg-[#e60000] text-white text-xs font-bold shadow-xs transition-transform hover:-translate-y-0.5 hidden sm:inline-flex"
            >
              <Youtube className="w-3.5 h-3.5 fill-current" />
              <span>YouTube</span>
            </a>
            <button
              onClick={() => onOpenSearch()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Job</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Maroon Navigation Bar (Signature Result Bharat Menu) */}
      <div className="bg-[#800000] text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 font-bold text-xs tracking-wider">
            {navItems.map(item => {
              const active = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-${item.route}`}
                  onClick={() => handleNav(item.route)}
                  className={`py-3 px-3 transition-colors cursor-pointer border-b-2 flex items-center gap-1 ${
                    active 
                      ? 'bg-[#660000] text-[#ffeb3b] border-[#ffeb3b]' 
                      : 'border-transparent text-white hover:bg-[#990000] hover:text-[#ffeb3b]'
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
                className="py-3 px-3 transition-colors cursor-pointer border-b-2 border-transparent text-white hover:bg-[#990000] hover:text-[#ffeb3b] flex items-center gap-1"
              >
                TOOLS ▾
              </button>
              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-0 w-52 bg-white rounded-b-md shadow-xl border border-gray-200 py-2 z-50 text-gray-800 font-medium">
                  <button
                    onClick={() => handleNav('age-calculator')}
                    className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-amber-50 hover:text-[#800000] flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <Calculator className="w-4 h-4 text-[#800000]" />
                    Age Calculator
                  </button>
                  <button
                    onClick={() => handleNav('percentage-calculator')}
                    className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-amber-50 hover:text-[#800000] flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <Calculator className="w-4 h-4 text-[#800000]" />
                    Percentage Calculator
                  </button>
                  <button
                    onClick={() => handleNav('exam-calendar')}
                    className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-amber-50 hover:text-[#800000] flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <Calendar className="w-4 h-4 text-[#800000]" />
                    Exam Calendar 2026
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('jobs')}
              className="py-3 px-3 transition-colors cursor-pointer border-b-2 border-transparent text-white hover:bg-[#990000] hover:text-[#ffeb3b]"
            >
              STATE JOBS
            </button>
          </nav>

          {/* Quick Search Action button on Right */}
          <div className="hidden md:flex items-center gap-2 py-2">
            <button
              onClick={onOpenSearch}
              className="bg-[#660000] hover:bg-[#550000] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer border border-[#990000]"
            >
              <Search className="w-3.5 h-3.5 text-[#ffeb3b]" />
              <span>Search Portal</span>
            </button>
          </div>

          {/* Mobile menu trigger button */}
          <div className="md:hidden flex items-center justify-between w-full py-2.5">
            <span className="font-extrabold text-xs tracking-wider text-[#ffeb3b]">
              X SARKARI JOB MENU
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSearch}
                className="p-1.5 bg-[#660000] text-[#ffeb3b] rounded cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-white hover:bg-[#660000] rounded cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#660000] border-t border-[#800000] px-4 py-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className="w-full text-left py-2 px-3 text-xs font-bold text-white hover:bg-[#800000] hover:text-[#ffeb3b] rounded flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-gray-300">→</span>
              </button>
            ))}
            <div className="border-t border-[#800000] pt-2 mt-2">
              <button
                onClick={() => handleNav('age-calculator')}
                className="w-full text-left py-2 px-3 text-xs font-bold text-amber-200 hover:bg-[#800000] rounded"
              >
                Age Calculator Tool
              </button>
              <button
                onClick={() => handleNav('exam-calendar')}
                className="w-full text-left py-2 px-3 text-xs font-bold text-amber-200 hover:bg-[#800000] rounded"
              >
                Exam Calendar 2026
              </button>
            </div>
          </div>
        )}
      </div>

    </header>
  );
};
