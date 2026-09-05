import React, { useState, useEffect } from 'react';
import { AdmitCardItem } from '../../types';
import { CreditCard, Calendar, ChevronRight, ExternalLink, ShieldCheck, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';

interface AdmitCardDetailViewProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const AdmitCardDetailView: React.FC<AdmitCardDetailViewProps> = ({ slug, onNavigate }) => {
  const [admitCard, setAdmitCard] = useState<AdmitCardItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`/api/admit-cards/${slug}`)
      .then(res => res.json())
      .then(data => {
        setAdmitCard(data);
        if (data?.title) document.title = `${data.title} | X Sarkari Job`;
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-semibold text-sm">Loading hall ticket details...</p>
      </div>
    );
  }

  if (!admitCard) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Admit Card Not Found</h2>
        <p className="text-gray-600 text-sm mt-1 mb-6">Hall ticket link has expired or exam has concluded.</p>
        <button onClick={() => onNavigate('admit-card')} className="bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
          Return to Admit Cards
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 flex-wrap">
        <button onClick={() => onNavigate('home')} className="hover:text-amber-700">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <button onClick={() => onNavigate('admit-card')} className="hover:text-amber-700">Admit Card</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">{admitCard.organizationSlug.toUpperCase()}</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 sm:p-8 bg-amber-50/50 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">
              Admit Card Live
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded">
              {admitCard.category}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
            {admitCard.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-3">
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-gray-500" /> {admitCard.organization}
            </span>
            <span>•</span>
            <span>Release Date: <strong className="text-gray-900">{admitCard.releaseDate}</strong></span>
            <span>•</span>
            <span className="text-amber-900 font-bold">Exam Date: {admitCard.examDate}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <strong className="text-gray-900 block mb-1">Hall Ticket Details:</strong>
            {admitCard.organization} has released the official Admit Card / Call Letter for {admitCard.examName}. Candidates scheduled to appear for the test starting on <strong>{admitCard.examDate}</strong> must download and print their admit cards before the examination day. Entry to the examination venue will be prohibited without a valid printed admit card and original photo ID.
          </div>

          {/* Exam Day Instructions */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> Mandatory Documents to Carry
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 list-disc list-inside">
              <li>Clear printed copy of the Admit Card (Color or Black & White).</li>
              <li>Original Government Photo ID Proof (Aadhaar Card, Voter ID, PAN Card, Driving License or Passport).</li>
              <li>Two recent passport-size color photographs matching the application form.</li>
              <li>Transparent blue or black ballpoint pen.</li>
            </ul>
          </div>

          {/* Download Hall Ticket Links */}
          <div className="border-2 border-amber-500 rounded-xl overflow-hidden shadow-md">
            <div className="bg-amber-600 text-white px-5 py-3 font-extrabold text-sm flex items-center justify-between">
              <span>Direct Admit Card Download Servers</span>
              <span className="text-xs bg-amber-700 px-2 py-0.5 rounded font-normal">Official Link</span>
            </div>
            <table className="w-full text-xs sm:text-sm divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-100">
                {admitCard.importantLinks.map((link, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40">
                    <td className="px-5 py-3.5 font-bold text-gray-900">{link.label}</td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-4 py-1.5 rounded text-xs transition-colors shadow-xs"
                      >
                        <span>Download Admit Card</span>
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
              <p className="font-bold text-sm text-emerald-900">Official Server Authentication</p>
              <p className="mt-1">
                Download links point directly to the authorized portal of {admitCard.organization} at <a href={admitCard.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold">{admitCard.sourceUrl}</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
