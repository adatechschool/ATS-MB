// src/stores/userStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref("");
  const email = ref("");
  const bio = ref("");
  const profilePicture = ref("");
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
    profilePicture.value = user.profilePicture || "";
    joinDate.value = user.joinDate || "";
  }

  function clearUser() {
    username.value = "";
    email.value = "";
    bio.value = "";
    profilePicture.value = "";
    joinDate.value = "";
  }

  return {
    username,
    email,
    bio,
    profilePicture,
    joinDate,
    avatarLetter,
    setUser,
    clearUser,
  };
});
