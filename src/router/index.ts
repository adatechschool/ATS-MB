// src\router\index.ts

import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "../pages/RegisterPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import UsersPage from "../pages/UsersPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import { useAuth } from "../composables/useAuth";

const routes = [
  { path: "/", redirect: "/register" },
  { path: "/register", name: "RegisterPage", component: RegisterPage },
  { path: "/login", name: "LoginPage", component: LoginPage },
  {
    path: "/profile",
    name: "ProfilePage",
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  { path: "/users", name: "UsersPage", component: UsersPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const { isAuthenticated, fetchAuth } = useAuth();

  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      const ok = await fetchAuth();
      return ok ? next() : next("/login");
    }
    return next();
  }

  next();
});

export default router;
