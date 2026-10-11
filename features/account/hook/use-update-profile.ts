'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AUTH_USER_QUERY_KEY } from '@/features/auth/hook/use-auth-user';
import { getAuthSessionId } from '@/features/auth/lib/auth-session';

import { updateProfileApi } from '../api/update-profile-api';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileApi,

    onSuccess: (updatedUser) => {
      const sessionId = getAuthSessionId();

      if (!sessionId) return;

      queryClient.setQueryData(
        [...AUTH_USER_QUERY_KEY, sessionId],
        updatedUser
      );
    },
  });
};
