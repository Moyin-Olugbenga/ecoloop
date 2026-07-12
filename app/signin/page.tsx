'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      if (result.error === 'ACCOUNT_NOT_ACTIVATED') {
        setError('Your account isn\u2019t activated yet. Check your email for the activation link.');
      } else {
        setError('Invalid email or password.');
      }
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#063321] rounded-t-2xl" />
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-[#063321]">Welcome Back</h1>
          <p className="text-xs text-gray-500">Access your node to manage waste assets or check live tracking parameters.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-600">Password</label>
              <a href="/forgot-password" className="text-[11px] text-gray-400 hover:text-[#063321] font-semibold">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#063321] text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 group disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Authenticate Login'}</span>
            <ArrowRight className="w-4 h-4 text-[#9DE3C5] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
        <div className="border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-400">New to EcoLoop? <a href="/signup" className="text-[#063321] font-bold hover:underline">Create an account</a></p>
        </div>
      </div>
    </div>
  );
}