import { 
  Job, 
  ResultItem, 
  AdmitCardItem, 
  AnswerKeyItem, 
  SyllabusItem, 
  NoticeItem, 
  Source, 
  AIDraft, 
  User, 
  ContactMessage, 
  SiteSettings 
} from '../../src/types';

export const initialCategories = [
  'SSC', 'UPSC', 'Railway', 'Banking', 'Defence', 'Police', 
  'Teaching', 'State Government', 'PSU', 'Medical', 'Engineering', 
  'Court Jobs', 'University Jobs', 'Postal Jobs', 'Other Government Jobs', 'Private Jobs'
];

export const initialStates = [
  'All India', 'Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 
  'Delhi', 'Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Haryana', 
  'Punjab', 'Gujarat', 'Odisha', 'Chhattisgarh', 'Assam', 'Uttarakhand', 'Other States'
];

export const initialOrganizations = [
  { name: 'Staff Selection Commission (SSC)', slug: 'ssc', websiteUrl: 'https://ssc.gov.in' },
  { name: 'Union Public Service Commission (UPSC)', slug: 'upsc', websiteUrl: 'https://upsc.gov.in' },
  { name: 'Railway Recruitment Control Board (RRB)', slug: 'rrb', websiteUrl: 'https://rrbcdg.gov.in' },
  { name: 'Institute of Banking Personnel Selection (IBPS)', slug: 'ibps', websiteUrl: 'https://ibps.in' },
  { name: 'National Testing Agency (NTA)', slug: 'nta', websiteUrl: 'https://nta.ac.in' },
  { name: 'Bihar Public Service Commission (BPSC)', slug: 'bpsc', websiteUrl: 'https://bpsc.bih.nic.in' },
  { name: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)', slug: 'upprpb', websiteUrl: 'https://uppbpb.gov.in' },
  { name: 'State Bank of India (SBI)', slug: 'sbi', websiteUrl: 'https://sbi.co.in' },
  { name: 'Delhi Subordinate Services Selection Board (DSSSB)', slug: 'dsssb', websiteUrl: 'https://dsssb.delhi.gov.in' }
];

export const initialUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Super Administrator',
    email: 'admin@xsarkarijob.com',
    role: 'SUPER_ADMIN',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-editor-1',
    name: 'Senior Content Editor',
    email: 'editor@xsarkarijob.com',
    role: 'EDITOR',
    createdAt: '2026-01-15T00:00:00.000Z'
  }
];

export const initialNotices: NoticeItem[] = [
  {
    id: 'notice-1',
    title: 'SSC CGL 2026 Online Application Window Closing Soon — Apply Before Last Date',
    category: 'SSC',
    link: '/jobs/ssc-cgl-2026',
    isBreaking: true,
    priority: 'breaking',
    date: '05 Sep 2026',
    status: 'PUBLISHED'
  },
  {
    id: 'notice-2',
    title: 'RRB NTPC Graduate & Undergraduate CEN 05/2026 Exam Schedule Released by Railway Board',
    category: 'Railway',
    link: '/admit-card/rrb-ntpc-2026',
    isBreaking: true,
    priority: 'important',
    date: '04 Sep 2026',
    status: 'PUBLISHED'
  },
  {
    id: 'notice-3',
    title: 'UPSC Civil Services Prelims 2026 Marksheet & Category-wise Cutoff Uploaded',
    category: 'UPSC',
    link: '/results/upsc-cse-prelims-2026',
    isBreaking: false,
    priority: 'normal',
    date: '03 Sep 2026',
    status: 'PUBLISHED'
  },
  {
    id: 'notice-4',
    title: 'IBPS PO XIV Online Application Edit / Form Correction Facility Open',
    category: 'Banking',
    link: '/jobs/ibps-po-xiv-2026',
    isBreaking: false,
    priority: 'normal',
    date: '02 Sep 2026',
    status: 'PUBLISHED'
  }
];

