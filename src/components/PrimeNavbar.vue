<!-- src\components\PrimeNavbar.vue -->

<template>
  <nav class="card px-4 pt-8">
    <PrimeMenubar :model="menuItems">
      <template #start>
        <p class="text-4xl font-bold">DevBlog</p>
      </template>

      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span v-if="item.icon" :class="[item.icon, 'mr-2']" />
          <span>{{ item.label }}</span>
          <PrimeBadge
            v-if="item.badge"
            :class="{ 'ml-auto': !root, 'ml-2': root }"
            :value="item.badge"
          />
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down ml-auto',
              { 'pi-angle-down': root, 'pi-angle-right': !root },
            ]"
          ></i>
        </a>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <PrimeAvatar
            v-if="isAuthenticated && userStore.profilePicture"
            :image="userStore.profilePicture"
            class="mr-2 cursor-pointer"
            size="large"
            shape="circle"
            @click="onProfileClick"
          />
          <PrimeAvatar
            v-else-if="isAuthenticated"
            :label="userStore.avatarLetter"
            class="mr-2 cursor-pointer"
            size="large"
            shape="circle"
            @click="onProfileClick"
          />
          <PrimeButton
            v-else
            icon="pi pi-user"
            severity="secondary"
            rounded
            variant="outlined"
            aria-label="Login"
            class="mr-2"
            @click="onLoginButtonClick"
          />
          <PrimeButton
            v-if="isAuthenticated"
            icon="pi pi-sign-out"
            severity="secondary"
            rounded
            variant="outlined"
            aria-label="Logout"
            @click="logout"
          />
        </div>
      </template>
    </PrimeMenubar>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuth } from "../composables/useAuth";
import { useUserStore } from "../stores/userStore";

// const apiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL;
// const authServicePort = import.meta.env.VITE_AUTH_SERVICE_PORT;
// const authApiBaseUrl = `${apiBaseUrl}:${authServicePort}`;
// const accountServicePort = import.meta.env.VITE_ACCOUNT_SERVICE_PORT;
// const accountApiBaseUrl = `${apiBaseUrl}:${accountServicePort}`;

const router = useRouter();
const { isAuthenticated, setAuthenticated, fetchAuth } = useAuth();
const userStore = useUserStore();

const menuItems = computed(() => {
  return [];
});

async function fetchCurrentUser() {
  try {
    const { data } = await axios.get(`/api/accounts/get/account/`, {
      withCredentials: true,
    });
    userStore.setUser(data);
    setAuthenticated(true);
  } catch {
    userStore.clearUser();
    setAuthenticated(false);
  }
}

const onLoginButtonClick = () => {
  router.push("/login");
};

const onProfileClick = () => {
  router.push("/profile");
};

async function logout() {
  try {
    await axios.post(`/api/auth/logout/`, {}, { withCredentials: true });
    userStore.clearUser();
  } catch (error) {
    console.error("Error during logout:", error);
  }
  setAuthenticated(false);
  await fetchAuth();
  router.push("/login");
}

onMounted(fetchCurrentUser);
</script>
