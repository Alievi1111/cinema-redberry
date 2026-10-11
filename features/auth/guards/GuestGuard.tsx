'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { AuthLoadingScreen } from '@/features/common/components/primitives/AuthLoadingScreen';
import { REDIRECT } from '../config/routes.config';

interface GuardProps {
  children: React.ReactNode;
}

export const GuestGuard = ({ children }: GuardProps) => {
  const router = useRouter();

  const { isAuthenticated, isLoading, isError, refetch } = useAuthUser();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(REDIRECT.afterLogin);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <AuthLoadingScreen />;

  if (isError) {
    return (
      <button onClick={() => void refetch()}>
        სესიის შემოწმების გამეორება
      </button>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
};
