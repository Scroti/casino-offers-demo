'use client';

import { useLoginMutation, useMeQuery } from '@/app/lib/data-access/configs/auth.config';
import { RootState } from '@/app/lib/data-access/store/store.config';
import { useSelector } from 'react-redux';

export function GlobalLoader() {
  const { isFetching: isAuthLoading } = useMeQuery(undefined, { skip: false });
   const isLoadingAuth = useSelector((state: RootState) => {
    const mutations = state.authApi?.mutations || {};

    // Check if any login or signup mutation is loading
    const isAuthMutationLoading = Object.values(mutations).some(
      (mutation: any) => mutation?.status === 'pending'
    );

    return isAuthMutationLoading;
  });
  const isLoading = isAuthLoading || isLoadingAuth;

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-51 backdrop-blur-md">
      <img
        src="/assets/images/logo.png"
        alt="Logo"
        className="w-24 h-auto animate-grayscalePulse"
      />
    </div>
  );
}
