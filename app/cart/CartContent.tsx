'use client';

import React, { useState, useTransition } from 'react';
import { useCart } from '@/lib/cart-context';
import { purchaseListings } from '@/app/actions/listings';
import { Trash2, ShoppingCart, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartContent({ user }: { user: any }) {
  const cart = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<{ id: string; ok: boolean; error?: string }[] | null>(null);


  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex font-sans antialiased">
      
      {/* ─── PLATFORM SIDEBAR INJECTION ─── */}
      <Sidebar user={user} role={user?.role} />

      {/* ─── MAIN CONTENT VIEW (OFFSET FOR DESKTOP SIDEBAR) ─── */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-12 pt-24 lg:pt-12 transition-all duration-300">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Back to feed directory link anchor */}
          <Link href="/marketplace" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#063321] transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Marketplace</span>
          </Link>

          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShoppingCart className="w-5 h-5 text-[#063321]" />
            <h1 className="text-2xl font-black text-[#063321] tracking-tight">Your Cart</h1>
          </div>

          {cart.items.length === 0 && !results ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-sm text-gray-400 shadow-sm">
              Your cart is empty. <Link href="/marketplace" className="text-[#063321] font-bold hover:underline">Browse batches →</Link>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4 relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#063321] rounded-t-2xl" />
              
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-[#F8FBF9] p-4 rounded-xl border border-gray-100 gap-4 transition-all hover:border-gray-200">
                  
                  {/* Left Segment: Mini Thumbnail Frame + Asset Identifiers */}
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-14 h-14 bg-white border border-gray-200/80 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center shadow-inner relative">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={item.imageUrl} 
                          alt={item.wasteType} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-300" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-sm font-black block text-[#1A2420] truncate">
                        {item.wasteType} - {item.quantityKg}kg
                      </span>
                      <span className="text-xs text-gray-400 block truncate font-medium">
                        {item.location || 'No location set'}
                      </span>
                    </div>
                  </div>

                  {/* Right Segment: Pricing Weights & Management Options */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-black text-sm text-[#063321]">₦{item.price.toLocaleString()}</span>
                    <button 
                      onClick={() => cart.removeItem(item.id)} 
                      className="text-gray-300 hover:text-red-500 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}

              {cart.items.length > 0 && (
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Accumulation</span>
                  <span className="text-xl font-black text-[#063321]">₦{cart.total.toLocaleString()}</span>
                </div>
              )}

              {cart.items.length > 0 && (
               <button
                onClick={() => router.push('/cart/checkout')} 
                className="w-full bg-[#063321] hover:bg-opacity-95 text-white font-black py-4 rounded-xl shadow-md transition-all uppercase tracking-widest text-xs mt-2"
                >
                Proceed to Checkout
                </button>
                  
              )}
            </div>
          )}

          {/* Transaction Result Messages Grid */}
          {results && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-sm relative">
              <h2 className="text-xs font-black text-[#063321] uppercase tracking-wider border-b border-gray-50 pb-2">Checkout results</h2>
              <div className="space-y-1">
                {results.map((r) => (
                  <p key={r.id} className={`text-xs font-medium flex items-center gap-1.5 ${r.ok ? 'text-emerald-700' : 'text-red-600'}`}>
                    <span className="font-mono font-bold">[{r.id.slice(0, 8).toUpperCase()}]</span> 
                    <span>{r.ok ? 'Succeeded — Lot trade sync operational.' : `Failed: ${r.error}`}</span>
                  </p>
                ))}
              </div>
              <Link href="/dashboard/my-ledger" className="inline-block mt-1 text-xs font-black text-[#063321] hover:underline uppercase tracking-wider">
                Open Personal Ledger Node →
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}