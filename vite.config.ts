// vite.config.ts

/// <reference types="vite/client" />
/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const DJANGO = env.VITE_DJANGO_API_BASE_URL;
  const AUTH = env.VITE_AUTH_SERVICE_PORT;
  const ACC = env.VITE_ACCOUNT_SERVICE_PORT;
  const SESS = env.VITE_SESSION_SERVICE_PORT;
  const USERS = env.VITE_USER_SERVICE_PORT;
  const POSTS = env.VITE_POSTS_SERVICE_PORT;

  return {
    plugins: [vue(), tailwindcss()],
    server: {
      proxy: {
        "/api/auth": {
          target: `${DJANGO}:${AUTH}`,
          changeOrigin: true,
          secure: false,
        },
        "/api/accounts": {
          target: `${DJANGO}:${ACC}`,
          changeOrigin: true,
          secure: false,
        },
        "/api/sessions": {
          target: `${DJANGO}:${SESS}`,
          changeOrigin: true,
          secure: false,
        },
        "/api/users": {
          target: `${DJANGO}:${USERS}`,
          changeOrigin: true,
          secure: false,
        },
        "/api/posts": {
          target: `${DJANGO}:${POSTS}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    optimizeDeps: {
      include: ["vitest"],
    },
    test: {
      globals: true,
      include: ["tests/**/*.test.ts"],
      reporters: ["verbose"],
      isolate: false,
      watch: false,
      environment: "jsdom",
    },
  };
});
