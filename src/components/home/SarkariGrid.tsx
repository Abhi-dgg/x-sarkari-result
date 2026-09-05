import React from 'react';
import { 
  Job, 
  ResultItem, 
  AdmitCardItem, 
  AnswerKeyItem, 
  SyllabusItem 
} from '../../types';
import { ChevronRight, Sparkles, ExternalLink, Calendar, Users, FileText, CheckCircle2 } from 'lucide-react';

interface SarkariGridProps {
  jobs: Job[];
  results: ResultItem[];
  admitCards: AdmitCardItem[];
  answerKeys: AnswerKeyItem[];
  syllabusList: SyllabusItem[];
  onNavigate: (route: string) => void;
}

export const SarkariGrid: React.FC<SarkariGridProps> = ({
  jobs,
  results,
  admitCards,
  answerKeys,
  syllabusList,
  onNavigate
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Primary 3-Column Sarkari Result Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* ========================================================= */}
        {/* Column 1: RESULT */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Result
            </h2>
            <button 
              onClick={() => onNavigate('results')}
              className="text-xs font-semibold text-blue-100 hover:text-white flex items-center gap-0.5 cursor-pointer"
            >
              View More <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="divide-y divide-gray-100 flex-1">
            {results.slice(0, 7).map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`result:${item.slug}`)}
                className="p-3.5 hover:bg-blue-50/50 transition-colors cursor-pointer group flex items-start justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {item.organizationSlug.toUpperCase()}
                    </span>
                    {idx < 2 && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-600 text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-blue-700 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                    <span>Result Date: {item.resultDate}</span>
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
              </div>
            ))}
          </div>

          <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={() => onNavigate('results')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 py-1 block w-full"
            >
              View All Examination Results ({results.length}+) →
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Column 2: ADMIT CARD */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-amber-600 text-white px-4 py-3 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Admit Card
            </h2>
            <button 
              onClick={() => onNavigate('admit-card')}
              className="text-xs font-semibold text-amber-100 hover:text-white flex items-center gap-0.5 cursor-pointer"
            >
              View More <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {admitCards.slice(0, 7).map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`admit-card:${item.slug}`)}
                className="p-3.5 hover:bg-amber-50/50 transition-colors cursor-pointer group flex items-start justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                      {item.organizationSlug.toUpperCase()}
                    </span>
                    {idx < 2 && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-600 text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-amber-700 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                    <span>Exam: {item.examDate}</span>
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
              </div>
            ))}
          </div>

          <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={() => onNavigate('admit-card')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 py-1 block w-full"
            >
              View All Admit Cards ({admitCards.length}+) →
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Column 3: LATEST JOBS */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Latest Jobs
            </h2>
            <button 
              onClick={() => onNavigate('jobs')}
              className="text-xs font-semibold text-emerald-100 hover:text-white flex items-center gap-0.5 cursor-pointer"
            >
              View More <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {jobs.slice(0, 7).map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`job:${item.slug}`)}
                className="p-3.5 hover:bg-emerald-50/50 transition-colors cursor-pointer group flex items-start justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {item.totalVacancy} Posts
                    </span>
                    {item.isHot && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-600 text-white">
                        HOT
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-emerald-700 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                    <span>Last Date: {item.importantDates[2]?.date || 'Refer Notice'}</span>
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
              </div>
            ))}
          </div>

          <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 py-1 block w-full"
            >
              View All Latest Recruitment ({jobs.length}+) →
            </button>
          </div>
        </div>

      </div>

      {/* Row 2: Secondary 3-Column Grid: Answer Key, Syllabus, Admission & Scholarships */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Answer Key Column */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-purple-700 text-white px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight uppercase">
              Answer Key
            </h2>
            <button onClick={() => onNavigate('answer-key')} className="text-xs text-purple-200 hover:text-white font-semibold">
              More →
            </button>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {answerKeys.slice(0, 4).map((item) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`answer-key:${item.slug}`)}
                className="p-3 hover:bg-purple-50/50 cursor-pointer group"
              >
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-900">
                  {item.keyType} Key
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-purple-700 mt-1 line-clamp-2">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Syllabus Column */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight uppercase">
              Syllabus & Pattern
            </h2>
            <button onClick={() => onNavigate('syllabus')} className="text-xs text-teal-200 hover:text-white font-semibold">
              More →
            </button>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {syllabusList.slice(0, 4).map((item) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`syllabus:${item.slug}`)}
                className="p-3 hover:bg-teal-50/50 cursor-pointer group"
              >
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-900">
                  {item.category}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-teal-700 mt-1 line-clamp-2">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Admission & Scholarship Column */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-rose-700 text-white px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight uppercase">
              Admission & Scholarship
            </h2>
            <button onClick={() => onNavigate('admission')} className="text-xs text-rose-200 hover:text-white font-semibold">
              More →
            </button>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            <div 
              onClick={() => onNavigate('admission')}
              className="p-3 hover:bg-rose-50/50 cursor-pointer group"
            >
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-900">
                Admission 2026
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-rose-700 mt-1">
                NTA CUET UG 2026 Common University Entrance Test Online Form
              </h3>
            </div>
            <div 
              onClick={() => onNavigate('scholarship')}
              className="p-3 hover:bg-rose-50/50 cursor-pointer group"
            >
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-900">
                Scholarship
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-rose-700 mt-1">
                National Scholarship Portal (NSP) Pre & Post Matric 2026 Registration
              </h3>
            </div>
            <div 
              onClick={() => onNavigate('admission')}
              className="p-3 hover:bg-rose-50/50 cursor-pointer group"
            >
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-900">
                IIT Entrance
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-rose-700 mt-1">
                IIT JAM 2026 Joint Admission Test for Masters Application Form
              </h3>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
