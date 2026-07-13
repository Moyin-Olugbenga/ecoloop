import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft, MapPin, Scale, History,
  Info, Link as LinkIcon
} from 'lucide-react';
import { prisma } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import ListingDetailActions from "./ListingDetailActions";
import { getListingById } from '@/app/actions/listings';
import { getCurrentUser } from '@/app/actions/user';
import { CartProvider } from '@/lib/cart-context';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
       
  if (!user) {
    redirect("/signin");
  }
   
  const listing = await getListingById(id);
  if (!listing) {
    notFound();
  }

  const isBatch = listing.batchItems.length > 0;

  return (
    <CartProvider>
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex font-sans antialiased">

      <Sidebar user={user} role={user.role} />

      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-12 pt-24 lg:pt-12 transition-all">
        <div className="max-w-5xl mx-auto space-y-8">

          <Link href="/marketplace" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#063321] transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Marketplace Feed</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl relative space-y-6">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#063321] rounded-t-2xl" />

              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Lot Node ID: {listing.id.slice(0, 12).toUpperCase()}</span>
                  <h1 className="text-2xl font-black text-[#063321] tracking-tight mt-1">
                    Verified {listing.wasteType} Stock
                  </h1>
                </div>
                <span className={`text-xs font-mono font-black px-3 py-1 rounded-xl ${listing.status === 'LISTED' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : listing.status === 'CLAIMED' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                  {listing.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8FBF9] border border-gray-100 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5" /> Net Weight
                  </span>
                  <span className="text-xl font-black text-[#063321] block">{listing.quantityKg} KG</span>
                </div>

                <div className="bg-[#F8FBF9] border border-gray-100 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 " /> Dispatch Depot
                  </span>
                  <span className="text-xs font-black text-gray-700 block truncate">{listing.location || 'Not Configured'}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 font-bold">Origin Node / Provider</span>
                  <span className="font-black text-[#063321]">{listing.seller?.name || 'Household Provider'}</span>
                </div>

                {listing.middleman && (
                  <div className="flex justify-between items-center p-3 bg-blue-50/40 border border-blue-100/50 rounded-xl">
                    <span className="text-blue-800 font-bold">Claimed By Collector</span>
                    <span className="font-black text-blue-900">{listing.middleman.name}</span>
                  </div>
                )}

                {listing.order && (
                  <div className="flex justify-between items-center p-3 bg-emerald-50/40 border border-emerald-100/50 rounded-xl">
                    <span className="text-emerald-800 font-bold">Purchased By</span>
                    <span className="font-black text-emerald-900">{listing.order.buyer?.name} — ₦{listing.order.price.toLocaleString()}</span>
                  </div>
                )}

                {listing.dumpSite && (
                  <div className="flex justify-between items-center p-3 bg-emerald-50/40 border border-emerald-100/50 rounded-xl">
                    <span className="text-emerald-800 font-bold flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5" /> Geospatial Mapping Link
                    </span>
                    <span className="font-mono font-bold text-emerald-900">{listing.dumpSite.name}</span>
                  </div>
                )}
              </div>

              <div className="bg-[#F8FBF9] border border-gray-100 rounded-xl p-4 flex items-start space-x-3 text-xs">
                <Info className="w-4 h-4 text-[#063321] mt-0.5 flex-shrink-0" />
                <p className="text-gray-500 leading-relaxed">
                  This lot data parameter model has been signed off under standard verification conditions. Physical quality discrepancies can be flag routed back to your regional collection desk.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-6 relative">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">Pricing Matrix</span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-3xl font-black text-[#063321]">
                      {listing.price ? `₦${listing.price.toLocaleString()}` : 'Price TBD'}
                    </span>
                    {listing.price && <span className="text-xs text-gray-400 font-bold">/ Total Valuation</span>}
                  </div>
                </div>

                {/* Listing Action Control Block Inject */}
                <ListingDetailActions
                  listing={{
                    id: listing.id,
                    wasteType: listing.wasteType,
                    quantityKg: listing.quantityKg,
                    price: listing.price,
                    location: listing.location,
                    status: listing.status,
                  }}
                  isBatch={isBatch}
                  role={user.role}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="border-b border-gray-100 pb-2 flex items-center space-x-2 text-[#063321]">
                  <History className="w-4 h-4" />
                  <h3 className="font-black text-xs uppercase tracking-wider">Lot Supply Chain Lineage</h3>
                </div>

                <div className="relative border-l-2 border-[#063321]/20 pl-4 ml-2 space-y-4 text-[11px] font-medium">
                  {listing.batchItems && listing.batchItems.length > 0 ? (
                    listing.batchItems.map((item: any) => (
                      <div className="relative" key={item.id}>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 absolute -left-[21px] top-1 border-2 border-white" />
                        <span className="text-[9px] font-bold uppercase text-emerald-600 block">Sourced Feedstock</span>
                        <p className="font-black text-gray-800 mt-0.5">{item.quantityKg}kg from {item.seller?.name || 'Household Node'}</p>
                      </div>
                    ))
                  ) : (
                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 absolute -left-[21px] top-1 border-2 border-white" />
                      <span className="text-[9px] font-bold uppercase text-emerald-600 block">Generation Node</span>
                      <p className="font-black text-gray-800 mt-0.5">Staged directly by {listing.seller?.name || 'Household Node'}</p>
                    </div>
                  )}

                  <div className="relative">
                    <div className={`w-2.5 h-2.5 rounded-full absolute -left-[21px] top-1 border-2 border-white ${listing.middlemanId ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                    <span className={`text-[9px] font-bold uppercase block ${listing.middlemanId ? 'text-yellow-600' : 'text-gray-400'}`}>Consolidation Transit</span>
                    <p className={`font-black mt-0.5 ${listing.middlemanId ? 'text-gray-800' : 'text-gray-400'}`}>
                      {listing.middlemanId ? 'Aggregated at Central Depot' : 'Awaiting collector logistics routing'}
                    </p>
                  </div>

                  <div className="relative">
                    <div className={`w-2.5 h-2.5 rounded-full absolute -left-[21px] top-1 border-2 border-white ${listing.order ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                    <span className={`text-[9px] font-bold uppercase block ${listing.order ? 'text-emerald-600' : 'text-gray-400'}`}>Factory Procurement</span>
                    <p className={`font-black mt-0.5 ${listing.order ? 'text-gray-800' : 'text-gray-400'}`}>
                      {listing.order ? `Purchased by ${listing.order.buyer?.name}` : 'Pending commercial buyout'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
    </CartProvider>
  );
}