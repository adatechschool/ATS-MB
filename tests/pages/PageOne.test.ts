// tests\pages\PageOne.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import PageOne from "../../src/pages/PageOne.vue";
import PageTwo from "../../src/pages/PageTwo.vue";
import { createRouter, createWebHistory } from "vue-router";
import flushPromises from "flush-promises";

describe("PageOne.vue", () => {
  const routes = [
    { path: "/page-one", component: PageOne },
    { path: "/page-two", component: PageTwo },
  ];
  const router = createRouter({ history: createWebHistory(), routes });

  beforeEach(async () => {
    router.push("/page-one");
    await router.isReady();
  });

  it('renders the title "Page One"', () => {
    const wrapper = mount(PageOne, {
      global: {
        plugins: [router],
        stubs: {
          // Custom stub that renders a native button element
          PrimeButton: {
            template: `<button @click="$emit('click')"><slot /></button>`,
          },
        },
      },
    });
    expect(wrapper.text()).toContain("Page One");
  });

  it("navigates to Page Two on button click", async () => {
    const wrapper = mount(PageOne, {
      global: {
        plugins: [router],
        stubs: {
          PrimeButton: {
            template: `<button @click="$emit('click')"><slot /></button>`,
          },
        },
      },
    });
    // Find the stubbed native button element.
    const button = wrapper.find("button");
    await button.trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/page-two");
  });
});
