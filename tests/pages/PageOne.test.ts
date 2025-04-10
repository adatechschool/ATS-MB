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
    const wrapper = mount(PageOne, { global: { plugins: [router] } });
    expect(wrapper.text()).toContain("Page One");
  });

  it("navigates to Page Two on button click", async () => {
    const wrapper = mount(PageOne, { global: { plugins: [router] } });
    // Find the PrimeVue button. Since Button is rendered as a native <button>,
    // adjust the selector if needed.
    const button = wrapper.find("button");
    await button.trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/page-two");
  });
});
