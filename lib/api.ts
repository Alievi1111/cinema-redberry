import axios from "axios";

import { getAuthToken } from "@/lib/auth-token";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://api.kinoxii.redberryinternship.ge/api",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.url === "/login") {
    return config;
  }

  const token = getAuthToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});
