// src\router\index.ts

import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "../pages/RegisterPage.vue";
import LoginPage from "../pages/LoginPage.vue";
// import TimelinePage from "../pages/TimelinePage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import { useAuth } from "../composables/useAuth";

const routes = [
  { path: "/", redirect: "/register" },
  // { path: "/timeline", name: "TimelinePage", component: TimelinePage },
  { path: "/register", name: "RegisterPage", component: RegisterPage },
  { path: "/login", name: "LoginPage", component: LoginPage },
  {
    path: "/profile",
    name: "ProfilePage",
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const { isAuthenticated } = useAuth();
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next("/login");
  } else {
    next();
  }
});

export default router;
