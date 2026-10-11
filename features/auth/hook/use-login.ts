"use client";

import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getAuthSessionId, saveAuthToken } from "../lib/auth-session";

import { loginApi } from "../api/login-api";
import { AUTH_USER_QUERY_KEY } from "../query-keys";
import type {
  AuthApiError,
  AuthUser,
  LoginPayload,
  LoginSession,
} from "../types/type";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginSession, AxiosError<AuthApiError>, LoginPayload>({
    mutationFn: loginApi,
    onSuccess: ({ token, user }) => {
      saveAuthToken(token);
      queryClient.setQueryData<AuthUser>(
        [...AUTH_USER_QUERY_KEY, getAuthSessionId()],
        user
      );
    },
  });
}
