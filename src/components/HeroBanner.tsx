import React from 'react';
import { FileText, Mic, ShieldCheck } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="w-full mb-6">
      {/* Light modern desk-themed card matching user screenshot 1793001295964_56d18e94.png */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#eef2f6]/80 via-white to-[#f1f5f9]/70 border border-slate-200/90 shadow-xs px-4 py-6 sm:py-8 text-center">
        {/* Subtle decorative desk elements background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Tagline */}
        <h2 className="text-sm sm:text-base md:text-lg font-medium text-slate-700 tracking-tight mb-3">
          Made for India&apos;s Businessmen &amp; Professionals
        </h2>

        {/* Center Logo Lockup */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="max-w-[340px] sm:max-w-[380px] w-full flex items-center justify-center p-1">
            <img
              src="/assets/aistudio/Screenshot_20261017_081327_Instagram_ccb82a27.jpg"
              alt="Cotrix Tax & Compliance Group"
              className="w-full h-auto object-contain max-h-28"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* 4 Trust Badges in a horizontal row exactly as in screenshot */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-slate-700 font-semibold">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>28 Agreement &amp; Affidavit Templates</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-teal-600" />
            <span>Browser-dependent voice tools</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Demo data stored on this device</span>
          </div>
        </div>
      </div>
    </div>
  );
};
