// app/reset-password/page.tsx
import { Suspense } from "react";
import ResetContent from "./ResetContent";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FBF9] flex items-center justify-center p-4">
        <div className="animate-pulse text-[#063321] font-medium">
          Loading reset password form...
        </div>
      </div>
    }>
      <ResetContent />
    </Suspense>
  );
}