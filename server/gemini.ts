import { GoogleGenAI, Type } from "@google/genai";
import { Job } from "../src/types";

// Initialize the Google Gen AI client with telemetry User-Agent
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

export interface ExtractedJobResult {
  title: string;
  organization: string;
  recruitmentName: string;
  advertisementNumber: string;
  category: string;
  state: string;
  totalVacancy: string;
  educationalQualification: string;
  ageLimitMin?: number;
  ageLimitMax?: number;
  ageLimitAsOn?: string;
  salaryPayScale?: string;
  selectionProcess: string[];
  importantDates: { label: string; date: string }[];
  applicationFees: { category: string; fee: string }[];
  officialNotificationUrl?: string;
  applyUrl?: string;
  officialWebsiteUrl?: string;
  confidenceScore: number;
  suspiciousFields: string[];
  notes?: string;
}

export const geminiService = {
  /**
   * Extract structured job recruitment information from raw official notice text
   */
  async extractJobData(sourceText: string, sourceUrl: string): Promise<ExtractedJobResult> {
    const ai = getAiClient();
    
    // Fallback parser if API key is not yet set
    if (!ai) {
      console.warn("GEMINI_API_KEY not configured. Using rule-based fallback extraction.");
      return fallbackExtraction(sourceText, sourceUrl);
    }

    try {
      const prompt = `You are a high-accuracy government recruitment and examination data extraction engine for Indian exam portals (like SSC, UPSC, RRB, IBPS).
Extract structured recruitment data from the following official notice text:

Source URL: ${sourceUrl}

Notice Content:
${sourceText.slice(0, 15000)}

RULES:
1. NEVER hallucinate or invent numbers, vacancies, or dates.
2. If any field is not stated in the text, leave it empty or return standard values.
3. Identify potential inconsistencies (e.g. conflicting dates, missing eligibility).
4. Return pure structured JSON matching the provided schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Clear descriptive article title" },
              organization: { type: Type.STRING, description: "Official commission or department name" },
              recruitmentName: { type: Type.STRING, description: "Full exam / recruitment title" },
              advertisementNumber: { type: Type.STRING, description: "Official notice advertisement number" },
              category: { type: Type.STRING, description: "Category like SSC, UPSC, Railway, Banking, Police, Teaching, Defence" },
              state: { type: Type.STRING, description: "Indian State name or All India" },
              totalVacancy: { type: Type.STRING, description: "Exact number of posts or stated vacancy count" },
              educationalQualification: { type: Type.STRING, description: "Eligibility education requirements" },
              ageLimitMin: { type: Type.INTEGER, description: "Minimum age required" },
              ageLimitMax: { type: Type.INTEGER, description: "Maximum age allowed" },
              ageLimitAsOn: { type: Type.STRING, description: "Cutoff date for age calculation" },
              salaryPayScale: { type: Type.STRING, description: "Pay scale or Pay level" },
              selectionProcess: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Steps of selection (Written, Interview, Physical, etc.)"
              },
              importantDates: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    date: { type: Type.STRING }
                  },
                  required: ["label", "date"]
                }
              },
              applicationFees: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    fee: { type: Type.STRING }
                  },
                  required: ["category", "fee"]
                }
              },
              officialNotificationUrl: { type: Type.STRING },
              applyUrl: { type: Type.STRING },
              officialWebsiteUrl: { type: Type.STRING },
              confidenceScore: { type: Type.INTEGER, description: "Confidence score between 0 and 100" },
              suspiciousFields: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Any fields that lacked clarity or appeared inconsistent"
              },
              notes: { type: Type.STRING }
            },
            required: ["title", "organization", "recruitmentName", "category", "confidenceScore"]
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      return {
        title: parsed.title || "Government Recruitment Notice",
        organization: parsed.organization || "Recruitment Commission",
        recruitmentName: parsed.recruitmentName || parsed.title,
        advertisementNumber: parsed.advertisementNumber || "Not Specified",
        category: parsed.category || "Other Government Jobs",
        state: parsed.state || "All India",
        totalVacancy: parsed.totalVacancy || "Refer Notification",
        educationalQualification: parsed.educationalQualification || "Refer to Official Notification",
        ageLimitMin: parsed.ageLimitMin,
        ageLimitMax: parsed.ageLimitMax,
        ageLimitAsOn: parsed.ageLimitAsOn,
        salaryPayScale: parsed.salaryPayScale || "As per central/state govt pay scales",
        selectionProcess: parsed.selectionProcess || ["Written Test", "Document Verification"],
        importantDates: parsed.importantDates || [{ label: "Notification Date", date: "Check Official Notice" }],
        applicationFees: parsed.applicationFees || [{ category: "General/OBC", fee: "Refer Notification" }],
        officialNotificationUrl: parsed.officialNotificationUrl || sourceUrl,
        applyUrl: parsed.applyUrl,
        officialWebsiteUrl: parsed.officialWebsiteUrl,
        confidenceScore: parsed.confidenceScore || 85,
        suspiciousFields: parsed.suspiciousFields || [],
        notes: parsed.notes
      };
    } catch (error) {
      console.error("Gemini AI extraction error:", error);
      return fallbackExtraction(sourceText, sourceUrl);
    }
  },

  /**
   * Compare two versions of content to identify official updates and changed dates
   */
  async detectChanges(original: Partial<Job>, updatedNoticeText: string): Promise<string[]> {
    const ai = getAiClient();
    if (!ai) {
      return ["Source document updated — please review dates and links."];
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Compare this existing published job record with the newly published official notice text. Identify any critical updates:
Existing Record:
Title: ${original.title}
Dates: ${JSON.stringify(original.importantDates)}
Vacancy: ${original.totalVacancy}

New Notice Text:
${updatedNoticeText.slice(0, 8000)}

List all detected changes (such as extended last date, exam date announcement, vacancy revision, answer key release).
Return as a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      return JSON.parse(response.text?.trim() || "[]");
    } catch (e) {
      return ["Updated notice detected on official portal."];
    }
  },

  /**
   * Generate SEO Meta Title and Meta Description
   */
  async generateSEO(title: string, org: string, category: string): Promise<{ seoTitle: string; metaDescription: string }> {
    const ai = getAiClient();
    const defaultSeo = {
      seoTitle: `${title} - Apply Online, Dates & Eligibility | X Sarkari Job`,
      metaDescription: `Get complete details on ${title} by ${org}. Check eligibility criteria, vacancy details, important dates, exam fee, and direct apply link.`
    };

    if (!ai) return defaultSeo;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Create high-CTR, SEO-optimized title (under 60 chars) and meta description (130-155 chars) for this Indian government job:
Title: ${title}
Organization: ${org}
Category: ${category}
Do not use hyperbolic spam words like "Mindblowing". Keep it accurate, professional, and search-focused.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              seoTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING }
            },
            required: ["seoTitle", "metaDescription"]
          }
        }
      });
      return JSON.parse(response.text?.trim() || JSON.stringify(defaultSeo));
    } catch {
      return defaultSeo;
    }
  },

  /**
   * Check for duplicate notices against existing jobs in database
   */
  detectDuplicate(title: string, org: string, advtNo: string, existingJobs: Job[]): { isDuplicate: boolean; matchedJob?: Job; reason?: string } {
    const cleanAdvt = advtNo.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTitle = title.toLowerCase().trim();

    for (const job of existingJobs) {
      const jobAdvt = job.advertisementNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanAdvt && jobAdvt && cleanAdvt === jobAdvt && cleanAdvt !== 'notspecified') {
        return {
          isDuplicate: true,
          matchedJob: job,
          reason: `Exact advertisement number match: "${job.advertisementNumber}"`
        };
      }

      // Check organization & title similarity
      if (job.organization.toLowerCase() === org.toLowerCase()) {
        if (cleanTitle.includes(job.recruitmentName.toLowerCase()) || job.title.toLowerCase().includes(cleanTitle)) {
          return {
            isDuplicate: true,
            matchedJob: job,
            reason: `Highly similar title and matching organization.`
          };
        }
      }
    }

    return { isDuplicate: false };
  }
};

// Heuristic rule-based fallback when Gemini API key is missing or network fails
function fallbackExtraction(text: string, sourceUrl: string): ExtractedJobResult {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const title = lines[0] || 'Government Recruitment Notification';
  
  // Try to find vacancy numbers
  const vacancyMatch = text.match(/(\d{1,3}(?:,\d{3})+|\d{2,5})\s*(?:posts|vacancies|seats)/i);
  const vacancy = vacancyMatch ? vacancyMatch[1] : 'Refer Notification';

  return {
    title: title.length > 80 ? title.slice(0, 80) : title,
    organization: lines[1] || 'Official Recruitment Commission',
    recruitmentName: title,
    advertisementNumber: 'Notice-2026',
    category: 'Other Government Jobs',
    state: 'All India',
    totalVacancy: vacancy,
    educationalQualification: 'Class 10th / 12th / Graduation as specified in official notification',
    ageLimitMin: 18,
    ageLimitMax: 30,
    ageLimitAsOn: '01/08/2026',
    salaryPayScale: 'As per central / state government rules',
    selectionProcess: ['Written Examination', 'Skill / Physical Test', 'Document Verification'],
    importantDates: [
      { label: 'Application Start Date', date: 'Refer Official Notice' },
      { label: 'Last Date to Apply', date: 'Refer Official Notice' }
    ],
    applicationFees: [
      { category: 'General / OBC / EWS', fee: 'Refer Notification' },
      { category: 'SC / ST / Women', fee: 'Exempted / As per rules' }
    ],
    officialNotificationUrl: sourceUrl,
    officialWebsiteUrl: sourceUrl,
    confidenceScore: 78,
    suspiciousFields: ['educationalQualification', 'importantDates'],
    notes: 'Parsed using fallback engine. Please verify dates and details before publishing.'
  };
}
