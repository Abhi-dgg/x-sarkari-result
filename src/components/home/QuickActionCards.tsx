import React from 'react';
import { Briefcase, Award, CreditCard, KeyRound, ChevronRight } from 'lucide-react';

interface QuickActionCardsProps {
  onNavigate: (route: string) => void;
  counts?: {
    jobs: number;
    results: number;
    admitCards: number;
    answerKeys: number;
  };
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ onNavigate, counts }) => {
  const cards = [
    {
      title: 'Latest Jobs',
      subtitle: 'Online Application Forms',
      route: 'jobs',
      count: counts?.jobs ?? 12,
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-950',
      badgeColor: 'bg-emerald-600 text-white',
      icon: Briefcase,
      accentColor: 'text-emerald-700'
    },
    {
      title: 'Results',
      subtitle: 'Scorecards & Merit Lists',
      route: 'results',
      count: counts?.results ?? 6,
      bgColor: 'bg-blue-50 hover:bg-blue-100/70 border-blue-200 text-blue-950',
      badgeColor: 'bg-blue-600 text-white',
      icon: Award,
      accentColor: 'text-blue-700'
    },
    {
      title: 'Admit Card',
      subtitle: 'Hall Tickets & City Slips',
      route: 'admit-card',
      count: counts?.admitCards ?? 5,
      bgColor: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200 text-amber-950',
      badgeColor: 'bg-amber-600 text-white',
      icon: CreditCard,
      accentColor: 'text-amber-700'
    },
    {
      title: 'Answer Key',
      subtitle: 'Objections & Response Sheets',
      route: 'answer-key',
      count: counts?.answerKeys ?? 4,
      bgColor: 'bg-purple-50 hover:bg-purple-100/70 border-purple-200 text-purple-950',
      badgeColor: 'bg-purple-600 text-white',
      icon: KeyRound,
      accentColor: 'text-purple-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => onNavigate(card.route)}
              className={`${card.bgColor} border rounded-xl p-4 sm:p-5 transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between group`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-white shadow-2xs border border-gray-100">
                  <Icon className={`w-5 h-5 ${card.accentColor}`} />
                </div>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                  {card.count}+ Updates
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 group-hover:text-amber-700 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Browse all</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
