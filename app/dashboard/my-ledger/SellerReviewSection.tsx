'use client';

import React, { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import SellerRatingWidget from '@/components/SellerRatingWidget';

export default function SellerReviewSection({ acquisitions }: { acquisitions: any[] }) {
  // Track which unique listing card currently has its review accordion drawer toggled open
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {acquisitions.map((listing) => {
        const isReviewOpen = activeReviewId === listing.id;
        const sellerId = listing.sellerId || listing.seller?.id;
        const sellerName = listing.seller?.name || 'Independent Vendor';
        
        // Anti-theft rule check: allow ratings only on completed/finalized lot nodes
        const canRate = listing.status === 'SOLD' && sellerId;

        return (
          <div 
            key={listing.id} 
            className="bg-white border-2 border-emerald-800/5 rounded-2xl p-5 shadow-sm space-y-3 relative flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ACQUIRED
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  listing.status === 'CLAIMED' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                }`}>
                  {listing.status}
                </span>
              </div>
              
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-black text-[#063321]">{listing.quantityKg} KG</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {listing.wasteType}
                </span>
              </div>
              
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> {listing.location || 'No depot set'}
              </p>
              
              {listing.price && (
                <p className="text-sm font-black text-[#063321] pt-1">
                  Evaluation: ₦{listing.price.toLocaleString()}
                </p>
              )}

              <p className="text-[11px] font-medium text-gray-400">
                Vendor: <span className="text-gray-700 font-bold">{sellerName}</span>
              </p>
            </div>

            {/* Anti-Theft Verification CTA Link */}
            {canRate && (
              <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveReviewId(isReviewOpen ? null : listing.id)}
                  className={`w-full py-2 rounded-xl font-black uppercase tracking-wider text-[10px] transition-all flex items-center justify-center space-x-1.5 border ${
                    isReviewOpen 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-[#063321] text-white hover:bg-opacity-95'
                  }`}
                >
                  <Star className={`w-3 h-3 ${isReviewOpen ? 'fill-amber-500 text-amber-500' : 'text-white'}`} />
                  <span>{isReviewOpen ? 'Close Review Panel' : 'Verify & Rate Seller'}</span>
                </button>

                {/* Inline Expandable Rating Interface Widget Form */}
                {isReviewOpen && (
                  <div className="pt-2 animate-fadeIn">
                    <SellerRatingWidget sellerId={sellerId} sellerName={sellerName} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}