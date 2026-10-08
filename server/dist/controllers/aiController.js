import { BusinessProfile } from '../models/BusinessProfile.js';
import { Opportunity } from '../models/Opportunity.js';
import { extractStructuredProfileFromText, generateB2BPitch, handleAdvisorChat, } from '../services/aiProvider.js';
export const handleAiChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message query is required' });
        }
        let profile = await BusinessProfile.findOne();
        if (!profile) {
            profile = new BusinessProfile();
        }
        const advisorResponse = handleAdvisorChat(message.trim(), profile);
        return res.json(advisorResponse);
    }
    catch (err) {
        console.error('AI Controller Chat Error:', err);
        return res.status(500).json({ error: err.message || 'Error generating AI response' });
    }
};
export const handleConvertProfile = async (req, res) => {
    try {
        const { textDescription } = req.body;
        if (!textDescription || !textDescription.trim()) {
            return res.status(400).json({ error: 'Natural language text description is required' });
        }
        const structured = extractStructuredProfileFromText(textDescription.trim());
        return res.json(structured);
    }
    catch (err) {
        console.error('AI Controller Convert Profile Error:', err);
        return res.status(500).json({ error: err.message || 'Error converting description into structured profile' });
    }
};
export const handleGeneratePitch = async (req, res) => {
    try {
        const { opportunityId } = req.body;
        let profile = await BusinessProfile.findOne();
        if (!profile) {
            profile = new BusinessProfile();
        }
        let opportunity;
        if (opportunityId) {
            opportunity = await Opportunity.findById(opportunityId);
        }
        if (!opportunity) {
            opportunity = await Opportunity.findOne();
        }
        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }
        const pitch = generateB2BPitch(opportunity, profile);
        return res.json(pitch);
    }
    catch (err) {
        console.error('AI Controller Generate Pitch Error:', err);
        return res.status(500).json({ error: err.message || 'Error generating B2B pitch' });
    }
};
