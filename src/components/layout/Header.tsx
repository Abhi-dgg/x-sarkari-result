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
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  Bell,
  Smartphone,
  Bot
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  isAdminLoggedIn: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLiveSync: () => void;
  isSyncing: boolean;
  lastSyncedAt?: string;
  onOpenAIAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  isAdminLoggedIn,
  theme,
  onToggleTheme,
  onLiveSync,
  isSyncing,
  lastSyncedAt,
  onOpenAIAssistant
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
    { label: 'IMPORTANT', route: 'scholarship' },
  ];

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <header className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 transition-colors duration-200">
      
      {/* Top micro-bar: Verified notice, Fast Alert & Live Sync Status */}
      <div className="bg-[#0b192e] text-gray-200 text-xs px-4 py-1.5 font-medium flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white uppercase tracking-wider shrink-0">
            OFFICIAL ALERTS
          </span>
          <span className="hidden sm:inline text-gray-300 text-[11px] truncate">
            Welcome to <strong className="text-white">X Sarkari Job</strong> — India's Real-time Govt Jobs, Results & Admit Card Portal
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] shrink-0">
          {/* Admin-only quick sync indicator (hidden from regular user side) */}
          {isAdminLoggedIn && (
            <button
              onClick={onLiveSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/80 transition-all cursor-pointer"
              title="Admin 24/7 Portal Sync with Result Bharat & Sarkari Result"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Admin Sync</span>
              <RefreshCw className={`w-3 h-3 ml-0.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          )}

          <button 
            onClick={() => handleNav('disclaimer')} 
            className="text-gray-300 hover:text-white transition-colors cursor-pointer hidden sm:inline"
          >
            Disclaimer
          </button>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <button 
            onClick={() => handleNav('contact')} 
            className="text-gray-300 hover:text-white transition-colors cursor-pointer hidden sm:inline"
          >
            Help & Contact
          </button>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <button 
            onClick={() => handleNav('admin')} 
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            <User className="w-3 h-3" />
            {isAdminLoggedIn ? 'Admin Panel' : 'Staff Login'}
          </button>
        </div>
      </div>

      {/* Main Brand Header (Result Bharat Style, In Royal Navy & Amber Theme) */}
      <div className="bg-white dark:bg-slate-900 py-3.5 px-4 sm:px-6 border-b border-gray-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Centered / Left Logo & Title: Name & Logo Kept Exactly as Requested */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3.5 cursor-pointer select-none group text-center md:text-left"
            id="brand-logo-button"
          >
            <img 
              src="/logo.svg" 
              alt="X Sarkari Job Official Emblem" 
              className="w-14 h-14 rounded-full transition-transform group-hover:scale-105 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f2347] dark:text-blue-400 uppercase font-sans flex items-center">
                  <span className="text-[#f59e0b] mr-1">X</span> SARKARI JOB
                </h1>
                <span className="text-[10px] font-black bg-[#1e3a8a] text-[#ffeb3b] px-2 py-0.5 rounded tracking-wide uppercase shadow-xs">
                  NO. 1 PORTAL
                </span>
              </div>
              <p className="text-xs font-bold text-gray-800 dark:text-slate-200 tracking-wide mt-0.5">
                www.xsarkarijob.com — भारतम की सबसे तेज सरकारी रिजल्ट व जॉब पोर्टल
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 hidden sm:block">
                Free Job Alert, Sarkari Result, Sarkari Exam, Online Form, Admit Card & Answer Key 2026
              </p>
            </div>
          </div>

          {/* Social Quick-Join Buttons & The Student Dark Mode Button */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            
            {/* ======================================================== */}
            {/* ONE BUTTON FOR LIGHT MODE AND DARK MODE FOR THE STUDENT */}
            {/* ======================================================== */}
            <button
              id="student-dark-mode-toggle"
              onClick={onToggleTheme}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm transition-all duration-200 cursor-pointer border ${
                theme === 'dark' 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 hover:bg-amber-300' 
                  : 'bg-slate-900 text-yellow-300 border-slate-700 hover:bg-slate-800'
              }`}
              title="Toggle Light / Dark mode for student eye comfort while studying"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 fill-current text-slate-950 animate-spin-slow" />
                  <span>☀️ Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 fill-current text-yellow-300" />
                  <span>🌙 Dark Mode (Students)</span>
                </>
              )}
            </button>

            {/* Ask AI (GPT / Claude / Grok) Button */}
            {onOpenAIAssistant && (
              <button
                id="header-ai-ask-button"
                onClick={onOpenAIAssistant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-sm transition-all duration-200 cursor-pointer border bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-yellow-300 border-indigo-500 hover:brightness-110 active:scale-95"
                title="Ask AI Exam Questions using GPT-4o, Claude 3.5, Grok or Gemini"
              >
                <Bot className="w-4 h-4 text-yellow-300" />
                <span>Ask AI (GPT/Claude/Grok)</span>
              </button>
            )}

            {/* Social channels (Result Bharat Style) */}
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-xs transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold shadow-xs transition-transform hover:-translate-y-0.5"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Telegram</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-yellow-300" />
              <span>Search Job</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Royal Navy Navigation Bar (Result Bharat Format, in Navy Blue Theme) */}
      <div className="bg-[#0f2347] dark:bg-slate-900 text-white shadow-md sticky top-0 z-30 border-b border-blue-900/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-0.5 font-extrabold text-xs tracking-wider">
            {navItems.map(item => {
              const active = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-${item.route}`}
                  onClick={() => handleNav(item.route)}
                  className={`py-3 px-3 transition-all cursor-pointer border-b-2 flex items-center gap-1 select-none ${
                    active 
                      ? 'bg-[#1e3a8a] text-[#ffeb3b] border-[#ffeb3b]' 
                      : (item as any).highlight
                        ? 'bg-amber-500/20 text-yellow-300 hover:bg-amber-500/35 border-amber-300'
                        : 'border-transparent text-gray-100 hover:bg-[#1b3a6b] hover:text-[#ffeb3b]'
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
                className="py-3 px-3 transition-colors cursor-pointer border-b-2 border-transparent text-gray-100 hover:bg-[#1b3a6b] hover:text-[#ffeb3b] flex items-center gap-1 select-none"
              >
                TOOLS ▾
              </button>
              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-0 w-52 bg-white dark:bg-slate-900 rounded-b-md shadow-xl border border-gray-200 dark:border-slate-700 py-2 z-50 text-gray-800 dark:text-slate-100 font-medium">
                  <button
                    onClick={() => handleNav('age-calculator')}
                    className="w-full px-4 py-2 text-left text-xs text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#1e3a8a] flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <Calculator className="w-4 h-4 text-blue-700" />
                    Age Calculator
                  </button>
                  <button
                    onClick={() => handleNav('percentage-calculator')}
                    className="w-full px-4 py-2 text-left text-xs text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#1e3a8a] flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <Calculator className="w-4 h-4 text-blue-700" />
                    Percentage Calculator
                  </button>
                  <button
                    onClick={() => handleNav('exam-calendar')}
                    className="w-full px-4 py-2 text-left text-xs text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#1e3a8a] flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <Calendar className="w-4 h-4 text-blue-700" />
                    Exam Calendar 2026
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('jobs')}
              className="py-3 px-3 transition-colors cursor-pointer border-b-2 border-transparent text-gray-100 hover:bg-[#1b3a6b] hover:text-[#ffeb3b] select-none"
            >
              STATE JOBS
            </button>
          </nav>

          {/* Quick Search Action & Sync on Right */}
          <div className="hidden md:flex items-center gap-2 py-2">
            <button
              onClick={onLiveSync}
              disabled={isSyncing}
              className="bg-[#172e54] hover:bg-[#1b3a6b] text-yellow-300 text-xs font-bold px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer border border-blue-800/80"
              title="Sync with latest Result Bharat & Official Releases"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Live Sync'}</span>
            </button>
            <button
              onClick={onOpenSearch}
              className="bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer border border-blue-600"
            >
              <Search className="w-3.5 h-3.5 text-yellow-300" />
              <span>Search Portal</span>
            </button>
          </div>

          {/* Mobile menu trigger button & Dark mode button */}
          <div className="md:hidden flex items-center justify-between w-full py-2.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs tracking-wider text-[#ffeb3b]">
                X SARKARI JOB
              </span>
              <button
                onClick={onToggleTheme}
                className="px-2 py-1 bg-slate-800 text-yellow-300 rounded text-[11px] font-bold flex items-center gap-1"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSearch}
                className="p-1.5 bg-[#1e3a8a] text-[#ffeb3b] rounded cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-white hover:bg-[#1e3a8a] rounded cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c1e3d] border-t border-blue-900 px-4 py-3 space-y-1">
            <div className="pb-2 mb-2 border-b border-blue-800/60 flex items-center justify-between">
              <span className="text-xs text-gray-300">Display Mode:</span>
              <button
                onClick={onToggleTheme}
                className="text-xs font-bold px-3 py-1 bg-amber-400 text-slate-950 rounded flex items-center gap-1"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
            </div>
            {navItems.map(item => (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className="w-full text-left py-2 px-3 text-xs font-bold text-white hover:bg-[#1e3a8a] hover:text-[#ffeb3b] rounded flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-gray-300">→</span>
              </button>
            ))}
            <div className="border-t border-blue-900/80 pt-2 mt-2">
              <button
                onClick={() => handleNav('age-calculator')}
                className="w-full text-left py-2 px-3 text-xs font-bold text-amber-200 hover:bg-[#1e3a8a] rounded"
              >
                Age Calculator Tool
              </button>
              <button
                onClick={() => handleNav('percentage-calculator')}
                className="w-full text-left py-2 px-3 text-xs font-bold text-amber-200 hover:bg-[#1e3a8a] rounded"
              >
                Percentage Calculator
              </button>
              <button
                onClick={() => handleNav('exam-calendar')}
                className="w-full text-left py-2 px-3 text-xs font-bold text-amber-200 hover:bg-[#1e3a8a] rounded"
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
