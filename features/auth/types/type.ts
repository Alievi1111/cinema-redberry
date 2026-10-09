import type { z } from "zod";

import type { loginSchema } from "../schema/login-schema";

export type LoginPayload = z.infer<typeof loginSchema>;

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  profileComplete: boolean;
};

export type LoginSession = {
  user: AuthUser;
  token: string;
};

export type LoginResponse = {
  data: LoginSession;
};

export type AuthApiError = {
  message: string;
  errors?: Record<string, string[]>;
};