export const initialJobs: Job[] = [
  {
    id: 'job-1',
    slug: 'ssc-cgl-2026',
    title: 'SSC CGL 2026 Online Form — Combined Graduate Level Examination (17,727 Posts)',
    shortDescription: 'Staff Selection Commission (SSC) invites online applications from eligible graduate candidates for recruitment to Group B and Group C Gazetted and Non-Gazetted posts in various Ministries and Departments.',
    organization: 'Staff Selection Commission (SSC)',
    organizationSlug: 'ssc',
    recruitmentName: 'Combined Graduate Level Examination 2026',
    advertisementNumber: 'CGL-EXAM-2026/01',
    category: 'SSC',
    state: 'All India',
    totalVacancy: '17,727',
    importantDates: [
      { label: 'Notification Released', date: '24 June 2026' },
      { label: 'Online Application Start', date: '24 June 2026' },
      { label: 'Application Last Date', date: '24 July 2026 (11:00 PM)' },
      { label: 'Online Fee Payment Last Date', date: '25 July 2026' },
      { label: 'Correction Window Period', date: '10 to 11 August 2026' },
      { label: 'Tier 1 Computer Based Exam', date: '09 to 26 September 2026' },
      { label: 'Tier 1 Admit Card', date: '01 September 2026' },
      { label: 'Tier 2 Exam Date', date: 'December 2026 (Tentative)', isTentative: true }
    ],
    applicationFees: [
      { category: 'General / OBC / EWS', fee: '₹ 100/-' },
      { category: 'SC / ST / PwBD / Ex-Servicemen', fee: '₹ 0/- (Exempted)' },
      { category: 'All Female Candidates', fee: '₹ 0/- (Exempted)' },
      { category: 'Correction Charges (1st Time)', fee: '₹ 200/-' },
      { category: 'Correction Charges (2nd Time)', fee: '₹ 500/-' }
    ],
    paymentMode: 'Debit Card, Credit Card, Net Banking, UPI through SBI Gateway',
    ageLimitMin: 18,
    ageLimitMax: 32,
    ageLimitAsOn: '01/08/2026',
    ageRelaxationRules: 'SC/ST: 5 Years, OBC (NCL): 3 Years, PwBD: 10 to 15 Years as per central government norms.',
    educationalQualification: 'Bachelor\'s Degree in any discipline from a recognized University or equivalent institute. Mathematical statistics requirements applicable for Junior Statistical Officer (JSO).',
    postWiseVacancies: [
      {
        postName: 'Assistant Section Officer (CSS, MEA, IB, Railway)',
        totalPosts: '3,840',
        eligibility: 'Bachelor Degree in Any Stream. Age 20-30 Years.',
        categoryBreakup: { UR: '1,540', OBC: '1,020', EWS: '380', SC: '580', ST: '320' }
      },
      {
        postName: 'Inspector of Income Tax & Central Excise (CBIC)',
        totalPosts: '4,150',
        eligibility: 'Bachelor Degree in Any Stream. Age 18-30 Years.',
        categoryBreakup: { UR: '1,720', OBC: '1,110', EWS: '415', SC: '610', ST: '295' }
      },
      {
        postName: 'Sub Inspector (CBI, NIA, Narcotics)',
        totalPosts: '890',
        eligibility: 'Bachelor Degree in Any Stream with physical standards.',
        categoryBreakup: { UR: '360', OBC: '240', EWS: '89', SC: '130', ST: '71' }
      },
      {
        postName: 'Tax Assistant & Auditor (CAG, CGDA)',
        totalPosts: '6,200',
        eligibility: 'Graduation with Data Entry Speed of 8,000 key depressions per hour.',
        categoryBreakup: { UR: '2,510', OBC: '1,670', EWS: '620', SC: '920', ST: '480' }
      },
      {
        postName: 'Junior Statistical Officer (JSO)',
        totalPosts: '2,647',
        eligibility: 'Bachelor Degree with 60% in Math at 10+2 OR Bachelor Degree with Statistics as a subject.',
        categoryBreakup: { UR: '1,080', OBC: '710', EWS: '264', SC: '395', ST: '198' }
      }
    ],
    selectionProcess: [
      'Tier-I Computer Based Examination (Objective Type Qualifying)',
      'Tier-II Computer Based Examination (Merit Evaluation)',
      'Computer Knowledge Test (Qualifying)',
      'Data Entry Speed Test (DEST)',
      'Document Verification (DV) by User Departments'
    ],
    examPattern: 'Tier-I consists of 100 questions (200 marks) across General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension. Time duration: 60 minutes. Negative marking: 0.50 marks per wrong answer.',
    salaryPayScale: 'Pay Level 4 (₹ 25,500 to ₹ 81,100) to Pay Level 8 (₹ 47,600 to ₹ 1,51,100) plus DA, HRA, Transport Allowance.',
    requiredDocuments: [
      'Recent passport-size photograph (live webcam capture during online application)',
      'Scanned signature in white background (10-20 KB, JPG)',
      'Class 10th (Matriculation) Certificate for Date of Birth verification',
      'Graduation Degree Certificate / Final Year Marksheet',
      'Caste / Category / EWS Certificate if claiming reservation',
      'Valid Photo Identity Card (Aadhaar Card / Voter ID / PAN / Passport)'
    ],
    howToApply: [
      'Visit the official website of SSC at https://ssc.gov.in',
      'Complete One Time Registration (OTR) if you are a first-time applicant.',
      'Log in with your Registration Number and Password.',
      'Click on the "Apply" link under Combined Graduate Level Examination 2026.',
      'Capture your live photograph and upload your scanned signature as per official guidelines.',
      'Select your preferred examination centers (3 choices within the same region).',
      'Pay the online application fee of ₹ 100/- via Net Banking/UPI/Debit Card (if applicable).',
      'Verify all details carefully before final submission.',
      'Take a clear printout of the completed application form for future reference.'
    ],
    importantInstructions: [
      'Candidates must ensure they meet the educational qualification cutoff as of 01/08/2026.',
      'SSC conducts live photo capture; avoid wearing caps, masks, or tinted spectacles during capture.',
      'Submission of multiple applications will lead to cancellation of candidature.',
      'Check spelling of candidate name, father\'s name, and DOB exactly as recorded in Class 10th certificate.'
    ],
    importantLinks: [
      {
        label: 'Apply Online (OTR & Application)',
        url: 'https://ssc.gov.in',
        linkType: 'APPLY',
        isOfficial: true,
        status: 200
      },
      {
        label: 'Download Official Notification PDF',
        url: 'https://ssc.gov.in/api/attachment/uploads/docms/Notice_CGL_2026.pdf',
        linkType: 'NOTIFICATION',
        isOfficial: true,
        status: 200
      },
      {
        label: 'SSC Official Portal',
        url: 'https://ssc.gov.in',
        linkType: 'OFFICIAL_WEBSITE',
        isOfficial: true,
        status: 200
      },
      {
        label: 'Download Tier 1 Admit Card / Exam Status',
        url: '/admit-card/ssc-cgl-2026',
        linkType: 'ADMIT_CARD',
        isOfficial: false
      },
      {
        label: 'Check SSC CGL Detailed Syllabus',
        url: '/syllabus/ssc-cgl-2026',
        linkType: 'SYLLABUS',
        isOfficial: false
      }
    ],
    sourceUrl: 'https://ssc.gov.in/notice-board',
    sourceName: 'Staff Selection Commission Official Notice Board',
    status: 'PUBLISHED',
    verificationStatus: 'ADMIN_VERIFIED',
    verifiedBy: 'Administrator',
    verifiedDate: '2026-06-25T10:00:00.000Z',
    seoTitle: 'SSC CGL 2026 Online Form: 17,727 Vacancies, Eligibility, Exam Date & Notification PDF',
    metaDescription: 'SSC CGL 2026 Recruitment application form. Check 17,727 vacancies, age limit, syllabus, eligibility criteria, post-wise pay scale and apply online link.',
    canonicalUrl: 'https://xsarkarijob.com/jobs/ssc-cgl-2026',
    viewCount: 148200,
    isHot: true,
    isPinned: true,
    publishedAt: '2026-06-24T12:00:00.000Z',
    updatedAt: '2026-09-02T14:30:00.000Z'
  },
  {
    id: 'job-2',
    slug: 'railway-rrb-ntpc-2026',
    title: 'Railway RRB NTPC Recruitment 2026 (CEN 05/2026) — 11,558 Posts',
    shortDescription: 'Railway Recruitment Control Board (RRB) has announced CEN 05/2026 recruitment for 11,558 Non-Technical Popular Categories (Graduate & Undergraduate) vacancies across all 21 RRB zones.',
    organization: 'Railway Recruitment Control Board (RRB)',
    organizationSlug: 'rrb',
    recruitmentName: 'RRB Non-Technical Popular Categories (NTPC) 2026',
    advertisementNumber: 'CEN 05/2026',
    category: 'Railway',
    state: 'All India',
    totalVacancy: '11,558',
    importantDates: [
      { label: 'Detailed CEN Notice Release', date: '14 September 2026' },
      { label: 'Online Application Window Opens', date: '14 September 2026' },
      { label: 'Registration Last Date', date: '13 October 2026 (11:59 PM)' },
      { label: 'Fee Payment Window Last Date', date: '15 October 2026' },
      { label: 'CBT 1 Exam Schedule', date: 'December 2026 / January 2027', isTentative: true }
    ],
    applicationFees: [
      { category: 'UR / OBC / EWS Candidates', fee: '₹ 500/- (₹ 400 refundable on attending CBT-1)' },
      { category: 'SC / ST / Ex-SM / PwBD / Female / Minorities / EBC', fee: '₹ 250/- (Fully refundable on attending CBT-1)' }
    ],
    paymentMode: 'Online via Net Banking, Debit Card, Credit Card or UPI',
    ageLimitMin: 18,
    ageLimitMax: 36,
    ageLimitAsOn: '01/01/2027',
    ageRelaxationRules: 'As per Indian Railway rules: SC/ST +5 Years, OBC +3 Years. Includes one-time 3-year COVID relief.',
    educationalQualification: 'Undergraduate posts: Class 12th passed. Graduate posts: Bachelor\'s Degree in any discipline from a recognized University.',
    postWiseVacancies: [
      { postName: 'Chief Commercial cum Ticket Supervisor', totalPosts: '1,736', eligibility: 'Degree from recognized university. Age 18-36.' },
      { postName: 'Station Master', totalPosts: '994', eligibility: 'Degree + CBAT (Computer Based Aptitude Test). Age 18-36.' },
      { postName: 'Goods Train Manager', totalPosts: '3,144', eligibility: 'Degree from recognized university. Age 18-36.' },
      { postName: 'Junior Accounts Assistant cum Typist', totalPosts: '1,507', eligibility: 'Degree with typing proficiency in English (30 wpm) or Hindi (25 wpm).' },
      { postName: 'Commercial cum Ticket Clerk (12th Pass)', totalPosts: '2,022', eligibility: '12th Pass with minimum 50% marks. Age 18-33.' },
      { postName: 'Junior Clerk cum Typist (12th Pass)', totalPosts: '990', eligibility: '12th Pass with English/Hindi typing.' },
      { postName: 'Accounts Clerk cum Typist (12th Pass)', totalPosts: '361', eligibility: '12th Pass with English/Hindi typing.' }
    ],
    selectionProcess: [
      '1st Stage Computer Based Test (CBT-1 common for all posts)',
      '2nd Stage Computer Based Test (CBT-2 post-wise level)',
      'Computer Based Aptitude Test (CBAT) for Station Master posts',
      'Typing Skill Test (TST) for Clerk / Typist posts',
      'Document Verification (DV) and Medical Examination'
    ],
    salaryPayScale: 'Pay Level 2 (₹ 19,900) to Level 6 (₹ 35,400) plus Railway DA, allowances.',
    requiredDocuments: [
      'Scanned color photograph (35mm x 45mm, plain light background)',
      'Scanned signature in running handwriting on white paper',
      'SC/ST Certificate (if requesting free railway travel pass)'
    ],
    howToApply: [
      'Visit the official regional RRB portal (e.g., rrbcdg.gov.in, rrbpatna.gov.in, rrbmumbai.gov.in).',
      'Select CEN 05/2026 Online Application Form link.',
      'Fill your personal, educational and contact credentials.',
      'Select post preferences and regional railway zone carefully.',
      'Upload photograph, signature, and community certificate if applicable.',
      'Pay application fee and print the final registration slip.'
    ],
    importantInstructions: [
      'Candidates can apply to ONLY ONE RRB zone; applying to multiple zones leads to outright rejection.',
      'Keep your registered mobile number and email address active throughout the recruitment lifecycle.'
    ],
    importantLinks: [
      { label: 'Apply Online on Railway Recruitment Portal', url: 'https://www.rrbapply.gov.in', linkType: 'APPLY', isOfficial: true, status: 200 },
      { label: 'Download CEN 05/2026 Official Notification PDF', url: 'https://rrbcdg.gov.in/uploads/CEN_05_2026_NTPC_Notice.pdf', linkType: 'NOTIFICATION', isOfficial: true, status: 200 },
      { label: 'Official RRB Chandigarh Website', url: 'https://rrbcdg.gov.in', linkType: 'OFFICIAL_WEBSITE', isOfficial: true, status: 200 }
    ],
    sourceUrl: 'https://rrbcdg.gov.in',
    sourceName: 'Railway Recruitment Board Central Notice',
    status: 'PUBLISHED',
    verificationStatus: 'ADMIN_VERIFIED',
    seoTitle: 'RRB NTPC Recruitment 2026: 11,558 Vacancies, Apply Online, Eligibility & Exam Pattern',
    metaDescription: 'Railway RRB NTPC CEN 05/2026 notification for 11,558 posts. Check age limit, exam dates, eligibility, post-wise vacancy and online form link.',
    canonicalUrl: 'https://xsarkarijob.com/jobs/railway-rrb-ntpc-2026',
    viewCount: 92400,
    isHot: true,
    publishedAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-04T12:00:00.000Z'
  },
  {
    id: 'job-3',
    slug: 'upsc-civil-services-ias-2026',
    title: 'UPSC Civil Services (IAS / IFS) 2026 Recruitment — 1,056 Posts',
    shortDescription: 'Union Public Service Commission (UPSC) invites applications for Civil Services Examination (CSE) 2026 and Indian Forest Service (IFS) Examination for Indian Administrative Service, Police Service, and Foreign Service.',
    organization: 'Union Public Service Commission (UPSC)',
    organizationSlug: 'upsc',
    recruitmentName: 'Civil Services Examination 2026',
    advertisementNumber: '05/2026-CSP',
    category: 'UPSC',
    state: 'All India',
    totalVacancy: '1,056',
    importantDates: [
      { label: 'Notification Released', date: '14 February 2026' },
      { label: 'Application Start Date', date: '14 February 2026' },
      { label: 'Application Last Date', date: '05 March 2026 (06:00 PM)' },
      { label: 'Correction Window', date: '06 to 12 March 2026' },
      { label: 'Preliminary Examination', date: '25 May 2026' },
      { label: 'Mains Examination Date', date: '19 September 2026' }
    ],
    applicationFees: [
      { category: 'General / OBC / EWS Male', fee: '₹ 100/-' },
      { category: 'Female / SC / ST / PwBD', fee: '₹ 0/- (Exempted)' }
    ],
    paymentMode: 'State Bank of India Net Banking, Visa/Master/RuPay Credit/Debit card or cash in SBI branch.',
    ageLimitMin: 21,
    ageLimitMax: 32,
    ageLimitAsOn: '01/08/2026',
    ageRelaxationRules: 'SC/ST: 5 years (Unlimited attempts), OBC: 3 years (9 attempts), PwBD: 10 years.',
    educationalQualification: 'Graduation degree in any stream from a recognized University or equivalent. Final year appearing students eligible.',
    postWiseVacancies: [
      { postName: 'Indian Administrative Service (IAS)', totalPosts: '180', eligibility: 'Bachelor Degree in Any Stream.' },
      { postName: 'Indian Foreign Service (IFS)', totalPosts: '55', eligibility: 'Bachelor Degree in Any Stream.' },
      { postName: 'Indian Police Service (IPS)', totalPosts: '200', eligibility: 'Bachelor Degree with prescribed physical standards.' },
      { postName: 'Central Services Group A & B', totalPosts: '621', eligibility: 'Bachelor Degree in Any Stream.' }
    ],
    selectionProcess: [
      'Civil Services (Preliminary) Examination (Objective 2 Papers)',
      'Civil Services (Main) Examination (Written 9 Papers)',
      'Personality Test / Interview'
    ],
    requiredDocuments: [
      'Scanned recent photo with name & date imprint',
      'Scanned signature',
      'Photo ID card (Aadhaar / Voter / Passport / DL)'
    ],
    howToApply: [
      'Register on UPSC One Time Registration (OTR) portal at upsconline.nic.in',
      'Fill part 1 and part 2 application forms.',
      'Upload ID proof, photo, and signature.',
      'Select Preliminary and Main examination centers.'
    ],
    importantInstructions: [
      'Negative marking: 1/3rd mark deducted for each wrong answer in Prelims.',
      'Paper II (CSAT) is qualifying with 33% minimum marks required.'
    ],
    importantLinks: [
      { label: 'UPSC Online OTR & Apply Portal', url: 'https://upsconline.nic.in', linkType: 'APPLY', isOfficial: true, status: 200 },
      { label: 'Download Official UPSC Notice PDF', url: 'https://upsc.gov.in/sites/default/files/Notice-CSP-2026-Engl.pdf', linkType: 'NOTIFICATION', isOfficial: true, status: 200 },
      { label: 'UPSC Official Portal', url: 'https://upsc.gov.in', linkType: 'OFFICIAL_WEBSITE', isOfficial: true, status: 200 }
    ],
    sourceUrl: 'https://upsc.gov.in',
    sourceName: 'Union Public Service Commission Examination Notice',
    status: 'PUBLISHED',
    verificationStatus: 'ADMIN_VERIFIED',
    seoTitle: 'UPSC IAS 2026 Notification: 1,056 Posts, Online Form, Eligibility, Prelims Date',
    metaDescription: 'UPSC Civil Services Examination 2026 notice for IAS, IPS, IFS. Check eligibility, syllabus, age limits, and online application details.',
    canonicalUrl: 'https://xsarkarijob.com/jobs/upsc-civil-services-ias-2026',
    viewCount: 110500,
    isHot: true,
    publishedAt: '2026-02-14T09:00:00.000Z',
    updatedAt: '2026-08-20T11:00:00.000Z'
  },
  {
    id: 'job-4',
    slug: 'ibps-po-xiv-2026',
    title: 'IBPS PO / MT XIV Recruitment 2026 — 4,455 Probationary Officer Posts',
    shortDescription: 'Institute of Banking Personnel Selection (IBPS) Common Recruitment Process (CRP PO/MT-XIV) for recruitment of Probationary Officers / Management Trainees in participating public sector banks.',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    organizationSlug: 'ibps',
    recruitmentName: 'CRP PO/MT-XIV 2026',
    advertisementNumber: 'CRP-PO/MT-XIV-2026',
    category: 'Banking',
    state: 'All India',
    totalVacancy: '4,455',
    importantDates: [
      { label: 'Online Registration Start', date: '01 August 2026' },
      { label: 'Registration Last Date', date: '28 August 2026' },
      { label: 'Pre-Exam Training (PET)', date: 'September 2026' },
      { label: 'Online Preliminary Exam', date: '19 & 20 October 2026' },
      { label: 'Online Mains Exam', date: '30 November 2026' }
    ],
    applicationFees: [
      { category: 'General / EWS / OBC', fee: '₹ 850/-' },
      { category: 'SC / ST / PwBD', fee: '₹ 175/-' }
    ],
    paymentMode: 'Online via Debit/Credit Cards, Internet Banking, IMPS, Cash Cards/Mobile Wallets',
    ageLimitMin: 20,
    ageLimitMax: 30,
    ageLimitAsOn: '01/08/2026',
    ageRelaxationRules: 'SC/ST: 5 years, OBC (Non-Creamy): 3 years, PwD: 10 years.',
    educationalQualification: 'A Degree (Graduation) in any discipline from a recognized University or equivalent qualification recognized by the Central Government.',
    postWiseVacancies: [
      { postName: 'Bank of Baroda PO', totalPosts: '800', eligibility: 'Graduation in Any Stream' },
      { postName: 'Punjab National Bank PO', totalPosts: '1,200', eligibility: 'Graduation in Any Stream' },
      { postName: 'Canara Bank PO', totalPosts: '750', eligibility: 'Graduation in Any Stream' },
      { postName: 'Union Bank of India PO', totalPosts: '950', eligibility: 'Graduation in Any Stream' },
      { postName: 'Other Participating Banks', totalPosts: '755', eligibility: 'Graduation in Any Stream' }
    ],
    selectionProcess: [
      'Preliminary Examination (100 Marks Objective)',
      'Main Examination (200 Objective + 25 Descriptive Marks)',
      'Common Interview conducted by participating banks'
    ],
    requiredDocuments: [
      'Photograph (4.5cm x 3.5cm)',
      'Signature (Not in capital letters)',
      'Left thumb impression',
      'Handwritten declaration'
    ],
    howToApply: [
      'Visit ibps.in and click CRP PO/MT XIV link.',
      'Register with mobile number and email.',
      'Fill personal, academic, and bank preference details.',
      'Upload photo, signature, left thumb, and handwritten declaration.',
      'Pay online application fee.'
    ],
    importantInstructions: [
      'Ensure bank preference order is carefully arranged before submission.',
      'Check handwritten declaration text format strictly from official notification.'
    ],
    importantLinks: [
      { label: 'Apply Online for IBPS PO XIV', url: 'https://ibps.in', linkType: 'APPLY', isOfficial: true, status: 200 },
      { label: 'Download CRP PO/MT XIV Detailed Notification', url: 'https://ibps.in/uploads/CRP_PO_XIV_Detailed_Advt.pdf', linkType: 'NOTIFICATION', isOfficial: true, status: 200 },
      { label: 'IBPS Official Website', url: 'https://ibps.in', linkType: 'OFFICIAL_WEBSITE', isOfficial: true, status: 200 }
    ],
    sourceUrl: 'https://ibps.in',
    sourceName: 'IBPS Recruitment Notification',
    status: 'PUBLISHED',
    verificationStatus: 'ADMIN_VERIFIED',
    seoTitle: 'IBPS PO XIV 2026: 4,455 Bank PO Vacancy, Apply Online, Eligibility & Exam Dates',
    metaDescription: 'IBPS PO XIV Recruitment 2026 for 4,455 Probationary Officers. Check bank-wise vacancy, age limits, syllabus and online application process.',
    canonicalUrl: 'https://xsarkarijob.com/jobs/ibps-po-xiv-2026',
    viewCount: 68300,
    isHot: false,
    publishedAt: '2026-08-01T08:00:00.000Z',
    updatedAt: '2026-08-28T18:00:00.000Z'
  },
  {
    id: 'job-5',
    slug: 'bihar-police-constable-2026',
    title: 'CSBC Bihar Police Constable Recruitment 2026 — 21,391 Posts',
    shortDescription: 'Central Selection Board of Constable (CSBC), Bihar announces recruitment for 21,391 Constable vacancies in Bihar Police, Special Armed Police, and other units.',
    organization: 'Central Selection Board of Constable (CSBC Bihar)',
    organizationSlug: 'bpsc',
    recruitmentName: 'Bihar Police Constable Recruitment 2026',
    advertisementNumber: 'Advt. 01/2026',
    category: 'Police',
    state: 'Bihar',
    totalVacancy: '21,391',
    importantDates: [
      { label: 'Application Start Date', date: '20 June 2026' },
      { label: 'Application Last Date', date: '20 July 2026' },
      { label: 'Written Exam Date', date: '07, 11, 18, 25 August 2026' },
      { label: 'Physical Efficiency Test (PET)', date: 'November 2026', isTentative: true }
    ],
    applicationFees: [
      { category: 'General / EBC / BC / EWS / Other States', fee: '₹ 675/-' },
      { category: 'SC / ST / Bihar Female Candidates', fee: '₹ 180/-' }
    ],
    paymentMode: 'Net Banking, Credit/Debit Card, UPI',
    ageLimitMin: 18,
    ageLimitMax: 25,
    ageLimitAsOn: '01/08/2026',
    ageRelaxationRules: 'BC/EBC Male: Up to 27 Years, BC/EBC Female: Up to 28 Years, SC/ST: Up to 30 Years.',
    educationalQualification: 'Passed Intermediate (Class 10+2) examination from a recognized Board / Madrasa Board / Sanskrit Board on or before 01/08/2026.',
    postWiseVacancies: [
      { postName: 'Constable (District Police & Armed Force)', totalPosts: '21,391', eligibility: '12th Pass + Physical Standards: Height 165cm (General/BC), 160cm (SC/ST/EBC), All Female 155cm.' }
    ],
    selectionProcess: [
      'Written Examination (100 Marks Qualifying)',
      'Physical Efficiency Test (100 Marks Merit based on Running, Shot Put & High Jump)',
      'Medical Examination & Document Verification'
    ],
    requiredDocuments: [
      '10th & 12th Marksheet and Pass Certificates',
      'Residential / Domicile Certificate (Bihar)',
      'Caste Certificate / Non-Creamy Layer Certificate',
      'Recent Passport Photograph'
    ],
    howToApply: [
      'Visit csbc.bih.nic.in and select Bihar Police section.',
      'Click on Advt 01/2026 registration link.',
      'Pay application fee and complete application form.'
    ],
    importantInstructions: [
      'Final merit list is prepared strictly based on marks obtained in Physical Efficiency Test (Running 50 marks, Shot Put 25 marks, High Jump 25 marks).'
    ],
    importantLinks: [
      { label: 'Apply Online at CSBC Official Portal', url: 'https://csbc.bih.nic.in', linkType: 'APPLY', isOfficial: true, status: 200 },
      { label: 'Download Official Notification Advt 01/2026', url: 'https://csbc.bih.nic.in/Advt/Notice-01-2026.pdf', linkType: 'NOTIFICATION', isOfficial: true, status: 200 },
      { label: 'CSBC Bihar Official Website', url: 'https://csbc.bih.nic.in', linkType: 'OFFICIAL_WEBSITE', isOfficial: true, status: 200 }
    ],
    sourceUrl: 'https://csbc.bih.nic.in',
    sourceName: 'CSBC Bihar Official Release',
    status: 'PUBLISHED',
    verificationStatus: 'ADMIN_VERIFIED',
    seoTitle: 'Bihar Police Constable 2026: 21,391 Vacancy, Exam Date, CSBC Online Form & Syllabus',
    metaDescription: 'Bihar Police Constable recruitment 2026 for 21,391 posts. Check CSBC online application, PET physical standards, eligibility and exam pattern.',
    canonicalUrl: 'https://xsarkarijob.com/jobs/bihar-police-constable-2026',
    viewCount: 88400,
    isHot: true,
    publishedAt: '2026-06-20T10:00:00.000Z',
    updatedAt: '2026-08-30T16:00:00.000Z'
  },
  {
    id: 'job-6',
    slug: 'up-police-constable-2026',
    title: 'UP Police Constable Recruitment 2026 — 60,244 Posts',
    shortDescription: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) invites online applications for recruitment of 60,244 Civil Police Constable vacancies.',
    organization: 'UP Police Recruitment Board (UPPRPB)',
    organizationSlug: 'upprpb',
    recruitmentName: 'Civil Police Constable Direct Recruitment 2026',
    advertisementNumber: 'PRPB-01/2026',
    category: 'Police',
    state: 'Uttar Pradesh',
    totalVacancy: '60,244',
    importantDates: [
      { label: 'Notification Issued', date: '23 December 2025' },
      { label: 'Application Start', date: '27 December 2025' },
      { label: 'Last Date to Apply', date: '16 January 2026' },
      { label: 'Written Exam Date', date: '23, 24, 25, 30, 31 August 2026' },
      { label: 'Answer Key Release', date: 'September 2026' }
    ],
    applicationFees: [
      { category: 'All Categories (UR / OBC / SC / ST / EWS)', fee: '₹ 400/-' }
    ],
    paymentMode: 'Online Payment Gateway / E-Challan',
    ageLimitMin: 18,
    ageLimitMax: 25,
    ageLimitAsOn: '01/07/2026',
    ageRelaxationRules: 'Male UR: 18-25 Yrs (Includes 3-year special relaxation). Reserved categories get +5 Years.',
    educationalQualification: 'Passed 10+2 (Intermediate) examination from a recognized Board in India.',
    postWiseVacancies: [
      { postName: 'Constable Civil Police', totalPosts: '60,244', eligibility: '12th Pass. Male Height 168cm, Female Height 152cm.', categoryBreakup: { UR: '24,102', EWS: '6,024', OBC: '16,264', SC: '12,650', ST: '1,204' } }
    ],
    selectionProcess: [
      'Written Examination (300 Marks OMR Based)',
      'Document Verification & Physical Standard Test (PST)',
      'Physical Efficiency Test (PET - Running)',
      'Final Merit List'
    ],
    requiredDocuments: [
      'Class 10th and 12th marksheets',
      'Domicile Certificate of Uttar Pradesh',
      'OBC / SC / ST / EWS Certificate issued after prescribed cutoff date',
      'Photo and signature'
    ],
    howToApply: [
      'Log on to uppbpb.gov.in official web portal.',
      'Click on Direct Recruitment for Constable Civil Police 2026.',
      'Complete initial registration and generate Application Number.',
      'Upload DigiLocker verified documents or scanned copies.',
      'Pay examination fee and submit.'
    ],
    importantInstructions: [
      'The examination will have negative marking of 0.5 marks for every wrong answer.',
      'OMR sheets must be filled strictly with Black or Blue ballpoint pens.'
    ],
    importantLinks: [
      { label: 'Check UPPRPB Online Portal', url: 'https://uppbpb.gov.in', linkType: 'APPLY', isOfficial: true, status: 200 },
      { label: 'Download UP Police Constable 60,244 Advt PDF', url: 'https://uppbpb.gov.in/Static/Constable_Notice_2026.pdf', linkType: 'NOTIFICATION', isOfficial: true, status: 200 },
      { label: 'UP Police Official Website', url: 'https://uppbpb.gov.in', linkType: 'OFFICIAL_WEBSITE', isOfficial: true, status: 200 }
    ],
    sourceUrl: 'https://uppbpb.gov.in',
    sourceName: 'UPPRPB Official Notification',
    status: 'PUBLISHED',
    verificationStatus: 'ADMIN_VERIFIED',
    seoTitle: 'UP Police Constable 2026: 60,244 Vacancies, Re-Exam Date, OMR Sheet & Result',
    metaDescription: 'UP Police Constable 60,244 vacancies details. Check exam schedule, answer key link, PET running criteria, and official notice.',
    canonicalUrl: 'https://xsarkarijob.com/jobs/up-police-constable-2026',
    viewCount: 154000,
    isHot: true,
    publishedAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-09-03T18:00:00.000Z'
  }
];

