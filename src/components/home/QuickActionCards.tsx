import React from 'react';
import { ChevronRight, Sparkles, Flame } from 'lucide-react';

interface QuickActionCardsProps {
  onNavigate: (route: string) => void;
  counts?: {
    jobs: number;
    results: number;
    admitCards: number;
    answerKeys: number;
  };
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ onNavigate }) => {
  // Iconic Result Bharat Trending Hot Boxed Links
  const trendingBoxes = [
    {
      title: 'SSC CGL 2026 Apply Online',
      route: 'job:ssc-cgl-2026',
      bgColor: 'bg-[#d32f2f] hover:bg-[#b71c1c]',
      tag: '17,727 Posts'
    },
    {
      title: 'Railway RRB NTPC 2026 Form',
      route: 'job:rrb-ntpc-2026',
      bgColor: 'bg-[#1976d2] hover:bg-[#1565c0]',
      tag: '11,558 Posts'
    },
    {
      title: 'UPSC Civil Services 2026 Result',
      route: 'result:upsc-cse-prelims-2026',
      bgColor: 'bg-[#2e7d32] hover:bg-[#1b5e20]',
      tag: 'Marks Out'
    },
    {
      title: 'Bihar Police Constable Admit Card',
      route: 'admit-card:csbc-bihar-police-constable-2026',
      bgColor: 'bg-[#e65100] hover:bg-[#bf360c]',
      tag: 'Download Link'
    },
    {
      title: 'UP Police Constable Exam 2026',
      route: 'job:ssc-cgl-2026',
      bgColor: 'bg-[#7b1fa2] hover:bg-[#6a1b9a]',
      tag: 'City Slip'
    },
    {
      title: 'IBPS PO Recruitment 2026',
      route: 'job:ibps-po-xiv-2026',
      bgColor: 'bg-[#00838f] hover:bg-[#006064]',
      tag: '3,955 Posts'
    },
    {
      title: 'Indian Army Agniveer Rally 2026',
      route: 'job:ssc-cgl-2026',
      bgColor: 'bg-[#880e4f] hover:bg-[#4a148c]',
      tag: 'Rally Online'
    },
    {
      title: 'Airforce Agniveer Vayu Intake',
      route: 'job:ssc-cgl-2026',
      bgColor: 'bg-[#0d47a1] hover:bg-[#1a237e]',
      tag: '01/2026 Batch'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Top Banner Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#800000] uppercase tracking-wider">
          <Flame className="w-4 h-4 fill-current text-red-600 animate-bounce" />
          <span>Trending Online Forms & Fast Links</span>
        </div>
        <span className="text-[11px] text-gray-500 hidden sm:inline font-semibold">
          Click any box below for direct application or admit card portal
        </span>
      </div>

      {/* The Famous Result Bharat 8-Box Colorful Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {trendingBoxes.map((box, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(box.route)}
            className={`${box.bgColor} text-white rounded-md p-3 sm:p-3.5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 text-center flex flex-col justify-center items-center select-none border border-black/10 group`}
          >
            <h3 className="text-xs sm:text-sm font-extrabold tracking-tight leading-snug group-hover:underline">
              {box.title}
            </h3>
            <span className="mt-1.5 text-[10px] sm:text-[11px] font-bold bg-black/25 text-[#ffeb3b] px-2 py-0.5 rounded">
              {box.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
