import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DemoPersona, BusinessProfile } from '../types';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileSidebar }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [personas, setPersonas] = useState<DemoPersona[]>([]);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    loadData();
    // Listen for custom profile update events
    const handleProfileUpdate = () => loadData();
    window.addEventListener('udyamsetu_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('udyamsetu_profile_updated', handleProfileUpdate);
  }, []);

  const loadData = async () => {
    try {
      const p = await api.getBusinessProfile();
      setProfile(p);
      const demoList = await api.getDemoPersonas();
      setPersonas(demoList);
    } catch (e) {
      console.warn('Error loading topbar data:', e);
    }
  };

  const handlePersonaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const personaId = e.target.value;
    if (!personaId) return;
    setIsSwitching(true);
    try {
      const updated = await api.switchPersona(personaId);
      setProfile(updated);
      window.dispatchEvent(new Event('udyamsetu_profile_updated'));
    } catch (err) {
      console.error('Error switching persona:', err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white text-gray-900 fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-30 border-b border-gray-200 flex justify-between items-center h-16 px-4 md:px-6 backdrop-blur-md bg-opacity-95">
      {/* Left: Mobile hamburger menu & Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Toggle Navigation"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs sm:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search B2B orders, bulk contracts, schemes, ONDC..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
          />
        </form>
      </div>

      {/* Right: Persona Switcher & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo Persona Switcher Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
          <span className="text-[11px] font-bold text-emerald-800 whitespace-nowrap">Switch Persona:</span>
          <select
            value={profile?.entrepreneurName ? personas.find(p => p.entrepreneurName === profile.entrepreneurName)?.id || '' : ''}
            onChange={handlePersonaChange}
            disabled={isSwitching}
            className="bg-white text-emerald-950 font-medium text-xs border border-emerald-300 rounded-lg py-1 px-2 focus:outline-none cursor-pointer"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.entrepreneurName} ({p.businessType.split(' ')[0]} - {p.locationDetails?.city || p.district})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => navigate('/assistant')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 hover:opacity-95 transition-all"
          title="Open AI Business Assistant"
        >
          <span className="material-symbols-outlined text-[16px]">smart_toy</span>
          <span className="hidden md:inline">AI Assistant</span>
        </button>

        {/* Profile Badge */}
        <div
          onClick={() => navigate('/business')}
          className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-gray-100 transition-colors"
          title="View Business Profile"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            {profile?.entrepreneurName ? profile.entrepreneurName.slice(0, 2).toUpperCase() : 'US'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {profile?.entrepreneurName || 'Sunita Devi'}
            </p>
            <p className="text-[10px] text-emerald-700 font-medium">
              {profile?.businessType || 'Food Producer'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
