"use client";

import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setAuthToken } from "@/lib/auth-token";

import { registerApi } from "../api/register-api";
import { AUTH_USER_QUERY_KEY } from "../query-keys";
import type {
  AuthApiError,
  AuthUser,
  RegisterPayload,
  RegisterSession,
} from "../types/type";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<
    RegisterSession,
    AxiosError<AuthApiError>,
    RegisterPayload
  >({
    mutationFn: registerApi,
    onSuccess: ({ token, user }) => {
      setAuthToken(token);
      queryClient.setQueryData<AuthUser>(AUTH_USER_QUERY_KEY, user);
    },
  });
}
