import { api } from '@/lib/api';

export const logoutApi = async (): Promise<void> => {
  await api.post<void>('/logout', undefined, { timeout: 10_000 });
};
