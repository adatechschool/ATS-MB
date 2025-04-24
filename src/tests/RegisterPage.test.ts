// src\tests\RegisterPage.test.ts
import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Component under test
import RegisterPage from "../../src/pages/RegisterPage.vue";
// Mock axios-instance module
import api from "../../src/axios-instance";

// Mock router push
const mockPush = vi.fn();
vi.mock("vue-router", () => ({ useRouter: () => ({ push: mockPush }) }));
// Mock toast notifications
const mockToastAdd = vi.fn();
vi.mock("primevue/usetoast", () => ({
  useToast: () => ({ add: mockToastAdd }),
}));

describe("RegisterPage.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(api, "post").mockResolvedValue({
      data: { message: "Registered" },
    });
    vi.spyOn(api, "isAxiosError").mockReturnValue(false);
  });

  it("renders username, email, password fields and register button", () => {
    const wrapper = mount(RegisterPage, {
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
    expect(wrapper.find('input[placeholder="Username"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe("Register");
  });

  it("submits form and navigates on successful registration", async () => {
    const validData = {
      username: "user",
      email: "test@example.com",
      password: "pass",
    };
    const wrapper = mount(RegisterPage, {
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
    // Trigger submit
    await wrapper.vm.onFormSubmit({ valid: true, values: validData });
    await flushPromises();

    expect(api.post).toHaveBeenCalledWith("/api/auth/register/", validData);
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success" }),
    );
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("displays error toast on registration failure", async () => {
    (api.post as vi.Mock).mockRejectedValue(new Error("Fail"));
    vi.spyOn(api, "isAxiosError").mockReturnValue(false);

    const wrapper = mount(RegisterPage, {
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
      values: { username: "", email: "", password: "" },
    });
    await flushPromises();

    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        summary: "Registration failed.",
      }),
    );
  });
});
