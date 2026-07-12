import React from 'react';
import { prisma } from '@/lib/db';
import Sidebar from '@/components/Sidebar';
import { notFound, redirect } from 'next/navigation';
import { MapPin, ArrowUpRight, ArrowDownLeft, Edit2 } from 'lucide-react';
import { auth } from '@/auth';
import Link from 'next/link';
import { getListings, getUserListing } from '@/app/actions/listings';
import { getCurrentUser } from '@/app/actions/user';

export const dynamic = "force-dynamic";

export default async function MyLedgerPage() {
     const user = await getCurrentUser();
     
     if (!user) {
       redirect("/signin");
     }
   
     const mySales = await getListings();
     if (!mySales) {
       notFound();
     }
  

  const myAcquisitions = await getUserListing(user.id);
     if (!mySales) {
       notFound();
     }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex font-sans antialiased">
      
      {/* Structural Sidebar Sync */}
      <Sidebar user={user} role={user.role} />

      {/* Main Container Area */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-12 pt-24 lg:pt-12 transition-all">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Section Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-black text-[#063321] tracking-tight">Personal Ledger Node</h1>
            <p className="text-xs text-gray-400 mt-0.5">Isolated transaction stream mapping your personal environmental trades.</p>
          </div>

          <div className="grid grid-cols-1 gap-10">
            
            {/* SUBSECTION A: OUTBOUND SALES (What I listed/sold) */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#063321]">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-black uppercase tracking-wider">My Outbound Sales / Submissions</h2>
              </div>

              {mySales.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-400">
                  You haven't listed any items for sale yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mySales.map((listing) => {
                    const isEditable = listing.status !== 'SOLD'; // Guard check: editable if LISTED or CLAIMED

                    return (
                      <div 
                        key={listing.id} 
                        className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3 relative flex flex-col justify-between transition-all ${
                          isEditable ? 'hover:border-[#063321]/40 hover:shadow-md' : ''
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono font-bold text-gray-400">
                              {listing.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              listing.status === 'LISTED' ? 'bg-yellow-50 text-yellow-700' : 
                              listing.status === 'CLAIMED' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                            }`}>
                              {listing.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-xl font-black text-[#063321]">{listing.quantityKg} KG</span>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{listing.wasteType}</span>
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {listing.location || 'No location specified'}
                          </p>
                        </div>

                        {/* ─── CONDITIONAL EDIT ACTION BUTTON FOR SELLER ─── */}
                        {isEditable && (
                          <div className="pt-2 border-t border-gray-100 mt-2 flex justify-end">
                            <Link 
                              href={`/marketplace/${listing.id}/edit`}
                              className="inline-flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-white bg-[#063321] hover:bg-opacity-90 rounded-xl px-3 py-2 transition-all shadow-sm"
                            >
                              <Edit2 className="w-3 h-3 text-[#9DE3C5]" />
                              <span>Edit Parameters</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SUBSECTION B: INBOUND ACQUISITIONS (What I claimed/bought) */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#063321]">
                <ArrowDownLeft className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-black uppercase tracking-wider">My Sourced Acquisitions / Purchases</h2>
              </div>

              {myAcquisitions.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-400">
                  You haven't claimed or procured any material lots yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myAcquisitions.map((listing) => (
                    <div key={listing.id} className="bg-white border-2 border-emerald-800/5 rounded-2xl p-5 shadow-sm space-y-3 relative">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">ACQUIRED</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${listing.status === 'CLAIMED' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-black text-[#063321]">{listing.quantityKg} KG</span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{listing.wasteType}</span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {listing.location || 'No depot set'}</p>
                      {listing.price && <p className="text-sm font-black text-[#063321] pt-1">Evaluation: ₦{listing.price.toLocaleString()}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}