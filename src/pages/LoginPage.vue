<!-- src/pages/LoginPage.vue -->
<template>
  <main class="card flex flex-1 flex-col items-center justify-center">
    <PrimeForm
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex w-full flex-col gap-4 rounded-border bg-surface-50 p-5 shadow sm:w-120 dark:bg-surface-950"
    >
      <div class="mb-8 text-center">
        <h1 class="mb-4 text-3xl font-medium">Welcome!</h1>
        <span
          class="leading-normal font-medium text-surface-600 dark:text-surface-200"
        >
          Don't have an account?
        </span>
        <PrimeButton
          label="Create one here."
          variant="link"
          @click="onRegisterClick"
        />
      </div>
      <!-- Champ email -->
      <PrimeFormField
        v-slot="$field"
        name="email"
        initialValue=""
        :resolver="zodEmailResolver"
        class="flex flex-col gap-1"
      >
        <PrimeInputText type="text" placeholder="Email" />
        <PrimeMessage
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </PrimeMessage>
      </PrimeFormField>

      <!-- Champ password -->
      <PrimeFormField
        v-slot="$field"
        name="password"
        initialValue=""
        :resolver="customPasswordResolver"
        class="flex flex-col gap-1"
      >
        <PrimePassword
          type="text"
          placeholder="Password"
          :feedback="false"
          toggleMask
          fluid
        />
        <PrimeMessage
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </PrimeMessage>
      </PrimeFormField>

      <div class="mb-12 flex items-center justify-between">
        <div class="flex items-center">
          <PrimeCheckbox
            id="rememberme1"
            v-model="checked1"
            :binary="true"
            class="mr-2"
          />
          <label for="rememberme1">Remember me</label>
        </div>
        <PrimeButton label="Forgot password?" variant="link" />
      </div>

      <PrimeButton type="submit" severity="secondary" label="Login" />
    </PrimeForm>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const router = useRouter();
const checked1 = ref(false);

// Update initial form values to use "email" instead of "username"
const initialValues = reactive({
  email: "",
  password: "",
});

// Zod resolver for the email field
const zodEmailResolver = zodResolver(
  // Here we simply check for a nonempty string; you can further enhance it by using z.string().email(…)
  z.string().min(1, { message: "Email is required." }),
);

// Custom resolver for the password field
const customPasswordResolver = ({ value }: { value: string }) => {
  const errors: Array<{ message: string }> = [];
  if (!value) {
    errors.push({ message: "Password is required." });
  }
  return { errors };
};

// Handler for the "Register" button click
const onRegisterClick = () => {
  router.push("/register");
};

// Form submission handler
const onFormSubmit = async ({
  valid,
  values,
}: {
  valid: boolean;
  values: { email: string; password: string };
}) => {
  if (valid) {
    try {
      const apiBaseUrl = `${import.meta.env.VITE_DJANGO_API_BASE_URL}`;
      const authServicePort = `${import.meta.env.VITE_AUTH_SERVICE_PORT}`;
      const apiUrl = `${apiBaseUrl}:${authServicePort}/api/auth/login/`;
      // Requête 1 : Authentification pour récupérer le token
      const authResponse = await axios.post(apiUrl, {
        email: values.email,
        password: values.password,
      });

      const { access, refresh } = authResponse.data;

      // Save access token in localStorage
      localStorage.setItem("accessToken", access);
      // Save refresh token in session storage (which persists only for the current session)
      sessionStorage.setItem("refreshToken", refresh);

      axios.defaults.headers.common["Authorization"] = `Token ${access}`;

      // Requête 2 : Récupération des informations utilisateur via le token
      const accountResponse = await axios.get(
        `${import.meta.env.VITE_DJANGO_API_URL}/api/users/account/`,
        { headers: { Authorization: `Token ${access}` } },
      );
      const user = accountResponse.data;

      toast.add({
        severity: "success",
        summary: `Welcome ${user.username} !`,
        detail: `You are now logged in.`,
        life: 3000,
      });

      // Uncomment if you wish to navigate to /timeline after login
      // router.push("/timeline");
    } catch (error: unknown) {
      let errorMessage = "Login failed.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.add({
        severity: "error",
        summary: "Login failed.",
        detail: errorMessage,
        life: 3000,
      });
    }
  }
};
</script>

<style scoped>
/* Ajoutez ici des styles complémentaires si nécessaire */
</style>
