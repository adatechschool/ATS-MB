// src\axios-interceptor.ts
import axios from "axios";
import router from "./router";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const sessionId = sessionStorage.getItem("sessionId");
      if (sessionId) {
        try {
          const apiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL;
          const sessionServicePort = import.meta.env.VITE_SESSION_SERVICE_PORT;
          // Make a refresh request with the session id.
          const response = await axios.post(
            `${apiBaseUrl}:${sessionServicePort}/api/sessions/refresh/`,
            { session_id: sessionId },
          );
          const newAccessToken = response.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed; clear tokens and force login.
          localStorage.removeItem("accessToken");
          sessionStorage.removeItem("sessionId");
          router.push("/login");
          return Promise.reject(
            refreshError instanceof Error
              ? refreshError
              : new Error(String(refreshError)),
          );
        }
      } else {
        router.push("/login");
      }
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);
