import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

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
      title: 'Railway RRB NTPC 2026 Form',
      route: 'job:rrb-ntpc-2026',
      bgLight: 'bg-[#1e40af] hover:bg-[#1d4ed8]',
      bgDark: 'dark:bg-blue-900/90 dark:hover:bg-blue-800 dark:border-blue-700',
      tag: '11,558 Posts [New]',
      borderColor: 'border-blue-950'
    },
    {
      title: 'SSC GD Constable 2026 Online Form',
      route: 'job:ssc-gd-constable-2026',
      bgLight: 'bg-[#b91c1c] hover:bg-[#991b1b]',
      bgDark: 'dark:bg-red-950/90 dark:hover:bg-red-900 dark:border-red-700',
      tag: '39,481 Posts [Active]',
      borderColor: 'border-red-950'
    },
    {
      title: 'UP Police 60,244 Answer Key',
      route: 'answer-key:up-police-constable-re-exam-answer-key-2026',
      bgLight: 'bg-[#0f766e] hover:bg-[#115e59]',
      bgDark: 'dark:bg-teal-950/90 dark:hover:bg-teal-900 dark:border-teal-700',
      tag: 'Master Key Out',
      borderColor: 'border-teal-950'
    },
    {
      title: 'Bihar Police Constable Admit Card',
      route: 'admit-card:csbc-bihar-police-constable-2026',
      bgLight: 'bg-[#c2410c] hover:bg-[#9a3412]',
      bgDark: 'dark:bg-orange-950/90 dark:hover:bg-orange-900 dark:border-orange-700',
      tag: 'Direct Download',
      borderColor: 'border-orange-950'
    },
    {
      title: 'BPSC 70th Integrated CCE Pre Form',
      route: 'job:bpsc-70th-cce-2026',
      bgLight: 'bg-[#6d28d9] hover:bg-[#5b21b6]',
      bgDark: 'dark:bg-purple-950/90 dark:hover:bg-purple-900 dark:border-purple-700',
      tag: '1,957 Posts',
      borderColor: 'border-purple-950'
    },
    {
      title: 'UPSC Civil Services 2026 Result',
      route: 'result:upsc-cse-prelims-2026',
      bgLight: 'bg-[#15803d] hover:bg-[#166534]',
      bgDark: 'dark:bg-emerald-950/90 dark:hover:bg-emerald-900 dark:border-emerald-700',
      tag: 'Marks & Cutoff',
      borderColor: 'border-emerald-950'
    },
    {
      title: 'SSC CGL 2026 Tier 1 Admit Card',
      route: 'admit-card:ssc-cgl-tier-1-admit-card-2026',
      bgLight: 'bg-[#831843] hover:bg-[#701a75]',
      bgDark: 'dark:bg-pink-950/90 dark:hover:bg-pink-900 dark:border-pink-700',
      tag: 'City Slip Live',
      borderColor: 'border-pink-950'
    },
    {
      title: 'NEET UG 2026 Scorecard & Rank',
      route: 'result:upsc-cse-prelims-2026',
      bgLight: 'bg-[#0369a1] hover:bg-[#075985]',
      bgDark: 'dark:bg-sky-950/90 dark:hover:bg-sky-900 dark:border-sky-700',
      tag: 'Counseling Open',
      borderColor: 'border-sky-950'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Top Banner Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#0f2347] dark:text-blue-400 uppercase tracking-wider">
          <Flame className="w-4 h-4 fill-current text-red-600 animate-bounce" />
          <span>Trending Online Forms & Fast Links 2026</span>
        </div>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:inline font-semibold">
          Click any box below for direct official application or admit card portal
        </span>
      </div>

      {/* The Famous Result Bharat 8-Box Colorful Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {trendingBoxes.map((box, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(box.route)}
            className={`${box.bgLight} ${box.bgDark} text-white rounded-md p-3 sm:p-3.5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 text-center flex flex-col justify-center items-center select-none border ${box.borderColor} group`}
          >
            <h3 className="text-xs sm:text-sm font-black tracking-tight leading-snug group-hover:underline">
              {box.title}
            </h3>
            <span className="mt-1.5 text-[10px] sm:text-[11px] font-extrabold bg-black/35 text-[#ffeb3b] px-2 py-0.5 rounded border border-yellow-400/20">
              {box.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
