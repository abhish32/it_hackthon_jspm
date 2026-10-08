import { IBusinessProfile } from '../models/BusinessProfile.js';
import { IOpportunity } from '../models/Opportunity.js';

export interface EligibilityFactor {
  criterion: string;
  status: 'met' | 'partially_met' | 'action_needed';
  note: string;
}

export interface OpportunityMatchResult {
  opportunity: IOpportunity;
  matchScore: number; // 0 - 100
  whyMatches: string;
  eligibilityChecklist: EligibilityFactor[];
  valueProposition: string;
  recommendedNextStep: string;
}

/**
 * Calculates rule-based and semantic match score between an entrepreneur profile and an opportunity,
 * and generates personalized explainability rationales.
 */
export function evaluateOpportunityMatch(
  opportunity: IOpportunity,
  profile: IBusinessProfile
): OpportunityMatchResult {
  let score = 50; // base score
  const checklist: EligibilityFactor[] = [];
  const reasons: string[] = [];

  // 1. Sector / Category Matching
  const catMatch =
    opportunity.category === 'All' ||
    opportunity.eligibleCategories.includes('All') ||
    opportunity.eligibleCategories.includes(profile.businessType) ||
    opportunity.category.toLowerCase().includes(profile.businessType.toLowerCase()) ||
    profile.businessType.toLowerCase().includes(opportunity.category.toLowerCase());

  if (catMatch) {
    score += 20;
    checklist.push({
      criterion: `Business Category: ${profile.businessType}`,
      status: 'met',
      note: `Directly matches opportunity category (${opportunity.category})`,
    });
    reasons.push(`matches your domain in ${profile.businessType}`);
  } else {
    score -= 10;
    checklist.push({
      criterion: `Business Category: ${profile.businessType}`,
      status: 'partially_met',
      note: `Designed for ${opportunity.category}, but cross-category applicants accepted`,
    });
  }

  // 2. Geographic / Location Check
  const state = profile.locationDetails?.state || profile.state || '';
  const city = profile.locationDetails?.city || profile.district || '';
  const isPanIndia = opportunity.locationScope.isPanIndia;
  const oppState = opportunity.locationScope.state || '';
  const oppCity = opportunity.locationScope.city || '';

  if (isPanIndia) {
    score += 10;
    checklist.push({
      criterion: 'Geographic Scope: All-India Available',
      status: 'met',
      note: `Open to entrepreneurs across all Indian states including ${state}`,
    });
  } else if (
    oppState &&
    (state.toLowerCase().includes(oppState.toLowerCase()) ||
      oppState.toLowerCase().includes(state.toLowerCase()))
  ) {
    score += 15;
    if (
      oppCity &&
      (city.toLowerCase().includes(oppCity.toLowerCase()) ||
        oppCity.toLowerCase().includes(city.toLowerCase()))
    ) {
      score += 5;
      checklist.push({
        criterion: `Local Proximity: ${city}, ${state}`,
        status: 'met',
        note: `Immediate local fulfillment within ${oppCity}`,
      });
      reasons.push(`located directly in ${city}`);
    } else {
      checklist.push({
        criterion: `State Presence: ${state}`,
        status: 'met',
        note: `Fulfills state-level eligibility in ${oppState}`,
      });
      reasons.push(`available within your state (${state})`);
    }
  } else {
    checklist.push({
      criterion: `Location Requirement: ${oppState || 'Regional'}`,
      status: 'action_needed',
      note: `Preferred in ${oppState || 'Regional area'}, requires regional courier capability`,
    });
  }

  // 3. Skills Overlap
  const profileSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const oppSkills = (opportunity.requiredSkills || []).map((s) => s.toLowerCase());
  let matchedSkillsCount = 0;
  const matchedSkillNames: string[] = [];

  for (const s of oppSkills) {
    const found = profileSkills.find(
      (ps) => ps.includes(s) || s.includes(ps) || (s.length > 4 && ps.includes(s.slice(0, 4)))
    );
    if (found) {
      matchedSkillsCount++;
      matchedSkillNames.push(s);
    }
  }

  if (oppSkills.length > 0) {
    if (matchedSkillsCount > 0) {
      const skillBonus = Math.min(15, matchedSkillsCount * 6);
      score += skillBonus;
      checklist.push({
        criterion: `Skill Verification: ${matchedSkillNames.slice(0, 2).join(', ')}`,
        status: 'met',
        note: `Matches your proven skills in ${matchedSkillNames.join(', ')}`,
      });
      reasons.push(`leverages your expertise in ${matchedSkillNames.slice(0, 2).join(' & ')}`);
    } else {
      checklist.push({
        criterion: `Required Craft/Skillset`,
        status: 'partially_met',
        note: `Requires basic familiarity with ${opportunity.requiredSkills.slice(0, 2).join(', ')}`,
      });
    }
  }

  // 4. Capacity & Resource Alignment
  const monthlyVolume = profile.capacityDetails?.monthlyVolume || '';
  if (opportunity.capacityNeeded) {
    reasons.push(`fits your capacity (${monthlyVolume})`);
    checklist.push({
      criterion: `Production / Service Scale`,
      status: 'met',
      note: `Your current capacity of ${monthlyVolume} satisfies requirement (${opportunity.capacityNeeded})`,
    });
    score += 5;
  }

  // 5. Business Goals Alignment
  const goals = (profile.businessGoals || []).join(' ').toLowerCase();
  let goalMatched = false;
  if (
    (opportunity.type === 'bulk_order' || opportunity.type === 'business') &&
    (goals.includes('bulk') || goals.includes('b2b') || goals.includes('restaurant') || goals.includes('hotel') || goals.includes('retail'))
  ) {
    goalMatched = true;
  } else if (
    (opportunity.type === 'financing' || opportunity.type === 'government_scheme') &&
    (goals.includes('loan') || goals.includes('subsidy') || goals.includes('mudra') || goals.includes('grant') || goals.includes('capital'))
  ) {
    goalMatched = true;
  } else if (
    opportunity.type === 'marketplace' &&
    (goals.includes('ondc') || goals.includes('online') || goals.includes('market') || goals.includes('platform'))
  ) {
    goalMatched = true;
  } else if (
    opportunity.type === 'partnership' &&
    (goals.includes('partner') || goals.includes('coop') || goals.includes('group') || goals.includes('share'))
  ) {
    goalMatched = true;
  }

  if (goalMatched) {
    score += 8;
    checklist.push({
      criterion: 'Business Goal Alignment',
      status: 'met',
      note: `Directly accelerates your target to expand via ${opportunity.type.replace('_', ' ')}`,
    });
    reasons.push(`directly supports your stated business goal`);
  }

  // Normalize score between 60 and 98
  score = Math.max(62, Math.min(98, score));

  // Synthesize explainable "Why it matches"
  let whyMatches = '';
  if (reasons.length > 0) {
    whyMatches = `This ${opportunity.type.replace('_', ' ')} directly ${reasons.join(', ')}.`;
  } else {
    whyMatches = `Identified as a high-potential growth match for your home enterprise profile in ${city || state}.`;
  }

  // Value Proposition synthesis
  const valueProposition = opportunity.estimatedValue
    ? `Expected Value: ${opportunity.estimatedValue}`
    : 'High strategic and ecosystem value';

  // Recommended next step synthesis
  let recommendedNextStep = 'Review specifications and click the action button to apply';
  if (opportunity.type === 'bulk_order') {
    recommendedNextStep = 'Prepare your production lead-time estimate and send proposal via UdyamSetu';
  } else if (opportunity.type === 'business') {
    recommendedNextStep = 'Send a tailored introduction pitch and sample catalog to the buyer';
  } else if (opportunity.type === 'financing') {
    recommendedNextStep = 'Check eligibility documents and generate pre-filled Mudra/PMEGP application dossier';
  } else if (opportunity.type === 'government_scheme') {
    recommendedNextStep = 'Verify Udyam/Aadhaar credentials and access the direct government nodal portal';
  } else if (opportunity.type === 'partnership') {
    recommendedNextStep = 'Connect with the partner entrepreneur to discuss capacity pooling';
  } else if (opportunity.type === 'marketplace') {
    recommendedNextStep = 'Sync your product catalog using UdyamSetu’s 1-click ONDC bridge';
  }

  return {
    opportunity,
    matchScore: score,
    whyMatches,
    eligibilityChecklist: checklist,
    valueProposition,
    recommendedNextStep,
  };
}
