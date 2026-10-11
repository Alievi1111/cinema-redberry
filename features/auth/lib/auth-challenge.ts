type AuthChallenge = {
  promise: Promise<void>;
  resolve: () => void;
  reject: (reason: Error) => void;
};

let challenge: AuthChallenge | null = null;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

export const subscribeAuthChallenge = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const isAuthChallengePending = () => challenge !== null;

export const waitForLogin = (): Promise<void> => {
  if (challenge) return challenge.promise;

  let resolve!: () => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<void>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });

  challenge = { promise, resolve, reject };
  notify();
  return promise;
};

export const completeAuthChallenge = () => {
  const pending = challenge;
  if (!pending) return;

  challenge = null;
  pending.resolve();
  notify();
};

export const cancelAuthChallenge = () => {
  const pending = challenge;
  if (!pending) return;

  challenge = null;
  pending.reject(new Error('Authentication cancelled.'));
  notify();
};
