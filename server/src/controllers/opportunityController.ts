import { Request, Response } from 'express';
import { Opportunity } from '../models/Opportunity.js';
import { BusinessProfile } from '../models/BusinessProfile.js';
import { evaluateOpportunityMatch } from '../services/matchingService.js';

export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const { type, category, minScore, search } = req.query;

    let profile = await BusinessProfile.findOne();
    if (!profile) {
      profile = new BusinessProfile();
    }

    const filter: any = {};
    if (type && type !== 'all') {
      filter.type = type;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }

    const rawOpportunities = await Opportunity.find(filter);

    // Score each opportunity against current profile and add explainability
    let scored = rawOpportunities.map((opp) => evaluateOpportunityMatch(opp, profile));

    // Filter by search query if provided
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      scored = scored.filter(
        (item) =>
          item.opportunity.title.toLowerCase().includes(q) ||
          item.opportunity.description.toLowerCase().includes(q) ||
          item.opportunity.organization.toLowerCase().includes(q) ||
          item.opportunity.category.toLowerCase().includes(q) ||
          item.whyMatches.toLowerCase().includes(q)
      );
    }

    // Filter by minScore if provided
    if (minScore) {
      const min = parseInt(minScore as string, 10);
      if (!isNaN(min)) {
        scored = scored.filter((item) => item.matchScore >= min);
      }
    }

    // Sort by match score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return res.json(scored);
  } catch (err: any) {
    console.error('Error fetching opportunities:', err);
    return res.status(500).json({ error: err.message || 'Error fetching opportunities' });
  }
};

export const getOpportunityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const opp = await Opportunity.findById(id);
    if (!opp) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    let profile = await BusinessProfile.findOne();
    if (!profile) {
      profile = new BusinessProfile();
    }

    const matched = evaluateOpportunityMatch(opp, profile);
    return res.json(matched);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const expressInterest = async (req: Request, res: Response) => {
  try {
    const { opportunityId, proposalText, requestedVolume } = req.body;
    const opp = await Opportunity.findById(opportunityId);
    if (!opp) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    let profile = await BusinessProfile.findOne();

    return res.json({
      success: true,
      message: `Your expression of interest for "${opp.title}" has been registered!`,
      leadReference: `SETU-${Date.now().toString().slice(-6)}`,
      opportunityTitle: opp.title,
      organization: opp.organization,
      nextStep: `The procurement contact (${opp.organization}) will receive your verified UdyamSetu maker dossier. Expected response time: 2-3 business days.`,
      pipelineStatus: 'Proposal Submitted',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
