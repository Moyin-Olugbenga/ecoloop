'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { BarChart3, LogOut, Menu, X } from 'lucide-react';
import HouseholdDashboard from './HouseholdDashboard';
import CollectorDashboard from './CollectorDashboard';
import BuyerDashboard from './BuyerDashboard';
import SchoolDashboard from './SchoolDashboard';
import Sidebar from '@/components/Sidebar';
import { User } from '../generated/prisma/client';

const ROLE_LABELS: Record<string, string> = {
  SELLER: 'Household Operations',
  MIDDLEMAN: 'Collector Logistics Base',
  BUYER: 'Industrial Procurement Hub',
  SCHOOL: 'Educational Loop Cluster',
  ADMIN: 'Admin Overview',
};

export default function DashboardShell({
  role,
  user,
  data,
}: {
  role: string;
  user: User;
  data: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex font-sans">
      
      
            <Sidebar user={user} role={user.role} />
      {/* ─── MAIN DASHBOARD INTERFACE CANVAS ─── */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 pt-24 lg:pt-12 lg:ml-64 transition-all">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                <span>Active Profile Context</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-3xl font-black text-[#063321] tracking-tight">
                {ROLE_LABELS[role] ?? 'Dashboard'}
              </h1>
            </div>
          </div>

          {role === 'SELLER' && <HouseholdDashboard data={data} />}
          {role === 'MIDDLEMAN' && <CollectorDashboard data={data} />}
          {role === 'BUYER' && <BuyerDashboard data={data} />}
          {role === 'SCHOOL' && <SchoolDashboard data={data} />}
          {role === 'ADMIN' && <HouseholdDashboard data={data} />}
        </div>
      </main>
    </div>
  );
}