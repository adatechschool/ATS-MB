// src/composables/useAuth.ts
import { ref, computed } from "vue";

const isAuthenticated = ref(false);

export function useAuth() {
  const setAuthenticated = (value: boolean) => {
    isAuthenticated.value = value;
  };

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    setAuthenticated,
  };
}
