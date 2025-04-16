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
import parseJwt from "../helpers/parseJwt";

const toast = useToast();
const router = useRouter();
const checked1 = ref(false);

const initialValues = reactive({
  email: "",
  password: "",
});

const zodEmailResolver = zodResolver(
  z.string().min(1, { message: "Email is required." }),
);

const customPasswordResolver = ({ value }: { value: string }) => {
  const errors: Array<{ message: string }> = [];
  if (!value) {
    errors.push({ message: "Password is required." });
  }
  return { errors };
};

const onRegisterClick = () => {
  router.push("/register");
};

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
      const authApiBaseUrl = `${apiBaseUrl}:${authServicePort}`;

      const sessionServicePort = `${import.meta.env.VITE_SESSION_SERVICE_PORT}`;
      const sessionApiBaseUrl = `${apiBaseUrl}:${sessionServicePort}`;

      const accountServicePort = `${import.meta.env.VITE_ACCOUNT_SERVICE_PORT}`;
      const accountApiBaseUrl = `${apiBaseUrl}:${accountServicePort}`;

      const authResponse = await axios.post(
        `${authApiBaseUrl}/api/auth/login/`,
        {
          email: values.email,
          password: values.password,
        },
      );

      const { access, refresh } = authResponse.data;

      localStorage.setItem("accessToken", access);

      const accessPayload = parseJwt(access);
      const userId = accessPayload?.user_id || accessPayload?.sub;
      if (!userId) {
        throw new Error(
          "User ID could not be determined from the access token.",
        );
      }

      const refreshPayload = parseJwt(refresh);
      if (!refreshPayload || !refreshPayload.exp) {
        throw new Error("Refresh token expiration could not be determined.");
      }

      const refreshExpiration = new Date(refreshPayload.exp * 1000);

      const sessionResponse = await axios.post(
        `${sessionApiBaseUrl}/api/sessions/add/`,
        {
          user_id: userId,
          token: refresh,
          expires_at: refreshExpiration.toISOString(),
        },
      );
      const sessionRecord = sessionResponse.data;
      sessionStorage.setItem("sessionId", sessionRecord.session_id);

      const accountResponse = await axios.get(
        `${accountApiBaseUrl}/api/accounts/get/${userId}/`,
        { headers: { Authorization: `Token ${access}` } },
      );

      const user = accountResponse.data;
      toast.add({
        severity: "success",
        summary: `Welcome ${user.username} !`,
        detail: `You are now logged in.`,
        life: 3000,
      });
      router.push("/profile");
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
