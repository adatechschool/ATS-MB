<!-- src\pages\RegisterPage.vue -->

<template>
  <div class="card flex justify-center">
    <PrimeForm
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex w-full flex-col gap-4 sm:w-80"
    >
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
      <PrimeButton type="submit" severity="secondary" label="Submit" />
    </PrimeForm>
  </div>
</template>

<script setup lang="ts">
// Importations de Vue et PrimeVue Forms ainsi que les résolveurs
import { reactive } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { yupResolver } from "@primevue/forms/resolvers/yup";
import * as yup from "yup";
import { z } from "zod";
import { useToast } from "primevue/usetoast";

const toast = useToast();

// Valeurs initiales pour le formulaire
const initialValues = reactive({
  details: "",
});

// Différents résolveurs pour valider les autres champs
const zodUserNameResolver = zodResolver(
  z.string().min(1, { message: "Username is required via Zod." }),
);

// Mise à jour du résolveur Yup pour valider une adresse email
const yupEmailResolver = yupResolver(
  yup.object({
    email: yup
      .string()
      .email("Must be a valid email address.")
      .required("Email is required via Yup."),
  }),
);

// Résolveur personnalisé pour le champ "password"
const customPasswordResolver = ({ value }: { value: string }) => {
  const errors: Array<{ message: string }> = [];
  if (!value) {
    errors.push({ message: "Password is required via Custom." });
  }
  return { errors };
};

// Handler de soumission du formulaire : affiche un toast de succès si le formulaire est validé
const onFormSubmit = ({ valid }: { valid: boolean }) => {
  if (valid) {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
  }
};
</script>

<style scoped>
/* Vous pouvez ajouter ici des styles supplémentaires si besoin */
</style>
