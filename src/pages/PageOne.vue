<!-- src\pages\PageOne.vue -->

<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-4 text-2xl font-bold">Page One</h1>
    <!-- Use the HelloComponent -->
    <HelloComponent />
    <div class="mt-4">
      <!-- PrimeVue button to navigate to Page Two -->
      <Button label="Go to Page Two" @click="goToPageTwo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import HelloComponent from "../components/HelloComponent.vue";

// Ensure Button is globally registered via main.ts or import locally:
// import Button from 'primevue/button';

const router = useRouter();

function goToPageTwo() {
  router.push("/page-two");
}
</script>

<style scoped>
/* You can add additional styling if needed */
</style>
