'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { AUTH_CHANGED_EVENT, getAuthSessionId } from '../lib/auth-session';

const subscribe = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (
      event.key === 'auth_token' ||
      event.key === 'auth_session_id' ||
      event.key === null
    ) {
      callback();
    }
  };

  window.addEventListener(AUTH_CHANGED_EVENT, callback);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
};

export const useAuthSession = () => {
  const sessionId = useSyncExternalStore(
    subscribe,
    getAuthSessionId,
    () => null
  );

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return { sessionId, isReady };
};
