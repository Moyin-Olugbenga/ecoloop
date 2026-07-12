'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { claimListing, purchaseListing } from '@/app/actions/listings';
import { useCart } from '@/lib/cart-context';

export default function ListingDetailActions({
  listing,
  isBatch,
  role,
}: {
  listing: { id: string; wasteType: string; quantityKg: number; price: number | null; location: string | null; status: string };
  isBatch: boolean;
  role?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const cart = isBatch ? useCart() : null;

  function handleClaim() {
    startTransition(async () => {
      try {
        await claimListing(listing.id);
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to claim');
      }
    });
  }

  function handleAddToCart() {
    if (!cart || listing.price == null) return;
    cart.addItem({
      id: listing.id,
      wasteType: listing.wasteType,
      quantityKg: listing.quantityKg,
      price: listing.price,
      location: listing.location,
    });
    setAdded(true);
  }

  function handleInstantCheckout() {
    startTransition(async () => {
      try {
        await purchaseListing(listing.id);
        router.push('/dashboard');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to purchase');
      }
    });
  }

  if (listing.status !== 'LISTED') {
    return <p className="text-xs text-gray-400 font-bold uppercase tracking-wider text-center py-2">No actions available — {listing.status.toLowerCase()}</p>;
  }

  if (!isBatch && role === 'MIDDLEMAN') {
    return (
      <button
        onClick={handleClaim}
        disabled={isPending}
        className="w-full bg-[#063321] hover:bg-opacity-90 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-60"
      >
        {isPending ? 'Claiming...' : 'Claim Waste Stream'}
      </button>
    );
  }

  if (isBatch && role === 'BUYER') {
    return (
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={added || listing.price == null}
          className="w-full bg-[#063321] hover:bg-opacity-90 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-60"
        >
          <ShoppingCart className="w-4 h-4 text-[#9DE3C5]" />
          <span>{added ? 'Added to Cart' : 'Add Material to Cart'}</span>
        </button>

        <button
          onClick={handleInstantCheckout}
          disabled={isPending || listing.price == null}
          className="w-full bg-[#9DE3C5] text-[#063321] font-black py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-sm hover:bg-opacity-90 transition-all disabled:opacity-60"
        >
          <CreditCard className="w-4 h-4" />
          <span>{isPending ? 'Processing...' : 'Instant Checkout'}</span>
        </button>
      </div>
    );
  }

  return (
    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider text-center py-2">
      {role ? 'No actions available for your role' : 'Sign in to interact with this listing'}
    </p>
  );
}