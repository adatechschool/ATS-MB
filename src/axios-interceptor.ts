// src\axios-interceptor.ts
import axios from "axios";
import router from "./router";

const REFRESH_URL = "/api/sessions/refresh/";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest.url === REFRESH_URL) {
      router.push("/login");
      return Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(REFRESH_URL, {}, { withCredentials: true });
        return axios(originalRequest);
      } catch (refreshError) {
        router.push("/login");
        return Promise.reject(
          refreshError instanceof Error
            ? refreshError
            : new Error(String(refreshError)),
        );
      }
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);
