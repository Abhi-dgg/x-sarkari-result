import React from 'react';
import { Zap, Bell } from 'lucide-react';
import { NoticeItem } from '../../types';

interface BreakingTickerProps {
  notices: NoticeItem[];
  onNavigate: (route: string) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ notices, onNavigate }) => {
  if (!notices || notices.length === 0) return null;

  return (
    <div className="bg-[#ffeb3b] border-y border-[#fbc02d] text-gray-900 py-1.5 px-4 overflow-hidden shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        
        {/* Flash Indicator */}
        <div className="flex items-center gap-1.5 shrink-0 z-10 bg-[#ffeb3b] pr-2">
          <span className="inline-flex items-center gap-1 bg-[#d32f2f] text-white font-black text-[11px] uppercase px-2.5 py-0.5 rounded shadow-xs animate-pulse tracking-wider">
            <Zap className="w-3 h-3 fill-current" /> FLASH NEWS
          </span>
        </div>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee hover:pause cursor-pointer text-xs sm:text-sm font-bold text-[#b71c1c]">
            {notices.concat(notices).map((notice, idx) => {
              return (
                <span
                  key={`${notice.id}-${idx}`}
                  onClick={() => {
                    if (notice.link) {
                      const parts = notice.link.split('/').filter(Boolean);
                      if (parts.length >= 2) {
                        onNavigate(`${parts[0]}:${parts[1]}`);
                      } else {
                        onNavigate(parts[0] || 'jobs');
                      }
                    }
                  }}
                  className="inline-flex items-center gap-2 hover:underline hover:text-black transition-colors"
                >
                  <span className="bg-[#b71c1c] text-white text-[10px] px-1.5 py-0.2 rounded font-black">
                    {notice.category}
                  </span>
                  <span>{notice.title}</span>
                  <span className="text-gray-700 font-medium text-xs">({notice.date})</span>
                  <span className="text-[#800000] font-black mx-2">||</span>
                </span>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
