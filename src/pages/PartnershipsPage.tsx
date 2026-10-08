import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BusinessProfile } from '../types';

export const PartnershipsPage: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [joinedPod, setJoinedPod] = useState<string | null>(null);

  useEffect(() => {
    api.getBusinessProfile().then(setProfile);
  }, []);

  const pods = [
    {
      id: 'pod_01',
      title: 'Rajasthani Heirloom Festive Hamper Pod',
      type: 'Cross-Selling & Bundling',
      partner: 'Aravali Raw Honey Collective (Alwar, RJ)',
      partnerCategory: 'Organic Forest Products',
      description: 'Bundling traditional mango pickles, raw comb honey, and cold-pressed mustard oil into premium festive gift boxes for corporate clients in Delhi NCR & Jaipur.',
      combinedCapacity: '120 hampers / week',
      costSavings: 'Saves 35% on custom rigid box printing and shipping',
      status: 'Accepting 1 Food Producer',
      benefit: 'Immediate listing in 500-unit Infosys festive procurement bid',
    },
    {
      id: 'pod_02',
      title: 'Shared Commercial Kitchen & Automated Bottling Pod',
      type: 'Shared Infrastructure',
      partner: 'Jaipur Women Micro-Kitchens Guild',
      partnerCategory: 'Commercial Facility Co-op',
      description: 'Shared access to FSSAI state-compliant commercial kitchen, industrial dehydrators, and automated bottle capping line in Malviya Nagar.',
      combinedCapacity: '15 hours / week per member',
      costSavings: 'Eliminates ₹2.5 Lakhs individual machinery capex',
      status: '2 of 5 slots available',
      benefit: 'Instant FSSAI state compliance certification for commercial hotel supply',
    },
    {
      id: 'pod_03',
      title: 'Handloom & Zari Bridal Co-Bidding Consortium',
      type: 'Production Capacity Pooling',
      partner: 'Kashi Weavers Cooperative Society (Varanasi, UP)',
      partnerCategory: 'Textiles & Handloom',
      description: 'Pooling production capacity between 4 master tailors and 6 handloom silk weavers to bid on a 400-piece bridal trousseau contract for an NRI destination wedding.',
      combinedCapacity: '400 pieces over 30 days',
      costSavings: 'Bulk wholesale zari thread purchase at 28% discount',
      status: 'Forming Pod',
      benefit: 'Enables solo tailors to participate in bulk luxury wedding contracts',
    },
    {
      id: 'pod_04',
      title: 'Artisan Clay & Brass Decor Joint Delivery Route',
      type: 'Logistics Aggregation',
      partner: 'Ramnagar Terracotta Cluster',
      partnerCategory: 'Handicrafts & Decor',
      description: 'Grouping bi-weekly freight dispatches from Varanasi artisan clusters to Delhi-NCR craft galleries to secure discounted pallet rates.',
      combinedCapacity: 'Bi-weekly freight truck',
      costSavings: 'Lowers interstate transit shipping cost by 42%',
      status: 'Active Route',
      benefit: 'Zero breakages with specialized bulk shock-cushioning pallet packaging',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">handshake</span>
          </span>
          <h1 className="text-xl font-bold text-gray-900">UdyamSetu Partnership Pods</h1>
        </div>
        <p className="text-xs text-gray-500">
          Collaborative matchmaking for home & solo creators. Overcome scale barriers by pooling capacity, bundling complementary products, sharing commercial kitchens, or grouping logistics.
        </p>
      </div>

      {/* Pods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pods.map((pod) => {
          const isJoined = joinedPod === pod.id;
          return (
            <div
              key={pod.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {pod.type}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {pod.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900">{pod.title}</h3>
                <div className="text-xs text-indigo-900 font-medium">
                  Partner: <strong>{pod.partner}</strong> ({pod.partnerCategory})
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{pod.description}</p>

                <div className="space-y-1.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between">
                    <span className="text-gray-500">Combined Scale:</span>
                    <span className="font-bold text-gray-800">{pod.combinedCapacity}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 flex items-center justify-between">
                    <span className="text-indigo-800 font-medium">Cost Advantage:</span>
                    <span className="font-bold text-indigo-900">{pod.costSavings}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/50 flex items-center justify-between">
                    <span className="text-emerald-800 font-medium">Key Order Unlock:</span>
                    <span className="font-bold text-emerald-900">{pod.benefit}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Matches your {profile?.businessType || 'enterprise'} profile
                </span>
                <button
                  onClick={() => setJoinedPod(isJoined ? null : pod.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isJoined
                      ? 'bg-green-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isJoined ? '✓ Pod Application Sent' : 'Connect & Join Pod'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
