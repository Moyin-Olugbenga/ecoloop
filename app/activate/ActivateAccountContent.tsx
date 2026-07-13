// app/activate/ActivateAccountContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, MailCheck, XCircle } from 'lucide-react';
import { activateAccount, resendActivation } from '@/app/actions/auth';

type Status = 'activating' | 'success' | 'error' | 'missing';

export default function ActivateAccountContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('activating');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('missing');
      return;
    }

    activateAccount(token)
      .then((result) => {
        setEmail(result.email);
        setStatus('success');
      })
      .catch((err) => {
        setErrorMessage(err instanceof Error ? err.message : 'Activation failed');
        setStatus('error');
      });
  }, [token]);

  async function handleResend() {
    if (!email) return;
    await resendActivation(email);
    setResent(true);
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 relative">
        <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl ${status === 'error' ? 'bg-red-500' : 'bg-[#063321]'}`} />

        {status === 'activating' && (
          <div className="text-center space-y-2 py-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#063321] flex items-center justify-center mx-auto animate-pulse">
              <MailCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#063321]">Activating your account...</h1>
            <p className="text-xs text-gray-500">Hang tight, this only takes a moment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-3 py-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#063321] flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#063321]">Account Activated</h1>
            <p className="text-xs text-gray-500">
              {email ? <span className="font-bold">{email}</span> : 'Your account'} is ready to go.
            </p>
            <a
              href="/signin"
              className="inline-flex w-full items-center justify-center bg-[#063321] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-opacity-95 transition-all mt-2"
            >
              Continue to Sign In
            </a>
          </div>
        )}

        {(status === 'error' || status === 'missing') && (
          <div className="text-center space-y-3 py-2">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#063321]">
              {status === 'missing' ? 'Missing Activation Link' : 'Activation Failed'}
            </h1>
            <p className="text-xs text-gray-500">
              {status === 'missing'
                ? "This page needs a valid activation link. Check the email we sent you, or request a new one below."
                : errorMessage || 'This link is invalid or has expired.'}
            </p>

            {status === 'error' && !resent && (
              <div className="pt-2">
                <input
                  type="email"
                  placeholder="Enter your email to resend"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321] mb-3"
                />
                <button
                  onClick={handleResend}
                  disabled={!email}
                  className="w-full bg-[#063321] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-opacity-95 transition-all disabled:opacity-60"
                >
                  Resend Activation Link
                </button>
              </div>
            )}

            {resent && (
              <p className="text-sm text-green-700 font-medium pt-2">
                If that email has an account, a new activation link is on its way.
              </p>
            )}

            <a href="/signin" className="inline-block text-xs text-gray-400 hover:text-[#063321] font-semibold pt-2">
              Return to Sign In
            </a>
          </div>
        )}
      </div>
    </div>
  );
}