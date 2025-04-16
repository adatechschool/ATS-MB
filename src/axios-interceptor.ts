// src\axios-interceptor.ts
import axios from "axios";
import router from "./router";

const apiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL;
const sessionServicePort = `${import.meta.env.VITE_SESSION_SERVICE_PORT}`;
const sessionApiBaseUrl = `${apiBaseUrl}:${sessionServicePort}`;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${sessionApiBaseUrl}/api/sessions/refresh/`,
          {},
          { withCredentials: true },
        );
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
