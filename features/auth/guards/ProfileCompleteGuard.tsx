'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { AuthLoadingScreen } from '@/features/common/components/primitives/AuthLoadingScreen';
import { REDIRECT } from '../config/routes.config';

interface GuardProps {
  children: React.ReactNode;
}

export const ProfileCompleteGuard = ({ children }: GuardProps) => {
  const router = useRouter();

  const { user, isLoading, isAuthenticated, isError } = useAuthUser();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !user.profileComplete) {
      router.replace(REDIRECT.completeProfile);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) return <AuthLoadingScreen />;

  if (isError || !isAuthenticated) return null;

  if (!user?.profileComplete) return null;

  return <>{children}</>;
};
