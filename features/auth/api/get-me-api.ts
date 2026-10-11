import { api } from '@/lib/api';
import type { AuthUser, GetMeResponse } from '../types/type';

export async function getMeApi(): Promise<AuthUser> {
  const response = await api.get<GetMeResponse>('/me');

  return response.data.data;
}
