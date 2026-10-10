const TOKEN_KEY = 'kinoxii_auth_token';
const SESSION_KEY = 'kinoxii_auth_session_id';

export const AUTH_CHANGED_EVENT = 'auth:changed';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthSessionId = (): string | null => {
  if (!getAuthToken()) return null;

  return localStorage.getItem(SESSION_KEY) ?? 'legacy-session';
};

export const saveAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, crypto.randomUUID());

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};
