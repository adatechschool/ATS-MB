// tests\pages\PageTwo.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import PageTwo from "../../src/pages/PageTwo.vue";
import PageOne from "../../src/pages/PageOne.vue";
import { createRouter, createWebHistory } from "vue-router";
import flushPromises from "flush-promises";

describe("PageTwo.vue", () => {
  const routes = [
    { path: "/page-one", component: PageOne },
    { path: "/page-two", component: PageTwo },
  ];
  const router = createRouter({ history: createWebHistory(), routes });

  beforeEach(async () => {
    router.push("/page-two");
    await router.isReady();
  });

  it('renders the title "Page Two"', () => {
    const wrapper = mount(PageTwo, {
      global: {
        plugins: [router],
        stubs: {
          PrimeButton: {
            template: `<button @click="$emit('click')"><slot /></button>`,
          },
        },
      },
    });
    expect(wrapper.text()).toContain("Page Two");
  });

  it("navigates to Page One on button click", async () => {
    const wrapper = mount(PageTwo, {
      global: {
        plugins: [router],
        stubs: {
          PrimeButton: {
            template: `<button @click="$emit('click')"><slot /></button>`,
          },
        },
      },
    });
    const button = wrapper.find("button");
    await button.trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/page-one");
  });
});
