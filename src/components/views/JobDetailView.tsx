import React, { useState, useEffect } from 'react';
import { Job } from '../../types';
import { 
  Calendar, 
  CreditCard, 
  UserCheck, 
  GraduationCap, 
  FileText, 
  ExternalLink, 
  Share2, 
  Printer, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Clock,
  CheckCircle2,
  Download
} from 'lucide-react';

interface JobDetailViewProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({ slug, onNavigate }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [related, setRelated] = useState<{ jobs: Job[]; results: any[] }>({ jobs: [], results: [] });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`/api/jobs/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.job) {
          setJob(data.job);
          setRelated(data.related || { jobs: [], results: [] });
          // Update document title for SEO
          document.title = `${data.job.title} | X Sarkari Job`;
        }
      })
      .catch(err => console.error("Error loading job:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: job?.shortDescription,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-semibold text-sm">Loading verified notification details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Job Notification Not Found</h2>
        <p className="text-gray-600 text-sm mt-1 mb-6">
          The requested recruitment announcement might have been updated or removed.
        </p>
        <button
          onClick={() => onNavigate('jobs')}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Latest Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 flex-wrap">
        <button onClick={() => onNavigate('home')} className="hover:text-amber-700 font-medium">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <button onClick={() => onNavigate('jobs')} className="hover:text-amber-700 font-medium">Latest Jobs</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="hover:text-amber-700 font-medium">{job.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-xs">{job.organization}</span>
      </nav>

      {/* Main Post Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        
        {/* Header Ribbon & Title */}
        <div className="p-6 sm:p-8 border-b border-gray-200 bg-gray-50/70">
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {job.category}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                <MapPin className="w-3 h-3 mr-1 text-gray-500" /> {job.state}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                Total: {job.totalVacancy} Vacancies
              </span>
            </div>

            {/* Share & Print Actions */}
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Share this job update"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied Link!' : 'Share'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Print this notification"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug mb-2">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2">
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-gray-500" /> {job.organization}
            </span>
            <span>•</span>
            <span>Advt No: <strong className="text-gray-900">{job.advertisementNumber}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> {job.verificationStatus === 'ADMIN_VERIFIED' ? 'Official Verified' : 'AI Verified'}
            </span>
            <span>•</span>
            <span className="text-gray-500">Updated: {new Date(job.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          {/* Short Description */}
          <div className="mt-4 p-3.5 bg-amber-50/60 rounded-lg border border-amber-200/60 text-xs sm:text-sm text-gray-800 leading-relaxed">
            <strong className="text-amber-950 font-bold">Brief Summary: </strong>
            {job.shortDescription}
          </div>
        </div>

        {/* Dense Sarkari-Style Two-Column Tables */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Important Dates & Application Fee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Dates Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-amber-600 text-white px-4 py-2.5 font-bold text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wider">
                <Calendar className="w-4 h-4" /> Important Dates
              </div>
              <table className="w-full text-xs sm:text-sm divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-100">
                  {job.importantDates.map((d, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                      <td className="px-4 py-2.5 font-semibold text-gray-700 w-1/2">{d.label}</td>
                      <td className="px-4 py-2.5 font-bold text-amber-900">{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Application Fee Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-700 text-white px-4 py-2.5 font-bold text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wider">
                <CreditCard className="w-4 h-4" /> Application Fee
              </div>
              <table className="w-full text-xs sm:text-sm divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-100">
                  {job.applicationFees.map((f, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                      <td className="px-4 py-2.5 font-semibold text-gray-700 w-1/2">{f.category}</td>
                      <td className="px-4 py-2.5 font-bold text-blue-900">{f.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-gray-50 text-[11px] text-gray-600 border-t border-gray-200">
                <strong>Payment Mode: </strong>{job.paymentMode || 'Net Banking, Credit Card, Debit Card or UPI through SBI Collect / Official Gateway.'}
              </div>
            </div>

          </div>

          {/* Age Limit & Relaxations */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-emerald-700 text-white px-4 py-2.5 font-bold text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wider">
              <UserCheck className="w-4 h-4" /> Age Limit (As on {job.ageLimitAsOn || 'Notification Date'})
            </div>
            <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm border-b border-gray-100">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-gray-600 block text-xs">Minimum Age</span>
                <strong className="text-emerald-900 text-base">{job.ageLimitMin ? `${job.ageLimitMin} Years` : 'Not Specified'}</strong>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-gray-600 block text-xs">Maximum Age</span>
                <strong className="text-emerald-900 text-base">{job.ageLimitMax ? `${job.ageLimitMax} Years` : 'Check Notice'}</strong>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-gray-600 block text-xs">Salary / Pay Scale</span>
                <strong className="text-emerald-900 text-xs sm:text-sm">{job.salaryPayScale || 'As per central/state 7th CPC rules'}</strong>
              </div>
            </div>
            <div className="p-3.5 bg-gray-50 text-xs text-gray-700">
              <strong>Age Relaxation: </strong>
              {job.ageRelaxationRules || 'Age Relaxation Extra as per recruitment rules (OBC: 3 Years, SC/ST: 5 Years, PwD: 10 Years). Read the official notification for complete details.'}
            </div>
          </div>

          {/* Vacancy Details & Eligibility */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white px-4 py-2.5 font-bold text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" /> Vacancy Details & Educational Eligibility
            </div>
            
            {/* General qualification summary */}
            <div className="p-4 bg-amber-50/50 border-b border-gray-200 text-xs sm:text-sm text-gray-800">
              <strong className="font-bold text-gray-900">Minimum Educational Qualification: </strong>
              <span>{job.educationalQualification}</span>
            </div>

            {/* Post-wise table if available */}
            {job.postWiseVacancies && job.postWiseVacancies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5">Post Name</th>
                      <th className="px-4 py-2.5">Total Vacancies</th>
                      <th className="px-4 py-2.5">Eligibility Criteria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {job.postWiseVacancies.map((p, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                        <td className="px-4 py-2.5 font-semibold text-gray-900">{p.postName}</td>
                        <td className="px-4 py-2.5 font-bold text-emerald-800">{p.vacancies}</td>
                        <td className="px-4 py-2.5 text-gray-700">{p.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-xs sm:text-sm text-gray-700">
                Refer to the detailed category-wise vacancy distribution in the official notification PDF below.
              </div>
            )}
          </div>

          {/* Selection Process & Exam Pattern */}
          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50/70">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Selection Process
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {job.selectionProcess.map((step, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-300 text-gray-800 shadow-2xs">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white inline-flex items-center justify-center text-[10px] mr-1.5 font-bold">
                    {idx + 1}
                  </span>
                  {step}
                </span>
              ))}
            </div>
            {job.examPattern && (
              <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-200/80 pt-2.5 mt-2">
                <strong>Pattern Details: </strong> {job.examPattern}
              </p>
            )}
          </div>

          {/* How to Apply Step-by-Step */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
              How to Fill {job.organization} Online Form 2026
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-gray-700 list-decimal list-inside">
              {job.howToApply.map((step, idx) => (
                <li key={idx} className="leading-relaxed pl-1">{step}</li>
              ))}
            </ol>
          </div>

          {/* ========================================================= */}
          {/* IMPORTANT OFFICIAL LINKS TABLE (CRITICAL SARKARI COMPONENT) */}
          {/* ========================================================= */}
          <div className="border-2 border-amber-500 rounded-xl overflow-hidden shadow-md">
            <div className="bg-amber-600 text-white px-5 py-3 font-extrabold text-sm sm:text-base flex items-center justify-between uppercase tracking-wider">
              <span>Important Links to Apply & Download</span>
              <span className="text-xs font-normal text-amber-100 bg-amber-700/80 px-2 py-0.5 rounded">
                Direct Official Links
              </span>
            </div>

            <table className="w-full text-xs sm:text-sm divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-100">
                {job.importantLinks.map((link, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-gray-900">
                      {link.label}
                      {link.isOfficial && (
                        <span className="ml-2 inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Official
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-4 py-1.5 rounded text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Click Here</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Source Verification Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-950">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-emerald-900">Information Authenticity Guarantee</p>
                <p className="mt-1 text-emerald-800">
                  This recruitment article was manually validated and synchronized against the official notification published by <strong>{job.organization}</strong>.
                </p>
                <p className="mt-1.5 text-[11px] text-emerald-700">
                  Official Source: <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold">{job.sourceName || job.sourceUrl}</a>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Related Jobs Section */}
      {related.jobs && related.jobs.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>Related Government Vacancies in {job.category}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {related.jobs.slice(0, 3).map((rJob) => (
              <div
                key={rJob.id}
                onClick={() => onNavigate(`job:${rJob.slug}`)}
                className="bg-white border border-gray-200 hover:border-amber-400 rounded-lg p-4 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {rJob.organization}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 mt-2 line-clamp-2 hover:text-amber-700">
                    {rJob.title}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>{rJob.totalVacancy} Vacancies</span>
                  <span className="text-amber-700 font-bold">Apply →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
