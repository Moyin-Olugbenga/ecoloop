import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, MapPin, Mail, ShieldCheck, Scale, 
  History, User, BarChart3, Calendar 
} from 'lucide-react';
import { prisma } from '@/lib/db'; // Your Prisma client path

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}

export default async function UserProfilePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { role } = await searchParams;

  const profileUser = await prisma.user.findUnique({
    where: { id },
    include: {
      listings: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      }
    }
  });

  if (!profileUser) {
    return notFound();
  }

  // Calculate high-level aggregates safely
  const completedDeliveriesCount = profileUser.listings.filter(l => l.status === 'SOLD').length;
  const cumulativeMassKg = profileUser.listings.reduce((sum, l) => sum + (l.quantityKg || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] font-sans antialiased">
      
      {/* ─── MINI STICKY BRAND HEADER ─── */}
      <div className="bg-[#063321] text-white px-4 sm:px-6 lg:px-8 border-b border-[#0b4d32] shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <Link href="/marketplace" className="inline-flex items-center space-x-2 text-xs font-bold text-gray-300 hover:text-[#9DE3C5] transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Live Ledger</span>
          </Link>
          <span className="text-[10px] text-[#9DE3C5] font-mono tracking-widest uppercase">Verified Node Profile</span>
        </div>
      </div>

      {/* ─── MAIN LAYOUT CANVAS ─── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Profile Identity Summary Badge */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#063321]" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
            <div className="flex items-start space-x-4">
              <div className="bg-[#F8FBF9] border border-gray-200 p-4 rounded-2xl text-[#063321]">
                <User className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-[#063321] tracking-tight">{profileUser.name || 'Anonymous Node'}</h1>
                  <span className="text-[10px] font-mono font-black bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {role || 'SELLER'}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> {profileUser.email}
                </p>
                {profileUser.lga && (
                  <p className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {profileUser.lga}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 p-3 rounded-xl w-fit self-start sm:self-center">
              <ShieldCheck className="w-4 h-4" />
              <span>Identity Verified Matrix Sync</span>
            </div>
          </div>
        </div>

        {/* Aggregate Performance Matrix Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><Scale className="w-6 h-6" /></div>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Cumulative Mass Sourced</span>
              <span className="text-2xl font-black text-[#063321] block mt-0.5">{cumulativeMassKg.toLocaleString()} KG</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><BarChart3 className="w-6 h-6" /></div>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Node Submissions</span>
              <span className="text-2xl font-black text-[#063321] block mt-0.5">{profileUser.listings.length} Batches</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><Calendar className="w-6 h-6" /></div>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Fulfilled Buyouts</span>
              <span className="text-2xl font-black text-[#063321] block mt-0.5">{completedDeliveriesCount} Closed Loop</span>
            </div>
          </div>
        </div>

        {/* Historic Ledger Timeline Feed */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center space-x-2 text-[#063321]">
            <History className="w-5 h-5" />
            <h3 className="font-black text-sm uppercase tracking-wider">Recent Activity Log</h3>
          </div>

          {profileUser.listings.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No historic supply listings traced to this node index configuration.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {profileUser.listings.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-gray-400">{item.id.slice(0, 8).toUpperCase()}</span>
                      <span className="font-black text-[#063321]">{item.wasteType}</span>
                    </div>
                    <p className="text-gray-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-300" /> {item.location || 'Staged at Origin'}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 self-start sm:self-center">
                    <span className="text-sm font-black text-[#063321]">{item.quantityKg} KG</span>
                    <span className={`font-mono font-bold px-2.5 py-1 rounded text-[10px] tracking-wide uppercase ${item.status === 'LISTED' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}