"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";

import { useRegister } from "@/features/auth/hook/use-register";
import { registerSchema } from "@/features/auth/schema/register-schema";
import type {
  AuthApiError,
  RegisterPayload,
  RegisterSession,
} from "@/features/auth/types/type";

type RegisterFormProps = {
  onSuccess?: (session: RegisterSession) => void;
};

const registerFields = [
  "username",
  "email",
  "password",
  "password_confirmation",
  "avatar",
] as const;

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const registration = useRegister();
  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      avatar: null,
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const selectAvatar = (file: File | undefined) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    const nextUrl = file?.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;
    previewUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
    setValue("avatar", file ?? null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const submit = async (values: RegisterPayload) => {
    clearErrors("root.server");

    let session: RegisterSession;

    try {
      session = await registration.mutateAsync(values);
    } catch (error) {
      if (axios.isAxiosError<AuthApiError>(error)) {
        const fieldErrors = error.response?.data?.errors;
        let hasFieldError = false;

        for (const field of registerFields) {
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
            error.response?.data?.message ?? "Unable to sign up. Try again.",
        });
        return;
      }

      setError("root.server", {
        type: "server",
        message: "Unable to sign up. Try again.",
      });
      return;
    }

    onSuccess?.(session);
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div>
        <label htmlFor="register-username">Username</label>
        <input
          id="register-username"
          type="text"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? "register-username-error" : undefined}
          {...register("username")}
        />
        {errors.username?.message && (
          <p id="register-username-error" role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          {...register("email")}
        />
        {errors.email?.message && (
          <p id="register-email-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "register-password-error" : undefined}
          {...register("password")}
        />
        {errors.password?.message && (
          <p id="register-password-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-password-confirmation">Confirm Password</label>
        <input
          id="register-password-confirmation"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password_confirmation)}
          aria-describedby={
            errors.password_confirmation
              ? "register-password-confirmation-error"
              : undefined
          }
          {...register("password_confirmation")}
        />
        {errors.password_confirmation?.message && (
          <p id="register-password-confirmation-error" role="alert">
            {errors.password_confirmation.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-avatar">Avatar (optional)</label>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <input
              id="register-avatar"
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              aria-invalid={Boolean(errors.avatar)}
              aria-describedby={errors.avatar ? "register-avatar-error" : undefined}
              onChange={(event) => selectAvatar(event.target.files?.[0])}
            />
          )}
        />
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Avatar preview"
            width={120}
            height={120}
            unoptimized
          />
        )}
        {errors.avatar?.message && (
          <p id="register-avatar-error" role="alert">
            {errors.avatar.message}
          </p>
        )}
      </div>

      {errors.root?.server?.message && (
        <p role="alert">{errors.root.server.message}</p>
      )}

      {registration.isSuccess && (
        <p role="status">
          Registered as {registration.data.user.username}.
          {!registration.data.user.profileComplete &&
            " Complete your profile before booking."}
        </p>
      )}

      <button type="submit" disabled={registration.isPending}>
        {registration.isPending ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
