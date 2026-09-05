import React, { useState } from 'react';
import { Calculator, Calendar } from 'lucide-react';

interface ToolsViewProps {
  toolType: 'age-calculator' | 'percentage-calculator' | 'exam-calendar';
  onNavigate: (route: string) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ toolType, onNavigate }) => {
  // Age Calculator State
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [asOnDate, setAsOnDate] = useState('2026-08-01');
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  // Percentage Calculator State
  const [obtainedMarks, setObtainedMarks] = useState('425');
  const [maxMarks, setMaxMarks] = useState('500');
  const [percentageResult, setPercentageResult] = useState<number | null>(85.0);

  const calculateAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate || !asOnDate) return;

    const bDate = new Date(birthDate);
    const targetDate = new Date(asOnDate);

    if (bDate > targetDate) {
      alert("Date of birth cannot be after the cutoff date.");
      return;
    }

    let years = targetDate.getFullYear() - bDate.getFullYear();
    let months = targetDate.getMonth() - bDate.getMonth();
    let days = targetDate.getDate() - bDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(targetDate.getTime() - bDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setAgeResult({ years, months, days, totalDays });
  };

  const calculatePercentage = (e: React.FormEvent) => {
    e.preventDefault();
    const obt = parseFloat(obtainedMarks);
    const max = parseFloat(maxMarks);
    if (!isNaN(obt) && !isNaN(max) && max > 0) {
      setPercentageResult(parseFloat(((obt / max) * 100).toFixed(2)));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 transition-colors">
      
      {/* Navigation tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-800 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => onNavigate('age-calculator')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer shrink-0 transition-colors ${
            toolType === 'age-calculator'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" /> Age Calculator
        </button>
        <button
          onClick={() => onNavigate('percentage-calculator')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer shrink-0 transition-colors ${
            toolType === 'percentage-calculator'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" /> Percentage Calculator
        </button>
        <button
          onClick={() => onNavigate('exam-calendar')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer shrink-0 transition-colors ${
            toolType === 'exam-calendar'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" /> Exam Calendar 2026
        </button>
      </div>

      {/* ========================================================= */}
      {/* Age Calculator Component */}
      {/* ========================================================= */}
      {toolType === 'age-calculator' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
          <div className="mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-slate-100">
              Government Job Age Calculator
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1">
              Calculate your exact age as on the official recruitment cutoff date (e.g. 01/08/2026 or 01/01/2026).
            </p>
          </div>

          <form onSubmit={calculateAge} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Date of Birth (DOB)
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2.5 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Age as on Cut-off Date
              </label>
              <input
                type="date"
                required
                value={asOnDate}
                onChange={(e) => setAsOnDate(e.target.value)}
                className="w-full p-2.5 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer shadow-xs"
              >
                Calculate Age
              </button>
            </div>
          </form>

          {ageResult && (
            <div className="bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                Calculated Age as on {asOnDate}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-blue-100 mt-2">
                {ageResult.years} Years, {ageResult.months} Months, {ageResult.days} Days
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">
                Total duration: <strong>{ageResult.totalDays.toLocaleString('en-IN')}</strong> days lived.
              </p>
              
              <div className="mt-4 pt-4 border-t border-blue-200/60 dark:border-slate-700 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2 rounded border border-blue-100 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-slate-400 block">General (18-27)</span>
                  <strong className={ageResult.years >= 18 && ageResult.years <= 27 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-400"}>
                    {ageResult.years >= 18 && ageResult.years <= 27 ? "Eligible ✓" : "Out of range"}
                  </strong>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded border border-blue-100 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-slate-400 block">OBC (Max 30)</span>
                  <strong className={ageResult.years >= 18 && ageResult.years <= 30 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-400"}>
                    {ageResult.years >= 18 && ageResult.years <= 30 ? "Eligible ✓" : "Out of range"}
                  </strong>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded border border-blue-100 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-slate-400 block">SC/ST (Max 32)</span>
                  <strong className={ageResult.years >= 18 && ageResult.years <= 32 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-400"}>
                    {ageResult.years >= 18 && ageResult.years <= 32 ? "Eligible ✓" : "Out of range"}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* Percentage Calculator Component */}
      {/* ========================================================= */}
      {toolType === 'percentage-calculator' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
          <div className="mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-slate-100">
              Exam Marks Percentage Calculator
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1">
              Calculate exact percentage of marks scored in 10th, 12th, or Bachelor degree for online forms.
            </p>
          </div>

          <form onSubmit={calculatePercentage} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Marks Obtained / Secured
              </label>
              <input
                type="number"
                step="any"
                required
                value={obtainedMarks}
                onChange={(e) => setObtainedMarks(e.target.value)}
                className="w-full p-2.5 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Maximum / Total Marks
              </label>
              <input
                type="number"
                step="any"
                required
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="w-full p-2.5 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer shadow-xs"
              >
                Calculate Percentage
              </button>
            </div>
          </form>

          {percentageResult !== null && (
            <div className="bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                Aggregate Percentage
              </span>
              <div className="text-3xl sm:text-4xl font-black text-blue-950 dark:text-blue-100 mt-2">
                {percentageResult}%
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">
                Division:{' '}
                <strong>
                  {percentageResult >= 60 ? '1st Division (First Class)' : percentageResult >= 45 ? '2nd Division' : '3rd Division / Pass'}
                </strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* Exam Calendar 2026 */}
      {/* ========================================================= */}
      {toolType === 'exam-calendar' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
          <div className="mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-slate-100">
              Government Exam Calendar 2026
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1">
              Yearly schedule of upcoming competitive examinations conducted by Central and State Commissions.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { month: 'September 2026', exams: [{ name: 'SSC Combined Graduate Level (CGL) Tier I', date: '09 - 26 Sep 2026', org: 'SSC' }, { name: 'IBPS RRB Officer Scale I Mains', date: '29 Sep 2026', org: 'IBPS' }] },
              { month: 'October 2026', exams: [{ name: 'UPSC Civil Services (Mains) Examination', date: '16 - 25 Oct 2026', org: 'UPSC' }, { name: 'Bihar Police Constable Written Exam', date: '11 - 18 Oct 2026', org: 'CSBC' }] },
              { month: 'November 2026', exams: [{ name: 'Railway RRB NTPC Computer Based Test', date: '14 Nov - 05 Dec 2026', org: 'RRB' }, { name: 'SSC CHSL 10+2 Tier II Examination', date: '22 Nov 2026', org: 'SSC' }] },
              { month: 'December 2026', exams: [{ name: 'SBI Probationary Officer (PO) Prelims', date: '05 - 12 Dec 2026', org: 'SBI' }, { name: 'UPPSC Combined State Upper Subordinate Mains', date: '18 - 22 Dec 2026', org: 'UPPSC' }] }
            ].map((schedule, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-[#0f2347] dark:bg-slate-800 text-white px-4 py-2 font-bold text-xs uppercase tracking-wider">
                  {schedule.month}
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {schedule.exams.map((ex, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-850/50 text-xs sm:text-sm transition-colors">
                      <div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-300 mr-2">
                          {ex.org}
                        </span>
                        <strong className="text-gray-900 dark:text-slate-100">{ex.name}</strong>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">{ex.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
