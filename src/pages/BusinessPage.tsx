import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { BusinessProfile, ProductServiceItem } from '../types';

export const BusinessPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form edit states
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newEquipment, setNewEquipment] = useState('');

  // Add Product Modal
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductServiceItem>({
    name: '',
    category: '',
    priceRange: '',
    capacityPerMonth: '',
    unit: 'units',
    description: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const p = await api.getBusinessProfile();
      setProfile(p);
    } catch (e) {
      console.error('Error fetching profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const updated = await api.updateBusinessProfile(profile);
      setProfile(updated);
      setSaveSuccess(true);
      window.dispatchEvent(new Event('udyamsetu_profile_updated'));
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || !profile) return;
    setProfile({
      ...profile,
      skills: [...profile.skills, newSkill.trim()],
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddGoal = () => {
    if (!newGoal.trim() || !profile) return;
    setProfile({
      ...profile,
      businessGoals: [...profile.businessGoals, newGoal.trim()],
    });
    setNewGoal('');
  };

  const handleRemoveGoal = (goalIndex: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      businessGoals: profile.businessGoals.filter((_, idx) => idx !== goalIndex),
    });
  };

  const handleAddEquipment = () => {
    if (!newEquipment.trim() || !profile) return;
    setProfile({
      ...profile,
      resourceDetails: {
        ...profile.resourceDetails,
        equipment: [...profile.resourceDetails.equipment, newEquipment.trim()],
      },
    });
    setNewEquipment('');
  };

  const handleRemoveEquipment = (eqToRemove: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      resourceDetails: {
        ...profile.resourceDetails,
        equipment: profile.resourceDetails.equipment.filter((e) => e !== eqToRemove),
      },
    });
  };

  const handleCreateProduct = () => {
    if (!newProduct.name.trim() || !profile) return;
    setProfile({
      ...profile,
      productsServices: [...profile.productsServices, newProduct],
    });
    setNewProduct({
      name: '',
      category: '',
      priceRange: '',
      capacityPerMonth: '',
      unit: 'units',
      description: '',
    });
    setShowAddProduct(false);
  };

  const handleRemoveProduct = (indexToRemove: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      productsServices: profile.productsServices.filter((_, idx) => idx !== indexToRemove),
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
          Loading single business profile...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {profile.entrepreneurName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{profile.businessName}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {profile.businessType}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Owned by <strong>{profile.entrepreneurName}</strong> • {profile.locationDetails?.city}, {profile.locationDetails?.state}
              </p>
              <p className="text-xs text-emerald-700 font-medium mt-1">{profile.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => navigate('/assistant')}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">mic</span>
              Auto-Fill via Voice / AI
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
            Business profile successfully updated! Opportunity matching engine re-evaluated.
          </div>
        )}
      </div>

      {/* Basic Metadata Editor */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-[20px]">badge</span>
          Identity & Enterprise Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Entrepreneur Name</label>
            <input
              type="text"
              value={profile.entrepreneurName}
              onChange={(e) => setProfile({ ...profile, entrepreneurName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Business Name</label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Business Category</label>
            <select
              value={profile.businessType}
              onChange={(e) => setProfile({ ...profile, businessType: e.target.value as any })}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-emerald-500 bg-white"
            >
              <option value="Food Production">Food Production</option>
              <option value="Tailoring & Apparel">Tailoring & Apparel</option>
              <option value="Handicrafts & Art">Handicrafts & Art</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Education & Tutoring">Education & Tutoring</option>
              <option value="Repair & Technical">Repair & Technical</option>
              <option value="Handmade Products">Handmade Products</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-gray-700 block mb-1">Tagline / Mission</label>
            <input
              type="text"
              value={profile.tagline || ''}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Contact Phone</label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* THE 6 CORE REQUIRED PILLARS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PILLAR 1: SKILLS */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">psychology</span>
                Pillar 1: Skills & Craftsmanship
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {profile.skills.length} Skills Listed
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Specific artisanal and technical competencies used for AI semantic similarity matching.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-emerald-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add skill (e.g. Cold Process Soap, Zari Embroidery)..."
              className="flex-1 p-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAddSkill}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
            >
              Add
            </button>
          </div>
        </div>

        {/* PILLAR 2: PRODUCTS & SERVICES */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">inventory</span>
                Pillar 2: Products & Services Catalog
              </h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                + Add Item
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Your signature offerings, price brackets, and dedicated output rates.
            </p>

            <div className="space-y-2 mb-4 max-h-56 overflow-y-auto">
              {profile.productsServices.map((prod, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs flex justify-between items-start gap-2"
                >
                  <div>
                    <div className="font-bold text-gray-900">{prod.name}</div>
                    <div className="text-[11px] text-gray-500">{prod.category}</div>
                    <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                      Price: {prod.priceRange} • Capacity: {prod.capacityPerMonth}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveProduct(idx)}
                    className="text-gray-400 hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PILLAR 3: LOCATION & REACH */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">location_on</span>
            Pillar 3: Location & Operational Reach
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Used for rule-based geographic radius and state-level eligibility filtering.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">City / Town</label>
              <input
                type="text"
                value={profile.locationDetails?.city || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    locationDetails: { ...profile.locationDetails, city: e.target.value },
                  })
                }
                className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">State</label>
              <input
                type="text"
                value={profile.locationDetails?.state || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    locationDetails: { ...profile.locationDetails, state: e.target.value },
                  })
                }
                className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Area Type</label>
              <select
                value={profile.locationDetails?.areaType || 'Urban'}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    locationDetails: {
                      ...profile.locationDetails,
                      areaType: e.target.value as any,
                    },
                  })
                }
                className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Urban">Urban</option>
                <option value="Semi-Urban">Semi-Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Service Radius (km)</label>
              <input
                type="number"
                value={profile.locationDetails?.serviceRadiusKm || 50}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    locationDetails: {
                      ...profile.locationDetails,
                      serviceRadiusKm: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* PILLAR 4: PRODUCTION CAPACITY */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">speed</span>
            Pillar 4: Production & Service Capacity
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Prevents recommending bulk orders you cannot fulfill alone, or prompts partnership pooling.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Current Monthly Volume</label>
              <input
                type="text"
                value={profile.capacityDetails?.monthlyVolume || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    capacityDetails: { ...profile.capacityDetails, monthlyVolume: e.target.value },
                  })
                }
                placeholder="e.g. 80 kg, 60 pieces"
                className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Batch Lead Time (Days)</label>
              <input
                type="number"
                value={profile.capacityDetails?.leadTimeDays || 3}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    capacityDetails: {
                      ...profile.capacityDetails,
                      leadTimeDays: parseInt(e.target.value) || 1,
                    },
                  })
                }
                className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="col-span-2">
              <label className="font-semibold text-gray-700 block mb-1">Scalability & Expansion Notes</label>
              <input
                type="text"
                value={profile.capacityDetails?.scalabilityNotes || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    capacityDetails: {
                      ...profile.capacityDetails,
                      scalabilityNotes: e.target.value,
                    },
                  })
                }
                className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* PILLAR 5: AVAILABLE RESOURCES */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">build</span>
              Pillar 5: Available Resources & Workspace
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Machinery, workspace square footage, and helpers available for scaling.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Workforce / Helpers</label>
                <input
                  type="number"
                  value={profile.resourceDetails?.workforceCount || 2}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      resourceDetails: {
                        ...profile.resourceDetails,
                        workforceCount: parseInt(e.target.value) || 1,
                      },
                    })
                  }
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Workspace Type</label>
                <input
                  type="text"
                  value={profile.resourceDetails?.workspaceType || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      resourceDetails: {
                        ...profile.resourceDetails,
                        workspaceType: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="font-semibold text-gray-700 text-xs block mb-1">Equipment List:</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {profile.resourceDetails?.equipment?.map((eq) => (
                  <span
                    key={eq}
                    className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1"
                  >
                    {eq}
                    <button
                      onClick={() => handleRemoveEquipment(eq)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddEquipment()}
              placeholder="Add tool/machine (e.g. Vacuum Sealer, Overlock)..."
              className="flex-1 p-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAddEquipment}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
            >
              Add
            </button>
          </div>
        </div>

        {/* PILLAR 6: BUSINESS GOALS */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">flag</span>
              Pillar 6: Business Goals
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Your growth milestones that drive opportunity ranking and recommendation priority.
            </p>

            <div className="space-y-2 mb-4">
              {profile.businessGoals.map((goal, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-gray-800 flex justify-between items-start gap-2"
                >
                  <span>{goal}</span>
                  <button
                    onClick={() => handleRemoveGoal(idx)}
                    className="text-gray-400 hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              placeholder="Add goal (e.g. Secure Mudra loan, sell on ONDC)..."
              className="flex-1 p-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAddGoal}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Official Government Registrations Box */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-[20px]">verified_user</span>
          Government & Sectoral Registrations
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Having these unlocks fast-track approval for government subsidies, Mudra loans, and GeM procurement.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Udyam Registration</label>
            <input
              type="text"
              value={profile.registrations?.udyam || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  registrations: { ...profile.registrations, udyam: e.target.value },
                })
              }
              placeholder="e.g. UDYAM-RJ-14-0084721"
              className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">FSSAI / Health Registration</label>
            <input
              type="text"
              value={profile.registrations?.fssai || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  registrations: { ...profile.registrations, fssai: e.target.value },
                })
              }
              placeholder="e.g. FSSAI-22424001928411"
              className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Artisan Pehchan Card</label>
            <input
              type="text"
              value={profile.registrations?.artisanCard || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  registrations: { ...profile.registrations, artisanCard: e.target.value },
                })
              }
              placeholder="e.g. PEHCHAN-UP-98421"
              className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">PAN Number</label>
            <input
              type="text"
              value={profile.registrations?.pan || profile.pan || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  registrations: { ...profile.registrations, pan: e.target.value },
                })
              }
              placeholder="e.g. ABCDE1234F"
              className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-mono text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Modal: Add Product */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Add New Product / Service</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Homemade Mango Pickle, Bridal Blouse"
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  placeholder="e.g. Food - Pickles, Apparel - Tailoring"
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Price Range</label>
                  <input
                    type="text"
                    value={newProduct.priceRange}
                    onChange={(e) => setNewProduct({ ...newProduct, priceRange: e.target.value })}
                    placeholder="e.g. ₹280/kg, ₹1,500/pc"
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Monthly Capacity</label>
                  <input
                    type="text"
                    value={newProduct.capacityPerMonth}
                    onChange={(e) => setNewProduct({ ...newProduct, capacityPerMonth: e.target.value })}
                    placeholder="e.g. 50 kg, 30 pcs"
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Artisanal recipe details, material source, or finish type..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddProduct(false)}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProduct}
                disabled={!newProduct.name.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
