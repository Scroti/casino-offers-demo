'use client';

import { Suspense } from 'react';
import BonusesPage from '@/components/bonuses-page';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function BonusesPageContent() {
  return <BonusesPage />;
}

export default function BonusesPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading bonuses...</p>
      </div>
    }>
      <BonusesPageContent />
    </Suspense>
  );
}