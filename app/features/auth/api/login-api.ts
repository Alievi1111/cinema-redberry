import { api } from "@/lib/api";

import type { LoginPayload, LoginResponse, LoginSession } from "../types/type";

export async function loginApi(payload: LoginPayload): Promise<LoginSession> {
  const response = await api.post<LoginResponse>("/login", payload);
  return response.data.data;
}
