import React from 'react';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/authz';
import Sidebar from '@/components/Sidebar';
import CheckoutForm from './CheckoutForm';
import { redirect } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import { CartProvider } from '@/lib/cart-context';

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id }
  });
  if (!user) redirect('/signin');

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex font-sans antialiased">
      
      {/* Structural Sidebar */}
      <Sidebar user={user} role={user.role} />

      {/* Main Billing Canvas */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-12 pt-24 lg:pt-12 transition-all">
        <div className="max-w-md mx-auto space-y-6">
          
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <CreditCard className="w-5 h-5 text-[#063321]" />
            <h1 className="text-xl font-black text-[#063321] tracking-tight uppercase tracking-wider">Ecoloop Billing Portal</h1>
          </div>


        <CartProvider>
            <CheckoutForm user={user} />
        </CartProvider>

        </div>
      </div>
    </div>
  );
}