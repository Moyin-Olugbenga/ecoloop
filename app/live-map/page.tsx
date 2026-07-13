import React from 'react';
// 1. IMPORT Next.js dynamic under an alias to prevent naming clashes!
import nextDynamic from 'next/dynamic'; 
import Sidebar from '@/components/Sidebar';
import { requireUser } from '@/lib/authz';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Map } from 'lucide-react';

// 2. This is the exported variable that was conflicting
export const dynamic = "force-dynamic"; 

// 3. Use the alias "nextDynamic" here instead of "dynamic"
const LiveEcoMap = nextDynamic(
  () => import('@/components/LiveEcoMap'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[600px] bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center text-xs text-gray-400 font-bold space-y-3 shadow-sm">
        <div className="w-6 h-6 border-2 border-[#063321] border-t-transparent rounded-full animate-spin" />
        <span className="uppercase tracking-widest text-[10px]">Initializing Regional Grid Coordinates...</span>
      </div>
    )
  }
);

export default async function LiveMapPage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  
  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex font-sans antialiased">
      
      {/* Universal Dashboard Sidebar Component */}
      <Sidebar user={user} role={user.role} />

      {/* Main Container Area - Adjusted with a wide layout container */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-12 pt-24 lg:pt-12 transition-all">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header & Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-5 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[#063321] mb-1">
                <Map className="w-5 h-5 text-emerald-600" />
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400">Regional Interface</span>
              </div>
              <h1 className="text-2xl font-black text-[#063321] tracking-tight">Geospatial Telemetry Grid</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time regional sensor array feed detailing waste levels and localized pollution metrics.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center space-x-1.5 uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>Active Link</span>
              </span>
            </div>
          </div>

          {/* Full-width Map Container */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-2 shadow-sm">
            <LiveEcoMap />
          </div>

        </div>
      </div>
    </div>
  );
}