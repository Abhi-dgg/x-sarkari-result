import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Building2, 
  GraduationCap, 
  Sparkles, 
  RefreshCw,
  Award,
  Globe2,
  Copy,
  Check
} from 'lucide-react';
import { FactCheckReport } from '../../types';

export const AIFactCheckSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gpt-4o' | 'claude-3-5' | 'grok' | 'gemini'>('gpt-4o');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<FactCheckReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportCopied, setReportCopied] = useState(false);

  const handleCopyReport = () => {
    if (!report) return;
    const copyText = `[X SARKARI JOB FACT CHECK REPORT - RESULT BHARAT VERIFIED]
📌 ${report.verdictHeadline}
🏛️ विभाग: ${report.keyFacts.organization}
📝 कुल पद: ${report.keyFacts.totalVacancies}
🗓️ आवेदन: ${report.keyFacts.applicationWindow}
🎯 परीक्षा: ${report.keyFacts.examDate}
✅ विवरण: ${report.hindiSummary}
🌐 आधिकारिक लिंक: ${report.directLinks?.map(l => `${l.label}: ${l.url}`).join(' | ')}
🔗 Source: Result Bharat (resultbharat.com)`;
    navigator.clipboard.writeText(copyText);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2500);
  };

  const modelTabs = [
    { id: 'gpt-4o', label: 'GPT-4o (OpenAI)', badge: 'ChatGPT', color: 'bg-emerald-700' },
    { id: 'claude-3-5', label: 'Claude 3.5 (Anthropic)', badge: 'Claude', color: 'bg-amber-700' },
    { id: 'grok', label: 'Grok-2 (xAI)', badge: 'Grok', color: 'bg-indigo-700' },
    { id: 'gemini', label: 'Gemini 2.5 (Google)', badge: 'Gemini', color: 'bg-blue-700' }
  ];

  const popularChecks = [
    { label: 'Patna High Court 550 Assistant', query: 'Patna High Court Assistant 2026 notification' },
    { label: 'BPSC TRE 4.0 (40,000+ Posts)', query: 'BPSC TRE 4.0 teacher recruitment 2026' },
    { label: 'India Post GDS (44,228 Posts)', query: 'India Post GDS online form 2026' },
    { label: 'RRB NTPC 2026 (11,558 Posts)', query: 'RRB NTPC 2026 notification vacancies' },
    { label: 'SSC GD Constable (39,481 Posts)', query: 'SSC GD Constable 2026 notification' },
    { label: 'UP Police 60,244 Answer Key', query: 'UP Police Constable 60244 answer key 2026' }
  ];

  const handleFactCheck = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    if (searchQuery) setQuery(searchQuery);

    try {
      const res = await fetch('/api/ai/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, model: selectedModel })
      });

      if (!res.ok) {
        throw new Error('Verification service temporarily busy');
      }

      const data: FactCheckReport = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to verify notice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: FactCheckReport['verificationStatus']) => {
    switch (status) {
      case 'OFFICIALLY_VERIFIED':
      case 'APPLICATION_ACTIVE':
        return {
          bg: 'bg-emerald-700 text-white',
          label: 'OFFICIALLY VERIFIED • आवेदन प्रक्रिया लाइव',
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case 'ADMIT_CARD_RELEASED':
        return {
          bg: 'bg-blue-700 text-white',
          label: 'ADMIT CARD ACTIVE • प्रवेश पत्र जारी',
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case 'RESULT_DECLARED':
        return {
          bg: 'bg-purple-700 text-white',
          label: 'RESULT DECLARED • परीक्षा परिणाम जारी',
          icon: <Award className="w-4 h-4" />
        };
      case 'EXAM_SCHEDULED':
        return {
          bg: 'bg-amber-600 text-white',
          label: 'EXAM SCHEDULED • परीक्षा तिथि घोषित',
          icon: <Calendar className="w-4 h-4" />
        };
      case 'FAKE_NOTICE_DEBUNKED':
        return {
          bg: 'bg-red-700 text-white',
          label: 'FAKE NOTICE DEBUNKED • फर्जी सूचना से सावधान',
          icon: <AlertTriangle className="w-4 h-4" />
        };
      default:
        return {
          bg: 'bg-gray-800 text-white',
          label: 'FACT CHECK VERIFIED',
          icon: <ShieldCheck className="w-4 h-4" />
        };
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50/60 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/60 border-y-2 border-blue-200 dark:border-slate-800 py-6 px-4 sm:px-6 shadow-inner transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1e40af] text-white px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider mb-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Result Bharat (resultbharat.com) Official Fact-Check & Verification
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0f2347] dark:text-blue-300 tracking-tight">
              Result Bharat अधिकृत भर्ती, रिजल्ट व एडमिट कार्ड सत्यापन (100% Data Matched)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
              यह प्रणाली केवल और केवल <strong>Result Bharat (resultbharat.com)</strong> के आधिकारिक डेटा, सरकारी गजट व आयोगों की सूचनाओं को सत्यापित करती है। GPT-4o, Claude 3.5 और Grok AI द्वारा संचालित।
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold text-gray-700 dark:text-slate-200">
            <span className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-gray-200 dark:border-slate-700 shadow-2xs text-[#1e40af] dark:text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Result Bharat Verified
            </span>
            <span className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-gray-200 dark:border-slate-700 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> SSC / BPSC / RRB / HC
            </span>
            <span className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-gray-200 dark:border-slate-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> GPT-4o • Claude • Grok
            </span>
          </div>
        </div>

        {/* Model Selection Selector (GPT, Claude, Grok, Gemini) */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-700 dark:text-slate-300">
            Select AI Engine:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {modelTabs.map(tab => {
              const isSelected = selectedModel === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedModel(tab.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? `${tab.color} text-white border-transparent shadow-xs scale-102`
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search / Fact Check Input */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleFactCheck(); }}
          className="flex flex-col sm:flex-row items-stretch gap-2 mb-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="उदा: RRB NTPC 2026 पद, UP Police री-एग्जाम उत्तर कुंजी, SSC GD भर्ती 39,481..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 rounded-lg border-2 border-blue-400/80 dark:border-slate-700 text-gray-900 dark:text-slate-100 text-sm placeholder:text-gray-400 focus:outline-hidden focus:border-blue-600 shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-black text-sm px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                जांच जारी है (Fact Checking)...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-yellow-300" />
                सत्यापित करें (Verify Notice)
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-gray-600 dark:text-slate-300 mb-4">
          <span className="font-bold text-gray-800 dark:text-slate-100">लोकप्रिय जांच (Popular Fact Checks):</span>
          {popularChecks.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleFactCheck(item.query)}
              className="bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 px-2.5 py-1 rounded-full border border-gray-300 dark:border-slate-700 text-[11px] font-semibold cursor-pointer transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-xs font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Report Card */}
        {report && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-blue-500/50 dark:border-blue-700 shadow-md p-5 animate-in fade-in-50 duration-300 transition-colors">
            {/* Verdict Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const badge = getStatusBadge(report.verificationStatus);
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-black tracking-wide ${badge.bg}`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  );
                })()}
                <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded text-xs font-bold">
                  AI विश्वास स्कोर: {report.confidenceScore}%
                </span>
                <span className="text-[11px] text-gray-500 dark:text-slate-400">
                  सत्यापन समय: {new Date(report.lastCheckedAt).toLocaleTimeString()} IST
                </span>
              </div>

              {/* Educational Reference Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">पुष्टि स्रोत:</span>
                {report.educationalReferences?.map((ref, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded border border-gray-200 dark:border-slate-700">
                    {ref}
                  </span>
                ))}
              </div>
            </div>

            {/* Result Bharat Official Data Ribbon */}
            <div className="mt-3.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs border border-blue-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-yellow-300 shrink-0" />
                <span className="text-xs sm:text-sm font-black">
                  Result Bharat (resultbharat.com) 100% अधिकृत डेटा सत्यापित
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyReport}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Copy complete verified notification to paste"
                >
                  {reportCopied ? <Check className="w-3.5 h-3.5 text-emerald-900" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{reportCopied ? 'Notification Copied!' : 'Copy Notification (कॉपी करें)'}</span>
                </button>
                {report.resultBharatUrl && (
                  <a
                    href={report.resultBharatUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1 border border-blue-600"
                  >
                    <span>Result Bharat Link</span>
                    <ExternalLink className="w-3 h-3 text-yellow-300" />
                  </a>
                )}
              </div>
            </div>

            {/* Headline & Summary */}
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-black text-gray-900 dark:text-slate-100 leading-snug">
                {report.verdictHeadline}
              </h3>

              {/* Hindi Summary Box */}
              <div className="bg-amber-50/70 dark:bg-slate-800/80 p-3 rounded-lg border-l-4 border-amber-600 dark:border-amber-500 text-xs sm:text-sm text-gray-800 dark:text-slate-200 font-medium">
                <strong className="text-amber-900 dark:text-amber-400 block mb-0.5">हिंदी विवरण (Result Bharat अधिकृत डेटा द्वारा प्रमाणित):</strong>
                <p>{report.hindiSummary}</p>
              </div>

              {/* English Summary */}
              <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                {report.englishSummary}
              </p>
            </div>

            {/* Official Confirmation Details */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 dark:bg-slate-950 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                <span className="font-bold text-gray-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block">आधिकारिक सरकारी विभाग / आयोग:</span>
                <p className="font-black text-gray-900 dark:text-slate-100 text-sm mt-0.5">{report.officialGovernmentSource}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-950 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                <span className="font-bold text-gray-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block">PIB Fact Check स्थिति:</span>
                <p className="font-bold text-emerald-800 dark:text-emerald-400 text-sm mt-0.5">{report.pibFactCheckStatus}</p>
              </div>
            </div>

            {/* Key Facts Grid */}
            <div className="mt-4">
              <h4 className="text-xs font-black uppercase text-gray-700 dark:text-slate-300 tracking-wider mb-2">
                महत्वपूर्ण प्रमाणित तथ्य (Verified Key Facts):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                <div className="bg-blue-50/50 dark:bg-slate-800 p-2.5 rounded border border-blue-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold block uppercase">विभाग/संगठन</span>
                  <strong className="text-gray-900 dark:text-slate-100 truncate block">{report.keyFacts.organization}</strong>
                </div>
                <div className="bg-blue-50/50 dark:bg-slate-800 p-2.5 rounded border border-blue-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold block uppercase">कुल पद (Vacancies)</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-black block">{report.keyFacts.totalVacancies}</strong>
                </div>
                <div className="bg-blue-50/50 dark:bg-slate-800 p-2.5 rounded border border-blue-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold block uppercase">आवेदन तिथि</span>
                  <strong className="text-gray-900 dark:text-slate-100 block truncate">{report.keyFacts.applicationWindow}</strong>
                </div>
                <div className="bg-blue-50/50 dark:bg-slate-800 p-2.5 rounded border border-blue-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold block uppercase">परीक्षा तिथि</span>
                  <strong className="text-amber-700 dark:text-amber-400 block truncate">{report.keyFacts.examDate}</strong>
                </div>
                <div className="bg-blue-50/50 dark:bg-slate-800 p-2.5 rounded border border-blue-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold block uppercase">एडमिट कार्ड स्थिति</span>
                  <strong className="text-blue-700 dark:text-blue-400 block truncate">{report.keyFacts.admitCardStatus}</strong>
                </div>
                <div className="bg-blue-50/50 dark:bg-slate-800 p-2.5 rounded border border-blue-200 dark:border-slate-700">
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold block uppercase">परिणाम स्थिति</span>
                  <strong className="text-purple-700 dark:text-purple-400 block truncate">{report.keyFacts.resultStatus}</strong>
                </div>
              </div>
            </div>

            {/* Direct Official Links & Citations */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-gray-700 dark:text-slate-300">सीधे आधिकारिक लिंक (Direct Links):</span>
                {report.directLinks?.map((link, idx) => (
                  <div key={idx} className="inline-flex items-center rounded overflow-hidden shadow-2xs">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 px-3 py-1 font-bold transition-colors ${
                        link.isOfficial
                          ? 'bg-[#1e40af] hover:bg-[#1d4ed8] text-white'
                          : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-800 dark:text-slate-200 border border-gray-300 dark:border-slate-700'
                      }`}
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(link.url);
                        alert(`Copied link to clipboard: ${link.url}`);
                      }}
                      title="Copy link to paste"
                      className="px-1.5 py-1 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 cursor-pointer border-l border-gray-300 dark:border-slate-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Web Grounding Sources */}
              {report.groundingSources && report.groundingSources.length > 0 && (
                <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                  <Globe2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>स्रोतः</span>
                  {report.groundingSources.slice(0, 3).map((src, sIdx) => (
                    <a 
                      key={sIdx}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[140px]"
                      title={src.title}
                    >
                      {src.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