export const initialResults: ResultItem[] = [
  {
    id: 'res-1',
    slug: 'ssc-chsl-tier-1-result-2026',
    title: 'SSC CHSL 10+2 Tier 1 Result 2026 Declared (Cutoff & Merit List PDF)',
    examName: 'Combined Higher Secondary (10+2) Level Tier 1 Exam 2026',
    organization: 'Staff Selection Commission (SSC)',
    organizationSlug: 'ssc',
    category: 'SSC',
    resultDate: '03 September 2026',
    examDate: '01 to 11 July 2026',
    resultStatus: 'Declared / Available Now',
    resultLink: 'https://ssc.gov.in/api/attachment/uploads/docms/CHSL_2026_Tier1_Result_List.pdf',
    scorecardLink: 'https://ssc.gov.in/portal/login',
    cutoffLink: 'https://ssc.gov.in/api/attachment/uploads/docms/CHSL_2026_Tier1_Cutoff_Writeup.pdf',
    meritListLink: 'https://ssc.gov.in/api/attachment/uploads/docms/CHSL_2026_Tier1_RollNumbers.pdf',
    officialNotificationUrl: 'https://ssc.gov.in/api/attachment/uploads/docms/CHSL_Result_Notice.pdf',
    officialWebsiteUrl: 'https://ssc.gov.in',
    sourceUrl: 'https://ssc.gov.in/notice-board',
    verificationStatus: 'ADMIN_VERIFIED',
    status: 'PUBLISHED',
    summary: 'Staff Selection Commission has released the result of Combined Higher Secondary (10+2) Level Examination (Tier-I), 2026. A total of 39,835 candidates have been shortlisted for appearing in Tier-II examination. Category-wise cutoff: UR 153.25, OBC 152.80, EWS 148.50, SC 136.40, ST 124.90.',
    publishedAt: '2026-09-03T17:00:00.000Z',
    updatedAt: '2026-09-03T18:30:00.000Z'
  },
  {
    id: 'res-2',
    slug: 'upsc-cse-prelims-2026',
    title: 'UPSC Civil Services Prelims Result 2026 with Name & Roll Number List',
    examName: 'Civil Services (Preliminary) Examination 2026',
    organization: 'Union Public Service Commission (UPSC)',
    organizationSlug: 'upsc',
    category: 'UPSC',
    resultDate: '01 July 2026',
    examDate: '25 May 2026',
    resultStatus: 'Declared',
    resultLink: 'https://upsc.gov.in/sites/default/files/WR-CSP-2026-NameList-Engl.pdf',
    scorecardLink: 'https://upsconline.nic.in/marksheet',
    cutoffLink: 'https://upsc.gov.in/sites/default/files/Cutoff-CSP-2026.pdf',
    meritListLink: 'https://upsc.gov.in/sites/default/files/WR-CSP-2026-RollList.pdf',
    officialNotificationUrl: 'https://upsc.gov.in/sites/default/files/PressNotice-CSP-2026.pdf',
    officialWebsiteUrl: 'https://upsc.gov.in',
    sourceUrl: 'https://upsc.gov.in',
    verificationStatus: 'ADMIN_VERIFIED',
    status: 'PUBLISHED',
    summary: 'UPSC has officially announced the list of candidates qualified for Civil Services (Main) Examination 2026. Candidates can download the complete name-wise and roll-number-wise PDF lists directly.',
    publishedAt: '2026-07-01T15:00:00.000Z',
    updatedAt: '2026-07-02T10:00:00.000Z'
  },
  {
    id: 'res-3',
    slug: 'rrb-alp-cbt-1-result-2026',
    title: 'RRB ALP Assistant Loco Pilot CBT 1 Result & Scorecard 2026',
    examName: 'Railway Assistant Loco Pilot (CEN 01/2026) CBT 1',
    organization: 'Railway Recruitment Control Board (RRB)',
    organizationSlug: 'rrb',
    category: 'Railway',
    resultDate: '28 August 2026',
    examDate: 'August 2026',
    resultStatus: 'Declared',
    resultLink: 'https://rrbcdg.gov.in/results/alp-cbt1-2026.pdf',
    scorecardLink: 'https://rrbapply.gov.in/#/auth/login',
    cutoffLink: 'https://rrbcdg.gov.in/results/alp-cbt1-cutoffs.pdf',
    officialNotificationUrl: 'https://rrbcdg.gov.in/uploads/ALP_CBT1_Result_Notice.pdf',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    sourceUrl: 'https://rrbcdg.gov.in',
    verificationStatus: 'ADMIN_VERIFIED',
    status: 'PUBLISHED',
    summary: 'Railway Recruitment Boards have uploaded the 1st Stage Computer Based Test (CBT-1) scorecard and normalized cutoffs for Assistant Loco Pilot posts. Shortlisted candidates will appear for CBT-2.',
    publishedAt: '2026-08-28T14:00:00.000Z',
    updatedAt: '2026-08-28T16:00:00.000Z'
  }
];

