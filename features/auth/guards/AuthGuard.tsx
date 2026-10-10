'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { AuthLoadingScreen } from '@/features/common/components/primitives/AuthLoadingScreen';
import { REDIRECT } from '../config/routes.config';

interface GuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: GuardProps) => {
  const router = useRouter();

  const { isAuthenticated, hasToken, isLoading, isError, refetch } =
    useAuthUser();

  useEffect(() => {
    if (!isLoading && !hasToken) {
      router.replace(REDIRECT.afterLogout);
    }
  }, [isLoading, hasToken, router]);

  if (isLoading) return <AuthLoadingScreen />;

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
