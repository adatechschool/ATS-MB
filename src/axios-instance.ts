// src\axios-instance.ts

import axios from "axios";

// 1) base config for all our services
const api = axios.create({
  baseURL: "/",
  withCredentials: true, // always send & receive cookies
});

// 2) Fetch the CSRF cookie once, before doing anything else:
export async function initCsrf() {
  try {
    await api.get("/api/auth/csrf/");
  } catch (err) {
    console.error("Could not fetch CSRF token:", err);
  }
}

// 3) Helper to read a cookie by name
function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

// 4) On every request, add the X-CSRFToken header if we have one
api.interceptors.request.use((config) => {
  const token = getCookie("csrftoken");
  if (token) {
    config.headers = {
      ...config.headers,
      "X-CSRFToken": token,
    };
  }
  return config;
});

export default api;
