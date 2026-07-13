

'use client';

import React, { useState, useTransition } from 'react';
import { useCart } from '@/lib/cart-context';
import { purchaseListings } from '@/app/actions/listings';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function CartContent() {
  const cart = useCart();
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<{ id: string; ok: boolean; error?: string }[] | null>(null);

  function handleCheckout() {
    startTransition(async () => {
      const ids = cart.items.map((i) => i.id);
      const outcome = await purchaseListings(ids);
      setResults(outcome);

      // Clear only the items that succeeded
      const succeededIds = new Set(outcome.filter((r) => r.ok).map((r) => r.id));
      cart.items.forEach((item) => {
        if (succeededIds.has(item.id)) cart.removeItem(item.id);
      });
    });
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] font-sans p-6 sm:p-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#063321]" />
          <h1 className="text-2xl font-black text-[#063321]">Your Cart</h1>
        </div>

        {cart.items.length === 0 && !results ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-sm text-gray-400">
            Your cart is empty. <a href="/marketplace" className="text-[#063321] font-bold hover:underline">Browse batches →</a>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-[#F8FBF9] p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-sm font-bold block text-[#1A2420]">{item.wasteType} — {item.quantityKg}kg</span>
                  <span className="text-xs text-gray-400">{item.location || 'No location set'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-[#063321]">₦{item.price.toLocaleString()}</span>
                  <button onClick={() => cart.removeItem(item.id)} className="text-gray-300 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {cart.items.length > 0 && (
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Total</span>
                <span className="text-xl font-black text-[#063321]">₦{cart.total.toLocaleString()}</span>
              </div>
            )}

            {cart.items.length > 0 && (
              <button
                onClick={handleCheckout}
                disabled={isPending}
                className="w-full bg-[#063321] text-white font-bold py-3.5 rounded-xl shadow-md disabled:opacity-60"
              >
                {isPending ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            )}
          </div>
        )}

        {results && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
            <h2 className="text-sm font-black text-[#063321] mb-2">Checkout results</h2>
            {results.map((r) => (
              <p key={r.id} className={`text-xs ${r.ok ? 'text-emerald-700' : 'text-red-600'}`}>
                {r.id.slice(0, 8).toUpperCase()} — {r.ok ? 'Purchased' : r.error}
              </p>
            ))}
            <a href="/dashboard" className="inline-block mt-3 text-xs font-bold text-[#063321] hover:underline">View in your dashboard →</a>
          </div>
        )}
      </div>
    </div>
  );
}