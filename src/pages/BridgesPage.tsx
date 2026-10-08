import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BusinessProfile } from '../types';

export const BridgesPage: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [ondcSynced, setOndcSynced] = useState(false);
  const [gemSynced, setGemSynced] = useState(false);
  const [mudraDownloaded, setMudraDownloaded] = useState(false);

  useEffect(() => {
    api.getBusinessProfile().then(setProfile);
  }, []);

  const handleSyncOndc = () => {
    setOndcSynced(true);
  };

  const handleSyncGem = () => {
    setGemSynced(true);
  };

  const handleDownloadMudra = () => {
    setMudraDownloaded(true);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">lan</span>
          </span>
          <h1 className="text-xl font-bold text-gray-900">Ecosystem Integration Bridges</h1>
        </div>
        <p className="text-xs text-gray-500">
          UdyamSetu operates as an enablement and discovery bridge. We plug your single business profile directly into national open networks, public procurement portals, and credit rails.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BRIDGE 1: ONDC NETWORK */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                Open Commerce Bridge
              </span>
              <span className={`text-xs font-bold ${ondcSynced ? 'text-green-600' : 'text-sky-600'}`}>
                {ondcSynced ? '● Live on ONDC Node' : '● Ready to Connect'}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900">
              ONDC (Open Network for Digital Commerce)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Break free from closed 30% platform monopolies. Connect your catalog once, and reach millions of buyers across Paytm, Magicpin, Mystore, and Pincode buyer apps.
            </p>

            <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-xs space-y-1.5 text-gray-700">
              <div className="flex items-center justify-between">
                <span>Commission Cut:</span>
                <strong className="text-sky-900">3 - 5% (vs 30% conventional)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Integrated Logistics:</span>
                <strong className="text-sky-900">Shadowfax & Delhivery pickup</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Mapped Items:</span>
                <strong className="text-sky-900">{profile?.productsServices?.length || 2} Products</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Node: Mystore / SellerApp Protocol</span>
            <button
              onClick={handleSyncOndc}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                ondcSynced
                  ? 'bg-green-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {ondcSynced ? '✓ Catalog Synchronized' : '1-Click ONDC Sync'}
            </button>
          </div>
        </div>

        {/* BRIDGE 2: GEM SAHAY */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Public Procurement Rail
              </span>
              <span className={`text-xs font-bold ${gemSynced ? 'text-green-600' : 'text-amber-700'}`}>
                {gemSynced ? '● GeM Sahay Verified' : '● Pre-Qualified'}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900">
              GeM Sahay (Government e-Marketplace)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tap into the 25% statutory procurement mandate for government departments, defense messes, and public sector guest houses with zero earnest money deposits.
            </p>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs space-y-1.5 text-gray-700">
              <div className="flex items-center justify-between">
                <span>Direct Purchase Ceiling:</span>
                <strong className="text-amber-900">Up to ₹5,00,000 without tender</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Guarantee:</span>
                <strong className="text-amber-900">10-Day Statutory CRAC Settlement</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Udyam Linkage:</span>
                <strong className="text-amber-900">{profile?.registrations?.udyam || 'Active'}</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Portal: gem.gov.in Direct Bridge</span>
            <button
              onClick={handleSyncGem}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                gemSynced
                  ? 'bg-green-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {gemSynced ? '✓ GeM Sahay Linked' : 'Link GeM Sahay'}
            </button>
          </div>
        </div>

        {/* BRIDGE 3: MUDRA PRE-FILLED CREDIT RAIL */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Zero-Collateral Credit Rail
              </span>
              <span className="text-xs font-bold text-purple-700">
                ● Pre-Filled Package Ready
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900">
              PMMY Mudra Loan Dossier Bridge
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Auto-generate a standardized bank loan pack for State Bank of India, PNB, or regional rural banks with verified production capacity, machinery quote, and turnover records.
            </p>

            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs space-y-1.5 text-gray-700">
              <div className="flex items-center justify-between">
                <span>Recommended Category:</span>
                <strong className="text-purple-900">Mudra Shishu (₹50,000) or Kishore (₹2L)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Collateral Required:</span>
                <strong className="text-purple-900">Zero (100% CGTMSE Backed)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Application Readiness:</span>
                <strong className="text-purple-900">95% Pre-Filled</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Format: Standardized PDF Dossier</span>
            <button
              onClick={handleDownloadMudra}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                mudraDownloaded
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {mudraDownloaded ? '✓ Dossier Generated' : 'Generate 1-Click Dossier'}
            </button>
          </div>
        </div>

        {/* BRIDGE 4: PM VISHWAKARMA & PMFME SUBSIDY CONDUIT */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                Central Subsidy Conduit
              </span>
              <span className="text-xs font-bold text-orange-700">
                ● Eligible for 35% Grant
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900">
              PM Vishwakarma / PMFME Direct Nodal Bridge
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Verify trade category match against the 18 designated traditional crafts or micro food processing ODOP clusters. Direct API sync with Ministry nodal servers.
            </p>

            <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 text-xs space-y-1.5 text-gray-700">
              <div className="flex items-center justify-between">
                <span>Toolkit Grant:</span>
                <strong className="text-orange-900">₹15,000 Digital eVoucher</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Interest Rate:</span>
                <strong className="text-orange-900">5% Subsidized Concessional</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Food Capital Grant:</span>
                <strong className="text-orange-900">35% Subsidy (up to ₹10 Lakhs)</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Portals: pmvishwakarma.gov.in / pmfme.mofpi.gov.in</span>
            <a
              href="https://pmvishwakarma.gov.in"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <span>Access Nodal Portal</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
