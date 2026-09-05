import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, Zap } from 'lucide-react';
import { NoticeItem } from '../../types';

interface BreakingTickerProps {
  notices: NoticeItem[];
  onNavigate: (route: string) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ notices, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!notices || notices.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [notices]);

  if (!notices || notices.length === 0) return null;

  const currentNotice = notices[currentIndex];

  return (
    <div className="bg-amber-50 border-y border-amber-200/70 text-gray-900 py-2.5 px-4 shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Badge Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1 bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wide animate-pulse">
            <Zap className="w-3 h-3 fill-current" /> Breaking
          </span>
          <span className="hidden sm:inline font-bold text-gray-700">Notice:</span>
        </div>

        {/* Ticker message */}
        <div 
          onClick={() => {
            if (currentNotice.link) {
              // Extract route from link like /jobs/ssc-cgl-2026 -> job:ssc-cgl-2026
              const parts = currentNotice.link.split('/').filter(Boolean);
              if (parts.length >= 2) {
                onNavigate(`${parts[0]}:${parts[1]}`);
              } else {
                onNavigate(parts[0] || 'jobs');
              }
            }
          }}
          className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer font-medium hover:text-amber-800 transition-colors"
        >
          <span className="font-semibold text-amber-900 mr-2">[{currentNotice.category}]</span>
          <span>{currentNotice.title}</span>
          <span className="ml-2 text-gray-500 text-xs hidden md:inline">({currentNotice.date})</span>
        </div>

        {/* View Details CTA */}
        <button
          onClick={() => {
            const parts = currentNotice.link.split('/').filter(Boolean);
            if (parts.length >= 2) {
              onNavigate(`${parts[0]}:${parts[1]}`);
            } else {
              onNavigate(parts[0] || 'jobs');
            }
          }}
          className="shrink-0 text-amber-800 font-bold hover:underline flex items-center gap-0.5 text-xs cursor-pointer"
        >
          View Notice <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
