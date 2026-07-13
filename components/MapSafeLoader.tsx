'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// ─── MOVE NEXT/DYNAMIC LOGIC HERE INTO THE CLIENT TREE ───
const LiveEcoMap = dynamic(
  () => import('@/components/LiveEcoMap'),
  { 
    ssr: false, // Disables server-side rendering safely here
    loading: () => (
      <div className="w-full h-[600px] bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center text-xs text-gray-400 font-bold space-y-3 shadow-sm">
        <div className="w-6 h-6 border-2 border-[#063321] border-t-transparent rounded-full animate-spin" />
        <span className="uppercase tracking-widest text-[10px]">Initializing Regional Grid Coordinates...</span>
      </div>
    )
  }
);

export default function MapSafeLoader() {
  return <LiveEcoMap />;
}

