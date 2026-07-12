'use client';

import React, { useState, useTransition } from 'react';
import {
  ShoppingBag, Plus, MapPin, Search, History, Link as LinkIcon, Eye, ShoppingCart,
} from 'lucide-react';
import { claimListing, purchaseListing, createBatch, getListingProvenance } from '@/app/actions/listings';
import { useCart } from '@/lib/cart-context';
import Sidebar from '@/components/Sidebar';
import CreateListingModal from './CreateListingModal';
import { User } from '../generated/prisma/client';

const WASTE_TYPES = ['PLASTIC', 'METAL', 'ORGANIC', 'EWASTE', 'PAPER', 'GLASS', 'OTHER'];

function CartLink() {
  const cart = useCart();
  return (
    <a href="/marketplace/cart" className="relative flex items-center gap-1 text-xs font-bold text-[#9DE3C5] hover:text-white">
      <ShoppingCart className="w-4 h-4" />
      Cart
      {cart.items.length > 0 && (
        <span className="ml-1 bg-[#9DE3C5] text-[#063321] text-[10px] font-black rounded-full px-1.5 py-0.5">
          {cart.items.length}
        </span>
      )}
    </a>
  );
}

export default function MarketplaceView({
  user,
  rawListings,
  batchListings,
  claimedForBatching,
}: {
  user: User;
  rawListings: any[];
  batchListings: any[];
  claimedForBatching: any[];
}) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvenanceId, setSelectedProvenanceId] = useState<string | null>(null);
  const [provenance, setProvenance] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const [batchSelected, setBatchSelected] = useState<string[]>([]);
  const [batchForm, setBatchForm] = useState({ wasteType: 'PLASTIC', price: '', location: '' });

  const filteredRaw = rawListings.filter((l) => {
    const matchesType = filterType === 'all' || l.wasteType === filterType;
    const q = searchQuery.toLowerCase();
    const matchesQuery = (l.location ?? '').toLowerCase().includes(q) || l.id.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });
  const filteredBatches = batchListings.filter((l) => {
    const matchesType = filterType === 'all' || l.wasteType === filterType;
    const q = searchQuery.toLowerCase();
    const matchesQuery = (l.location ?? '').toLowerCase().includes(q) || l.id.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });

  function handleTrace(id: string) {
    setSelectedProvenanceId(id);
    setProvenance(null);
    startTransition(async () => {
      const result = await getListingProvenance(id);
      setProvenance(result);
    });
  }

  function handleClaim(id: string) {
    startTransition(async () => {
      try {
        await claimListing(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to claim');
      }
    });
  }

  function handlePurchase(id: string) {
    startTransition(async () => {
      try {
        await purchaseListing(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to purchase');
      }
    });
  }

  function toggleBatchSelect(id: string) {
    setBatchSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function handleCreateBatch(e: React.FormEvent) {
    e.preventDefault();
    if (batchSelected.length === 0) return;
    startTransition(async () => {
      try {
        await createBatch({
          sourceListingIds: batchSelected,
          wasteType: batchForm.wasteType as any,
          price: batchForm.price ? parseFloat(batchForm.price) : undefined,
          location: batchForm.location || undefined,
        });
        setBatchSelected([]);
        setBatchForm({ wasteType: 'PLASTIC', price: '', location: '' });
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to create batch');
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex font-sans antialiased">
      
      {/* ─── STANDALONE SHAREABLE SIDEBAR ─── */}
      <Sidebar user={user} role={user.role} />

      {/* ─── MAIN APP CONTENT DISPLAY (OFFSET BY DESKTOP SIDEBAR PANEL WIDTH) ─── */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        
        {/* Sub-Header Top Navigation Strip */}
        <div className="bg-[#063321] text-white px-4 sm:px-6 lg:px-8 border-b border-[#0b4d32] shadow-md sticky top-0 z-30 pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto h-20 flex flex-col sm:flex-row items-center justify-between py-4 sm:py-0 gap-2">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-[#9DE3C5]" />
              <div>
                <span className="font-black text-sm uppercase tracking-widest block">EcoLoop Live Ledger</span>
                <span className="text-[10px] text-[#9DE3C5] font-mono tracking-wider block -mt-0.5">Status: Operational Sync</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user.role === 'BUYER' && <CartLink />}
              <div className="text-xs font-mono text-emerald-200/80">
                {user.role ? `Signed in — ${user.role}` : <a href="/signin" className="underline hover:text-white">Sign in to participate</a>}
              </div>
            </div>
          </div>
        </div>

        {/* Inner Content Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {['all', ...WASTE_TYPES].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-[11px] font-black uppercase tracking-wider px-3 py-2 rounded-xl border transition-all ${filterType === type ? 'bg-[#063321] text-white border-[#063321]' : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-400'}`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by location or listing ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-11 pr-4 py-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
              />
            </div>
          </div>

          {user.role === 'SELLER' && (
            <div className="flex justify-end">
              <CreateListingModal />
            </div>
          )}

          {(user.role === 'MIDDLEMAN' || user.role === 'ADMIN') && claimedForBatching.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#9DE3C5] rounded-t-2xl" />
              <div className="flex items-center space-x-2 text-[#063321] font-black text-sm mb-4">
                <Plus className="w-4 h-4" />
                <h3>Collector Action: Sort Into Batch</h3>
              </div>
              <div className="space-y-2 mb-4">
                {claimedForBatching.map((l: any) => (
                  <label key={l.id} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input type="checkbox" checked={batchSelected.includes(l.id)} onChange={() => toggleBatchSelect(l.id)} className="rounded text-[#063321] focus:ring-[#9DE3C5] accent-[#063321]" />
                    <span>{l.wasteType} — {l.quantityKg}kg</span>
                  </label>
                ))}
              </div>
              <form className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs" onSubmit={handleCreateBatch}>
                <select
                  value={batchForm.wasteType}
                  onChange={(e) => setBatchForm({ ...batchForm, wasteType: e.target.value })}
                  className="p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321] cursor-pointer"
                >
                  {WASTE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Batch price (₦)"
                  value={batchForm.price}
                  onChange={(e) => setBatchForm({ ...batchForm, price: e.target.value })}
                  className="p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
                />
                <input
                  type="text"
                  placeholder="Depot location"
                  value={batchForm.location}
                  onChange={(e) => setBatchForm({ ...batchForm, location: e.target.value })}
                  className="p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
                />
                <button disabled={isPending || batchSelected.length === 0} className="bg-[#063321] text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all uppercase tracking-wider disabled:opacity-60">
                  Create Batch
                </button>
              </form>
            </div>
          )}

          {/* ─── LAYOUT GRID (12 COLS MIX) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (8/12 Space): Feeds Area */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Household Raw Stream Segment */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h2 className="text-base font-black text-[#063321] tracking-tight uppercase tracking-wider">Household Raw Stream Listings</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Unclaimed items directly from source nodes. Actionable by Middlemen layer.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredRaw.length === 0 && <p className="text-sm text-gray-400 col-span-2">No raw listings match your filters.</p>}
                  {filteredRaw.map((listing: any) => (
                    <a href={`/marketplace/${listing.id}`} key={listing.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative flex flex-col justify-between hover:border-[#063321]/40 transition-all">
                      {listing.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={listing.imageUrl} alt={listing.wasteType} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="w-full h-32 bg-[#F8FBF9] flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-wider">
                          No Image
                        </div>
                      )}
                      <div className="p-5 space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono font-bold text-gray-400">{listing.id.slice(0, 8).toUpperCase()}</span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${listing.status === 'LISTED' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'}`}>{listing.status}</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-xl font-black text-[#063321]">{listing.quantityKg} KG</span>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{listing.wasteType}</span>
                          </div>
                          <p className="text-lg font-black text-[#063321]">{listing.price ? `₦${listing.price.toLocaleString()}` : 'Price Pending'}</p>
                          <div className="text-xs text-gray-500 space-y-1 pt-1">
                            <p className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {listing.location || 'No location set'}</p>
                            {listing.dumpSite && (
                              <p className="flex items-center gap-1 font-mono text-[11px] text-emerald-700 bg-emerald-50/50 p-1 rounded w-fit"><LinkIcon className="w-3 h-3" /> Linked Node: {listing.dumpSite.name}</p>
                            )}
                          </div>
                        </div>
                        {user.role === 'MIDDLEMAN' && listing.status === 'LISTED' && (
                          <button
                            onClick={(e) => { e.preventDefault(); handleClaim(listing.id); }}
                            disabled={isPending}
                            className="w-full bg-[#063321] text-white text-xs font-black uppercase tracking-widest py-2.5 rounded-xl mt-4 hover:bg-opacity-95 transition-all disabled:opacity-60"
                          >
                            {isPending ? 'Claiming...' : 'Claim Waste Stream'}
                          </button>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Aggregated Batches Segment */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h2 className="text-base font-black text-[#063321] tracking-tight uppercase tracking-wider">Aggregated Sorted Batches</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Middlemen compiled manufacturing-grade batches. Actionable by Commercial Buyers.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredBatches.length === 0 && <p className="text-sm text-gray-400 col-span-2">No batches match your filters.</p>}
                  {filteredBatches.map((listing: any) => (
                    <a href={`/marketplace/${listing.id}`} key={listing.id} className="bg-white border-2 border-emerald-800/10 rounded-2xl overflow-hidden shadow-sm relative flex flex-col justify-between hover:border-[#063321]/40 transition-all">
                      {listing.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={listing.imageUrl} alt={listing.wasteType} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="w-full h-32 bg-[#F8FBF9] flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-wider">
                          No Image
                        </div>
                      )}
                      <div className="p-5 space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">BATCH LOT</span>
                            <button
                              onClick={(e) => { e.preventDefault(); handleTrace(listing.id); }}
                              className="text-gray-400 hover:text-[#063321] text-xs font-bold flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg"
                            >
                              <History className="w-3 h-3" /> Trace
                            </button>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-xl font-black text-[#063321]">{listing.quantityKg} KG</span>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{listing.wasteType}</span>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1 pt-1">
                            <p className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {listing.location || 'No depot location set'}</p>
                            <p className="text-lg font-black text-[#063321] pt-2">{listing.price ? `₦${listing.price.toLocaleString()}` : 'Price Pending'}</p>
                          </div>
                        </div>
                        {user.role === 'BUYER' && listing.status === 'LISTED' && (
                          <button
                            onClick={(e) => { e.preventDefault(); handlePurchase(listing.id); }}
                            disabled={isPending}
                            className="w-full bg-[#9DE3C5] text-[#063321] text-xs font-black uppercase tracking-widest py-2.5 rounded-xl mt-4 hover:bg-opacity-90 transition-all disabled:opacity-60"
                          >
                            {isPending ? 'Processing...' : 'Procure Feedstock'}
                          </button>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div> 
            
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl sticky top-28 space-y-6">
              <div className="border-b border-gray-100 pb-3 flex items-center space-x-2 text-[#063321]">
                <History className="w-5 h-5" />
                <h3 className="font-black text-sm uppercase tracking-wider">Provenance Trace</h3>
              </div>

              {selectedProvenanceId ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{selectedProvenanceId.slice(0, 8).toUpperCase()}</span>
                  </div>

                  {!provenance ? (
                    <p className="text-xs text-gray-400">Loading chain...</p>
                  ) : (
                    <div className="relative border-l-2 border-[#063321]/20 pl-4 ml-2 space-y-6 text-xs">
                      {provenance.batchItems?.length > 0 ? (
                        provenance.batchItems.map((item: any) => (
                          <div className="relative" key={item.id}>
                            <div className="w-3 h-3 rounded-full bg-emerald-600 absolute -left-[22px] top-1 border-2 border-white" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Source Listing</span>
                            <p className="font-black text-gray-800 mt-0.5">{item.wasteType} — {item.quantityKg}kg</p>
                            <p className="text-gray-400 text-[11px]">From {item.seller?.name}{item.dumpSite ? ` · near ${item.dumpSite.name}` : ''}</p>
                          </div>
                        ))
                      ) : (
                        <div className="relative">
                          <div className="w-3 h-3 rounded-full bg-emerald-600 absolute -left-[22px] top-1 border-2 border-white" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Generation</span>
                          <p className="font-black text-gray-800 mt-0.5">Listed by {provenance.seller?.name}</p>
                        </div>
                      )}

                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full absolute -left-[22px] top-1 border-2 border-white ${provenance.middleman ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${provenance.middleman ? 'text-yellow-600' : 'text-gray-400'}`}>Consolidation</span>
                        <p className={`font-black mt-0.5 ${provenance.middleman ? 'text-gray-800' : 'text-gray-400'}`}>
                          {provenance.middleman ? `Claimed by ${provenance.middleman.name}` : 'Not yet claimed'}
                        </p>
                      </div>

                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full absolute -left-[22px] top-1 border-2 border-white ${provenance.order ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${provenance.order ? 'text-emerald-600' : 'text-gray-400'}`}>Factory Procurement</span>
                        <p className={`font-black mt-0.5 ${provenance.order ? 'text-gray-800' : 'text-gray-400'}`}>
                          {provenance.order ? `Purchased by ${provenance.order.buyer?.name} for ₦${provenance.order.price.toLocaleString()}` : 'Pending commercial buyout'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-gray-400 space-y-2">
                  <Eye className="w-8 h-8 mx-auto text-gray-300" />
                  <p>Click "Trace" on any aggregated batch card to view its real chain, from source households to buyer.</p>
                </div>
              )}
            </div>

          </div> {/* End of main 12-column grid */}
        </main>
      </div>

    </div>
  );
}