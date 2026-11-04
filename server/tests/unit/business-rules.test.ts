import { describe, it, expect } from 'vitest';
import { DeterministicEligibilityEngine, UserProfileAnswers } from '../../src/modules/eligibility/eligibility.engine.js';
import { getFinancialYear } from '../../src/utils/financial-year.js';
import { maskPAN } from '../../src/utils/logger.js';
import { amountInWords } from '../../src/utils/number-to-words.js';
import { aiSummaryResponseSchema } from '../../src/modules/ai/ai.prompts.js';
import { PAN_REGEX } from '../../src/modules/donations/donation.validator.js';

describe('Unit Tests: Core Business Logic', () => {
  const engine = new DeterministicEligibilityEngine();

  describe('Eligibility Evaluation Engine', () => {
    const widowScheme = {
      id: 'sch-1',
      schemeCode: 'SCH-014',
      name: 'State Widow Pension',
      nameHi: 'राज्य विधवा पेंशन योजना',
      slug: 'state-widow-pension',
      category: 'Social Security',
      need: 'Pension',
      benefit: '₹600 per month',
      benefitHi: '₹600 प्रति माह',
      applicableDistricts: ['Bhopal', 'Sehore', 'Raisen'],
      eligibilityRules: {
        minAge: 18,
        maxAge: 79,
        maritalStatus: ['widowed'],
        requiresBPL: true,
        requiresSHG: false,
      },
      requiredDocuments: [{ name: 'Husband Death Certificate' }],
      officialSourceUrl: 'https://socialjustice.mp.gov.in',
      lastCheckedAt: new Date(),
    };

    it('matches eligible widowed woman with BPL card in Bhopal', () => {
      const user: UserProfileAnswers = {
        district: 'Bhopal',
        age: 45,
        occupation: 'Homemaker',
        maritalStatus: 'widowed',
        isSHGMember: false,
        hasBPLCard: true,
      };

      const result = engine.evaluate(widowScheme, user);
      expect(result.isEligible).toBe(true);
      expect(result.matchScore).toBe(100);
      expect(result.unmetRequirements).toHaveLength(0);
      expect(result.satisfiedRequirements.some((r) => r.includes('widowed') || r.includes('Widow'))).toBe(true);
    });

    it('rejects applicant who is married when scheme requires widowed', () => {
      const user: UserProfileAnswers = {
        district: 'Bhopal',
        age: 35,
        occupation: 'Homemaker',
        maritalStatus: 'married',
        isSHGMember: false,
        hasBPLCard: true,
      };

      const result = engine.evaluate(widowScheme, user);
      expect(result.isEligible).toBe(false);
      expect(result.unmetRequirements.some((u) => u.includes('marital status'))).toBe(true);
    });

    it('rejects applicant who lacks required BPL card', () => {
      const user: UserProfileAnswers = {
        district: 'Bhopal',
        age: 50,
        occupation: 'Homemaker',
        maritalStatus: 'widowed',
        isSHGMember: false,
        hasBPLCard: false,
      };

      const result = engine.evaluate(widowScheme, user);
      expect(result.isEligible).toBe(false);
      expect(result.unmetRequirements.some((u) => u.includes('BPL'))).toBe(true);
    });

    it('rejects applicant whose district is outside applicable districts', () => {
      const user: UserProfileAnswers = {
        district: 'Indore', // Indore not in [Bhopal, Sehore, Raisen]
        age: 45,
        occupation: 'Homemaker',
        maritalStatus: 'widowed',
        isSHGMember: false,
        hasBPLCard: true,
      };

      const result = engine.evaluate(widowScheme, user);
      expect(result.isEligible).toBe(false);
      expect(result.unmetRequirements.some((u) => u.includes('currently active in'))).toBe(true);
    });
  });

  describe('Indian Financial Year Calculation', () => {
    it('calculates FY 2026-27 for November 2026', () => {
      const date = new Date(2026, 10, 4); // Month 10 is Nov
      expect(getFinancialYear(date)).toBe('2026-27');
    });

    it('calculates FY 2026-27 for April 1, 2026', () => {
      const date = new Date(2026, 3, 1); // Month 3 is Apr
      expect(getFinancialYear(date)).toBe('2026-27');
    });

    it('calculates FY 2026-27 for March 31, 2027', () => {
      const date = new Date(2027, 2, 31); // Month 2 is Mar
      expect(getFinancialYear(date)).toBe('2026-27');
    });

    it('calculates FY 2027-28 for April 1, 2027', () => {
      const date = new Date(2027, 3, 1);
      expect(getFinancialYear(date)).toBe('2027-28');
    });
  });

  describe('PAN Validation & Masking', () => {
    it('validates correct 10-character Indian PAN format', () => {
      expect(PAN_REGEX.test('ABCDE1234F')).toBe(true);
      expect(PAN_REGEX.test('BKZPP4589K')).toBe(true);
    });

    it('rejects invalid PAN formats', () => {
      expect(PAN_REGEX.test('12345ABCDE')).toBe(false);
      expect(PAN_REGEX.test('ABC12345')).toBe(false);
      expect(PAN_REGEX.test('ABCDE12345')).toBe(false);
      expect(PAN_REGEX.test('ABCDE12345F')).toBe(false);
    });

    it('masks middle characters of PAN for privacy compliance', () => {
      expect(maskPAN('ABCDE1234F')).toBe('AB******4F');
      expect(maskPAN('BKZPP4589K')).toBe('BK******9K');
    });
  });

  describe('Indian Currency Number-To-Words', () => {
    it('converts exact amounts to words in Indian numbering system', () => {
      expect(amountInWords(500)).toBe('Rupees Five Hundred Only');
      expect(amountInWords(1000)).toBe('Rupees One Thousand Only');
      expect(amountInWords(2500)).toBe('Rupees Two Thousand Five Hundred Only');
      expect(amountInWords(5000)).toBe('Rupees Five Thousand Only');
      expect(amountInWords(300000)).toBe('Rupees Three Lakh Only');
    });
  });

  describe('AI Summary Structured Response Validation', () => {
    it('validates compliant AI JSON output', () => {
      const validAiOutput = {
        hindiSummary: 'यह योजना मध्य प्रदेश की पात्र महिलाओं के लिए है।',
        englishSummary: 'This scheme provides livelihood support to rural women in MP.',
        missingInformation: [],
        sourceBased: true,
      };

      const parsed = aiSummaryResponseSchema.safeParse(validAiOutput);
      expect(parsed.success).toBe(true);
    });

    it('fails when summary is too short or missing required fields', () => {
      const invalidAiOutput = {
        hindiSummary: 'Short',
        englishSummary: 'Too short',
      };

      const parsed = aiSummaryResponseSchema.safeParse(invalidAiOutput);
      expect(parsed.success).toBe(false);
    });
  });
});

