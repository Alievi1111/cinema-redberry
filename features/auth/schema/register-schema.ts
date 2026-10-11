import { z } from "zod";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const registerFields = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  password: z
    .string()
    .min(1, "Password is required")
    .min(3, "Password must be at least 3 characters"),
  password_confirmation: z.string().min(1, "Confirm your password"),
  avatar: z
    .file()
    .max(MAX_AVATAR_SIZE, "Avatar must be 2 MB or smaller")
    .mime(
      ["image/jpeg", "image/png", "image/webp"],
      "Avatar must be a JPG, PNG, or WebP image",
    )
    .nullish(),
});

export const registerSchema = registerFields.refine(
  ({ password, password_confirmation }) =>
    password === password_confirmation,
  {
    path: ["password_confirmation"],
    message: "Passwords do not match",
    when(payload) {
      return registerFields
        .pick({ password: true, password_confirmation: true })
        .safeParse(payload.value).success;
    },
  },
);
