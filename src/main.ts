// src\main.ts

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Button from "primevue/button";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: "system",
    },
  },
});
app.use(router);
app.component("PrimeButton", Button);
app.mount("#app");
