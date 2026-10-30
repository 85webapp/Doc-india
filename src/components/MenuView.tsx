import React from 'react';
import {
  User,
  LayoutDashboard,
  FileText,
  ShieldCheck,
  PhoneCall,
  Settings,
  ChevronRight,
  Award
} from 'lucide-react';
import { TabType } from './BottomNav';

interface MenuViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenPolicies: () => void;
  userName: string;
  userPhone: string;
}

export const MenuView: React.FC<MenuViewProps> = ({
  onNavigateTab,
  onOpenProfile,
  onOpenSettings,
  onOpenPolicies,
  userName,
  userPhone
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-5 animate-fadeIn pb-24">
      <div className="mb-4">
        <h1 className="text-2xl font-black text-black">Menu</h1>
      </div>

      {/* User snippet */}
      <div
        onClick={onOpenProfile}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenProfile();
          }
        }}
        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between mb-4 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center">
            {userName ? userName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-base font-bold text-black">{userName || 'My Account'}</h2>
            <p className="text-xs text-slate-500 font-mono">{userPhone}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      {/* Navigation Links */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs mb-5 overflow-hidden">
        <button
          type="button"
          onClick={() => onNavigateTab('dashboard')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-900">My Dashboard &amp; Spends</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('agreements')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-900">All 7 Legal Categories</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onOpenPolicies}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-900">Terms &amp; Protection Policies</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-900">Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* 24/7 Helpline */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              24/7 Support Helpline
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
            Available
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          Call directly for emergency express drafting or custom business deed consultations.
        </p>
        <a
          href="tel:+919876543210"
          className="mt-3 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call +91 98765 43210</span>
        </a>
      </div>

      {/* Statutory Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-500 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Award className="w-4 h-4 text-blue-600" />
          <span>Cotrix Tax &amp; Compliance Group</span>
        </div>
        <div>MSME Registration: UDYAM-UP-28-0098412</div>
        <div>GSTIN: 07AABCC8921N1ZM</div>
      </div>
    </div>
  );
};
