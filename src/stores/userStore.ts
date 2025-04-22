// src/stores/userStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref("");
  const email = ref("");
  const bio = ref("");
  const rawProfilePicture = ref<string | null>(null);
  const profilePicture = computed(() => {
    const str = rawProfilePicture.value;
    if (!str) return "";
    if (str.startsWith("http") || str.startsWith("data:")) {
      return str;
    }
    return `data:image/png;base64,${str}`;
  });
  const joinDate = ref("");
  const avatarLetter = computed(() => username.value.charAt(0).toUpperCase());

  function setUser(user: {
    username: string;
    email: string;
    bio: string;
    profilePicture?: string;
    joinDate?: string;
  }) {
    username.value = user.username;
    email.value = user.email;
    bio.value = user.bio;
    rawProfilePicture.value = user.profilePicture ?? null;
    joinDate.value = user.joinDate ?? "";
  }

  function clearUser() {
    username.value = "";
    email.value = "";
    bio.value = "";
    rawProfilePicture.value = null;
    joinDate.value = "";
  }

  function setRawProfilePicture(b64: string | null) {
    rawProfilePicture.value = b64;
  }

  return {
    username,
    email,
    bio,
    profilePicture,
    rawProfilePicture,
    setRawProfilePicture,
    joinDate,
    avatarLetter,
    setUser,
    clearUser,
  };
});
