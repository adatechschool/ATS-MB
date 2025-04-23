<!-- src\App.vue -->

<template>
  <div v-if="bootstrapped" class="flex min-h-screen flex-col">
    <PrimeToast />
    <PrimeNavbar />
    <router-view />
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuth } from "./composables/useAuth";

const { fetchAuth, bootstrapped } = useAuth();

onMounted(fetchAuth);
</script>

<style scoped>
/* Optionally add some global styles or container adjustments */
</style>