export const initialAdmitCards: AdmitCardItem[] = [
  {
    id: 'admit-1',
    slug: 'ssc-cgl-2026',
    title: 'SSC CGL Tier 1 Admit Card 2026 & Application Status (All Regions Active)',
    examName: 'Combined Graduate Level Tier 1 Examination 2026',
    organization: 'Staff Selection Commission (SSC)',
    organizationSlug: 'ssc',
    category: 'SSC',
    releaseDate: '01 September 2026',
    examDate: '09 to 26 September 2026',
    downloadLink: 'https://ssc.gov.in/login',
    examCityLink: 'https://ssc.gov.in/candidate-portal/exam-city-intimation',
    instructions: [
      'Carry printed copy of the Admit Card / Hall Ticket with clear photograph.',
      'Bring original valid Photo Identity Card (Aadhaar, Voter ID, Driving License, Passport) having complete date of birth matching the admit card.',
      'Two recent passport size color photographs (3cm x 3.5cm).',
      'Electronic gadgets, smartwatches, calculators, and bluetooth devices are strictly prohibited inside examination centers.'
    ],
    officialNotificationUrl: 'https://ssc.gov.in/api/attachment/uploads/docms/CGL_Tier1_Exam_Notice.pdf',
    officialWebsiteUrl: 'https://ssc.gov.in',
    sourceUrl: 'https://ssc.gov.in',
    verificationStatus: 'ADMIN_VERIFIED',
    status: 'PUBLISHED',
    publishedAt: '2026-09-01T11:00:00.000Z',
    updatedAt: '2026-09-04T09:00:00.000Z'
  },
  {
    id: 'admit-2',
    slug: 'rrb-ntpc-2026',
    title: 'RRB NTPC CEN 05/2026 Exam City Slip & SC/ST Travel Pass Download',
    examName: 'Railway NTPC CEN 05/2026 Computer Based Test 1',
    organization: 'Railway Recruitment Control Board (RRB)',
    organizationSlug: 'rrb',
    category: 'Railway',
    releaseDate: '04 September 2026',
    examDate: 'December 2026 / January 2027',
    downloadLink: 'https://rrbapply.gov.in/#/auth/login',
    examCityLink: 'https://rrbapply.gov.in/city-slip',
    instructions: [
      'Aadhaar linked biometric verification will be carried out at test centers.',
      'Free travel railway sleeper class pass is integrated for eligible SC/ST candidates.'
    ],
    officialNotificationUrl: 'https://rrbcdg.gov.in/uploads/NTPC_City_Slip_Schedule.pdf',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    sourceUrl: 'https://rrbcdg.gov.in',
    verificationStatus: 'ADMIN_VERIFIED',
    status: 'PUBLISHED',
    publishedAt: '2026-09-04T12:00:00.000Z',
    updatedAt: '2026-09-04T12:00:00.000Z'
  },
  {
    id: 'admit-3',
    slug: 'ibps-po-mains-2026',
    title: 'IBPS PO XIV Online Mains Exam Call Letter 2026 Out',
    examName: 'CRP PO/MT XIV Online Main Examination',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    organizationSlug: 'ibps',
    category: 'Banking',
    releaseDate: '15 November 2026',
    examDate: '30 November 2026',
    downloadLink: 'https://ibpsonline.ibps.in/crppo14aug26/cloma_nov26/login.php',
    instructions: [
      'Affix passport photograph firmly on the call letter in the designated box.',
      'Carry authenticated Preliminary Exam call letter along with Main Exam call letter.'
    ],
    officialNotificationUrl: 'https://ibps.in/uploads/PO_Mains_Call_Letter_Notice.pdf',
    officialWebsiteUrl: 'https://ibps.in',
    sourceUrl: 'https://ibps.in',
    verificationStatus: 'ADMIN_VERIFIED',
    status: 'PUBLISHED',
    publishedAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z'
  }
];

