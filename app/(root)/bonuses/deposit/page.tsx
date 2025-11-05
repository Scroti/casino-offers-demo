import { Suspense } from 'react';
import BonusesPage from "@/components/bonuses-page";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function DepositBonusesPageContent() {
  return <BonusesPage filter="deposit" />;
}

export default function DepositBonusesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading bonuses...</p>
      </div>
    }>
      <DepositBonusesPageContent />
    </Suspense>
  );
}
