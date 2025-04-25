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
      <PrimeFormField
        v-slot="$field"
        name="email"
        initialValue=""
        :resolver="zodEmailResolver"
        class="flex flex-col gap-1"
      >
        <PrimeInputText v-bind="$field" type="text" placeholder="Email" />
        <PrimeMessage
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </PrimeMessage>
      </PrimeFormField>

      <PrimeFormField
        v-slot="$field"
        name="password"
        initialValue=""
        :resolver="customPasswordResolver"
        class="flex flex-col gap-1"
      >
        <PrimePassword
          v-bind="$field"
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

      <PrimeButton type="submit" severity="secondary" label="Login" />
    </PrimeForm>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { reactive } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import api from "../axios-instance";
import { useToast } from "primevue/usetoast";
import { useAuth } from "../composables/useAuth";

const toast = useToast();
const router = useRouter();
const { setAuthenticated, fetchAuth } = useAuth();

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
      const payload = {
        email: values.email,
        password: values.password,
      };
      const authResponse = await api.post(`/api/auth/login/`, payload);

      if (authResponse.status === 200) {
        setAuthenticated(true);
        toast.add({
          severity: "success",
          summary: `Login successful!`,
          detail: `You are now logged in.`,
          life: 3000,
        });
        setAuthenticated(true);
        await fetchAuth();
        router.push("/profile");
      } else {
        toast.add({
          severity: "error",
          summary: "Login failed.",
          detail: "Wrong username or password.",
          life: 3000,
        });
      }
    } catch (error: unknown) {
      let errorMessage = "Login failed.";
      if (api.isAxiosError(error) && error.response) {
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
