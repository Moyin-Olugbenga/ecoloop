'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, User, LogOut, Menu, X, FolderSync,
  Video
} from 'lucide-react';
import { User as UserType, Role } from '@/app/generated/prisma/client';

export default function Sidebar({ user, role }: { user: UserType; role?: Role }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Marketplace Feed', href: '/marketplace', icon: ShoppingBag },
    { name: 'My Ledger', href: '/dashboard/my-ledger', icon: FolderSync },
    { name: 'My Profile', href: `/users/${user?.id}?role=${role}`, icon: User },
    { name: 'My learning', href: `/learn`, icon: Video },
  ];

  return (
    <>
      {/* ─── MOBILE TOP HEADER BANNER ─── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#063321] text-white flex items-center justify-between px-4 z-50 border-b border-[#0b4d32]">
        <div className="flex items-center space-x-2">
          <div className="bg-[#9DE3C5] p-1.5 rounded text-[#063321]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          </div>
          <span className="font-black text-sm tracking-wider">ECOLOOP</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#9DE3C5] focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ─── SYSTEM SIDEBAR CONTAINER ─── */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#063321] text-white p-6 flex flex-col justify-between z-40 transform lg:transform-none lg:opacity-100 transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="space-y-8 pt-16 lg:pt-0">
          <div className="hidden lg:flex items-center space-x-3">
            <div className="bg-[#9DE3C5] p-2 rounded-xl text-[#063321]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </div>
            <div>
              <span className="font-black text-lg tracking-wider block">ECOLOOP</span>
              <span className="text-[9px] text-[#9DE3C5] tracking-widest uppercase block -mt-1">Live Ledger Base</span>
            </div>
          </div>

          <div className="bg-[#0b4d32] border border-white/10 p-3 rounded-xl">
            <span className="text-[9px] text-emerald-300 font-bold tracking-wider uppercase block mb-1">Active Identity</span>
            <span className="font-bold text-sm block truncate text-white">{user?.name || 'User Node'}</span>
            <span className="inline-block text-[10px] font-mono bg-[#063321] text-[#9DE3C5] px-2 py-0.5 rounded mt-1.5 font-bold uppercase tracking-wider">{role}</span>
          </div>

          <nav className="space-y-1 pt-2">
            <span className="text-[10px] text-emerald-300/40 font-bold tracking-wider uppercase block px-3 mb-2">Ecosystem Sections</span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href.split('?')[0];
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all ${isActive ? 'bg-[#9DE3C5] text-[#063321]' : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center space-x-2 text-[10px] text-emerald-100/40 font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Node Secure: 2026 Sync</span>
          </div>
          <Link href="/signin" className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white font-bold py-3 rounded-xl text-xs transition-all uppercase tracking-widest">
            <LogOut className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </Link>
        </div>
      </aside>
    </>
  );
}