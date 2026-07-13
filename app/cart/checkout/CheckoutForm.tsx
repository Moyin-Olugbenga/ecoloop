'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { purchaseListings } from '@/app/actions/listings';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function CheckoutForm({ user }: { user: any }) {
  const cart = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    phone: '',
    notes: 'Standard Delivery Requested',
  });

  // Paystack Integration Public Test Key (Replace with your own from Paystack Dashboard)
  const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_04451da3c1f63eb78db0c17f76441d2ab192af2f";

  const totalAmount = cart.total;

  const loadPaystackScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  async function handlePaystackPayment(e: React.FormEvent) {
    e.preventDefault();
    if (cart.items.length === 0) return alert('Your cart session is clear.');
    
    setIsProcessing(true);

    const res = await loadPaystackScript();
    if (!res) {
      alert("Failed to initialize billing network. Check connection parameters.");
      setIsProcessing(false);
      return;
    }

    // Initialize Paystack Inline Pop-up Object engine
    // Paystack monitors values in Kobo (₦1 = 100 Kobo), so multiply your price by 100
    const handler = (window as any).PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: totalAmount * 100, 
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Mobile Number",
            variable_name: "mobile_number",
            value: billingInfo.phone
          }
        ]
      },
      callback: async function (response: any) {
        // ✨ Executed when payment goes through successfully!
        try {
          const ids = cart.items.map((i) => i.id);
          
          // Execute your server action to mutate listing status to SOLD in Prisma
          await purchaseListings(ids);
          
          // Clear checkout session variables from context state memory maps
          ids.forEach((id) => cart.removeItem(id));
          
          router.push(`/dashboard/my-ledger?payment=success&ref=${response.reference}`);
          router.refresh();
        } catch (error) {
          alert("Payment confirmed but internal ledger ledger syncing failed. Ping Admin.");
        } finally {
          setIsProcessing(false);
        }
      },
      onClose: function () {
        setIsProcessing(false);
        alert("Secure payment process terminated by user.");
      }
    });

    handler.openIframe();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl relative space-y-6">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#063321] rounded-t-2xl" />

      {/* Summary Module */}
      <div className="bg-[#F8FBF9] border border-gray-100 p-4 rounded-xl space-y-2 text-xs">
        <div className="flex justify-between font-bold text-gray-500 uppercase tracking-wider">
          <span>Sourced Lots ({cart.items.length})</span>
          <span>Price Value</span>
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
          <span className="font-black text-gray-600 uppercase tracking-widest text-[10px]">Net Payable</span>
          <span className="text-xl font-black text-[#063321]">₦{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handlePaystackPayment} className="space-y-4 text-xs font-medium">
        <div className="space-y-1">
          <label className="font-bold text-gray-600">Contact Delivery Phone</label>
          <input 
            required type="tel" placeholder="e.g. +234 810 000 0000"
            value={billingInfo.phone} onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
            className="w-full p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
          />
        </div>

        <div className="space-y-1">
            <label className="font-bold text-gray-600">Logistics Instructions</label>
            <textarea 
                rows={2} 
                value={billingInfo.notes} 
                onChange={(e) => setBillingInfo({ ...billingInfo, notes: e.target.value })} // ✨ Fixed: changed 'setForm' to 'setBillingInfo'
                className="w-full p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321] resize-none leading-relaxed"
            />
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center space-x-2 text-[11px] text-emerald-800 font-bold">
          <ShieldCheck className="w-4 h-4 text-[#063321] flex-shrink-0" />
          <span>Paystack Layer Encryption Active</span>
        </div>

        <button
          type="submit"
          disabled={isProcessing || cart.items.length === 0}
          className="w-full bg-[#063321] hover:bg-opacity-95 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#9DE3C5]" />
              <span>Verifying Token Engine...</span>
            </>
          ) : (
            <span>Authorize Checkout ₦{totalAmount.toLocaleString()}</span>
          )}
        </button>
      </form>
    </div>
  );
}