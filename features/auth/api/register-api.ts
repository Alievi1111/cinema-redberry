import { api } from "@/lib/api";

import type {
  RegisterPayload,
  RegisterResponse,
  RegisterSession,
} from "../types/type";

export async function registerApi(
  payload: RegisterPayload,
): Promise<RegisterSession> {
  const formData = new FormData();
  formData.set("username", payload.username);
  formData.set("email", payload.email);
  formData.set("password", payload.password);
  formData.set("password_confirmation", payload.password_confirmation);

  if (payload.avatar) {
    formData.set("avatar", payload.avatar);
  }

  const response = await api.post<RegisterResponse>("/register", formData);
  return response.data.data;
}
