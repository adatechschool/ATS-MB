<!-- src\pages\PageTwo.vue -->

<template>
  <main class="container mx-auto flex flex-1 flex-col p-4">
    <h1 class="mb-4 text-2xl font-bold">Page Two</h1>
    <!-- Use the WorldComponent -->
    <WorldComponent />
    <div class="mt-4">
      <!-- PrimeVue button to navigate back to Page One -->
      <PrimeButton label="Go to Page One" @click="goToPageOne" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import WorldComponent from "../components/WorldComponent.vue";

const router = useRouter();

function goToPageOne() {
  router.push("/page-one");
}
</script>

<style scoped>
/* Additional scoped styles if necessary */
</style>
