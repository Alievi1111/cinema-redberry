import axios from 'axios';

import { getAuthToken, clearAuthToken } from '@/features/auth/lib/auth-session';

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
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';

      const isAuthEndpoint =
        url.endsWith('/login') || url.endsWith('/register');

      const sentAuthorization = error.config?.headers?.get('Authorization');

      const currentToken = getAuthToken();

      if (
        !isAuthEndpoint &&
        currentToken &&
        sentAuthorization === `Bearer ${currentToken}`
      ) {
        clearAuthToken();
      }
    }

    return Promise.reject(error);
  }
);
