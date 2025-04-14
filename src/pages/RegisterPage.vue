<!-- src\pages\RegisterPage.vue -->

<template>
  <main class="card flex flex-1 flex-col items-center justify-center">
    <PrimeForm
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex w-full flex-col gap-4 rounded-border bg-surface-50 p-5 shadow sm:w-120 dark:bg-surface-950"
    >
      <div class="mb-8 text-center">
        <h1 class="mb-4 text-3xl font-medium">Join us!</h1>
        <span
          class="leading-normal font-medium text-surface-600 dark:text-surface-200"
          >Already have an account?</span
        >
        <PrimeButton
          label="Log in here."
          variant="link"
          @click="onLoginClick"
        />
      </div>
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
      <PrimeFormField
        v-slot="$field"
        name="email"
        initialValue=""
        :resolver="yupEmailResolver"
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
      <PrimeButton type="submit" severity="secondary" label="Register" />
    </PrimeForm>
  </main>
</template>

<script setup lang="ts">
// Importations de Vue et PrimeVue Forms ainsi que les résolveurs
import { useRouter } from "vue-router";
import { reactive } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { yupResolver } from "@primevue/forms/resolvers/yup";
import * as yup from "yup";
import { z } from "zod";
import axios from "axios";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const router = useRouter();

// Valeurs initiales pour le formulaire
const initialValues = reactive({
  username: "",
  email: "",
  password: "",
});

// Différents résolveurs pour valider les autres champs
const zodUserNameResolver = zodResolver(
  z.string().min(1, { message: "Username is required via Zod." }),
);

// Mise à jour du résolveur Yup pour valider une adresse email
const yupEmailResolver = yupResolver(
  yup
    .object({
      email: yup
        .string()
        .email("Must be a valid email address.")
        .required("Email is required via Yup."),
    })
    // La transformation enveloppe la valeur brute dans un objet avec la clé "email"
    .transform((_, originalValue) => ({ email: originalValue })),
);

// Résolveur personnalisé pour le champ "password"
const customPasswordResolver = ({ value }: { value: string }) => {
  const errors: Array<{ message: string }> = [];
  if (!value) {
    errors.push({ message: "Password is required via Custom." });
  }
  return { errors };
};

// Handler de clic sur le bouton "Login"
const onLoginClick = () => {
  router.push("/login");
};

// Handler de soumission du formulaire : affiche un toast de succès si le formulaire est validé
const onFormSubmit = async ({
  valid,
  values,
}: {
  valid: boolean;
  values: { username: string; email: string; password: string };
}) => {
  if (valid) {
    try {
      const apiUrl = `${import.meta.env.VITE_DJANGO_API_URL}/api/auth/register/`;
      const response = await axios.post(apiUrl, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      toast.add({
        severity: "success",
        summary: response.data.message || "Registration successful.",
        life: 3000,
      });
    } catch (error: unknown) {
      let errorMessage = "Registration failed.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.add({
        severity: "error",
        summary: "Registration failed.",
        detail: errorMessage,
        life: 3000,
      });
    }
  }
};
</script>

<style scoped>
/* Vous pouvez ajouter ici des styles supplémentaires si besoin */
</style>
