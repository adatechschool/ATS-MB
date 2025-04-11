// src\router\index.ts

import { createRouter, createWebHistory } from "vue-router";
import PageOne from "../pages/PageOne.vue";
import PageTwo from "../pages/PageTwo.vue";
import RegisterPage from "../pages/RegisterPage.vue";

const routes = [
  { path: "/", redirect: "/page-one" },
  { path: "/page-one", name: "PageOne", component: PageOne },
  { path: "/page-two", name: "PageTwo", component: PageTwo },
  { path: "/register", name: "RegisterPage", component: RegisterPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
