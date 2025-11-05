'use client';

import { Suspense } from 'react';
import { Button } from "@/components/ui/button";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">Page Not Found</h2>
      <p className="text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Button className="mt-3">Go back to the Homepage</Button>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
}
