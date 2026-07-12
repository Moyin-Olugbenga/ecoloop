'use client';

import React from 'react';
import { Wallet, Layers, Award, Plus } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
  LISTED: 'Awaiting Pickup',
  CLAIMED: 'Claimed by Collector',
  SOLD: 'Sold',
};
const STATUS_DOT: Record<string, string> = {
  LISTED: 'bg-yellow-500',
  CLAIMED: 'bg-blue-500',
  SOLD: 'bg-emerald-500',
};

export default function HouseholdDashboard({ data }: { data: any }) {
  const { listed = [], claimed = [], sold = [] } = data ?? {};
  const allListings = [...listed, ...claimed, ...sold];

  const totalKg = allListings.reduce((sum, l) => sum + l.quantityKg, 0);
  const totalEarnings = sold.reduce((sum: any, l: { order: { price: any; }; }) => sum + (l.order?.price ?? 0), 0);
  const ecoPoints = Math.round(totalKg * 10); // simple gamification derived from real volume

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><Wallet className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Earnings</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">₦{totalEarnings.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><Layers className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Mass Listed</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">{totalKg.toFixed(1)} kg</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><Award className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Eco-Points</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">{ecoPoints.toLocaleString()} pts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-black text-[#063321] text-base">Your Waste Listings</h3>
            <a href="/marketplace" className="bg-[#063321] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 hover:bg-opacity-90">
              <Plus className="w-3.5 h-3.5" /> <span>List New Batch</span>
            </a>
          </div>
          <div className="space-y-3">
            {allListings.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">No listings yet — create your first one.</p>
            )}
            {allListings.map((l) => (
              <div key={l.id} className="flex justify-between items-center bg-[#F8FBF9] p-4 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[l.status]}`} />
                  <div>
                    <span className="text-xs font-bold block text-[#1A2420]">{l.wasteType} — {l.quantityKg} kg</span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">{l.location || 'No location set'}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {STATUS_LABEL[l.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#063321] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9DE3C5] block">Tip</span>
            <h4 className="text-lg font-black leading-tight">Clean, sorted plastic sells faster</h4>
            <p className="text-xs text-emerald-100/60 leading-relaxed pt-2">Listings with a clear waste type and pickup location get claimed by collectors more quickly.</p>
          </div>
          <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-baseline">
            <span className="text-xs text-gray-400">Listings sold:</span>
            <span className="text-xl font-black text-[#9DE3C5]">{sold.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}