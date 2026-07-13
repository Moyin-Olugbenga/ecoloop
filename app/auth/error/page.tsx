import { Suspense } from "react";
import AuthErrorContent from "./AuthErrorContent";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FBF9] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#063321]"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}