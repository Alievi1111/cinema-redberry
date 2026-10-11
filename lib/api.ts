import axios, { type InternalAxiosRequestConfig } from 'axios';

import { getAuthToken, clearAuthToken } from '@/features/auth/lib/auth-session';
import { waitForLogin } from '@/features/auth/lib/auth-challenge';

type AuthRequestConfig = InternalAxiosRequestConfig & { authRetried?: boolean };

export const api = axios.create({
  baseURL: 'https://api.kinoxii.redberryinternship.ge/api',
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers.delete('Authorization');
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const request = error.config as AuthRequestConfig | undefined;
    const url = request?.url ?? '';
    if (
      !request ||
      typeof window === 'undefined' ||
      url.endsWith('/login') ||
      url.endsWith('/register') ||
      url.endsWith('/logout')
    ) {
      return Promise.reject(error);
    }

    const sentAuthorization = request.headers.get('Authorization');
    const currentToken = getAuthToken();

    // A response from an older session must not clear a newer login.
    if (
      sentAuthorization &&
      currentToken &&
      sentAuthorization !== `Bearer ${currentToken}`
    ) {
      if (request.authRetried || url.endsWith('/me')) {
        return Promise.reject(error);
      }

      request.authRetried = true;
      return api.request(request);
    }

    if (currentToken && sentAuthorization === `Bearer ${currentToken}`) {
      clearAuthToken();
    }

    // /me on startup only discards a stale token; it does not prompt.
    if (url.endsWith('/me') || request.authRetried) {
      return Promise.reject(error);
    }

    try {
      await waitForLogin();
      if (!getAuthToken()) return Promise.reject(error);

      request.authRetried = true;
      return api.request(request);
    } catch {
      return Promise.reject(error);
    }
  }
);
