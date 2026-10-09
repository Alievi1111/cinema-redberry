"use client";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useLogin } from "@/features/auth/hook/use-login";
import { loginSchema } from "@/features/auth/schema/login-schema";
import type {
  AuthApiError,
  LoginPayload,
  LoginSession,
} from "@/features/auth/types/type";

type LoginFormProps = {
  onSuccess?: (session: LoginSession) => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = async (values: LoginPayload) => {
    clearErrors("root.server");

    let session: LoginSession;

    try {
      session = await login.mutateAsync(values);
    } catch (error) {
      if (axios.isAxiosError<AuthApiError>(error)) {
        const fieldErrors = error.response?.data?.errors;
        let hasFieldError = false;

        for (const field of ["email", "password"] as const) {
          const message = fieldErrors?.[field]?.[0];

          if (message) {
            setError(field, { type: "server", message });
            hasFieldError = true;
          }
        }

        if (hasFieldError) return;

        setError("root.server", {
          type: "server",
          message:
            error.response?.data?.message ?? "Unable to log in. Try again.",
        });
        return;
      }

      setError("root.server", {
        type: "server",
        message: "Unable to log in. Try again.",
      });
      return;
    }

    onSuccess?.(session);
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />
        {errors.email?.message && (
          <p id="login-email-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "login-password-error" : undefined
          }
          {...register("password")}
        />
        {errors.password?.message && (
          <p id="login-password-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root?.server?.message && (
        <p role="alert">{errors.root.server.message}</p>
      )}

      {login.isSuccess && (
        <p role="status">Logged in as {login.data.user.username}.</p>
      )}

      <button type="submit" disabled={login.isPending}>
        {login.isPending ? "Logging In..." : "Log In"}
      </button>
    </form>
  );
}
