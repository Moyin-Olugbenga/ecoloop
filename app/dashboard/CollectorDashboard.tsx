'use client';

import React from 'react';
import { MapPin, Layers, TrendingUp } from 'lucide-react';

export default function CollectorDashboard({ data }: { data: any }) {
  const { claimedUnsorted = [], batches = [] } = data ?? {};

  const totalVolumeKg =
    claimedUnsorted.reduce((sum: number, l: any) => sum + l.quantityKg, 0) +
    batches.reduce((sum: number, b: any) => sum + b.quantityKg, 0);

  const totalRevenue = batches
    .filter((b: any) => b.order)
    .reduce((sum: number, b: any) => sum + (b.order?.price ?? 0), 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><MapPin className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Unsorted Claims</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">{claimedUnsorted.length} pickups</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><Layers className="w-6 h-6" /></div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Total Volume Handled</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">{totalVolumeKg.toFixed(1)} kg</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Revenue from Batches</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">₦{totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-black text-[#063321] text-base">Claimed Pickups Awaiting Sorting</h3>
          <a href="/marketplace" className="text-xs font-bold text-[#063321] hover:underline">Sort into a batch →</a>
        </div>
        <div className="space-y-3">
          {claimedUnsorted.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">Nothing claimed yet — browse the marketplace for household listings.</p>
          )}
          {claimedUnsorted.map((item: any) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#F8FBF9] p-4 rounded-xl border border-gray-100 gap-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-xs font-mono text-gray-400 font-bold block">{item.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-sm font-black text-[#1A2420] block mt-0.5">{item.location || 'No location set'}</span>
                  <span className="text-xs text-gray-500 block">{item.wasteType} — {item.quantityKg}kg · from {item.seller?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {batches.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-black text-[#063321] text-base border-b border-gray-100 pb-3">Your Sorted Batches</h3>
          <div className="space-y-3">
            {batches.map((b: any) => (
              <div key={b.id} className="flex justify-between items-center bg-[#F8FBF9] p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-xs font-bold block text-[#1A2420]">{b.wasteType} — {b.quantityKg}kg ({b.batchItems.length} sources)</span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">{b.location || 'No depot location set'}</span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {b.order ? 'Sold' : 'Listed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}