export const initialAnswerKeys: AnswerKeyItem[] = [
  {
    id: 'ak-1',
    slug: 'ssc-stenographer-grade-c-d-2026',
    title: 'SSC Stenographer Grade C & D Provisional Answer Key & Response Sheet 2026',
    examName: 'Stenographer Grade C and D Examination 2026',
    organization: 'Staff Selection Commission (SSC)',
    category: 'SSC',
    releaseDate: '02 September 2026',
    keyType: 'Provisional',
    objectionStartDate: '02 September 2026 (05:00 PM)',
    objectionEndDate: '06 September 2026 (05:00 PM)',
    answerKeyLink: 'https://ssc.gov.in/portal/login',
    responseSheetLink: 'https://ssc.gov.in/portal/login',
    officialWebsiteUrl: 'https://ssc.gov.in',
    sourceUrl: 'https://ssc.gov.in',
    verificationStatus: 'ADMIN_VERIFIED',
    status: 'PUBLISHED',
    publishedAt: '2026-09-02T16:00:00.000Z',
    updatedAt: '2026-09-02T16:00:00.000Z'
  },
  {
    id: 'ak-2',
    slug: 'bpsc-tre-4-teacher-answer-key-2026',
    title: 'BPSC School Teacher TRE 4.0 Provisional Answer Key (Classes 1-5, 6-8, 9-10, 11-12)',
    examName: 'Bihar School Teacher Competitive Examination (TRE 4.0)',
    organization: 'Bihar Public Service Commission (BPSC)',
    category: 'Teaching',
    releaseDate: '29 August 2026',
    keyType: 'Provisional',
    objectionStartDate: '30 August 2026',
    objectionEndDate: '05 September 2026',
    answerKeyLink: 'https://bpsc.bih.nic.in/AnswerKeys.htm',
    officialWebsiteUrl: 'https://bpsc.bih.nic.in',
    sourceUrl: 'https://bpsc.bih.nic.in',
    verificationStatus: 'ADMIN_VERIFIED',
    status: 'PUBLISHED',
    publishedAt: '2026-08-29T18:00:00.000Z',
    updatedAt: '2026-08-29T18:00:00.000Z'
  }
];

