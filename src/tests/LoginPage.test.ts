// src\tests\LoginPage.test.ts

import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Component under test
import LoginPage from "../../src/pages/LoginPage.vue";
// Mock axios-instance module
import api from "../../src/axios-instance";
// Mock auth composable
import { useAuth } from "../composables/useAuth";

// Mock router push
const mockPush = vi.fn();
vi.mock("vue-router", () => ({ useRouter: () => ({ push: mockPush }) }));
// Mock toast notifications
const mockToastAdd = vi.fn();
vi.mock("primevue/usetoast", () => ({
  useToast: () => ({ add: mockToastAdd }),
}));

describe("LoginPage.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on api.post and isAxiosError
    vi.spyOn(api, "post").mockResolvedValue({ status: 200 });
    vi.spyOn(api, "isAxiosError").mockReturnValue(false);
    // Stub useAuth to avoid Pinia
    vi.spyOn(require("../composables/useAuth"), "useAuth").mockReturnValue({
      setAuthenticated: vi.fn(),
      fetchAuth: vi.fn(),
    });
  });

  it("renders email and password fields and login button", () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: [
          "PrimeForm",
          "PrimeFormField",
          "PrimeInputText",
          "PrimePassword",
          "PrimeMessage",
          "PrimeButton",
        ],
      },
    });
    expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe("Login");
  });

  it("submits form and navigates on successful login", async () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: [
          "PrimeForm",
          "PrimeFormField",
          "PrimeInputText",
          "PrimePassword",
          "PrimeMessage",
          "PrimeButton",
        ],
      },
    });
    // Trigger submit event with valid values
    await wrapper.vm.onFormSubmit({
      valid: true,
      values: { email: "test@example.com", password: "password" },
    });
    await flushPromises();

    expect(api.post).toHaveBeenCalledWith("/api/auth/login/", {
      email: "test@example.com",
      password: "password",
    });
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success" }),
    );
    expect(mockPush).toHaveBeenCalledWith("/profile");
  });

  it("displays error toast on login failure", async () => {
    // Simulate axios error
    (api.post as vi.Mock).mockRejectedValue({
      response: { data: { message: "Invalid" } },
    });
    vi.spyOn(api, "isAxiosError").mockReturnValue(true);

    const wrapper = mount(LoginPage, {
      global: {
        stubs: [
          "PrimeForm",
          "PrimeFormField",
          "PrimeInputText",
          "PrimePassword",
          "PrimeMessage",
          "PrimeButton",
        ],
      },
    });
    await wrapper.vm.onFormSubmit({
      valid: true,
      values: { email: "bad@example.com", password: "" },
    });
    await flushPromises();

    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error", summary: "Login failed." }),
    );
  });
});
