<!-- src\pages\RegisterPage.vue -->

<template>
  <div class="card flex justify-center">
    <PrimeForm
      :initialValues="initialValues"
      :resolver="resolver"
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
        name="firstname"
        initialValue=""
        :resolver="yupFirstNameResolver"
        class="flex flex-col gap-1"
      >
        <PrimeInputText type="text" placeholder="First Name" />
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
        name="lastname"
        initialValue=""
        :resolver="valibotLastNameResolver"
        class="flex flex-col gap-1"
      >
        <PrimeInputText type="text" placeholder="Last Name" />
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
      <PrimeFormField
        v-slot="$field"
        name="details"
        class="flex flex-col gap-1"
      >
        <PrimeTextarea placeholder="Details" />
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
import { valibotResolver } from "@primevue/forms/resolvers/valibot";
import * as v from "valibot";
import * as yup from "yup";
import { z } from "zod";
import { useToast } from "primevue/usetoast";

const toast = useToast();

// Valeurs initiales pour le formulaire
const initialValues = reactive({
  details: "",
});

// Exemple de résolveur global pour le champ "details"
const resolver = zodResolver(
  z.object({
    details: z
      .string()
      .min(1, { message: "Details is required via Form Resolver." }),
  }),
);

// Différents résolveurs pour valider les autres champs
const zodUserNameResolver = zodResolver(
  z.string().min(1, { message: "Username is required via Zod." }),
);
const yupFirstNameResolver = yupResolver(
  yup.object({
    firstName: yup.string().required("First name is required via Yup."),
  }),
);
const valibotLastNameResolver = valibotResolver(
  v.pipe(v.string(), v.minLength(1, "Last name is required via Valibot.")),
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
