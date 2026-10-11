export const AUTH_TOKEN_KEY = 'kinoxii_auth_token';
export const AUTH_SESSION_KEY = 'kinoxii_auth_session_id';

export const AUTH_CHANGED_EVENT = 'auth:changed';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getAuthSessionId = (): string | null => {
  if (!getAuthToken()) return null;

  return localStorage.getItem(AUTH_SESSION_KEY) ?? 'legacy-session';
};

export const saveAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_SESSION_KEY, crypto.randomUUID());

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_SESSION_KEY);

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};
