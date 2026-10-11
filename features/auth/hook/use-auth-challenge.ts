'use client';

import { useSyncExternalStore } from 'react';

import {
  isAuthChallengePending,
  subscribeAuthChallenge,
} from '../lib/auth-challenge';

export const useAuthChallenge = () =>
  useSyncExternalStore(subscribeAuthChallenge, isAuthChallengePending, () => false);
