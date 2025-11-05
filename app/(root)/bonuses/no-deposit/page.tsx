import { Suspense } from 'react';
import BonusesPage from "@/components/bonuses-page";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function NoDepositBonusesPageContent() {
  return <BonusesPage filter="no-deposit" />;
}

export default function NoDepositBonusesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading bonuses...</p>
      </div>
    }>
      <NoDepositBonusesPageContent />
    </Suspense>
  );
}
