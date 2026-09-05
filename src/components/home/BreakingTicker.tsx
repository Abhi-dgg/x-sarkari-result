import React, { useState } from 'react';
import { Bell, Copy, Check } from 'lucide-react';
import { NoticeItem } from '../../types';

interface BreakingTickerProps {
  notices: NoticeItem[];
  onNavigate: (route: string) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ notices, onNavigate }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!notices || notices.length === 0) return null;

  const handleNoticeClick = (notice: NoticeItem) => {
    if (!notice.link) {
      onNavigate('jobs');
      return;
    }
    const cleanLink = notice.link.startsWith('/') ? notice.link.slice(1) : notice.link;
    const parts = cleanLink.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const type = parts[0].endsWith('s') ? parts[0].slice(0, -1) : parts[0];
      onNavigate(`${type}:${parts[1]}`);
    } else {
      onNavigate(parts[0] || 'jobs');
    }
  };

  const handleCopyNotice = (e: React.MouseEvent, notice: NoticeItem) => {
    e.stopPropagation();
    const noticeText = `📢 [X SARKARI JOB ALERT]\n${notice.title}\nश्रेणी: ${notice.category}\nदिनांक: ${notice.date}\nलिंक: https://www.xsarkarijob.com${notice.link || '/jobs'}`;
    navigator.clipboard.writeText(noticeText);
    setCopiedId(notice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#fef08a] dark:bg-slate-900 border-y border-[#facc15] dark:border-slate-800 text-gray-900 dark:text-gray-100 py-1.5 px-4 overflow-hidden shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        
        {/* Latest Alert Indicator */}
        <div className="flex items-center gap-1.5 shrink-0 z-10 bg-[#fef08a] dark:bg-slate-900 pr-2">
          <span className="inline-flex items-center gap-1 bg-[#b91c1c] text-white font-black text-[11px] uppercase px-2.5 py-0.5 rounded shadow-xs tracking-wider">
            <Bell className="w-3 h-3" /> LATEST UPDATE
          </span>
        </div>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee hover:pause cursor-pointer text-xs sm:text-sm font-extrabold text-[#991b1b] dark:text-amber-300">
            {notices.concat(notices).map((notice, idx) => {
              const isCopied = copiedId === notice.id;
              return (
                <span
                  key={`${notice.id}-${idx}`}
                  onClick={() => handleNoticeClick(notice)}
                  className="inline-flex items-center gap-2 hover:underline hover:text-black dark:hover:text-white transition-colors group"
                >
                  <span className="bg-[#1e40af] dark:bg-blue-900 text-white text-[10px] px-1.5 py-0.5 rounded font-black">
                    {notice.category}
                  </span>
                  <span>{notice.title}</span>
                  <span className="text-gray-700 dark:text-slate-400 font-medium text-xs">({notice.date})</span>
                  <button
                    onClick={(e) => handleCopyNotice(e, notice)}
                    title="Copy this notification to clipboard"
                    className="p-1 rounded bg-amber-200 dark:bg-slate-800 hover:bg-amber-300 text-slate-800 dark:text-slate-200 text-[10px] font-bold inline-flex items-center gap-0.5 transition-colors cursor-pointer border border-amber-300 dark:border-slate-700"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <span className="text-blue-900 dark:text-slate-500 font-black mx-2">||</span>
                </span>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
