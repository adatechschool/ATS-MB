// tests/pages/RegisterPage.test.ts

import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import RegisterPage from "../../src/pages/RegisterPage.vue";
import axios from "axios";
import ToastService from "primevue/toastservice";

// Données valides pour simuler une soumission
const validData = {
  username: "John",
  email: "john@test.com",
  password: "secret",
};

describe("RegisterPage.vue", () => {
  it("renders the registration form correctly", () => {
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [ToastService],
        stubs: {
          // On stub les composants pour se concentrer sur le rendu
          PrimeForm: { template: `<form><slot /></form>` },
          PrimeFormField: { template: `<div><slot /></div>` },
          PrimeInputText: { template: `<input placeholder="Username" />` },
          PrimeMessage: { template: `<div><slot /></div>` },
          PrimePassword: { template: `<input type="password" />` },
          PrimeButton: { template: `<button type="submit">Submit</button>` },
        },
      },
    });
    // On vérifie la présence du placeholder "Username" (ce qui implique la présence du champ)
    expect(wrapper.html()).toContain('placeholder="Username"');
    expect(wrapper.html()).toContain('placeholder="Email"');
    // On peut aussi vérifier que le bouton submit est rendu
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("submits the form successfully", async () => {
    // On simule un appel axios.post qui retourne une réponse positive.
    const axiosPostSpy = vi.spyOn(axios, "post").mockResolvedValue({
      data: { message: "Registration successful." },
    });

    // On stub le composant PrimeForm pour qu'il émette l'événement "submit" avec les données valides.
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [ToastService],
        stubs: {
          PrimeForm: {
            template: `<form @submit.prevent="$emit('submit', { valid: true, values: submittedData })"><slot /></form>`,
            props: ["initialValues"],
            data() {
              return { submittedData: validData };
            },
          },
          PrimeFormField: { template: `<div><slot /></div>` },
          PrimeInputText: { template: `<input />` },
          PrimeMessage: true,
          PrimePassword: { template: `<input />` },
          PrimeButton: { template: `<button type="submit">Submit</button>` },
        },
      },
    });

    // Déclenchement de la soumission du formulaire
    await wrapper.find("form").trigger("submit.prevent");
    // On attend que toutes les promesses se résolvent
    await flushPromises();

    expect(axiosPostSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_DJANGO_API_URL}/api/auth/register/`,
      validData,
    );

    axiosPostSpy.mockRestore();
  });

  it("handles an error during form submission", async () => {
    // On simule un rejet de la requête axios
    const errorResponse = {
      response: { data: { message: "Error occurred." } },
      message: "Error occurred.",
    };
    const axiosPostSpy = vi
      .spyOn(axios, "post")
      .mockRejectedValue(errorResponse);

    // Stub du composant PrimeForm pour simuler l'émission de l'événement "submit" avec des données valides.
    const wrapper = mount(RegisterPage, {
      global: {
        plugins: [ToastService],
        stubs: {
          PrimeForm: {
            template: `<form @submit.prevent="$emit('submit', { valid: true, values: submittedData })"><slot /></form>`,
            props: ["initialValues"],
            data() {
              return { submittedData: validData };
            },
          },
          PrimeFormField: { template: `<div><slot /></div>` },
          PrimeInputText: { template: `<input />` },
          // On peut stub le composant PrimeMessage pour visualiser les messages d'erreur, ici on ne vérifie que l'appel à axios.
          PrimeMessage: { template: `<div><slot /></div>` },
          PrimePassword: { template: `<input />` },
          PrimeButton: { template: `<button type="submit">Submit</button>` },
        },
      },
    });

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(axiosPostSpy).toHaveBeenCalled();
    axiosPostSpy.mockRestore();
  });
});
