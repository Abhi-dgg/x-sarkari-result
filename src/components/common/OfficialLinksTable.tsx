import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck, Share2, Globe, FileText } from 'lucide-react';
import { ImportantLink } from '../../types';

interface OfficialLinksTableProps {
  title?: string;
  links?: ImportantLink[];
  sourceUrl?: string;
  organization?: string;
}

export const OfficialLinksTable: React.FC<OfficialLinksTableProps> = ({
  title = 'Important Official & Notification Links',
  links = [],
  sourceUrl,
  organization
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Normalize and clean links - preserving direct official Notification PDFs
  const cleanUrl = (url?: string): string => {
    if (!url) return sourceUrl || 'https://resultbharat.com';
    return url;
  };

  const getDomain = (url: string): string => {
    try {
      if (url.startsWith('/')) return 'xsarkarijob.com';
      const parsed = new URL(cleanUrl(url));
      return parsed.hostname.replace('www.', '');
    } catch {
      return 'gov.in';
    }
  };

  // Safe fallback if links array is empty or undefined
  const safeLinks: ImportantLink[] = Array.isArray(links) && links.length > 0
    ? links
    : [
        {
          label: 'Official Notification Notice PDF',
          url: sourceUrl || 'https://resultbharat.com',
          linkType: 'NOTIFICATION',
          isOfficial: true
        },
        {
          label: `Official Website (${organization || 'Department'})`,
          url: sourceUrl || 'https://resultbharat.com',
          linkType: 'OFFICIAL_WEBSITE',
          isOfficial: true
        }
      ];

  const handleCopyLink = (url: string, index: number) => {
    const finalUrl = cleanUrl(url);
    const textToCopy = finalUrl.startsWith('/') ? `${window.location.origin}${finalUrl}` : finalUrl;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleCopyAll = () => {
    const allText = safeLinks
      .map(l => `${l.label || 'Official Link'}: ${cleanUrl(l.url)}`)
      .join('\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
      {/* Table Header */}
      <div className="bg-[#1e40af] text-white px-5 py-3.5 font-extrabold text-sm sm:text-base flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-yellow-300 shrink-0" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 text-xs bg-blue-900 hover:bg-blue-800 text-yellow-200 hover:text-white px-2.5 py-1 rounded transition-colors cursor-pointer border border-blue-700 font-semibold"
            title="Copy all links to clipboard for WhatsApp / Telegram"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'All Copied!' : 'Copy All Links'}</span>
          </button>
          <span className="text-xs font-semibold text-yellow-200 bg-blue-950/80 px-2 py-0.5 rounded hidden sm:inline">
            Direct Server Links
          </span>
        </div>
      </div>

      {/* Links List / Table */}
      <div className="divide-y divide-gray-200 dark:divide-slate-800">
        {safeLinks.map((link, idx) => {
          const resolved = cleanUrl(link?.url);
          const domain = getDomain(resolved);
          const isCopied = copiedIndex === idx;
          const labelText = link?.label || 'Official Link';
          const isPdf = link?.linkType === 'NOTIFICATION' || 
            resolved.toLowerCase().endsWith('.pdf') || 
            labelText.toLowerCase().includes('pdf') || 
            labelText.toLowerCase().includes('notification');

          return (
            <div
              key={idx}
              className="p-4 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors"
            >
              {/* Link Label & Meta */}
              <div className="space-y-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-slate-100">
                    {labelText}
                  </span>
                  {link?.isOfficial && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      Official
                    </span>
                  )}
                  {isPdf && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-300 dark:border-rose-800">
                      <FileText className="w-3 h-3" />
                      Direct PDF Only
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 font-mono">
                  <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate max-w-[280px] sm:max-w-md">{domain}</span>
                </div>
              </div>

              {/* Action Buttons: Copy Link & Click Here */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Copy Link Button */}
                <button
                  onClick={() => handleCopyLink(resolved, idx)}
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer border ${
                    isCopied
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-700'
                  }`}
                  title="Copy link to paste or share"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Link Copied!' : 'Copy Link'}</span>
                </button>

                {/* Direct Open Link */}
                <a
                  href={resolved}
                  target={resolved.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold px-4 py-1.5 rounded text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Click Here</span>
                  <ExternalLink className="w-3.5 h-3.5 text-yellow-300" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Footnote */}
      <div className="bg-gray-50 dark:bg-slate-900/90 px-4 py-2.5 border-t border-gray-200 dark:border-slate-800 text-[11px] text-gray-600 dark:text-slate-400 flex items-center justify-between">
        <span>💡 Tip: Click <strong>"Copy Link"</strong> to share notification on WhatsApp / Telegram or paste in browser.</span>
      </div>
    </div>
  );
};
