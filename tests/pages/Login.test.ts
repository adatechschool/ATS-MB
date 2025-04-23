// tests\pages\Login.test.ts

import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import LoginPage from "../../src/pages/LoginPage.vue";
import axios from "axios";
import ToastService from "primevue/toastservice";

// Données de test valides pour la connexion
const validData = {
  username: "John",
  password: "secret",
};

describe("LoginPage.vue", () => {
  it("renders the login form correctly", () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [ToastService],
        stubs: {
          PrimeForm: { template: `<form><slot /></form>` },
          PrimeFormField: { template: `<div><slot /></div>` },
          PrimeInputText: { template: `<input placeholder="Username" />` },
          PrimeMessage: { template: `<div><slot /></div>` },
          PrimePassword: {
            template: `<input type="password" placeholder="Password" />`,
          },
          PrimeButton: { template: `<button type="submit">Login</button>` },
        },
      },
    });
    expect(wrapper.html()).toContain('placeholder="Username"');
    expect(wrapper.html()).toContain('placeholder="Password"');
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("submits the form and logs in successfully", async () => {
    // Simule une réponse réussie pour la requête POST (authentification)
    const axiosPostSpy = vi.spyOn(axios, "post").mockResolvedValue({
      data: { token: "dummyToken" },
    });
    // Simule une réponse réussie pour la requête GET (détails du compte)
    const axiosGetSpy = vi.spyOn(axios, "get").mockResolvedValue({
      data: { username: "John", email: "john@test.com" },
    });

    const wrapper = mount(LoginPage, {
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
          PrimeInputText: { template: `<input placeholder="Username" />` },
          PrimeMessage: { template: `<div><slot /></div>` },
          PrimePassword: {
            template: `<input type="password" placeholder="Password" />`,
          },
          PrimeButton: { template: `<button type="submit">Login</button>` },
        },
      },
    });

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(axiosPostSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_DJANGO_API_URL}/api-token-auth/`,
      validData,
    );
    expect(axiosGetSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_DJANGO_API_URL}/api/users/account/`,
      { headers: { Authorization: "Token dummyToken" } },
    );
    axiosPostSpy.mockRestore();
    axiosGetSpy.mockRestore();
  });

  it("handles an error during login", async () => {
    const errorResponse = {
      response: { data: { message: "Invalid credentials." } },
      message: "Invalid credentials.",
    };
    const axiosPostSpy = vi
      .spyOn(axios, "post")
      .mockRejectedValue(errorResponse);

    const wrapper = mount(LoginPage, {
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
          PrimeInputText: { template: `<input placeholder="Username" />` },
          PrimeMessage: { template: `<div><slot /></div>` },
          PrimePassword: {
            template: `<input type="password" placeholder="Password" />`,
          },
          PrimeButton: { template: `<button type="submit">Login</button>` },
        },
      },
    });

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(axiosPostSpy).toHaveBeenCalled();
    axiosPostSpy.mockRestore();
  });
});