export const initialSyllabus: SyllabusItem[] = [
  {
    id: 'syl-1',
    slug: 'ssc-cgl-2026',
    title: 'SSC CGL Tier 1 & Tier 2 Detailed Syllabus, Topic-wise Weightage & Exam Pattern',
    examName: 'Combined Graduate Level Examination (CGL)',
    organization: 'Staff Selection Commission (SSC)',
    category: 'SSC',
    examPattern: [
      {
        tierOrStage: 'Tier-I (Computer Based Examination)',
        subjects: [
          { name: 'General Intelligence and Reasoning', questions: 25, marks: 50, durationMinutes: 60 },
          { name: 'General Awareness (Current Affairs, Polity, History, Science)', questions: 25, marks: 50 },
          { name: 'Quantitative Aptitude (Arithmetic, Advanced Math)', questions: 25, marks: 50 },
          { name: 'English Comprehension & Grammar', questions: 25, marks: 50 }
        ],
        totalQuestions: 100,
        totalMarks: 200,
        totalDurationMinutes: 60,
        negativeMarking: '0.50 marks deducted for each wrong response'
      },
      {
        tierOrStage: 'Tier-II (Paper-I Compulsory for all posts)',
        subjects: [
          { name: 'Section-I: Module-I Mathematical Abilities & Module-II Reasoning', questions: 60, marks: 180, durationMinutes: 60 },
          { name: 'Section-II: Module-I English Language & Module-II General Awareness', questions: 70, marks: 210, durationMinutes: 60 },
          { name: 'Section-III: Computer Knowledge Module (Qualifying)', questions: 20, marks: 60, durationMinutes: 15 }
        ],
        totalQuestions: 150,
        totalMarks: 450,
        totalDurationMinutes: 135,
        negativeMarking: '1 mark deducted for each wrong response in Section I, II and Module I of Section III'
      }
    ],
    detailedSyllabus: [
      {
        subject: 'General Intelligence and Reasoning',
        topics: ['Analogies', 'Similarities and Differences', 'Space Visualization', 'Spatial Orientation', 'Problem Solving', 'Analysis', 'Decision Making', 'Visual Memory', 'Discrimination', 'Coding and Decoding', 'Statement Conclusion', 'Syllogistic Reasoning']
      },
      {
        subject: 'Quantitative Aptitude',
        topics: ['Number Systems', 'Computation of Whole Numbers', 'Decimals and Fractions', 'Percentages', 'Ratio and Proportion', 'Square Roots', 'Averages', 'Interest (Simple & Compound)', 'Profit and Loss', 'Discount', 'Time and Distance', 'Time and Work', 'Basic Algebra', 'Geometry & Triangles', 'Trigonometry', 'Heights and Distances', 'Histogram & Pie-chart']
      },
      {
        subject: 'English Language',
        topics: ['Vocabulary', 'Grammar', 'Sentence Structure', 'Synonyms & Antonyms', 'Spotting the Error', 'Fill in the Blanks', 'Idioms & Phrases', 'One Word Substitution', 'Active & Passive Voice', 'Direct & Indirect Speech', 'Cloze Test', 'Comprehension Passage']
      },
      {
        subject: 'General Awareness',
        topics: ['History of India & Neighboring Countries', 'Culture', 'Geography', 'Economic Scene', 'General Policy & Indian Constitution', 'Scientific Research', 'Current National & International Affairs']
      }
    ],
    pdfDownloadUrl: 'https://ssc.gov.in/api/attachment/uploads/docms/CGL_Detailed_Syllabus.pdf',
    officialWebsiteUrl: 'https://ssc.gov.in',
    status: 'PUBLISHED',
    publishedAt: '2026-06-25T12:00:00.000Z',
    updatedAt: '2026-08-15T14:00:00.000Z'
  },
  {
    id: 'syl-2',
    slug: 'railway-rrb-ntpc-2026',
    title: 'RRB NTPC CBT 1 & CBT 2 Detailed Syllabus & Stage-wise Marking Scheme',
    examName: 'RRB Non-Technical Popular Categories (NTPC)',
    organization: 'Railway Recruitment Control Board (RRB)',
    category: 'Railway',
    examPattern: [
      {
        tierOrStage: '1st Stage Computer Based Test (CBT-1 Screening)',
        subjects: [
          { name: 'General Awareness', questions: 40, marks: 40, durationMinutes: 90 },
          { name: 'Mathematics', questions: 30, marks: 30 },
          { name: 'General Intelligence and Reasoning', questions: 30, marks: 30 }
        ],
        totalQuestions: 100,
        totalMarks: 100,
        totalDurationMinutes: 90,
        negativeMarking: '1/3rd marks deducted for each wrong answer'
      }
    ],
    detailedSyllabus: [
      {
        subject: 'Mathematics',
        topics: ['Number System', 'Decimals', 'Fractions', 'LCM & HCF', 'Ratio and Proportions', 'Percentage', 'Mensuration', 'Time and Work', 'Time and Distance', 'Simple and Compound Interest', 'Profit and Loss', 'Elementary Algebra', 'Geometry and Trigonometry', 'Elementary Statistics']
      },
      {
        subject: 'General Intelligence and Reasoning',
        topics: ['Analogies', 'Completion of Number and Alphabetical Series', 'Coding and Decoding', 'Mathematical Operations', 'Similarities and Differences', 'Relationships', 'Analytical Reasoning', 'Syllogism', 'Jumbling', 'Venn Diagrams', 'Puzzle', 'Data Sufficiency']
      }
    ],
    pdfDownloadUrl: 'https://rrbcdg.gov.in/uploads/NTPC_Syllabus_Official.pdf',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    status: 'PUBLISHED',
    publishedAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z'
  }
];

