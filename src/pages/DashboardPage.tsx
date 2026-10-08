import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { BusinessProfile, OpportunityMatchResult, DemoPersona } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [personas, setPersonas] = useState<DemoPersona[]>([]);
  const [topMatches, setTopMatches] = useState<OpportunityMatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState<string>('all');

  useEffect(() => {
    loadDashboardData();
    const handleUpdate = () => loadDashboardData();
    window.addEventListener('udyamsetu_profile_updated', handleUpdate);
    return () => window.removeEventListener('udyamsetu_profile_updated', handleUpdate);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [prof, demoList, opps] = await Promise.all([
        api.getBusinessProfile(),
        api.getDemoPersonas(),
        api.getOpportunities(),
      ]);
      setProfile(prof);
      setPersonas(demoList);
      setTopMatches(opps.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchPersona = async (personaId: string) => {
    try {
      const updated = await api.switchPersona(personaId);
      setProfile(updated);
      const newMatches = await api.getOpportunities();
      setTopMatches(newMatches.slice(0, 5));
      window.dispatchEvent(new Event('udyamsetu_profile_updated'));
    } catch (err) {
      console.error('Failed to switch persona:', err);
    }
  };

  const streamCounts = {
    customers: 3,
    business: 4,
    bulk_orders: 3,
    partnerships: 2,
    marketplaces: 4,
    financing: 5,
    schemes: 6,
    support: 4,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider">
              UdyamSetu Opportunity Engine
            </span>
            <span className="text-xs text-emerald-200">
              • Location: {profile?.locationDetails?.city || 'Jaipur'}, {profile?.locationDetails?.state || 'Rajasthan'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Namaste, {profile?.entrepreneurName || 'Creator'}!
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 font-light leading-relaxed mb-6">
            Your single business profile is connected to <span className="font-bold text-white">8 active ecosystem channels</span>. We matched <span className="font-bold text-emerald-300">18 high-relevance opportunities</span> for your {profile?.businessType || 'enterprise'} skills and {profile?.capacityDetails?.monthlyVolume || 'capacity'}.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/assistant')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
              Describe Business via AI Voice / Text
            </button>
            <button
              onClick={() => navigate('/opportunities')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">hub</span>
              Explore All 8 Channels
            </button>
            <button
              onClick={() => navigate('/business')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              Edit 6-Pillar Profile
            </button>
          </div>
        </div>

        {/* Decorative background art */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[320px]">bridge</span>
        </div>
      </div>

      {/* Quick Demo Persona Switcher Ribbon */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">switch_account</span>
              Live Persona Selector (Test Different Grassroots Entrepreneurs)
            </h2>
            <p className="text-xs text-gray-500">
              Click any maker below to instantly reload the profile and see personalized opportunity matching recompute live!
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit">
            Current: {profile?.entrepreneurName} ({profile?.businessType})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {personas.map((p) => {
            const isSelected = profile?.entrepreneurName === p.entrepreneurName;
            return (
              <button
                key={p.id}
                onClick={() => handleSwitchPersona(p.id)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900 truncate">{p.entrepreneurName}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-emerald-700 truncate">{p.businessType}</p>
                <p className="text-[10px] text-gray-500 truncate">{p.locationDetails?.city || p.district}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Overview: Readiness Gauge + 8 Stream Discovery Counters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Setu Readiness Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">analytics</span>
                Setu Bridge Readiness Index
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {profile?.readinessScore || 84}/100
              </span>
            </div>

            {/* Circular Progress Display */}
            <div className="flex items-center justify-center my-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-600 transition-all duration-1000"
                    strokeDasharray={`${profile?.readinessScore || 84}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-gray-900">{profile?.readinessScore || 84}%</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Ready to Scale</span>
                </div>
              </div>
            </div>

            {/* Pillar Status Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="text-gray-600 font-medium">1. Skills & Craftsmanship</span>
                <span className="font-bold text-emerald-700">✓ Verified ({profile?.skills?.length || 5} skills)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="text-gray-600 font-medium">2. Products & Pricing</span>
                <span className="font-bold text-emerald-700">✓ Ready ({profile?.productsServices?.length || 2} items)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="text-gray-600 font-medium">3. Capacity Specified</span>
                <span className="font-bold text-emerald-700">✓ {profile?.capacityDetails?.monthlyVolume || '80 kg/mo'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="text-gray-600 font-medium">4. Udyam Registration</span>
                <span className="font-bold text-emerald-700">{profile?.registrations?.udyam ? '✓ Linked' : '⚡ 10 min setup'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/business')}
            className="w-full mt-6 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-all text-center"
          >
            Review & Complete Profile Pillars
          </button>
        </div>

        {/* Right Column: 8 Channel Discovery Matrix */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">hub</span>
                8-Channel Opportunity Bridge
              </h2>
              <p className="text-xs text-gray-500">
                Personalized access across all economic pathways for home & micro-entrepreneurs
              </p>
            </div>
            <button
              onClick={() => navigate('/opportunities')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
            >
              View Full Marketplace <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Stream 1 */}
            <div
              onClick={() => navigate('/opportunities?type=customer')}
              className="p-3.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
              </div>
              <div className="text-xs font-bold text-gray-900">Direct Customers</div>
              <p className="text-[11px] text-gray-500 mt-0.5">Pop-up haats, farmer bazaars</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                3 Local Matches
              </span>
            </div>

            {/* Stream 2 */}
            <div
              onClick={() => navigate('/opportunities?type=business')}
              className="p-3.5 rounded-xl bg-teal-50/50 hover:bg-teal-50 border border-teal-100 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">domain</span>
              </div>
              <div className="text-xs font-bold text-gray-900">B2B Businesses</div>
              <p className="text-[11px] text-gray-500 mt-0.5">Hotels, cafes, boutiques</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded">
                4 Active Contracts
              </span>
            </div>

            {/* Stream 3 */}
            <div
              onClick={() => navigate('/opportunities?type=bulk_order')}
              className="p-3.5 rounded-xl bg-amber-50/50 hover:bg-amber-50 border border-amber-100 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              </div>
              <div className="text-xs font-bold text-gray-900">Bulk Orders</div>
              <p className="text-[11px] text-gray-500 mt-0.5">Festivals, corporate gifts</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                ₹2.5L Inquiries
              </span>
            </div>

            {/* Stream 4 */}
            <div
              onClick={() => navigate('/partnerships')}
              className="p-3.5 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">handshake</span>
              </div>
              <div className="text-xs font-bold text-gray-900">Partnerships</div>
              <p className="text-[11px] text-gray-500 mt-0.5">Creator pods, shared kitchens</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded">
                2 Synergy Pods
              </span>
            </div>

            {/* Stream 5 */}
            <div
              onClick={() => navigate('/opportunities?type=marketplace')}
              className="p-3.5 rounded-xl bg-sky-50/50 hover:bg-sky-50 border border-sky-100 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              </div>
              <div className="text-xs font-bold text-gray-900">Marketplaces</div>
              <p className="text-[11px] text-gray-500 mt-0.5">ONDC, GeM, Amazon Saheli</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded">
                1-Click Bridge Ready
              </span>
            </div>

            {/* Stream 6 */}
            <div
              onClick={() => navigate('/opportunities?type=financing')}
              className="p-3.5 rounded-xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
              </div>
              <div className="text-xs font-bold text-gray-900">Financing & Loans</div>
              <p className="text-[11px] text-gray-500 mt-0.5">PMMY Mudra, PMEGP subsidy</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-purple-700 bg-purple-100/70 px-1.5 py-0.5 rounded">
                Zero Collateral
              </span>
            </div>

            {/* Stream 7 */}
            <div
              onClick={() => navigate('/schemes')}
              className="p-3.5 rounded-xl bg-orange-50/50 hover:bg-orange-50 border border-orange-100 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
              </div>
              <div className="text-xs font-bold text-gray-900">Govt Schemes</div>
              <p className="text-[11px] text-gray-500 mt-0.5">PM Vishwakarma, PMFME</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-orange-800 bg-orange-100/70 px-1.5 py-0.5 rounded">
                35% Subsidies
              </span>
            </div>

            {/* Stream 8 */}
            <div
              onClick={() => navigate('/opportunities?type=support_program')}
              className="p-3.5 rounded-xl bg-rose-50/50 hover:bg-rose-50 border border-rose-100 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </div>
              <div className="text-xs font-bold text-gray-900">Support Programs</div>
              <p className="text-[11px] text-gray-500 mt-0.5">Skill India, FSSAI camps</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded">
                100% Free
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Personalized Matches with Clear Explainability */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[22px]">auto_awesome</span>
              Top Matched Recommendations with Explainability
            </h2>
            <p className="text-xs text-gray-500">
              Ranked using hybrid rule-based eligibility filtering and AI semantic capability matching.
            </p>
          </div>
          <button
            onClick={() => navigate('/opportunities')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Explore all {topMatches.length}+ recommendations →
          </button>
        </div>

        <div className="space-y-4">
          {topMatches.map((m) => (
            <div
              key={m.opportunity.id || m.opportunity._id || m.opportunity.title}
              className="p-5 rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all bg-gradient-to-r from-white via-gray-50/30 to-white hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Content */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {m.matchScore}% Match
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      {m.opportunity.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600 font-medium">{m.opportunity.organization}</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900">{m.opportunity.title}</h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {m.opportunity.description}
                  </p>

                  {/* Why it matches box */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 mt-2">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 mt-0.5">
                        psychology
                      </span>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block mb-0.5">
                          Why this matches your profile:
                        </span>
                        <p className="text-xs text-emerald-800 leading-relaxed font-normal">
                          {m.whyMatches}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Factors checklist */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {m.eligibilityChecklist.slice(0, 3).map((factor, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                          factor.status === 'met'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {factor.status === 'met' ? 'check_circle' : 'pending'}
                        </span>
                        {factor.criterion}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Value & Actions */}
                <div className="md:w-60 md:text-right shrink-0 flex flex-col justify-between items-start md:items-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estimated Value</span>
                    <span className="text-sm font-extrabold text-emerald-700">{m.opportunity.estimatedValue}</span>
                  </div>

                  <div className="flex flex-col w-full sm:w-auto gap-2">
                    <button
                      onClick={() => navigate('/opportunities')}
                      className="w-full px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all text-center"
                    >
                      {m.opportunity.actionLabel || 'Apply & Connect'}
                    </button>
                    <button
                      onClick={() => navigate('/assistant')}
                      className="w-full px-4 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-all text-center"
                    >
                      Draft AI Pitch / Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
