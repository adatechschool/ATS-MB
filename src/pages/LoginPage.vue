<!-- src\pages\LoginPage.vue -->

<template>
  <main class="card flex flex-1 flex-col items-center justify-center">
    <PrimeForm
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex w-full flex-col gap-4 sm:w-80"
    >
      <div class="mb-8 text-center">
        <h1 class="mb-4 text-3xl font-medium">Welcome!</h1>
        <span
          class="text-surface-600 dark:text-surface-200 leading-normal font-medium"
          >Don't have an account?</span
        >
        <PrimeButton
          label="Create one here."
          variant="link"
          @click="onRegisterClick"
        />
      </div>
      <!-- Champ username -->
      <PrimeFormField
        v-slot="$field"
        name="username"
        initialValue=""
        :resolver="zodUserNameResolver"
        class="flex flex-col gap-1"
      >
        <PrimeInputText type="text" placeholder="Username" />
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

// Valeurs initiales du formulaire
const initialValues = reactive({
  username: "",
  password: "",
});

// Résolveur pour le champ username via Zod
const zodUserNameResolver = zodResolver(
  z.string().min(1, { message: "Username is required." }),
);

// Résolveur personnalisé pour le champ password
const customPasswordResolver = ({ value }: { value: string }) => {
  const errors: Array<{ message: string }> = [];
  if (!value) {
    errors.push({ message: "Password is required." });
  }
  return { errors };
};

// Handler de clic sur le bouton "Register"
const onRegisterClick = () => {
  router.push("/register");
};

// Handler de soumission du formulaire
const onFormSubmit = async ({
  valid,
  values,
}: {
  valid: boolean;
  values: { username: string; password: string };
}) => {
  if (valid) {
    try {
      // Requête 1 : Authentification pour récupérer le token
      const authResponse = await axios.post(
        `${import.meta.env.VITE_DJANGO_API_URL}/api-token-auth/`,
        {
          username: values.username,
          password: values.password,
        },
      );
      const token = authResponse.data.token;

      // Requête 2 : Récupération des informations utilisateur via le token
      const accountResponse = await axios.get(
        `${import.meta.env.VITE_DJANGO_API_URL}/api/users/account/`,
        { headers: { Authorization: `Token ${token}` } },
      );
      const user = accountResponse.data;

      toast.add({
        severity: "success",
        summary: `Bienvenue ${user.username} !`,
        detail: `Email : ${user.email}`,
        life: 3000,
      });
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
