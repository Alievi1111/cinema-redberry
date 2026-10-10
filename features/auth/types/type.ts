import type { z } from 'zod';
import type { loginSchema } from '../schema/login-schema';
import type { registerSchema } from '../schema/register-schema';

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  fullName: string | null;
  mobileNumber: string | null;
  dateOfBirth: string | null;
  age: number | null;
  preferredVenue: {
    id: number;
    slug: string;
    name: string;
    city: string;
    formats: {
      id: number;
      slug: string;
      name: string;
      priceUplift: number;
    }[];
  } | null;
  profileComplete: boolean;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};

export type LoginSession = AuthSession;
export type RegisterSession = AuthSession;

export type AuthResponse = {
  data: AuthSession;
};

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;

export type AuthApiError = {
  message: string;
  errors?: Record<string, string[]>;
};

export type GetMeResponse = {
  data: AuthUser;
};
