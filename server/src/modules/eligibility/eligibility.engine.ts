export interface UserProfileAnswers {
  district: string;
  age: number;
  occupation: string;
  maritalStatus: 'unmarried' | 'married' | 'widowed' | 'divorced';
  isSHGMember: boolean;
  hasBPLCard: boolean;
  isPregnantOrNewMother?: boolean;
}

export interface SchemeRuleDefinition {
  minAge?: number;
  maxAge?: number;
  maritalStatus?: string[];
  requiresBPL?: boolean;
  requiresSHG?: boolean;
  requiresPregnantOrNewMother?: boolean;
  allowedOccupations?: string[];
  notes?: string;
}

export interface SchemeMatchResult {
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
  lastCheckedAt: Date;
  isEligible: boolean;
  matchScore: number;
  matchingReasons: string[];
  satisfiedRequirements: string[];
  unmetRequirements: string[];
  requiredDocuments: any[];
}

export class DeterministicEligibilityEngine {
  evaluate(scheme: any, user: UserProfileAnswers): SchemeMatchResult {
    const rules: SchemeRuleDefinition = (scheme.eligibilityRules as SchemeRuleDefinition) || {};
    const satisfiedRequirements: string[] = [];
    const unmetRequirements: string[] = [];
    const matchingReasons: string[] = [];

    let totalCriteria = 0;
    let satisfiedCriteria = 0;

    // 1. District check
    const districts: string[] = Array.isArray(scheme.applicableDistricts)
      ? (scheme.applicableDistricts as string[])
      : [];
    if (districts.length > 0) {
      totalCriteria++;
      const isDistrictMatched = districts.some(
        (d) => d.toLowerCase() === user.district.toLowerCase()
      );
      if (isDistrictMatched) {
        satisfiedCriteria++;
        satisfiedRequirements.push(`Resident of eligible district: ${user.district}`);
      } else {
        unmetRequirements.push(`Scheme currently active in: ${districts.slice(0, 3).join(', ')}... (not ${user.district})`);
      }
    }

    // 2. Age criteria
    if (rules.minAge !== undefined || rules.maxAge !== undefined) {
      totalCriteria++;
      const min = rules.minAge ?? 0;
      const max = rules.maxAge ?? 120;
      if (user.age >= min && user.age <= max) {
        satisfiedCriteria++;
        satisfiedRequirements.push(`Age ${user.age} falls within the eligible range of ${min}-${max} years`);
        matchingReasons.push(`Age eligibility verified (${user.age} yrs)`);
      } else {
        unmetRequirements.push(`Age must be between ${min} and ${max} years (Applicant age: ${user.age})`);
      }
    }

    // 3. Marital status criteria
    if (rules.maritalStatus && !rules.maritalStatus.includes('all')) {
      totalCriteria++;
      const normalizedAllowed = rules.maritalStatus.map((s) => s.toLowerCase());
      if (normalizedAllowed.includes(user.maritalStatus.toLowerCase())) {
        satisfiedCriteria++;
        const statusLabel = user.maritalStatus === 'widowed' ? 'Widow' : user.maritalStatus;
        satisfiedRequirements.push(`Marital status qualifies: ${statusLabel}`);
        matchingReasons.push(`Eligible marital status (${statusLabel})`);
      } else {
        unmetRequirements.push(`Requires marital status to be: ${rules.maritalStatus.join(' or ')}`);
      }
    }

    // 4. BPL Card criteria
    if (rules.requiresBPL !== undefined) {
      totalCriteria++;
      if (rules.requiresBPL) {
        if (user.hasBPLCard) {
          satisfiedCriteria++;
          satisfiedRequirements.push('Valid BPL / Antyodaya ration card requirement satisfied');
          matchingReasons.push('BPL status confirmed');
        } else {
          unmetRequirements.push('Requires Below Poverty Line (BPL) card or Antyodaya status');
        }
      } else {
        satisfiedCriteria++;
        satisfiedRequirements.push('No BPL card strictly mandated');
      }
    }

    // 5. SHG Membership criteria
    if (rules.requiresSHG !== undefined) {
      totalCriteria++;
      if (rules.requiresSHG) {
        if (user.isSHGMember) {
          satisfiedCriteria++;
          satisfiedRequirements.push('Active membership in registered Self-Help Group (SHG) verified');
          matchingReasons.push('Active SHG member');
        } else {
          unmetRequirements.push('Requires membership in a registered Self-Help Group (SHG)');
        }
      } else {
        satisfiedCriteria++;
        satisfiedRequirements.push('Open to SHG and non-SHG individuals');
      }
    }

    // 6. Pregnancy / Maternity criteria
    if (rules.requiresPregnantOrNewMother) {
      totalCriteria++;
      if (user.isPregnantOrNewMother) {
        satisfiedCriteria++;
        satisfiedRequirements.push('Expectant mother / nursing first child condition satisfied');
        matchingReasons.push('Maternity qualification met');
      } else {
        unmetRequirements.push('Applicable for pregnant women or lactating mothers with first child');
      }
    }

    // 7. Occupation criteria
    if (rules.allowedOccupations && !rules.allowedOccupations.includes('all')) {
      totalCriteria++;
      const userOcc = user.occupation.toLowerCase();
      const isOccAllowed = rules.allowedOccupations.some((o) => o.toLowerCase() === userOcc);
      if (isOccAllowed) {
        satisfiedCriteria++;
        satisfiedRequirements.push(`Occupation (${user.occupation}) is eligible`);
      } else {
        unmetRequirements.push(`Scheme targets occupations: ${rules.allowedOccupations.join(', ')}`);
      }
    }

    const matchScore = totalCriteria > 0 ? Math.round((satisfiedCriteria / totalCriteria) * 100) : 100;
    const isEligible = unmetRequirements.length === 0;

    return {
      schemeId: scheme.id,
      schemeCode: scheme.schemeCode,
      name: scheme.name,
      nameHi: scheme.nameHi,
      slug: scheme.slug,
      category: scheme.category,
      need: scheme.need,
      benefit: scheme.benefit,
      benefitHi: scheme.benefitHi,
      officialSourceUrl: scheme.officialSourceUrl,
      lastCheckedAt: scheme.lastCheckedAt,
      isEligible,
      matchScore,
      matchingReasons,
      satisfiedRequirements,
      unmetRequirements,
      requiredDocuments: (scheme.requiredDocuments as any[]) || [],
    };
  }
}

export const eligibilityEngine = new DeterministicEligibilityEngine();