export const initialSources: Source[] = [
  {
    id: 'src-1',
    organization: 'Staff Selection Commission (SSC)',
    category: 'SSC',
    officialWebsite: 'https://ssc.gov.in',
    sourceUrl: 'https://ssc.gov.in/notice-board',
    frequency: '15m',
    isActive: true,
    lastChecked: '2026-09-05T17:45:00.000Z',
    status: 'HEALTHY',
    notes: 'Official notice board feed for CGL, CHSL, MTS, GD, Stenographer, and CPO notices.'
  },
  {
    id: 'src-2',
    organization: 'Union Public Service Commission (UPSC)',
    category: 'UPSC',
    officialWebsite: 'https://upsc.gov.in',
    sourceUrl: 'https://upsc.gov.in/whats-new',
    frequency: '1h',
    isActive: true,
    lastChecked: '2026-09-05T17:30:00.000Z',
    status: 'HEALTHY',
    notes: 'UPSC What\'s New portal for IAS, NDA, CDS, CMS, and IES updates.'
  },
  {
    id: 'src-3',
    organization: 'Railway Recruitment Control Board (RRB)',
    category: 'Railway',
    officialWebsite: 'https://rrbcdg.gov.in',
    sourceUrl: 'https://rrbcdg.gov.in',
    frequency: '1h',
    isActive: true,
    lastChecked: '2026-09-05T17:00:00.000Z',
    status: 'HEALTHY',
    notes: 'RRB Chandigarh Centralized Employment Notices for NTPC, Group D, ALP, and Technician.'
  },
  {
    id: 'src-4',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    category: 'Banking',
    officialWebsite: 'https://ibps.in',
    sourceUrl: 'https://ibps.in',
    frequency: '1h',
    isActive: true,
    lastChecked: '2026-09-05T16:30:00.000Z',
    status: 'HEALTHY',
    notes: 'IBPS notifications for PO, Clerk, SO, and RRB Officers.'
  },
  {
    id: 'src-5',
    organization: 'National Testing Agency (NTA)',
    category: 'Admission',
    officialWebsite: 'https://nta.ac.in',
    sourceUrl: 'https://nta.ac.in/NoticeArchive',
    frequency: '6h',
    isActive: true,
    lastChecked: '2026-09-05T12:00:00.000Z',
    status: 'HEALTHY',
    notes: 'CUET, NEET UG, JEE Main, UGC NET notices.'
  }
];

