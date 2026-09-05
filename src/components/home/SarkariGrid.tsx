import React from 'react';
import { 
  Job, 
  ResultItem, 
  AdmitCardItem, 
  AnswerKeyItem, 
  SyllabusItem 
} from '../../types';
import { ChevronRight, ExternalLink, Flame, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
        <div className="bg-white border-2 border-[#800000] rounded-md shadow-xs flex flex-col overflow-hidden">
          {/* Result Bharat Maroon Header */}
          <div className="bg-[#800000] text-white px-3.5 py-2.5 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5">
              <span>Result</span>
            </h2>
            <button 
              onClick={() => onNavigate('results')}
              className="text-xs font-bold text-[#ffeb3b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View More »
            </button>
          </div>
          
          {/* Link items list */}
          <div className="divide-y divide-gray-200 flex-1 bg-[#fffdfa]">
            {results.slice(0, 9).map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`result:${item.slug}`)}
                className="py-2.5 px-3 hover:bg-amber-50/70 transition-colors cursor-pointer text-xs leading-snug flex items-start gap-2 group"
              >
                <span className="text-[#800000] font-black text-sm shrink-0">»</span>
                <div className="flex-1">
                  <span className="font-bold text-[#0000cc] group-hover:text-[#800000] group-hover:underline">
                    {item.title}
                  </span>
                  {idx < 2 && (
                    <span className="ml-1.5 text-[10px] font-extrabold text-[#d32f2f] uppercase">
                      [New]
                    </span>
                  )}
                  <span className="block text-[11px] text-gray-500 mt-0.5">
                    Declared: {item.resultDate}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom View More Button */}
          <div className="p-2 bg-gray-100 border-t border-gray-200 text-center">
            <button
              onClick={() => onNavigate('results')}
              className="text-xs font-bold text-[#800000] hover:text-[#b71c1c] hover:underline cursor-pointer block w-full py-1"
            >
              View More Result...
            </button>
          </div>
        </div>

        {/* ============================== */}
        {/* COLUMN 2: ADMIT CARD */}
        {/* ============================== */}
        <div className="bg-white border-2 border-[#800000] rounded-md shadow-xs flex flex-col overflow-hidden">
          {/* Result Bharat Maroon Header */}
          <div className="bg-[#800000] text-white px-3.5 py-2.5 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5">
              <span>Admit Card</span>
            </h2>
            <button 
              onClick={() => onNavigate('admit-card')}
              className="text-xs font-bold text-[#ffeb3b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View More »
            </button>
          </div>
          
          {/* Link items list */}
          <div className="divide-y divide-gray-200 flex-1 bg-[#fffdfa]">
            {admitCards.slice(0, 9).map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`admit-card:${item.slug}`)}
                className="py-2.5 px-3 hover:bg-amber-50/70 transition-colors cursor-pointer text-xs leading-snug flex items-start gap-2 group"
              >
                <span className="text-[#800000] font-black text-sm shrink-0">»</span>
                <div className="flex-1">
                  <span className="font-bold text-[#0000cc] group-hover:text-[#800000] group-hover:underline">
                    {item.title}
                  </span>
                  {idx < 2 && (
                    <span className="ml-1.5 text-[10px] font-extrabold text-[#d32f2f] uppercase">
                      [New]
                    </span>
                  )}
                  <span className="block text-[11px] text-gray-500 mt-0.5">
                    Exam Date: {item.examDate}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom View More Button */}
          <div className="p-2 bg-gray-100 border-t border-gray-200 text-center">
            <button
              onClick={() => onNavigate('admit-card')}
              className="text-xs font-bold text-[#800000] hover:text-[#b71c1c] hover:underline cursor-pointer block w-full py-1"
            >
              View More Admit Card...
            </button>
          </div>
        </div>

        {/* ============================== */}
        {/* COLUMN 3: LATEST JOBS */}
        {/* ============================== */}
        <div className="bg-white border-2 border-[#800000] rounded-md shadow-xs flex flex-col overflow-hidden">
          {/* Result Bharat Maroon Header */}
          <div className="bg-[#800000] text-white px-3.5 py-2.5 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5">
              <span>Latest Jobs</span>
            </h2>
            <button 
              onClick={() => onNavigate('jobs')}
              className="text-xs font-bold text-[#ffeb3b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View More »
            </button>
          </div>
          
          {/* Link items list */}
          <div className="divide-y divide-gray-200 flex-1 bg-[#fffdfa]">
            {jobs.slice(0, 9).map((job, idx) => (
              <div 
                key={job.id}
                onClick={() => onNavigate(`job:${job.slug}`)}
                className="py-2.5 px-3 hover:bg-amber-50/70 transition-colors cursor-pointer text-xs leading-snug flex items-start gap-2 group"
              >
                <span className="text-[#800000] font-black text-sm shrink-0">»</span>
                <div className="flex-1">
                  <span className="font-bold text-[#0000cc] group-hover:text-[#800000] group-hover:underline">
                    {job.title}
                  </span>
                  {idx < 3 && (
                    <span className="ml-1.5 text-[10px] font-extrabold text-[#d32f2f] uppercase">
                      [Last Date: 2026]
                    </span>
                  )}
                  <span className="block text-[11px] text-gray-500 mt-0.5">
                    {job.organization} • Total Post: {job.totalVacancy}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom View More Button */}
          <div className="p-2 bg-gray-100 border-t border-gray-200 text-center">
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs font-bold text-[#800000] hover:text-[#b71c1c] hover:underline cursor-pointer block w-full py-1"
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
        <div className="bg-white border-2 border-[#800000] rounded-md shadow-xs flex flex-col overflow-hidden">
          <div className="bg-[#800000] text-white px-3.5 py-2.5 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Answer Key
            </h2>
            <button 
              onClick={() => onNavigate('answer-key')}
              className="text-xs font-bold text-[#ffeb3b] hover:underline cursor-pointer"
            >
              View More »
            </button>
          </div>
          <div className="divide-y divide-gray-200 flex-1 bg-[#fffdfa]">
            {answerKeys.slice(0, 6).map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`answer-key:${item.slug}`)}
                className="py-2 px-3 hover:bg-amber-50 transition-colors cursor-pointer text-xs flex items-start gap-2 group"
              >
                <span className="text-[#800000] font-bold">»</span>
                <span className="font-bold text-[#0000cc] group-hover:text-[#800000] group-hover:underline">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 bg-gray-100 border-t border-gray-200 text-center">
            <button
              onClick={() => onNavigate('answer-key')}
              className="text-xs font-bold text-[#800000] hover:underline cursor-pointer"
            >
              View More Answer Key...
            </button>
          </div>
        </div>

        {/* Column: Syllabus */}
        <div className="bg-white border-2 border-[#800000] rounded-md shadow-xs flex flex-col overflow-hidden">
          <div className="bg-[#800000] text-white px-3.5 py-2.5 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Syllabus
            </h2>
            <button 
              onClick={() => onNavigate('syllabus')}
              className="text-xs font-bold text-[#ffeb3b] hover:underline cursor-pointer"
            >
              View More »
            </button>
          </div>
          <div className="divide-y divide-gray-200 flex-1 bg-[#fffdfa]">
            {syllabusList.slice(0, 6).map((item) => (
              <div 
                key={item.id}
                onClick={() => onNavigate(`syllabus:${item.slug}`)}
                className="py-2 px-3 hover:bg-amber-50 transition-colors cursor-pointer text-xs flex items-start gap-2 group"
              >
                <span className="text-[#800000] font-bold">»</span>
                <span className="font-bold text-[#0000cc] group-hover:text-[#800000] group-hover:underline">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 bg-gray-100 border-t border-gray-200 text-center">
            <button
              onClick={() => onNavigate('syllabus')}
              className="text-xs font-bold text-[#800000] hover:underline cursor-pointer"
            >
              View More Syllabus...
            </button>
          </div>
        </div>

        {/* Column: Admission */}
        <div className="bg-white border-2 border-[#800000] rounded-md shadow-xs flex flex-col overflow-hidden">
          <div className="bg-[#800000] text-white px-3.5 py-2.5 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Admission
            </h2>
            <button 
              onClick={() => onNavigate('admission')}
              className="text-xs font-bold text-[#ffeb3b] hover:underline cursor-pointer"
            >
              View More »
            </button>
          </div>
          <div className="divide-y divide-gray-200 flex-1 bg-[#fffdfa]">
            {[
              { title: 'NTA CUET UG 2026 Online Application Form', date: 'Active' },
              { title: 'NTA NEET UG 2026 Registration Portal Open', date: 'Active' },
              { title: 'NTA JEE Main 2026 Session 2 Online Form', date: 'Active' },
              { title: 'UP B.Ed Joint Entrance Exam (JEE) 2026 Form', date: 'Active' },
              { title: 'Bihar DElEd Admission 2026 Entrance Test', date: 'Active' },
              { title: 'IGNOU B.Ed / OPENMAT Admission 2026', date: 'Active' },
            ].map((adm, i) => (
              <div 
                key={i}
                onClick={() => onNavigate('admission')}
                className="py-2 px-3 hover:bg-amber-50 transition-colors cursor-pointer text-xs flex items-start gap-2 group"
              >
                <span className="text-[#800000] font-bold">»</span>
                <span className="font-bold text-[#0000cc] group-hover:text-[#800000] group-hover:underline">
                  {adm.title}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 bg-gray-100 border-t border-gray-200 text-center">
            <button
              onClick={() => onNavigate('admission')}
              className="text-xs font-bold text-[#800000] hover:underline cursor-pointer"
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
        <div className="bg-white border-2 border-[#800000] rounded-md shadow-xs flex flex-col overflow-hidden">
          <div className="bg-[#800000] text-white px-3.5 py-2.5 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Certificate Verification
            </h2>
            <span className="text-xs font-bold text-[#ffeb3b]">Services</span>
          </div>
          <div className="divide-y divide-gray-200 flex-1 bg-[#fffdfa] text-xs">
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
                className="py-2 px-3 hover:bg-amber-50 text-[#0000cc] hover:text-[#800000] font-bold flex items-start gap-2 cursor-pointer"
              >
                <span className="text-[#800000]">»</span>
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important / Scholarship */}
        <div className="bg-white border-2 border-[#800000] rounded-md shadow-xs flex flex-col overflow-hidden">
          <div className="bg-[#800000] text-white px-3.5 py-2.5 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase">
              Important & Scholarship
            </h2>
            <button onClick={() => onNavigate('scholarship')} className="text-xs font-bold text-[#ffeb3b] hover:underline">
              View All »
            </button>
          </div>
          <div className="divide-y divide-gray-200 flex-1 bg-[#fffdfa] text-xs">
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
                className="py-2 px-3 hover:bg-amber-50 text-[#0000cc] hover:text-[#800000] font-bold flex items-start gap-2 cursor-pointer"
              >
                <span className="text-[#800000]">»</span>
                <span>{imp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State Wise Govt Jobs */}
        <div className="bg-white border-2 border-[#800000] rounded-md shadow-xs flex flex-col overflow-hidden">
          <div className="bg-[#800000] text-white px-3.5 py-2.5 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase">
              State Wise Jobs
            </h2>
            <button onClick={() => onNavigate('jobs')} className="text-xs font-bold text-[#ffeb3b] hover:underline">
              All States »
            </button>
          </div>
          <div className="divide-y divide-gray-200 flex-1 bg-[#fffdfa] text-xs">
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
                className="py-2 px-3 hover:bg-amber-50 text-gray-900 flex items-start justify-between cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[#800000] font-bold">»</span>
                  <span className="font-bold text-[#0000cc] hover:text-[#800000] hover:underline">
                    {st.state}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">
                  {st.note}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* X Sarkari Job Informative & SEO Disclaimer Box */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-[#800000] rounded-md p-5 shadow-xs space-y-3 text-xs text-gray-700 leading-relaxed">
        <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-black text-[#800000] uppercase">
            X Sarkari Job : Free Sarkari Result, Sarkari Exam & Online Form Portal
          </h3>
          <span className="text-[11px] font-bold text-gray-500">
            www.xsarkarijob.com
          </span>
        </div>
        <p>
          <strong>X Sarkari Job</strong> is India's fast and verified government recruitment information portal providing real-time alerts on Central and State Government Jobs (Sarkari Naukri), Exam Results, Admit Cards (Hall Tickets), Answer Keys, Syllabus, and Admissions. Whether you are looking for SSC (Staff Selection Commission), Railway Recruitment Board (RRB), UPSC, Banking (IBPS, SBI), Police, Defense (Indian Army, Air Force, Navy), or Teaching vacancies, X Sarkari Job delivers official notifications and verified direct application links.
        </p>
        <p>
          Candidates are advised to regularly visit <strong>XSarkariJob.com</strong> or bookmark this page on mobile and desktop browsers to get the fastest alerts on newly released online forms, exam dates, answer keys, and scorecards.
        </p>
        <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center justify-between gap-2">
          <span>Disclaimer: X Sarkari Job is an independent educational news and career information portal and is not affiliated with any government organization.</span>
          <button 
            onClick={() => onNavigate('disclaimer')} 
            className="text-[#800000] font-bold hover:underline"
          >
            Read Full Disclaimer »
          </button>
        </div>
      </div>

    </div>
  );
};
