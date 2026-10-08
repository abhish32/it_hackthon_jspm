import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { path: '/business', label: 'Business Profile (6 Pillars)', icon: 'badge' },
    { path: '/assistant', label: 'AI Business Assistant', icon: 'smart_toy', badge: 'Voice/AI' },
    { path: '/opportunities', label: '8-Channel Discovery', icon: 'hub', badge: 'Matches' },
    { path: '/partnerships', label: 'Partnership Pods', icon: 'handshake' },
    { path: '/schemes', label: 'Schemes & Subsidies', icon: 'account_balance' },
    { path: '/bridges', label: 'Ecosystem Bridges (ONDC/GeM)', icon: 'lan' },
    { path: '/compliance', label: 'Compliance & Permits', icon: 'verified_user' },
    { path: '/documents', label: 'Document Locker', icon: 'folder_open' },
  ];

  const bottomItems = [
    { path: '/settings', label: 'Settings & Config', icon: 'settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full p-4">
      {/* Brand Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <span className="material-symbols-outlined text-[24px]">bridge</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-headline-md text-lg font-black tracking-tight text-gray-900 leading-tight">
                Udyam<span className="text-emerald-600">Setu</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                AI
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">Bridge for Micro-Enterprise</p>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {/* Target Focus Banner */}
      <div className="mb-4 p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-emerald-900">For Home & Solo Makers</span>
        </div>
        <p className="text-[10px] text-emerald-700 mt-0.5">
          Connecting skills to B2B, bulk orders & schemes
        </p>
      </div>

      {/* Main Navigation Links */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto pr-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `text-sm rounded-xl px-3.5 py-2.5 flex items-center justify-between transition-all duration-150 font-medium ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/30'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Footer Items */}
      <div className="mt-auto flex flex-col gap-1 pt-3 border-t border-gray-200">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `text-sm rounded-xl px-3.5 py-2 flex items-center gap-3 transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <div className="pt-2 text-center">
          <p className="text-[10px] text-gray-400">UdyamSetu Engine v2.0 • AI-Native</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex bg-white text-gray-900 h-screen w-64 fixed left-0 top-0 border-r border-gray-200 z-40 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative bg-white text-gray-900 w-72 h-full border-r border-gray-200 shadow-2xl flex flex-col z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