export const initialAIDrafts: AIDraft[] = [
  {
    id: 'aidraft-1',
    sourceId: 'src-1',
    sourceUrl: 'https://ssc.gov.in/api/attachment/uploads/docms/Notice_GD_2026.pdf',
    sourceTitle: 'Notice of Constable (GD) in Central Armed Police Forces (CAPFs), SSF and Rifleman (GD) in Assam Rifles Examination, 2026',
    organization: 'Staff Selection Commission (SSC)',
    category: 'Defence',
    extractedTitle: 'SSC GD Constable Recruitment 2026 — 39,481 Vacancies',
    extractedData: {
      title: 'SSC GD Constable Recruitment 2026 (BSF, CISF, CRPF, SSB, ITBP, AR, SSF) — 39,481 Posts',
      recruitmentName: 'Constable (GD) in CAPFs, SSF and Rifleman (GD) 2026',
      advertisementNumber: 'SSC-GD-CAPF-2026',
      category: 'Defence',
      totalVacancy: '39,481',
      educationalQualification: 'Passed Matriculation (Class 10th) from a recognized Board/University.',
      ageLimitMin: 18,
      ageLimitMax: 23,
      ageLimitAsOn: '01/01/2026',
      salaryPayScale: 'Pay Level-3 (₹ 21,700 - 69,100)',
      sourceUrl: 'https://ssc.gov.in/notice-board',
      sourceName: 'SSC Official Recruitment Notice',
      importantDates: [
        { label: 'Application Start', date: '05 September 2026' },
        { label: 'Application Last Date', date: '14 October 2026' },
        { label: 'Computer Based Exam (CBE)', date: 'January - February 2027', isTentative: true }
      ],
      applicationFees: [
        { category: 'General / OBC / EWS', fee: '₹ 100/-' },
        { category: 'SC / ST / Women / Ex-SM', fee: '₹ 0/-' }
      ],
      importantLinks: [
        { label: 'Apply Online on SSC OTR Portal', url: 'https://ssc.gov.in', linkType: 'APPLY', isOfficial: true },
        { label: 'Download Official Notice PDF', url: 'https://ssc.gov.in/api/attachment/uploads/docms/Notice_GD_2026.pdf', linkType: 'NOTIFICATION', isOfficial: true }
      ]
    },
    confidenceScore: 94,
    suspiciousFields: [],
    detectedChanges: ['New major vacancy notice detected on official portal', 'Exam date marked tentative (Jan-Feb 2027)'],
    status: 'NEEDS_REVIEW',
    createdAt: '2026-09-05T10:30:00.000Z'
  },
  {
    id: 'aidraft-2',
    sourceId: 'src-2',
    sourceUrl: 'https://upsc.gov.in/sites/default/files/Notice-CDS-II-2026.pdf',
    sourceTitle: 'Combined Defence Services Examination (II), 2026 Notice',
    organization: 'Union Public Service Commission (UPSC)',
    category: 'Defence',
    extractedTitle: 'UPSC CDS II 2026 Recruitment Online Form — 459 Posts',
    extractedData: {
      title: 'UPSC CDS II 2026 Examination (IMA, INA, AFA, OTA) — 459 Posts',
      recruitmentName: 'Combined Defence Services Examination (II) 2026',
      advertisementNumber: '11/2026-CDS-II',
      category: 'Defence',
      totalVacancy: '459',
      educationalQualification: 'Graduation Degree for IMA & OTA; Engineering Degree / 10+2 with Physics & Math for INA & AFA.',
      ageLimitMin: 19,
      ageLimitMax: 24,
      sourceUrl: 'https://upsc.gov.in',
      sourceName: 'UPSC Official Exam Notice'
    },
    confidenceScore: 88,
    suspiciousFields: ['ageLimitAsOn'],
    detectedChanges: ['OTA Female seats increased from 16 to 18'],
    status: 'NEEDS_REVIEW',
    createdAt: '2026-09-05T09:15:00.000Z'
  }
];

export const initialSiteSettings: SiteSettings = {
  siteName: 'X Sarkari Job',
  siteUrl: 'https://xsarkarijob.com',
  contactEmail: 'support@xsarkarijob.com',
  legalName: 'X Sarkari Job Media & Information Network',
  analyticsId: '',
  searchConsoleCode: '',
  footerText: '© 2026 X Sarkari Job. An independent educational & job information portal. Not affiliated with any government department.',
  socialLinks: {
    telegram: 'https://t.me/xsarkarijob',
    whatsapp: 'https://whatsapp.com/channel/xsarkarijob',
    twitter: 'https://x.com/xsarkarijob',
    youtube: 'https://youtube.com/@xsarkarijob'
  }
};

export const initialContactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Aakash Verma',
    email: 'aakash.v@example.com',
    subject: 'SSC CGL 2026 Application Form correction query',
    message: 'Hello, could you please confirm if the correction window charges apply to category change as well? Thanks for the helpful updates.',
    status: 'UNREAD',
    createdAt: '2026-09-05T11:20:00.000Z'
  }
];
