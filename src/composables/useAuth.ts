// src/composables/useAuth.ts
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import axios from "axios";

const isAuthenticated = ref(false);
const bootstrapped = ref(false);

export function useAuth() {
  const userStore = useUserStore();

  async function fetchAuth() {
    try {
      const response = await axios.get(`/api/accounts/get/account/`, {
        withCredentials: true,
      });
      const payload = response.data;
      const userData = payload.data;
      userStore.setUser({
        username: userData.username,
        email: userData.email,
        bio: userData.bio,
        profilePicture: userData.profile_picture,
        joinDate: userData.date_joined?.substring(0, 10),
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
