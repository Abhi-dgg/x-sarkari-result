import React, { useState, useEffect } from 'react';
import { AdmitCardItem } from '../../types';
import { OfficialLinksTable } from '../common/OfficialLinksTable';
import { ChevronRight, ExternalLink, ShieldCheck, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';

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
      .then(res => {
        if (!res.ok) throw new Error('Admit card not found');
        return res.json();
      })
      .then(data => {
        if (data && !data.error) {
          setAdmitCard(data);
          if (data?.title) document.title = `${data.title} | X Sarkari Job`;
        } else {
          setAdmitCard(null);
        }
      })
      .catch(err => {
        console.error(err);
        setAdmitCard(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500 dark:text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-semibold text-sm">Loading hall ticket details...</p>
      </div>
    );
  }

  if (!admitCard) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Admit Card Not Found</h2>
        <p className="text-gray-600 dark:text-slate-400 text-sm mt-1 mb-6">Hall ticket link has expired or exam has concluded.</p>
        <button onClick={() => onNavigate('admit-card')} className="bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold px-4 py-2 rounded-lg text-sm cursor-pointer">
          Return to Admit Cards
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 mb-4 flex-wrap">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <button onClick={() => onNavigate('admit-card')} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">Admit Card</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 dark:text-slate-200 font-semibold">{admitCard.organizationSlug?.toUpperCase()}</span>
      </nav>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8 transition-colors">
        <div className="p-6 sm:p-8 bg-blue-50/50 dark:bg-slate-950/60 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#1e40af] text-white text-xs font-bold px-2.5 py-0.5 rounded">
              Admit Card Live
            </span>
            <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 rounded border border-gray-200 dark:border-slate-700">
              {admitCard.category}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-slate-100 leading-snug">
            {admitCard.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-slate-400 mt-3">
            <span className="font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-gray-500" /> {admitCard.organization}
            </span>
            <span>•</span>
            <span>Release Date: <strong className="text-gray-900 dark:text-slate-100">{admitCard.releaseDate}</strong></span>
            <span>•</span>
            <span className="text-blue-900 dark:text-blue-300 font-bold">Exam Date: {admitCard.examDate}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-gray-50 dark:bg-slate-850/60 p-4 rounded-lg border border-gray-200 dark:border-slate-800 text-xs sm:text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-gray-900 dark:text-slate-100 block mb-1">Hall Ticket Details:</strong>
            {admitCard.organization} has released the official Admit Card / Call Letter for {admitCard.examName}. Candidates scheduled to appear for the test starting on <strong>{admitCard.examDate}</strong> must download and print their admit cards before the examination day. Entry to the examination venue will be prohibited without a valid printed admit card and original photo ID.
          </div>

          {/* Exam Day Instructions */}
          <div className="border border-gray-200 dark:border-slate-800 rounded-lg p-5 bg-white dark:bg-slate-900">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mandatory Documents to Carry
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-slate-300 list-disc list-inside">
              <li>Clear printed copy of the Admit Card (Color or Black & White).</li>
              <li>Original Government Photo ID Proof (Aadhaar Card, Voter ID, PAN Card, Driving License or Passport).</li>
              <li>Two recent passport-size color photographs matching the application form.</li>
              <li>Transparent blue or black ballpoint pen.</li>
            </ul>
          </div>

          {/* Download Hall Ticket Links */}
          {(() => {
            const admitCardLinks = (admitCard.importantLinks && admitCard.importantLinks.length > 0)
              ? admitCard.importantLinks
              : [
                  ...(admitCard.downloadLink ? [{
                    label: `Download ${admitCard.examName || admitCard.title} Admit Card / Hall Ticket (Server 1)`,
                    url: admitCard.downloadLink,
                    linkType: 'ADMIT_CARD' as const,
                    isOfficial: true,
                  }] : []),
                  ...(admitCard.examCityLink ? [{
                    label: 'Check Exam City Intimation Slip / Center Allotment',
                    url: admitCard.examCityLink,
                    linkType: 'OTHER' as const,
                    isOfficial: true,
                  }] : []),
                  ...(admitCard.officialNotificationUrl ? [{
                    label: 'Download Exam Date Notice & Important Instructions PDF',
                    url: admitCard.officialNotificationUrl,
                    linkType: 'NOTIFICATION' as const,
                    isOfficial: true,
                  }] : []),
                  {
                    label: `Official Website (${admitCard.organization})`,
                    url: admitCard.officialWebsiteUrl || admitCard.sourceUrl || 'https://resultbharat.com',
                    linkType: 'OFFICIAL_WEBSITE' as const,
                    isOfficial: true,
                  }
                ];

            return (
              <OfficialLinksTable
                title="Direct Admit Card Download Servers"
                links={admitCardLinks}
                sourceUrl={admitCard.sourceUrl}
                organization={admitCard.organization}
              />
            );
          })()}

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Official Server Authentication</p>
              <p className="mt-1 text-emerald-800 dark:text-emerald-300">
                Download links point directly to the authorized portal of {admitCard.organization} at <a href={admitCard.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold">{admitCard.sourceUrl}</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
