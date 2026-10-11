'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { useAuthChallenge } from '@/features/auth/hook/use-auth-challenge';
import { waitForLogin } from '@/features/auth/lib/auth-challenge';
import { AuthLoadingScreen } from '@/features/common/components/primitives/AuthLoadingScreen';
import { REDIRECT } from '../config/routes.config';

interface GuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: GuardProps) => {
  const router = useRouter();

  const { isAuthenticated, hasToken, isLoading, isError, refetch } =
    useAuthUser();
  const challengePending = useAuthChallenge();
  const challengeStarted = useRef(false);

  useEffect(() => {
    if (isLoading || hasToken) return;

    if (challengePending) {
      challengeStarted.current = true;
    } else if (challengeStarted.current) {
      router.replace(REDIRECT.afterLogout);
    } else {
      challengeStarted.current = true;
      void waitForLogin().catch(() => {});
    }
  }, [isLoading, hasToken, challengePending, router]);

  if (isLoading || challengePending) return <AuthLoadingScreen />;

  if (isError) {
    return (
      <div>
        <p>მომხმარებლის მონაცემების ჩატვირთვა ვერ მოხერხდა.</p>
        <button onClick={() => void refetch()}>თავიდან ცდა</button>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};
