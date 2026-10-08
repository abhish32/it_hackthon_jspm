import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { OpportunityMatchResult, BusinessProfile, GeneratedPitch } from '../types';

export const OpportunitiesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [activeType, setActiveType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [matches, setMatches] = useState<OpportunityMatchResult[]>([]);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Proposal Pitch Generator Modal State
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<OpportunityMatchResult | null>(null);
  const [generatedPitch, setGeneratedPitch] = useState<GeneratedPitch | null>(null);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [pitchCopied, setPitchCopied] = useState(false);

  // Express Interest Modal State
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [leadSuccessInfo, setLeadSuccessInfo] = useState<{ message: string; ref: string } | null>(null);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);

  useEffect(() => {
    loadData();
    const handleProfileUpdate = () => loadData();
    window.addEventListener('udyamsetu_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('udyamsetu_profile_updated', handleProfileUpdate);
  }, [activeType, minScoreFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prof, oppResults] = await Promise.all([
        api.getBusinessProfile(),
        api.getOpportunities({
          type: activeType,
          minScore: minScoreFilter > 0 ? minScoreFilter : undefined,
          search: searchQuery,
        }),
      ]);
      setProfile(prof);
      setMatches(oppResults);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenPitchModal = async (match: OpportunityMatchResult) => {
    setSelectedMatch(match);
    setPitchModalOpen(true);
    setIsGeneratingPitch(true);
    setPitchCopied(false);

    try {
      const pitch = await api.generateB2BPitch(match.opportunity.id || match.opportunity._id);
      setGeneratedPitch(pitch);
    } catch (e) {
      console.error('Error generating pitch:', e);
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleCopyPitch = () => {
    if (!generatedPitch) return;
    const fullText = `Subject: ${generatedPitch.subject}\n\n${generatedPitch.salutation}\n\n${generatedPitch.executiveSummary}\n\nOffered Capacity: ${generatedPitch.offeredCapacity}\nLead Time: ${generatedPitch.turnaroundTime}\n\nQuality Assurance: ${generatedPitch.qualityAssurance}\n\nPricing: ${generatedPitch.pricingProposal}\n\n${generatedPitch.callToAction}`;
    navigator.clipboard.writeText(fullText);
    setPitchCopied(true);
    setTimeout(() => setPitchCopied(false), 2500);
  };

  const handleOpenInterestModal = (match: OpportunityMatchResult) => {
    setSelectedMatch(match);
    setLeadSuccessInfo(null);
    setInterestModalOpen(true);
  };

  const handleConfirmInterest = async () => {
    if (!selectedMatch) return;
    setIsSubmittingInterest(true);
    try {
      const res = await api.expressInterest({
        opportunityId: selectedMatch.opportunity.id || selectedMatch.opportunity._id || '',
        proposalText: `Official expression of interest from ${profile?.businessName || 'Artisan Enterprise'}`,
      });
      setLeadSuccessInfo({
        message: res.message,
        ref: res.leadReference,
      });
    } catch (err) {
      console.error('Error expressing interest:', err);
    } finally {
      setIsSubmittingInterest(false);
    }
  };

  const opportunityTabs = [
    { id: 'all', label: 'All Opportunities', icon: 'hub' },
    { id: 'customer', label: 'Direct Customers', icon: 'storefront' },
    { id: 'business', label: 'B2B Businesses', icon: 'domain' },
    { id: 'bulk_order', label: 'Bulk Orders', icon: 'inventory_2' },
    { id: 'partnership', label: 'Partnership Pods', icon: 'handshake' },
    { id: 'marketplace', label: 'Marketplaces (ONDC)', icon: 'shopping_bag' },
    { id: 'financing', label: 'Financing & Loans', icon: 'currency_rupee' },
    { id: 'government_scheme', label: 'Govt Schemes', icon: 'account_balance' },
    { id: 'support_program', label: 'Support & Camps', icon: 'school' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">explore</span>
              </span>
              <h1 className="text-xl font-bold text-gray-900">Personalized Opportunity Discovery Layer</h1>
            </div>
            <p className="text-xs text-gray-500">
              Connecting <strong className="text-gray-800">{profile?.entrepreneurName || 'Your Enterprise'}</strong> ({profile?.businessType}, {profile?.locationDetails?.city}) across 8 opportunity streams using rule-based eligibility & AI semantic ranking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Min Fit:</span>
            <select
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(parseInt(e.target.value))}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 outline-none"
            >
              <option value="0">All Match Scores</option>
              <option value="85">85%+ High Match</option>
              <option value="90">90%+ Top Priority Fit</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by buyer, order type, location, skill or subsidy keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Filter
          </button>
        </form>

        {/* Stream Tabs Bar */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {opportunityTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeType === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List View */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Evaluating opportunities against your 6-pillar business profile...
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <span className="material-symbols-outlined text-gray-300 text-[48px] mb-2">search_off</span>
          <h3 className="text-sm font-bold text-gray-800">No matching opportunities found</h3>
          <p className="text-xs text-gray-500 mt-1">Try lowering the minimum score filter or searching another term.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => {
            const opp = m.opportunity;
            return (
              <div
                key={opp.id || opp._id || opp.title}
                className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-emerald-300 transition-all shadow-xs hover:shadow-md space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {m.matchScore}% Match
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                        {opp.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 font-medium">{opp.organization}</span>
                      {opp.locationScope.city && (
                        <span className="text-xs text-gray-400">
                          📍 {opp.locationScope.city}, {opp.locationScope.state}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-gray-900">{opp.title}</h2>
                    <p className="text-xs text-gray-600 leading-relaxed">{opp.description}</p>
                  </div>

                  {/* Value Pill */}
                  <div className="text-left md:text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      Opportunity Value
                    </span>
                    <span className="text-sm font-extrabold text-emerald-700">{opp.estimatedValue}</span>
                  </div>
                </div>

                {/* Explainability Highlight Box (Why this matches you) */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-emerald-50/80 border border-emerald-200/70">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">psychology</span>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950">
                          Why this matches your enterprise profile:
                        </span>
                        <span className="text-[10px] text-emerald-800 font-medium">
                          Rule-based & Semantic verified
                        </span>
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed">{m.whyMatches}</p>
                    </div>
                  </div>
                </div>

                {/* Eligibility Factors Checklist */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-gray-700 block">Eligibility Breakdown:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {m.eligibilityChecklist.map((factor, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg text-xs border flex items-start gap-2 ${
                          factor.status === 'met'
                            ? 'bg-green-50/70 border-green-200 text-green-900'
                            : factor.status === 'partially_met'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                            : 'bg-red-50/70 border-red-200 text-red-900'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                          {factor.status === 'met'
                            ? 'check_circle'
                            : factor.status === 'partially_met'
                            ? 'schedule'
                            : 'info'}
                        </span>
                        <div>
                          <div className="font-bold text-[11px] leading-tight">{factor.criterion}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{factor.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Step Recommendation */}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">lightbulb</span>
                  <span>
                    <strong>Recommended Next Step:</strong> {m.recommendedNextStep}
                  </span>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {opp.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenPitchModal(m)}
                      className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit_document</span>
                      Draft AI Pitch / Quote
                    </button>

                    <button
                      onClick={() => handleOpenInterestModal(m)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      {opp.actionLabel || 'Apply & Connect'}
                    </button>

                    {opp.officialUrl && (
                      <a
                        href={opp.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                        title="View Official Portal"
                      >
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: AI B2B PITCH / PROPOSAL GENERATOR */}
      {pitchModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">auto_awesome</span>
                  AI 1-Click B2B Pitch & Quotation
                </h3>
                <p className="text-xs text-gray-500">
                  Customized for {selectedMatch.opportunity.organization} using your verified profile data
                </p>
              </div>
              <button
                onClick={() => setPitchModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {isGeneratingPitch || !generatedPitch ? (
              <div className="py-12 flex flex-col items-center justify-center text-xs text-gray-500 gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 animate-ping"></span>
                Generating formal quotation and executive pitch...
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 text-xs leading-relaxed text-gray-800 pr-1">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono text-[11px]">
                  <strong>Subject:</strong> {generatedPitch.subject}
                </div>

                <div className="space-y-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100">
                  <p className="font-semibold text-gray-900">{generatedPitch.salutation}</p>
                  <p>{generatedPitch.executiveSummary}</p>
                  <p>
                    <strong>Capacity Commitment:</strong> {generatedPitch.offeredCapacity}
                  </p>
                  <p>
                    <strong>Turnaround Lead Time:</strong> {generatedPitch.turnaroundTime}
                  </p>
                  <p>
                    <strong>Quality Assurance:</strong> {generatedPitch.qualityAssurance}
                  </p>
                  <p>
                    <strong>Pricing Terms:</strong> {generatedPitch.pricingProposal}
                  </p>
                  <p className="font-semibold text-emerald-900">{generatedPitch.callToAction}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-[11px] text-gray-400">
                Ready to send via email, WhatsApp, or Setu direct bridge
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPitchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={handleCopyPitch}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {pitchCopied ? 'check' : 'content_copy'}
                  </span>
                  {pitchCopied ? 'Copied to Clipboard!' : 'Copy Proposal Text'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EXPRESS INTEREST VIA SETU */}
      {interestModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                Connect via UdyamSetu Bridge
              </h3>
              <button
                onClick={() => setInterestModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {leadSuccessInfo ? (
              <div className="space-y-3 py-2 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[28px]">task_alt</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{leadSuccessInfo.message}</h4>
                <p className="text-xs text-gray-500">
                  Your lead dossier has been dispatched. Reference number:
                </p>
                <div className="p-2.5 bg-gray-100 rounded-xl font-mono text-xs font-bold text-emerald-800">
                  {leadSuccessInfo.ref}
                </div>
                <button
                  onClick={() => setInterestModalOpen(false)}
                  className="w-full mt-2 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-gray-600">
                  You are expressing interest in <strong>{selectedMatch.opportunity.title}</strong> posted by{' '}
                  <strong>{selectedMatch.opportunity.organization}</strong>.
                </p>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <div>
                    <strong>Transmitting Profile:</strong> {profile?.businessName} ({profile?.entrepreneurName})
                  </div>
                  <div>
                    <strong>Declared Capacity:</strong> {profile?.capacityDetails?.monthlyVolume}
                  </div>
                  <div>
                    <strong>Location:</strong> {profile?.locationDetails?.city}, {profile?.locationDetails?.state}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    onClick={() => setInterestModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmInterest}
                    disabled={isSubmittingInterest}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                  >
                    {isSubmittingInterest ? 'Connecting...' : 'Confirm & Transmit Dossier'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
