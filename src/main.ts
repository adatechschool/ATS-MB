// src\main.ts

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Button from "primevue/button";
import { Form, FormField } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Password from "primevue/password";
import Textarea from "primevue/textarea";
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
app.use(ToastService);
app.component("PrimeButton", Button);
app.component("PrimeForm", Form);
app.component("PrimeFormField", FormField);
app.component("PrimeInputText", InputText);
app.component("PrimeMessage", Message);
app.component("PrimePassword", Password);
app.component("PrimeTextarea", Textarea);
app.component("PrimeToast", Toast);
app.use(router);
app.mount("#app");
