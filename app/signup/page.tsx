'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, ShoppingBag, GraduationCap, Users, ArrowRight, Lock, Mail, Phone, MapPin } from 'lucide-react';
import { signUp } from '@/app/actions/auth';

const ROLE_MAP = {
  household: 'SELLER',
  collector: 'MIDDLEMAN',
  buyer: 'BUYER',
  school: 'SCHOOL',
} as const;

export default function SignUp() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'household' | 'collector' | 'buyer' | 'school'>('household');
  const [form, setForm] = useState({
    name: '',
    lga: 'Ikeja LGA',
    email: '',
    phone: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const roles = [
    { id: 'household' as const, title: 'Household / Resident', desc: 'List and sell sorted home recyclables for rewards.', icon: Users },
    { id: 'collector' as const, title: 'Collector / Middleman', desc: 'Gain source visibility and fulfill local pickups.', icon: ShoppingBag },
    { id: 'buyer' as const, title: 'Corporate Buyer / Factory', desc: 'Source high-purity, bulk recycled feedstock directly.', icon: Layers },
   ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signUp({
        name: form.name,
        email: form.email,
        password: form.password,
        role: ROLE_MAP[selectedRole] as any,
        lga: form.lga,
        phone: form.phone || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FBF9] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-xl text-center space-y-3">
          <h1 className="text-2xl font-black text-[#063321]">Check your email</h1>
          {/* <p className="text-sm text-gray-500">
            We sent an activation link to <span className="font-bold">{form.email}</span>. Click it to activate your account, then sign in.
          </p> */}
          <p className="text-sm text-gray-500">
            Account successfully created.</p>
          <a href="/signin" className="inline-block mt-2 text-sm font-bold text-[#063321] hover:underline">
            Go to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex flex-col lg:flex-row font-sans">
      <div className="lg:w-[40%] bg-[#063321] text-white p-8 lg:p-12 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-[#9DE3C5]">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="bg-[#9DE3C5] p-1.5 rounded text-[#063321]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </div>
            <span className="font-black text-lg tracking-wider">ECOLOOP</span>
          </div>
          <div className="pt-12 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">One platform connecting the entire chain.</h2>
            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-sm">
              EcoLoop turns Lagos' waste issue into an accessible digital economy by bridging the gap between generators, sorters, and industrial buyers.
            </p>
          </div>
        </div>
        <div className="bg-[#0b4d32] border border-white/10 p-4 rounded-xl mt-12 lg:mt-0 text-xs text-emerald-200/90 font-mono">
          <span className="text-[#9DE3C5] font-bold block mb-1">✓ Ecosystem Directive:</span>
          {selectedRole === 'household' && "Unlocks direct peer micro-rewards for dynamic sorting habits."}
          {selectedRole === 'collector' && "Optimizes multi-point neighborhood routing to reduce manual sorting strain."}
          {selectedRole === 'buyer' && "Bypasses informal broker layer to secure guaranteed bulk material pipeline."}
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-10 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-xl space-y-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#063321]">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Already registered? <a href="/signin" className="text-[#063321] font-bold hover:underline">Log in securely</a></p>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase font-black tracking-wider text-gray-400 block">Select Your Platform Role</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                    <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-4 text-left rounded-xl border-2 transition-all flex items-start space-x-3 h-full ${
                        isSelected 
                            ? 'border-[#063321] bg-white shadow-md ring-2 ring-[#9DE3C5]/40' 
                            : 'border-gray-200 bg-white/60 hover:bg-white'
                        }`}
                    >
                        <div className={`p-2 rounded-lg mt-0.5 flex-shrink-0 ${isSelected ? 'bg-[#063321] text-[#9DE3C5]' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon className="w-4 h-4" />
                        </div>
                        <div>
                        <span className="font-bold text-xs block text-[#1A2420]">{role.title}</span>
                        <span className="text-[11px] text-gray-500 block mt-0.5 leading-tight">{role.desc}</span>
                        </div>
                    </button>
                    );
                })}
          </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Full Name / Entity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kola Ibrahim"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#063321] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">LGA Location (Lagos)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                  <select
                    value={form.lga}
                    onChange={(e) => setForm({ ...form, lga: e.target.value })}
                    className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#063321] appearance-none cursor-pointer"
                  >
                    <option>Ikeja LGA</option>
                    <option>Mushin LGA</option>
                    <option>Lagos Island LGA</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#063321] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-600">Phone Number</label>
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Optional</span>
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="tel"
                  placeholder="+234..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#063321] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#063321] transition-all"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#063321] hover:bg-opacity-95 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 group disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Registering...' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#9DE3C5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}