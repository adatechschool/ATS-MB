// src\axios-interceptor.ts
import api from "./axios-instance";
import router from "./router";

const REFRESH_URL = "/api/sessions/refresh/";

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const resp = error.response;
    const originalRequest = error.config;

    // 1) If this is the refresh endpoint itself, go to login
    if (resp?.status === 401 && originalRequest.url === REFRESH_URL) {
      router.push("/login");
      return Promise.reject(new Error(error.message));
    }

    // 2) ONLY refresh when the access‐token is EXPIRED or INVALID,
    //    _not_ on every 401 (e.g. user_not_found)
    const isAccessTokenExpired =
      resp?.status === 401 &&
      resp.data?.code === "token_not_valid" &&
      resp.data?.detail?.[0]?.token_class === "AccessToken";

    if (isAccessTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post(REFRESH_URL, {}, { withCredentials: true });
        return api(originalRequest);
      } catch {
        router.push("/login");
        return Promise.reject(new Error(error.message));
      }
    }

    return Promise.reject(new Error(error.message));
  },
);
