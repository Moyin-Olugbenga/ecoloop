"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Mail, Shield, UserX, Lock, AlertTriangle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  // EcoLoop Pitch Deck Brand Color System Mapping
  const brandColors = {
    primary: "bg-[#063321] hover:bg-opacity-90 focus:ring-[#9DE3C5]",
    primaryLight: "text-[#063321]",
    primaryBg: "bg-[#F8FBF9]",
    primaryBorder: "border-gray-200",
    primaryHover: "hover:bg-gray-50",
    accentMint: "text-[#9DE3C5]",
  };

  const errorMessages: Record<string, { title: string; message: string; icon: React.ReactNode }> = {
    "AccessDenied": {
      title: "Access Denied",
      message: "Your current platform role profile does not grant permission to access this resource loop node.",
      icon: <Shield className="h-12 w-12 text-red-500" />
    },
    "OAuthAccountNotLinked": {
      title: "Account Already Linked",
      message: "This email address is already associated with an existing EcoLoop profile. Please authenticate using your primary original provider.",
      icon: <AlertCircle className="h-12 w-12 text-yellow-500" />
    },
    "OAuthCallback": {
      title: "Authentication Failed",
      message: "There was an unexpected failure executing the authentication callback flow. Please try again.",
      icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />
    },
    "OAuthCreateAccount": {
      title: "Account Creation Failed",
      message: "We were unable to initialize your sector profile configuration. Please retry or alert system support.",
      icon: <UserX className="h-12 w-12 text-red-500" />
    },
    "OAuthSignIn": {
      title: "Sign In Failed",
      message: "An internal handshake error occurred during active sign in processing. Please try again.",
      icon: <Lock className="h-12 w-12 text-red-500" />
    },
    "EmailCreateAccount": {
      title: "Profile Creation Failed",
      message: "We were unable to provision an account for this specific email address. Please retry.",
      icon: <Mail className="h-12 w-12 text-red-500" />
    },
    "CallbackRouteError": {
      title: "Authentication Error",
      message: "A functional callback routing variance interrupted registration execution.",
      icon: <AlertCircle className="h-12 w-12 text-red-500" />
    },
    "OAuthAccountNotFound": {
      title: "Profile Not Found",
      message: "No active platform profile could be identified for this provider. Please complete register sign up protocols first.",
      icon: <UserX className="h-12 w-12 text-yellow-500" />
    },
    "EmailSignIn": {
      title: "Email Dispatch Failed",
      message: "We were unable to successfully transmit your secure entry link. Please re-verify parameters and retry.",
      icon: <Mail className="h-12 w-12 text-red-500" />
    },
    "CredentialsSignin": {
      title: "Invalid Credentials",
      message: "The identifier or password match pattern provided was rejected. Please review inputs and attempt authentication again.",
      icon: <Lock className="h-12 w-12 text-red-500" />
    },
    "ACCOUNT_NOT_ACTIVATED": {
      title: "Ecosystem Node Inactive",
      message: "Please check your inbox or activation queue to finalize sector profile verification before initiating direct dashboard access.",
      icon: <Mail className="h-12 w-12 text-yellow-500" />
    },
    "default": {
      title: "System Exception",
      message: "An unhandled authentication error interrupted system execution parameters. Please retry.",
      icon: <AlertCircle className="h-12 w-12 text-red-500" />
    }
  };

  const errorInfo = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FBF9] p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 relative">
          {/* Aesthetic top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#063321] rounded-t-2xl" />

          {/* Logo/Brand Header Context */}
          <div className="flex flex-col items-center justify-center mb-6 space-y-2">
            <div className="bg-[#063321] p-2.5 rounded-xl text-[#9DE3C5] shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </div>
            <span className="font-black text-sm tracking-wider text-[#063321]">ECOLOOP LOGISTICS</span>
          </div>

          {/* Incident Icon */}
          <div className="flex justify-center mb-4 bg-[#F8FBF9] w-20 h-20 rounded-2xl items-center mx-auto border border-gray-100">
            {errorInfo.icon}
          </div>

          {/* Error Message Title */}
          <h1 className={`text-2xl font-black text-center ${brandColors.primaryLight} tracking-tight mb-2`}>
            {errorInfo.title}
          </h1>

          {/* Functional Description Message */}
          <p className="text-center text-xs text-gray-500 leading-relaxed mb-8 max-w-xs mx-auto">
            {errorInfo.message}
          </p>

          {/* Context Action Triggers */}
          <div className="space-y-3">
            <Link
              href="/signin"
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white ${brandColors.primary} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`}
            >
              <ArrowLeft className="h-4 w-4 text-[#9DE3C5]" />
              Return to Sign In
            </Link>
            
            {error === "ACCOUNT_NOT_ACTIVATED" && (
              <Link
                href="/auth/resend-verification"
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border ${brandColors.primaryBorder} rounded-xl shadow-sm text-sm font-bold ${brandColors.primaryLight} bg-white ${brandColors.primaryHover} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`}
              >
                <Mail className="h-4 w-4" />
                Resend Activation Payload
              </Link>
            )}
          </div>

          {/* Divider Elements Block */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">
                Need operational support?
              </span>
            </div>
          </div>

          {/* Help Center Navigation Link Anchor */}
          <p className="text-xs text-center text-gray-400">
            Alert architecture desks at{" "}
            <a href="mailto:support@ecoloop.lagos" className={`${brandColors.primaryLight} hover:underline font-bold`}>
              support@ecoloop.lagos
            </a>
          </p>
        </div>

        {/* Global Structural Context Footer */}
        <p className="mt-4 text-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
          &copy; 2026 EcoLoop Platform Framework.
        </p>
      </div>
    </div>
  );
}