'use client';

import React, { useTransition } from 'react';
import { ShoppingCart, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { purchaseListing } from '@/app/actions/listings';

interface ActionsProps {
  listing: {
    id: string;
    wasteType: string;
    quantityKg: number;
    price: number | null;
    location: string | null;
    status: string;
  };
  isBatch: boolean;
  role?: string;
}

export default function ListingDetailActions({ listing, role }: ActionsProps) {
  const cart = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isListed = listing.status === 'LISTED';
  const hasPrice = listing.price !== null;

  // Check if this explicit listing item is already sitting in the client's cart state
  const isInCart = cart.items.some((item) => item.id === listing.id);

  function handleAddToCart() {
    if (isInCart) {
      router.push('/cart');
      return;
    }
    
    // Append object payload context structure into context tracking
    cart.addItem({
      id: listing.id,
      wasteType: listing.wasteType,
      quantityKg: listing.quantityKg,
      price: listing.price ?? 0,
      location: listing.location ?? 'Default Depot',
    });
  }

  function handleInstantCheckout() {
    startTransition(async () => {
      try {
        if (!hasPrice) return;
        await purchaseListing(listing.id);
        router.push('/dashboard/my-ledger');
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Checkout operation failed.');
      }
    });
  }

  // If the listing status isn't available or the user isn't a buyer/admin, hide transactional options
  if (!isListed) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
        Material lot unavailable for procurement
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Add To Cart Trigger */}
      <button
        onClick={handleAddToCart}
        className={`w-full font-black py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-sm transition-all border border-gray-200 ${
          isInCart 
            ? 'bg-white text-[#063321] hover:bg-gray-50' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <ShoppingCart className="w-4 h-4 text-[#063321]" />
        <span>{isInCart ? 'View inside Cart' : 'Add Material to Cart'}</span>
      </button>

      {/* Direct Settlement Action Checkout Vector */}
      <button
        disabled={isPending || !hasPrice}
        onClick={handleInstantCheckout}
        className="w-full bg-[#063321] hover:bg-opacity-95 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
      >
        <CreditCard className="w-4 h-4 text-[#9DE3C5]" />
        <span>{isPending ? 'Processing transaction...' : 'Proceed to Checkout'}</span>
      </button>
    </div>
  );
}