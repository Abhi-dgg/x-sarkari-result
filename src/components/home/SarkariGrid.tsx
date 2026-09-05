import React from 'react';
import { 
  Job, 
  ResultItem, 
  AdmitCardItem, 
  AnswerKeyItem, 
  SyllabusItem 
} from '../../types';
import { Calculator, Calendar, CheckCircle2, Award, FileText, Briefcase, Sparkles, BookOpen } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      
      {/* ========================================================================= */}
      {/* ROW 1: THE CORE 3 COLUMNS (RESULT | ADMIT CARD | LATEST JOBS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ============================== */}
        {/* COLUMN 1: RESULT */}
        {/* ============================== */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md shadow-xs flex flex-col overflow-hidden transition-colors">
          {/* Royal Navy Blue Header (Result Bharat Layout with Custom Color) */}
          <div className="bg-[#0f2347] dark:bg-blue-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-blue-900">
            <h2 className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5 text-white">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Result</span>
            </h2>
            <button 
              onClick={() => onNavigate('results')}
              className="text-xs font-black text-[#ffeb3b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View More »
            </button>
          </div>
          
          {/* Link items list */}
          <div className="divide-y divide-gray-200 dark:divide-slate-800 flex-1 bg-[#fffdfa] dark:bg-slate-900/90">
            {results.slice(0, 10).map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`result:${item.slug}`)}
                className="py-2.5 px-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-xs leading-snug flex items-start gap-2 group"
              >
                <span className="text-[#1e40af] dark:text-blue-400 font-black text-sm shrink-0">»</span>
                <div className="flex-1">
                  <span className="font-bold text-[#1d4ed8] dark:text-blue-400 group-hover:text-[#0f2347] dark:group-hover:text-blue-200 group-hover:underline">
                    {item.title}
                  </span>
                  {idx < 3 && (
                    <span className="ml-1.5 text-[10px] font-extrabold text-[#dc2626] dark:text-red-400 uppercase">
                      [New]
                    </span>
                  )}
                  <span className="block text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                    Declared: {item.resultDate}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom View More Button */}
          <div className="p-2 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigate('results')}
              className="text-xs font-black text-[#1e3a8a] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer block w-full py-1"
            >
              View More Result...
            </button>
          </div>
        </div>

        {/* ============================== */}
        {/* COLUMN 2: ADMIT CARD */}
        {/* ============================== */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md shadow-xs flex flex-col overflow-hidden transition-colors">
          {/* Royal Navy Blue Header */}
          <div className="bg-[#0f2347] dark:bg-blue-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-blue-900">
            <h2 className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5 text-white">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Admit Card</span>
            </h2>
            <button 
              onClick={() => onNavigate('admit-card')}
              className="text-xs font-black text-[#ffeb3b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View More »
            </button>
          </div>
          
          {/* Link items list */}
          <div className="divide-y divide-gray-200 dark:divide-slate-800 flex-1 bg-[#fffdfa] dark:bg-slate-900/90">
            {admitCards.slice(0, 10).map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`admit-card:${item.slug}`)}
                className="py-2.5 px-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-xs leading-snug flex items-start gap-2 group"
              >
                <span className="text-[#1e40af] dark:text-blue-400 font-black text-sm shrink-0">»</span>
                <div className="flex-1">
                  <span className="font-bold text-[#1d4ed8] dark:text-blue-400 group-hover:text-[#0f2347] dark:group-hover:text-blue-200 group-hover:underline">
                    {item.title}
                  </span>
                  {idx < 3 && (
                    <span className="ml-1.5 text-[10px] font-extrabold text-[#dc2626] dark:text-red-400 uppercase">
                      [New]
                    </span>
                  )}
                  <span className="block text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                    Exam Date: {item.examDate}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom View More Button */}
          <div className="p-2 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigate('admit-card')}
              className="text-xs font-black text-[#1e3a8a] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer block w-full py-1"
            >
              View More Admit Card...
            </button>
          </div>
        </div>

        {/* ============================== */}
        {/* COLUMN 3: LATEST JOBS */}
        {/* ============================== */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md shadow-xs flex flex-col overflow-hidden transition-colors">
          {/* Royal Navy Blue Header */}
          <div className="bg-[#0f2347] dark:bg-blue-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-blue-900">
            <h2 className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5 text-white">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Latest Jobs</span>
            </h2>
            <button 
              onClick={() => onNavigate('jobs')}
              className="text-xs font-black text-[#ffeb3b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View More »
            </button>
          </div>
          
          {/* Link items list */}
          <div className="divide-y divide-gray-200 dark:divide-slate-800 flex-1 bg-[#fffdfa] dark:bg-slate-900/90">
            {jobs.slice(0, 10).map((job, idx) => (
              <div 
                key={job.id}
                onClick={() => onNavigate(`job:${job.slug}`)}
                className="py-2.5 px-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-xs leading-snug flex items-start gap-2 group"
              >
                <span className="text-[#1e40af] dark:text-blue-400 font-black text-sm shrink-0">»</span>
                <div className="flex-1">
                  <span className="font-bold text-[#1d4ed8] dark:text-blue-400 group-hover:text-[#0f2347] dark:group-hover:text-blue-200 group-hover:underline">
                    {job.title}
                  </span>
                  {idx < 3 && (
                    <span className="ml-1.5 text-[10px] font-extrabold text-[#dc2626] dark:text-red-400 uppercase">
                      [Last Date: 2026]
                    </span>
                  )}
                  <span className="block text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                    {job.organization} • Total Post: {job.totalVacancy}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom View More Button */}
          <div className="p-2 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs font-black text-[#1e3a8a] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer block w-full py-1"
            >
              View More Latest Jobs...
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 2: ANSWER KEY | SYLLABUS | ADMISSION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Column: Answer Key */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md shadow-xs flex flex-col overflow-hidden transition-colors">
          <div className="bg-[#0f2347] dark:bg-blue-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-blue-900">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Answer Key
            </h2>
            <button 
              onClick={() => onNavigate('answer-key')}
              className="text-xs font-black text-[#ffeb3b] hover:underline cursor-pointer"
            >
              View More »
            </button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800 flex-1 bg-[#fffdfa] dark:bg-slate-900/90">
            {answerKeys.slice(0, 6).map((item) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`answer-key:${item.slug}`)}
                className="py-2.5 px-3 hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-xs flex items-start gap-2 group"
              >
                <span className="text-[#1e40af] dark:text-blue-400 font-bold">»</span>
                <span className="font-bold text-[#1d4ed8] dark:text-blue-400 group-hover:text-[#0f2347] dark:group-hover:text-blue-200 group-hover:underline">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigate('answer-key')}
              className="text-xs font-black text-[#1e3a8a] dark:text-blue-400 hover:underline cursor-pointer"
            >
              View More Answer Key...
            </button>
          </div>
        </div>

        {/* Column: Syllabus */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md shadow-xs flex flex-col overflow-hidden transition-colors">
          <div className="bg-[#0f2347] dark:bg-blue-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-blue-900">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Syllabus
            </h2>
            <button 
              onClick={() => onNavigate('syllabus')}
              className="text-xs font-black text-[#ffeb3b] hover:underline cursor-pointer"
            >
              View More »
            </button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800 flex-1 bg-[#fffdfa] dark:bg-slate-900/90">
            {syllabusList.slice(0, 6).map((item) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`syllabus:${item.slug}`)}
                className="py-2.5 px-3 hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-xs flex items-start gap-2 group"
              >
                <span className="text-[#1e40af] dark:text-blue-400 font-bold">»</span>
                <span className="font-bold text-[#1d4ed8] dark:text-blue-400 group-hover:text-[#0f2347] dark:group-hover:text-blue-200 group-hover:underline">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigate('syllabus')}
              className="text-xs font-black text-[#1e3a8a] dark:text-blue-400 hover:underline cursor-pointer"
            >
              View More Syllabus...
            </button>
          </div>
        </div>

        {/* Column: Admission */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md shadow-xs flex flex-col overflow-hidden transition-colors">
          <div className="bg-[#0f2347] dark:bg-blue-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-blue-900">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Admission
            </h2>
            <button 
              onClick={() => onNavigate('admission')}
              className="text-xs font-black text-[#ffeb3b] hover:underline cursor-pointer"
            >
              View More »
            </button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800 flex-1 bg-[#fffdfa] dark:bg-slate-900/90">
            {[
              { title: 'NTA CUET UG 2026 Online Application Form Active', date: 'Active' },
              { title: 'NTA NEET UG 2026 Registration Portal & Information Bulletin', date: 'Active' },
              { title: 'NTA JEE Main 2026 Session 2 Online Application Form', date: 'Active' },
              { title: 'UP B.Ed Joint Entrance Exam (JEE) 2026 Online Form', date: 'Active' },
              { title: 'Bihar DElEd Admission 2026 Entrance Test Form', date: 'Active' },
              { title: 'IGNOU B.Ed / OPENMAT 2026 Admission Portal', date: 'Active' },
            ].map((adm, i) => (
              <div 
                key={i}
                onClick={() => onNavigate('admission')}
                className="py-2.5 px-3 hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-xs flex items-start gap-2 group"
              >
                <span className="text-[#1e40af] dark:text-blue-400 font-bold">»</span>
                <span className="font-bold text-[#1d4ed8] dark:text-blue-400 group-hover:text-[#0f2347] dark:group-hover:text-blue-200 group-hover:underline">
                  {adm.title}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigate('admission')}
              className="text-xs font-black text-[#1e3a8a] dark:text-blue-400 hover:underline cursor-pointer"
            >
              View More Admission...
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 3: CERTIFICATE VERIFICATION | IMPORTANT / SCHOLARSHIP | STATE JOBS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Certificate Verification */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md shadow-xs flex flex-col overflow-hidden transition-colors">
          <div className="bg-[#0f2347] dark:bg-blue-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-blue-900">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Certificate Verification
            </h2>
            <span className="text-xs font-bold text-amber-400">Govt Services</span>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800 flex-1 bg-[#fffdfa] dark:bg-slate-900/90 text-xs">
            {[
              'PAN Card Online Application & Correction (NSDL / UTIITSL)',
              'Voter ID Card Online Registration / EPIC Download',
              'Aadhaar Card Download & Address Online Correction (UIDAI)',
              'Driving License (DL) Learning & Permanent Form (Sarathi)',
              'UP / Bihar Caste, Income, Niwas Certificate Verification',
              'Khasra Khatauni Bhulekh Land Records Online Search'
            ].map((cert, idx) => (
              <div 
                key={idx}
                className="py-2.5 px-3 hover:bg-blue-50 dark:hover:bg-slate-800/80 text-[#1d4ed8] dark:text-blue-400 hover:text-[#0f2347] dark:hover:text-blue-200 font-bold flex items-start gap-2 cursor-pointer"
              >
                <span className="text-[#1e40af] dark:text-blue-400 font-black">»</span>
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important / Scholarship */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md shadow-xs flex flex-col overflow-hidden transition-colors">
          <div className="bg-[#0f2347] dark:bg-blue-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-blue-900">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Important & Scholarship
            </h2>
            <button onClick={() => onNavigate('scholarship')} className="text-xs font-black text-[#ffeb3b] hover:underline cursor-pointer">
              View All »
            </button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800 flex-1 bg-[#fffdfa] dark:bg-slate-900/90 text-xs">
            {[
              'National Scholarship Portal (NSP) Pre & Post Matric 2026',
              'UP Scholarship Fee Reimbursement Online Form 2026',
              'Bihar Post Matric Scholarship Portal Open',
              'NIELIT CCC Exam Online Form & Admit Card Every Month',
              'Army Agniveer Common Entrance Exam (CEE) Syllabus',
              'Railway RPF Constable & Sub Inspector Syllabus 2026'
            ].map((imp, idx) => (
              <div 
                key={idx}
                onClick={() => onNavigate('scholarship')}
                className="py-2.5 px-3 hover:bg-blue-50 dark:hover:bg-slate-800/80 text-[#1d4ed8] dark:text-blue-400 hover:text-[#0f2347] dark:hover:text-blue-200 font-bold flex items-start gap-2 cursor-pointer"
              >
                <span className="text-[#1e40af] dark:text-blue-400 font-black">»</span>
                <span>{imp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State Wise Govt Jobs */}
        <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md shadow-xs flex flex-col overflow-hidden transition-colors">
          <div className="bg-[#0f2347] dark:bg-blue-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-blue-900">
            <h2 className="text-sm font-black tracking-wider uppercase">
              State Wise Jobs
            </h2>
            <button onClick={() => onNavigate('jobs')} className="text-xs font-black text-[#ffeb3b] hover:underline cursor-pointer">
              All States »
            </button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800 flex-1 bg-[#fffdfa] dark:bg-slate-900/90 text-xs">
            {[
              { state: 'Uttar Pradesh (UP)', note: 'UPSSSC, UP Police, UPPSC, UPTET' },
              { state: 'Bihar (BH)', note: 'BSSC, CSBC Police, BPSC Teacher' },
              { state: 'Delhi (DL)', note: 'DSSSB Various Posts, Delhi Police' },
              { state: 'Rajasthan (RJ)', note: 'RSMSSB, RPSC, Rajasthan Police' },
              { state: 'Madhya Pradesh (MP)', note: 'MPESB Vyapam, MPPSC' },
              { state: 'Haryana (HR)', note: 'HSSC CET, HPSC Lecturer' }
            ].map((st, idx) => (
              <div 
                key={idx}
                onClick={() => onNavigate('jobs')}
                className="py-2.5 px-3 hover:bg-blue-50 dark:hover:bg-slate-800/80 text-gray-900 dark:text-slate-200 flex items-start justify-between cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[#1e40af] dark:text-blue-400 font-bold">»</span>
                  <span className="font-bold text-[#1d4ed8] dark:text-blue-400 hover:underline">
                    {st.state}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                  {st.note}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 4: STUDENT FAST UTILITY STRIP (AGE & PERCENTAGE CALCULATORS) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-md p-4 shadow-sm border border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <Calculator className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-sm font-black tracking-wide text-amber-300 uppercase">
              Student Preparation & Eligibility Utilities
            </h4>
            <p className="text-xs text-blue-100">
              Calculate your exact age for Sarkari jobs or convert 10th/12th/Graduation marks to percentage instantly.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('age-calculator')}
            className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-xs"
          >
            Age Calculator
          </button>
          <button
            onClick={() => onNavigate('percentage-calculator')}
            className="px-3 py-1.5 rounded bg-blue-800 hover:bg-blue-700 text-white border border-blue-600 font-black text-xs cursor-pointer shadow-xs"
          >
            Marks % Calculator
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 5: X Sarkari Job Informative & SEO Disclaimer Box */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border-2 border-[#1e3a8a] dark:border-blue-700 rounded-md p-5 shadow-xs space-y-3 text-xs text-gray-700 dark:text-slate-300 leading-relaxed transition-colors">
        <div className="border-b border-gray-200 dark:border-slate-800 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-black text-[#0f2347] dark:text-blue-400 uppercase">
            X Sarkari Job : Free Sarkari Result, Sarkari Exam & Online Form Portal
          </h3>
          <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">
            www.xsarkarijob.com
          </span>
        </div>
        <p>
          <strong>X Sarkari Job</strong> is India's fast and verified government recruitment information portal providing real-time alerts on Central and State Government Jobs (Sarkari Naukri), Exam Results, Admit Cards (Hall Tickets), Answer Keys, Syllabus, and Admissions. Whether you are looking for SSC (Staff Selection Commission), Railway Recruitment Board (RRB), UPSC, Banking (IBPS, SBI), Police, Defense (Indian Army, Air Force, Navy), or Teaching vacancies, X Sarkari Job delivers official notifications and verified direct application links.
        </p>
        <p>
          Candidates are advised to regularly visit <strong>XSarkariJob.com</strong> or bookmark this page on mobile and desktop browsers to get the fastest alerts on newly released online forms, exam dates, answer keys, and scorecards.
        </p>
        <div className="pt-2 border-t border-gray-200 dark:border-slate-800 text-[11px] text-gray-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Disclaimer: X Sarkari Job is an independent educational news and career information portal and is not affiliated with any government organization.</span>
          <button 
            onClick={() => onNavigate('disclaimer')} 
            className="text-[#1e40af] dark:text-blue-400 font-bold hover:underline"
          >
            Read Full Disclaimer »
          </button>
        </div>
      </div>

    </div>
  );
};
