import React, { useState, useEffect } from 'react';
import { ResultItem } from '../../types';
import { Award, Calendar, ChevronRight, ExternalLink, ShieldCheck, AlertCircle, Building2, Download } from 'lucide-react';

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
      .then(res => res.json())
      .then(data => {
        setResult(data);
        if (data?.title) document.title = `${data.title} | X Sarkari Job`;
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-semibold text-sm">Loading verified result announcement...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Result Not Found</h2>
        <p className="text-gray-600 text-sm mt-1 mb-6">The requested exam scorecard has not yet been declared or link expired.</p>
        <button onClick={() => onNavigate('results')} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
          Return to Results
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 flex-wrap">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-700">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <button onClick={() => onNavigate('results')} className="hover:text-blue-700">Results</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">{result.organizationSlug.toUpperCase()}</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 sm:p-8 bg-blue-50/50 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-700 text-white text-xs font-bold px-2.5 py-0.5 rounded">
              Result Declared
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded">
              {result.category}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
            {result.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-3">
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-gray-500" /> {result.organization}
            </span>
            <span>•</span>
            <span>Declaration Date: <strong className="text-gray-900">{result.resultDate}</strong></span>
            <span>•</span>
            <span>Exam Date: {result.examDate}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <strong className="text-gray-900 block mb-1">Result Information:</strong>
            {result.organization} has officially declared the written exam result and merit list for {result.examName}. Candidates who appeared in the examination conducted on {result.examDate} can check their qualifying status, cutoff marks, and scorecards using the official links below.
          </div>

          {/* Download Steps */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
              How to Check & Download {result.examName} Result 2026
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-gray-700 list-decimal list-inside">
              <li>Click on the direct "Download Result / Merit List" link provided below.</li>
              <li>A PDF document will open in your browser window.</li>
              <li>Press <strong>Ctrl + F</strong> (on Computer) or use the search icon (on Mobile).</li>
              <li>Enter your Roll Number or Registration ID to find your name and qualifying status.</li>
              <li>Download and print a copy for document verification and future rounds.</li>
            </ol>
          </div>

          {/* Important Links Table */}
          <div className="border-2 border-blue-600 rounded-xl overflow-hidden shadow-md">
            <div className="bg-blue-700 text-white px-5 py-3 font-extrabold text-sm flex items-center justify-between">
              <span>Direct Result & Cut-off Links</span>
              <span className="text-xs bg-blue-800 px-2 py-0.5 rounded font-normal">Official Servers</span>
            </div>
            <table className="w-full text-xs sm:text-sm divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-100">
                {result.importantLinks.map((link, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/40">
                    <td className="px-5 py-3.5 font-bold text-gray-900">{link.label}</td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded text-xs transition-colors"
                      >
                        <span>Download Result</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-900">Source Authenticity</p>
              <p className="mt-1">
                Verified directly from {result.organization} official announcement at <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold">{result.sourceUrl}</a>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
