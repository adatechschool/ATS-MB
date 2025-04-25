// src\router\index.ts

import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "../pages/RegisterPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import PostsPage from "../pages/PostsPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import { useAuth } from "../composables/useAuth";
import CreatePost from "../pages/CreatePost.vue";

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
  {
    path: "/posts",
    name: "PostsPage",
    component: PostsPage,
    meta: { requiresAuth: true },
  },
  { path: "/create-post", name: "CreatePost", component: CreatePost },
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
