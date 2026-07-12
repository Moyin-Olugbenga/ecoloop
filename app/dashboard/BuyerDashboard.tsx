'use client';

import React from 'react';
import { Layers, ShoppingBag, CheckCircle } from 'lucide-react';

export default function BuyerDashboard({ data }: { data: any }) {
  const orders = data ?? [];

  const totalKg = orders.reduce((sum: number, o: any) => sum + (o.listing?.quantityKg ?? 0), 0);
  const totalSpent = orders.reduce((sum: number, o: any) => sum + o.price, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><Layers className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Stock Sourced</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">{totalKg.toFixed(1)} kg</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><ShoppingBag className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Completed Purchases</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">{orders.length}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Spent</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">₦{totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
          <h3 className="font-black text-[#063321] text-base">Procurement Ledger</h3>
          <a href="/marketplace" className="text-xs font-bold text-[#063321] hover:underline">Browse batches →</a>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No purchases yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8FBF9] text-gray-400 font-black uppercase tracking-wider border-b border-gray-100">
                  <th className="p-3">Batch Reference</th>
                  <th className="p-3">Material</th>
                  <th className="p-3">Volume</th>
                  <th className="p-3">Sources</th>
                  <th className="p-3 text-right">Price Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((o: any) => (
                  <tr key={o.id}>
                    <td className="p-3 font-mono font-bold text-[#063321]">{o.listingId.slice(0, 8).toUpperCase()}</td>
                    <td className="p-3">{o.listing?.wasteType}</td>
                    <td className="p-3">{o.listing?.quantityKg} kg</td>
                    <td className="p-3">{o.listing?.batchItems?.length ?? 0} listings</td>
                    <td className="p-3 text-right font-bold text-[#063321]">₦{o.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}