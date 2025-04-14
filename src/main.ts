// src\main.ts

import "primeicons/primeicons.css";
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
import Menubar from "primevue/menubar";
import Badge from "primevue/badge";
import Avatar from "primevue/avatar";
import Chip from "primevue/chip";
import Checkbox from "primevue/checkbox";

import App from "./App.vue";
import router from "./router";

import PrimeNavbar from "./components/PrimeNavbar.vue";
import FooterComponent from "./components/FooterComponent.vue";

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

app.component("PrimeToast", Toast);
app.component("PrimeButton", Button);
app.component("PrimeForm", Form);
app.component("PrimeFormField", FormField);
app.component("PrimeInputText", InputText);
app.component("PrimeMessage", Message);
app.component("PrimePassword", Password);
app.component("PrimeTextarea", Textarea);
app.component("PrimeMenubar", Menubar);
app.component("PrimeBadge", Badge);
app.component("PrimeAvatar", Avatar);
app.component("PrimeChip", Chip);
app.component("PrimeCheckbox", Checkbox);

app.component("PrimeNavbar", PrimeNavbar);
app.component("FooterComponent", FooterComponent);

app.use(router);
app.mount("#app");
