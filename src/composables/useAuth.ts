// src/composables/useAuth.ts
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import axios from "axios";

const isAuthenticated = ref(false);
const bootstrapped = ref(false);

const apiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL;
const accountServicePort = import.meta.env.VITE_ACCOUNT_SERVICE_PORT;
const accountApiBaseUrl = `${apiBaseUrl}:${accountServicePort}`;

export function useAuth() {
  const userStore = useUserStore();

  async function fetchAuth() {
    try {
      const { data } = await axios.get(
        `${accountApiBaseUrl}/api/accounts/get/account/`,
        { withCredentials: true },
      );
      userStore.setUser({
        username: data.username,
        email: data.email,
        bio: data.bio,
        profilePicture: data.profile_picture,
        joinDate: data.created_at?.substring(0, 10),
      });
      isAuthenticated.value = true;
    } catch {
      isAuthenticated.value = false;
      userStore.clearUser();
    } finally {
      bootstrapped.value = true;
    }
    return isAuthenticated.value;
  }

  function setAuthenticated(val: boolean) {
    isAuthenticated.value = val;
  }

  return { isAuthenticated, bootstrapped, fetchAuth, setAuthenticated };
}
