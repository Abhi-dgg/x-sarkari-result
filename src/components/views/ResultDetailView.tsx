import React, { useState, useEffect } from 'react';
import { ResultItem } from '../../types';
import { OfficialLinksTable } from '../common/OfficialLinksTable';
import { ChevronRight, ExternalLink, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';

interface ResultDetailViewProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const ResultDetailView: React.FC<ResultDetailViewProps> = ({ slug, onNavigate }) => {
  const [result, setResult] = useState<ResultItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`/api/results/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Result not found');
        return res.json();
      })
      .then(data => {
        if (data && !data.error) {
          setResult(data);
          if (data?.title) document.title = `${data.title} | X Sarkari Job`;
        } else {
          setResult(null);
        }
      })
      .catch(err => {
        console.error(err);
        setResult(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500 dark:text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-semibold text-sm">Loading verified result announcement...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Result Not Found</h2>
        <p className="text-gray-600 dark:text-slate-400 text-sm mt-1 mb-6">The requested exam scorecard has not yet been declared or link expired.</p>
        <button onClick={() => onNavigate('results')} className="bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold px-4 py-2 rounded-lg text-sm cursor-pointer">
          Return to Results
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 mb-4 flex-wrap">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <button onClick={() => onNavigate('results')} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">Results</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 dark:text-slate-200 font-semibold">{result.organizationSlug?.toUpperCase()}</span>
      </nav>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8 transition-colors">
        <div className="p-6 sm:p-8 bg-blue-50/50 dark:bg-slate-950/60 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#1e40af] text-white text-xs font-bold px-2.5 py-0.5 rounded">
              Result Declared
            </span>
            <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 rounded border border-gray-200 dark:border-slate-700">
              {result.category}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-slate-100 leading-snug">
            {result.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-slate-400 mt-3">
            <span className="font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-gray-500" /> {result.organization}
            </span>
            <span>•</span>
            <span>Declaration Date: <strong className="text-gray-900 dark:text-slate-100">{result.resultDate}</strong></span>
            <span>•</span>
            <span>Exam Date: {result.examDate}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-gray-50 dark:bg-slate-850/60 p-4 rounded-lg border border-gray-200 dark:border-slate-800 text-xs sm:text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-gray-900 dark:text-slate-100 block mb-1">Result Information:</strong>
            {result.organization} has officially declared the written exam result and merit list for {result.examName}. Candidates who appeared in the examination conducted on {result.examDate} can check their qualifying status, cutoff marks, and scorecards using the official links below.
          </div>

          {/* Download Steps */}
          <div className="border border-gray-200 dark:border-slate-800 rounded-lg p-5 bg-white dark:bg-slate-900">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-3">
              How to Check & Download {result.examName} Result 2026
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-slate-300 list-decimal list-inside">
              <li>Click on the direct "Download Result / Merit List" link provided below.</li>
              <li>A PDF document will open in your browser window.</li>
              <li>Press <strong>Ctrl + F</strong> (on Computer) or use the search icon (on Mobile).</li>
              <li>Enter your Roll Number or Registration ID to find your name and qualifying status.</li>
              <li>Download and print a copy for document verification and future rounds.</li>
            </ol>
          </div>

          {/* Important Links Table */}
          {(() => {
            const resultLinks = (result.importantLinks && result.importantLinks.length > 0)
              ? result.importantLinks
              : [
                  ...(result.resultLink ? [{
                    label: `Download ${result.examName || 'Exam'} Result & Merit List PDF`,
                    url: result.resultLink,
                    linkType: 'RESULT' as const,
                    isOfficial: true,
                  }] : []),
                  ...(result.scorecardLink ? [{
                    label: 'Download Marks / Score Card / Candidate Rank',
                    url: result.scorecardLink,
                    linkType: 'OTHER' as const,
                    isOfficial: true,
                  }] : []),
                  ...(result.cutoffLink ? [{
                    label: 'Download Official Cut-off Marks Notice PDF',
                    url: result.cutoffLink,
                    linkType: 'NOTIFICATION' as const,
                    isOfficial: true,
                  }] : []),
                  ...(result.meritListLink && result.meritListLink !== result.resultLink ? [{
                    label: 'Download Selected Candidates Roll Number List PDF',
                    url: result.meritListLink,
                    linkType: 'RESULT' as const,
                    isOfficial: true,
                  }] : []),
                  ...(result.officialNotificationUrl ? [{
                    label: 'Download Official Result Declaration Notification PDF',
                    url: result.officialNotificationUrl,
                    linkType: 'NOTIFICATION' as const,
                    isOfficial: true,
                  }] : []),
                  {
                    label: `Official Website (${result.organization})`,
                    url: result.officialWebsiteUrl || result.sourceUrl || 'https://resultbharat.com',
                    linkType: 'OFFICIAL_WEBSITE' as const,
                    isOfficial: true,
                  }
                ];

            return (
              <OfficialLinksTable
                title="Direct Result & Cut-off Links"
                links={resultLinks}
                sourceUrl={result.sourceUrl}
                organization={result.organization}
              />
            );
          })()}

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Source Authenticity</p>
              <p className="mt-1 text-emerald-800 dark:text-emerald-300">
                Verified directly from {result.organization} official announcement at <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold">{result.sourceUrl}</a>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
