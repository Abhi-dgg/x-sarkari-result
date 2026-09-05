export type ContentStatus = 
  | 'DRAFT' 
  | 'AI_GENERATED' 
  | 'NEEDS_REVIEW' 
  | 'VERIFIED' 
  | 'PUBLISHED' 
  | 'SCHEDULED' 
  | 'ARCHIVED' 
  | 'REJECTED';

export type VerificationStatus = 
  | 'UNVERIFIED' 
  | 'AI_VERIFIED' 
  | 'ADMIN_VERIFIED' 
  | 'PUBLISHED';

export type UserRole = 'SUPER_ADMIN' | 'EDITOR' | 'REVIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ImportantDateItem {
  label: string;
  date: string;
  isTentative?: boolean;
}

export interface ApplicationFeeItem {
  category: string;
  fee: string;
}

export interface VacancyDetail {
  postName: string;
  totalPosts: number | string;
  eligibility: string;
  ageLimit?: string;
  categoryBreakup?: Record<string, number | string>;
}

export interface ImportantLinkItem {
  label: string;
  url: string;
  linkType?: 'APPLY' | 'NOTIFICATION' | 'OFFICIAL_WEBSITE' | 'ADMIT_CARD' | 'RESULT' | 'ANSWER_KEY' | 'SYLLABUS' | 'CORRECTION' | 'OTHER';
  isOfficial: boolean;
  status?: number; // 200, 404, etc.
  lastChecked?: string;
}

export type ImportantLink = ImportantLinkItem;

export interface Job {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  organization: string;
  organizationSlug: string;
  recruitmentName: string;
  advertisementNumber: string;
  category: string;
  state: string;
  totalVacancy: number | string;
  importantDates: ImportantDateItem[];
  applicationFees: ApplicationFeeItem[];
  paymentMode: string;
  ageLimitMin?: number;
  ageLimitMax?: number;
  ageLimitAsOn?: string;
  ageRelaxationRules?: string;
  educationalQualification: string;
  postWiseVacancies: VacancyDetail[];
  selectionProcess: string[];
  examPattern?: string;
  syllabusOverview?: string;
  salaryPayScale?: string;
  requiredDocuments?: string[];
  howToApply?: string[];
  importantInstructions?: string[];
  importantLinks: ImportantLinkItem[];
  sourceUrl: string;
  sourceName: string;
  status: ContentStatus;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedDate?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  viewCount: number;
  isHot?: boolean;
  isPinned?: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface ResultItem {
  id: string;
  slug: string;
  title: string;
  examName: string;
  organization: string;
  organizationSlug: string;
  category: string;
  resultDate: string;
  examDate: string;
  resultStatus: string;
  resultLink: string;
  scorecardLink?: string;
  cutoffLink?: string;
  meritListLink?: string;
  officialNotificationUrl: string;
  officialWebsiteUrl: string;
  sourceUrl: string;
  importantLinks?: ImportantLink[];
  verificationStatus: VerificationStatus;
  status: ContentStatus;
  summary: string;
  publishedAt: string;
  updatedAt: string;
}

export interface AdmitCardItem {
  id: string;
  slug: string;
  title: string;
  examName: string;
  organization: string;
  organizationSlug: string;
  category: string;
  releaseDate: string;
  examDate: string;
  downloadLink: string;
  examCityLink?: string;
  instructions: string[];
  officialNotificationUrl: string;
  officialWebsiteUrl: string;
  sourceUrl: string;
  importantLinks?: ImportantLink[];
  verificationStatus: VerificationStatus;
  status: ContentStatus;
  publishedAt: string;
  updatedAt: string;
}

export interface AnswerKeyItem {
  id: string;
  slug: string;
  title: string;
  examName: string;
  organization: string;
  category: string;
  releaseDate: string;
  keyType: 'Provisional' | 'Final';
  objectionStartDate?: string;
  objectionEndDate?: string;
  answerKeyLink: string;
  responseSheetLink?: string;
  officialWebsiteUrl: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  status: ContentStatus;
  publishedAt: string;
  updatedAt: string;
}

export interface SyllabusItem {
  id: string;
  slug: string;
  title: string;
  examName: string;
  organization: string;
  category: string;
  examPattern: {
    tierOrStage: string;
    subjects: { name: string; questions: number; marks: number; durationMinutes?: number }[];
    totalQuestions: number;
    totalMarks: number;
    totalDurationMinutes: number;
    negativeMarking: string;
  }[];
  detailedSyllabus: { subject: string; topics: string[] }[];
  pdfDownloadUrl?: string;
  officialWebsiteUrl: string;
  status: ContentStatus;
  publishedAt: string;
  updatedAt: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: string;
  link: string;
  isBreaking?: boolean;
  priority: 'normal' | 'important' | 'breaking';
  date: string;
  status: 'PUBLISHED' | 'DRAFT';
}

export interface Source {
  id: string;
  organization: string;
  category: string;
  officialWebsite: string;
  sourceUrl: string;
  frequency: '15m' | '1h' | '6h' | 'daily';
  isActive: boolean;
  lastChecked?: string;
  status: 'HEALTHY' | 'ERROR' | 'CHANGED_DETECTED' | 'CHECKING';
  notes?: string;
}

export interface FactCheckReport {
  query: string;
  verificationStatus: 'OFFICIALLY_VERIFIED' | 'APPLICATION_ACTIVE' | 'ADMIT_CARD_RELEASED' | 'RESULT_DECLARED' | 'EXAM_SCHEDULED' | 'FAKE_NOTICE_DEBUNKED' | 'TENTATIVE';
  resultBharatVerified?: boolean;
  resultBharatStatus?: string;
  resultBharatUrl?: string;
  verdictHeadline: string;
  hindiSummary: string;
  englishSummary: string;
  officialGovernmentSource: string;
  educationalReferences: string[]; // e.g. Testbook, PhysicsWallah (PW), Adda247
  pibFactCheckStatus: string; // Official PIB / Commission bulletin status
  keyFacts: {
    organization: string;
    totalVacancies: string;
    applicationWindow: string;
    examDate: string;
    eligibility: string;
    admitCardStatus: string;
    resultStatus: string;
  };
  directLinks: { label: string; url: string; isOfficial: boolean }[];
  groundingSources: { title: string; url: string }[];
  confidenceScore: number;
  lastCheckedAt: string;
}

export interface AIDraft {
  id: string;
  sourceId: string;
  sourceUrl: string;
  sourceTitle: string;
  organization: string;
  category: string;
  extractedTitle: string;
  extractedData: Partial<Job>;
  confidenceScore: number;
  suspiciousFields: string[];
  detectedChanges?: string[];
  status: 'NEEDS_REVIEW' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  pibVerified?: boolean;
  educationalReferences?: string[];
  factCheckVerdict?: string;
  createdAt: string;
  reviewedBy?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export interface NotificationSubscriber {
  id: string;
  email: string;
  categories: string[];
  createdAt: string;
  isActive: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  legalName: string;
  analyticsId?: string;
  searchConsoleCode?: string;
  footerText: string;
  socialLinks: {
    telegram?: string;
    whatsapp?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface Revision {
  id: string;
  entityType: 'JOB' | 'RESULT' | 'ADMIT_CARD';
  entityId: string;
  changedFields: string[];
  changedBy: string;
  reason: string;
  timestamp: string;
}
