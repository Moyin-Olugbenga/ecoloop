'use client';

import React, { useState, useTransition } from 'react';
import { useCart } from '@/lib/cart-context';
import { purchaseListings } from '@/app/actions/listings';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function CheckoutForm({ user }: { user: any }) {
  const cart = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [billingInfo, setBillingInfo] = useState({ phone: '', notes: 'Standard Delivery' });

  const totalAmount = cart.total;

  function handleInstantCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (cart.items.length === 0) return alert('Your cart session is empty.');

    startTransition(async () => {
      try {
        const ids = cart.items.map((i) => i.id);
        
        // Directly process internal balance clearing and mark items as SOLD
        await purchaseListings(ids);
        
        // Flush cart memory cache
        ids.forEach((id) => cart.removeItem(id));
        
        router.push('/dashboard/my-ledger?checkout=success');
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Database transaction mutation failed.');
      }
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl relative space-y-6">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#063321] rounded-t-2xl" />

      {/* Basket Total Summary Card */}
      <div className="bg-[#F8FBF9] border border-gray-100 p-4 rounded-xl space-y-2 text-xs">
        <div className="flex justify-between font-bold text-gray-500 uppercase tracking-wider">
          <span>Material Lot Basket ({cart.items.length})</span>
          <span>Valuation</span>
        </div>
        <div className="divide-y divide-gray-200/60 max-h-24 overflow-y-auto">
          {cart.items.map((item) => (
            <div key={item.id} className="py-2 flex justify-between text-gray-700 font-bold">
              <span className="truncate">{item.wasteType} ({item.quantityKg}kg)</span>
              <span>₦{item.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
          <span className="font-black text-gray-600 uppercase tracking-widest text-[10px]">Total Balance Due</span>
          <span className="text-xl font-black text-[#063321]">₦{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleInstantCheckout} className="space-y-4 text-xs font-medium">
        <div className="space-y-1">
          <label className="font-bold text-gray-600">Contact Delivery Phone</label>
          <input 
            required type="tel" placeholder="e.g. +2348123456789"
            value={billingInfo.phone} onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
            className="w-full p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-gray-600">Logistics Instructions</label>
          <textarea 
            rows={2} value={billingInfo.notes} onChange={(e) => setBillingInfo({...billingInfo, notes: e.target.value})}
            className="w-full p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321] resize-none"
          />
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center space-x-2 text-[11px] text-emerald-800 font-bold">
          <ShieldCheck className="w-4 h-4 text-[#063321] flex-shrink-0" />
          <span>Local Simulation Active: No External Payment Keys Required</span>
        </div>

        <button
          type="submit"
          disabled={isPending || cart.items.length === 0}
          className="w-full bg-[#063321] hover:bg-opacity-95 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center space-x-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#9DE3C5]" />
              <span>Updating Ledger Nodes...</span>
            </>
          ) : (
            <span>Authorize Instant Checkout</span>
          )}
        </button>
      </form>
    </div>
  );
}