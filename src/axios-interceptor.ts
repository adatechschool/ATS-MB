// In src/axios-interceptor.ts
import axios from "axios";
import router from "./router";

const apiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL;
const sessionServicePort = import.meta.env.VITE_SESSION_SERVICE_PORT; // Define this in your .env

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check for 401 error and ensure we haven't retried already.
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Call the refresh endpoint
          const response = await axios.post(
            `${apiBaseUrl}:${sessionServicePort}/api/sessions/refresh/`,
            { refresh_token: refreshToken },
          );
          const newAccessToken = response.data.access;
          // Update local storage and default headers.
          localStorage.setItem("accessToken", newAccessToken);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed; clear tokens and redirect to login.
          localStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          router.push("/login");
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available; force login.
        router.push("/login");
      }
    }
    return Promise.reject(error);
  },
);
