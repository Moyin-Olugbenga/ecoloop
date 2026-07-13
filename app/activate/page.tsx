// app/activate/page.tsx
import { Suspense } from "react";
import ActivateAccountContent from "./ActivateAccountContent";

export default function ActivateAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FBF9] flex items-center justify-center p-4">
        <div className="animate-pulse text-[#063321] font-medium">
          Loading activation status...
        </div>
      </div>
    }>
      <ActivateAccountContent />
    </Suspense>
  );
}