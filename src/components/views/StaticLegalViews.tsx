import React, { useState } from 'react';
import { ShieldCheck, Mail, Send, AlertTriangle, CheckCircle2, MapPin, Building2 } from 'lucide-react';

interface StaticLegalViewsProps {
  viewType: 'about' | 'contact' | 'disclaimer' | 'privacy-policy' | 'terms' | 'cookie-policy';
  onNavigate: (route: string) => void;
}

export const StaticLegalViews: React.FC<StaticLegalViewsProps> = ({ viewType }) => {
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      } else {
        setErrorMsg(data.error || 'Failed to send message.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 transition-colors">
      
      {/* ========================================================= */}
      {/* About Us View */}
      {/* ========================================================= */}
      {viewType === 'about' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6 transition-colors">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
              About X Sarkari Job
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Empowering Indian youth with prompt, verified, and transparent government recruitment updates.
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 dark:text-slate-300 leading-relaxed space-y-4">
            <p>
              <strong className="text-gray-900 dark:text-slate-100">X Sarkari Job (xsarkarijob.com)</strong> is an independent educational and career information platform founded with a single mission: to simplify, organize, and accelerate access to official Indian government employment opportunities, examination schedules, admit cards, and scorecards.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 pt-2">Our Core Principles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose">
              <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
                <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">Source Verification</h4>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">Every post links directly to statutory commission notifications and official portals.</p>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-slate-800 rounded-lg border border-indigo-200 dark:border-slate-700">
                <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">No Clickbait Or Rumors</h4>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">We do not publish speculative dates or unconfirmed news. Real gazette data only.</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-slate-800 rounded-lg border border-emerald-200 dark:border-slate-700">
                <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">All-India Coverage</h4>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">Comprehensive tracking of Central SSC, UPSC, RRB and State Police, PSCs, and Teacher boards.</p>
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 pt-4">Our Technology</h3>
            <p>
              Unlike legacy portals that require manual copy-pasting, X Sarkari Job leverages intelligent continuous monitoring of verified government RSS feeds and official press portals with human editorial oversight to ensure error-free eligibility, syllabus, and application fee data.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Contact Us View */}
      {/* ========================================================= */}
      {viewType === 'contact' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 transition-colors">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
              Contact & Support Desk
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Have feedback, spotted an incorrect date, or have an editorial query? Send us a message below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              {submitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl p-6 text-center text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <h3 className="text-base font-bold">Message Received!</h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                    Our editorial team reviews messages regularly and will reply to your email if an inquiry was made.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs font-bold text-emerald-700 dark:text-emerald-400 underline cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs rounded-lg border border-red-200 dark:border-red-800">
                      {errorMsg}
                    </div>
                  )}

                  {/* Honeypot field for spam prevention */}
                  <input
                    type="text"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                  />

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Correction in SSC CGL 2026 Notification"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your question, feedback, or link correction..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-2.5 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-hidden focus:border-blue-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-5 bg-gray-50 dark:bg-slate-850/60 p-6 rounded-xl border border-gray-200 dark:border-slate-800 text-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider">
                Support Information
              </h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                For corrections, recruitment advertising queries, or reporting broken links on official portals, please use the form or our official editorial contact:
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>support@xsarkarijob.com</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-slate-300">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>X Sarkari Job Media & Editorial Network</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>New Delhi, India</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400">
                <strong>Notice:</strong> We do not issue admit cards or accept job application fees directly. Please do not send your admit card or fee receipts to this email.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Disclaimer View (Explicit Legal Requirement) */}
      {/* ========================================================= */}
      {viewType === 'disclaimer' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6 transition-colors">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Legal Notice</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
              Disclaimer & Non-Affiliation Statement
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Last Updated: September 2026</p>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 dark:text-slate-300 leading-relaxed space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 font-medium text-xs sm:text-sm">
              <strong>CRITICAL NOTICE:</strong> X Sarkari Job (xsarkarijob.com) is an independent, privately owned educational and career aggregation website. It is <strong>NOT</strong> an official website of the Government of India, any State Government, or any recruitment agency such as UPSC, SSC, IBPS, RRB, NTA, or CSBC.
            </div>

            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">1. Information Accuracy and Verification</h3>
            <p>
              While every attempt is made to keep information on this website authentic, accurate, and up to date, X Sarkari Job does not warrant or represent the complete accuracy or timeliness of any content. Candidates are strictly advised to double-check every examination date, eligibility criterion, fee amount, and vacancy detail on the official gazette notifications and official portals before submitting applications or paying exam fees.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">2. Non-Liability</h3>
            <p>
              Under no circumstances shall X Sarkari Job, its operators, editors, or contributors be held liable for any loss, delay, disqualification, or damage resulting from reliance on the information provided on this platform.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">3. External Links & Official Logos</h3>
            <p>
              This website contains hyperlinks to external, official government recruitment websites. These external links are provided purely for user convenience. We do not own, control, or take responsibility for the availability, server uptime, or content of third-party domains. All government emblems, board logos, and recruitment names belong to their respective statutory owners and are used purely for nominative reference.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Privacy Policy View */}
      {/* ========================================================= */}
      {viewType === 'privacy-policy' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6 transition-colors">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Effective Date: September 1, 2026</p>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 dark:text-slate-300 leading-relaxed space-y-4">
            <p>
              At <strong className="text-gray-900 dark:text-slate-100">X Sarkari Job</strong>, accessible from xsarkarijob.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by X Sarkari Job and how we use it.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Information We Collect</h3>
            <p>
              We do not require users to register or create accounts to view jobs, results, or admit cards. When you choose to subscribe to exam notifications or contact our help desk, we collect only your email address and message contents.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Log Files & Cookies</h3>
            <p>
              Like most websites, X Sarkari Job follows a standard procedure of using log files. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. These are not linked to any personally identifiable information.
            </p>

            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Google AdSense and Advertising Partners</h3>
            <p>
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on X Sarkari Job. They automatically receive your IP address when this occurs.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Terms & Conditions */}
      {/* ========================================================= */}
      {viewType === 'terms' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6 transition-colors">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Last Revised: September 2026</p>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 dark:text-slate-300 leading-relaxed space-y-4">
            <p>
              Welcome to <strong className="text-gray-900 dark:text-slate-100">X Sarkari Job</strong>. By accessing or using this website, you agree to be bound by these terms and conditions. If you disagree with any part of these terms, please do not use our website.
            </p>
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Use License</h3>
            <p>
              Permission is granted to temporarily access the materials on X Sarkari Job's website for personal, non-commercial transitory viewing only. You may not scrape or redistribute our curated summaries for unauthorized commercial aggregation.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Cookie Policy */}
      {/* ========================================================= */}
      {viewType === 'cookie-policy' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6 transition-colors">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Last Revised: September 2026</p>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 dark:text-slate-300 leading-relaxed space-y-4">
            <p>
              This is the Cookie Policy for X Sarkari Job. Cookies are small files downloaded to your computer to improve your experience, remember preferences, and analyze site performance.
            </p>
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Disabling Cookies</h3>
            <p>
              You can prevent the setting of cookies by adjusting the settings on your browser. Disabling cookies will usually result in also disabling certain functionality of this site.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
