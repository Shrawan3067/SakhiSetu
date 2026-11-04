export type Role = 'DONOR' | 'ADMIN';
export type Language = 'EN' | 'HI';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  preferredLanguage: Language;
  createdAt: string;
}

export interface Scheme {
  id: string;
  schemeCode: string;
  name: string;
  nameHi?: string | null;
  slug: string;
  category: string;
  need: string;
  description: string;
  descriptionHi?: string | null;
  benefit: string;
  benefitHi?: string | null;
  eligibilityRules: any;
  requiredDocuments: Array<{ name: string; nameHi?: string; required?: boolean }>;
  applicationSteps: Array<{ step: number; title: string; description: string }>;
  applicableDistricts: string[];
  officialSourceUrl: string;
  nearestHelpCentre?: any;
  lastCheckedAt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  aiReviews?: AIReview[];
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  imageUrl?: string | null;
  goalAmount: number;
  collectedAmount: number;
  progressPercentage: number;
  donorCount?: number;
  startDate: string;
  endDate?: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ARCHIVED';
}

export interface Receipt {
  id: string;
  donationId: string;
  receiptNumber: string;
  donorName: string;
  donorPAN: string;
  donationAmount: number;
  trustPAN: string;
  trust80GRegistrationNumber: string;
  financialYear: string;
  issuedAt: string;
}

export interface Donation {
  id: string;
  donorId?: string | null;
  campaignId: string;
  campaign?: { title: string; slug: string };
  amount: number;
  currency: string;
  donationType: 'ONE_TIME' | 'MONTHLY';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  idempotencyKey?: string | null;
  paymentReference?: string | null;
  paymentMethod?: string | null;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorPANMasked?: string;
  donorAddress: string;
  receipt?: Receipt | null;
  createdAt: string;
}

export interface AIReview {
  id: string;
  schemeId: string;
  scheme?: {
    id: string;
    schemeCode: string;
    name: string;
    nameHi?: string | null;
    slug?: string;
    category?: string;
    description?: string;
    benefit?: string;
  };
  generatedHindiSummary: string;
  generatedEnglishSummary: string;
  missingInformation?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: { id: string; fullName: string; email: string };
  reviewedAt?: string | null;
  createdAt: string;
}

export interface EligibilityResult {
  answers: any;
  eligibleSchemes: Array<{
    schemeId: string;
    schemeCode: string;
    name: string;
    nameHi: string | null;
    slug: string;
    category: string;
    need: string;
    benefit: string;
    benefitHi: string | null;
    officialSourceUrl: string;
    lastCheckedAt: string;
    isEligible: boolean;
    matchScore: number;
    matchingReasons: string[];
    satisfiedRequirements: string[];
    unmetRequirements: string[];
    requiredDocuments: any[];
  }>;
  potentialSchemes: any[];
  totalMatched: number;
  evaluatedCount: number;
  disclaimer: {
    en: string;
    hi: string;
  };
}

