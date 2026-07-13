'use client';

import React, { useState, useTransition } from 'react';
import { Star, ShieldCheck, MessageSquare } from 'lucide-react';
import { rateSeller } from '@/app/actions/listings';

export default function SellerRatingWidget({ sellerId, sellerName }: { sellerId: string; sellerName: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);

    startTransition(async () => {
      try {
        await rateSeller({ sellerId, rating, comment: comment || undefined });
        setSuccess(true);
        setComment('');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Review authorization exception.');
      }
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#063321] rounded-t-2xl" />
      
      <div>
        <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-wider block">Anti-Theft Protocol</span>
        <h4 className="font-black text-xs text-[#063321] mt-0.5">Rate Vendor: {sellerName}</h4>
      </div>

      <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
        {/* Interactive Star Row Selection Array */}
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star} type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-0.5 focus:outline-none transition-transform active:scale-95"
            >
              <Star 
                className={`w-5 h-5 transition-colors ${
                  star <= (hoverRating ?? rating) 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-gray-200'
                }`} 
              />
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <textarea
            rows={2} placeholder="Share feedback on batch purity or pickup punctuality..."
            value={comment} onChange={(e) => setComment(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none text-xs leading-normal resize-none"
          />
        </div>

        {success && (
          <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified review synced successfully!
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#063321] text-white font-black py-2 rounded-xl text-[10px] uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center space-x-1"
        >
          <MessageSquare className="w-3 h-3 text-[#9DE3C5]" />
          <span>{isPending ? 'Authenticating Trade...' : 'Submit Verified Rating'}</span>
        </button>
      </form>
    </div>
  );
}