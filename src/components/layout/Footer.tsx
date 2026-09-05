import React, { useState } from 'react';
import { ShieldCheck, Mail, Send, ExternalLink, AlertCircle, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribing(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch {
      setSubscribed(true);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Subscription Alert Box */}
        <div className="bg-gray-800/80 rounded-xl p-6 sm:p-8 border border-gray-700/80 mb-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Fast Alert Notifications
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Never Miss an Important Government Job or Exam Result
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Get instant updates on SSC, UPSC, Railway, Police, and Banking recruitment notifications directly to your inbox.
              </p>
            </div>
            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="bg-emerald-950/60 border border-emerald-600/50 rounded-lg p-3 text-emerald-300 text-sm font-medium text-center">
                  ✓ Thank you! You will receive verified exam alerts.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {subscribing ? 'Joining...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4 Column Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & About */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
              <img src="/logo.svg" alt="X Sarkari Job" className="w-9 h-9" />
              <span className="text-lg font-black tracking-tight text-white">
                <span className="text-amber-500">X</span> SARKARI JOB
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4 pr-6">
              X Sarkari Job is an independent government examination and career information portal dedicated to providing authenticated recruitment notices, admit cards, answer keys, exam results, and detailed syllabi for Indian government job aspirants.
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Official Sources Checked Real-time</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('jobs')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Latest Jobs 2026
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('results')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Exam Results
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admit-card')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Admit Cards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('answer-key')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Answer Keys
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('syllabus')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Exam Syllabus
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admission')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Admission Forms
                </button>
              </li>
            </ul>
          </div>

          {/* Tools & Utilities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Helpful Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('age-calculator')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Age Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('percentage-calculator')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Percentage Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exam-calendar')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Exam Calendar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jobs')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  State-wise Jobs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scholarship')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Scholarships
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('disclaimer')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cookie-policy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Strict Legal Non-Affiliation Disclaimer Banner */}
        <div className="border-t border-gray-800 pt-6 pb-6 text-xs text-gray-400 leading-relaxed bg-gray-950/40 p-4 rounded-lg">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-200">Independent Information Notice: </span>
              X Sarkari Job (xsarkarijob.com) is an independent private educational and career portal. It is NOT affiliated with, authorized by, or endorsed by the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), Central Selection Board, or any Central or State Government department. All recruitment notifications and logos displayed belong to their respective statutory authorities. Candidates are strictly advised to verify all notifications directly on the official websites before making application or fee payments.
            </div>
          </div>
        </div>

        {/* Bottom copyright & sitemap links */}
        <div className="border-t border-gray-800/80 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 X Sarkari Job. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
              XML Sitemap <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
              Robots.txt <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <button onClick={() => onNavigate('admin')} className="hover:text-amber-400">
              Admin Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
