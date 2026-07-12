import React from 'react';
import { prisma } from '@/lib/db';
import Sidebar from '@/components/Sidebar';
import EditListingForm from './EditListingForm';
import { redirect, notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/app/actions/user';
import { getListingById } from '@/app/actions/listings';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/signin");
  }

  // 2. Query target listing parameter indices from Prisma
  const listing = await getListingById(id);
  if (!listing) {
    notFound();
  }

  // 3. Authority Validation Safeguard: Enforce listing ownership bounds
  const isOwner = listing.sellerId === user.id || listing.middlemanId === user.id;
  if (!isOwner) {
    redirect('/dashboard/my-ledger?error=UnauthorizedAction');
  }

  // 4. Transactional Lifecycle Safeguard: Lock edits if the stock asset has already been completely sold
  if (listing.status === 'SOLD') {
    redirect('/dashboard/my-ledger?error=LockedAsset');
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex font-sans antialiased">
      
      {/* Platform Sidebar */}
      <Sidebar user={user} role={user.role} />

      {/* Main Content Pane */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-12 pt-24 lg:pt-12 transition-all duration-300">
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* Back Nav Link */}
          <Link 
            href="/dashboard/my-ledger" 
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#063321] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Cancel & Back to Ledger</span>
          </Link>

          {/* Form Card Envelope Wrapper */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl relative space-y-6">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#063321] rounded-t-2xl" />
            
            <div className="border-b border-gray-100 pb-4">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Modify Active Node Reference</span>
              <h1 className="text-xl font-black text-[#063321] tracking-tight mt-0.5">
                Update Listing parameters ({listing.id.slice(0, 8).toUpperCase()})
              </h1>
            </div>

            {/* Render Client-Side Interactive Form Subsystem */}
            <EditListingForm listing={listing} />
            
          </div>
        </div>
      </div>

    </div>
  );
}