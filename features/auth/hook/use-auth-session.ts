'use client';

import { useSyncExternalStore } from 'react';

import {
  AUTH_CHANGED_EVENT,
  AUTH_SESSION_KEY,
  AUTH_TOKEN_KEY,
  getAuthSessionId,
} from '../lib/auth-session';

const subscribe = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (
      event.key === AUTH_TOKEN_KEY ||
      event.key === AUTH_SESSION_KEY ||
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

const subscribeToHydration = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;

export const useAuthSession = () => {
  const sessionId = useSyncExternalStore(
    subscribe,
    getAuthSessionId,
    () => null
  );

  const isReady = useSyncExternalStore(
    subscribeToHydration,
    getClientReady,
    getServerReady
  );

  return { sessionId, isReady };
};
