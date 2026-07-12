'use client';

import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { requestPasswordReset } from '@/app/actions/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
    } finally {
      // Always show the same success state, whether or not the email exists
      setIsSubmitting(false);
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-500 rounded-t-2xl" />
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#063321]">Reset Request</h1>
          <p className="text-xs text-gray-500">Lost your security access keys? Input your email address to generate an activation link.</p>
        </div>

        {sent ? (
          <p className="text-sm text-center text-gray-600">
            If an account exists for <span className="font-bold">{email}</span>, a reset link has been sent. Check your inbox.
          </p>
        ) : (
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#063321] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-opacity-95 transition-all disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Token'}
            </button>
          </form>
        )}

        <div className="text-center">
          <a href="/signin" className="inline-flex items-center space-x-1 text-xs text-gray-400 hover:text-[#063321] font-semibold">
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Sign In</span>
          </a>
        </div>
      </div>
    </div>
  );
}