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
          <span
            v-if="item.shortcut"
            class="ml-auto rounded border border-surface p-1 text-xs bg-emphasis text-muted-color"
          >
            {{ item.shortcut }}
          </span>
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
          <PrimeButton
            v-if="!isAuthenticated"
            icon="pi pi-user"
            severity="secondary"
            rounded
            variant="outlined"
            aria-label="Login"
            class="mr-2"
            @click="onLoginButtonClick"
          />
          <PrimeAvatar
            v-else
            :label="avatarLetter"
            class="mr-2 cursor-pointer"
            size="large"
            shape="circle"
            @click="onProfileClick"
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { isAuthenticated, setAuthenticated } = useAuth();
const username = ref("");

const menuItems = computed(() => {
  return [];
});

const avatarLetter = computed(() => username.value.charAt(0).toUpperCase());

const onLoginButtonClick = () => {
  router.push("/login");
};

const onProfileClick = () => {
  router.push("/profile");
};

async function logout() {
  try {
    const apiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL;

    const authServicePort = import.meta.env.VITE_AUTH_SERVICE_PORT;
    const authApiBaseUrl = `${apiBaseUrl}:${authServicePort}`;

    await axios.post(
      `${authApiBaseUrl}/api/auth/logout/`,
      {},
      { withCredentials: true },
    );
    setAuthenticated(false);
  } catch (error) {
    console.error("Error during logout:", error);
  }
  router.push("/login");
}

async function fetchCurrentUser() {
  try {
    const apiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL;
    const accountServicePort = import.meta.env.VITE_ACCOUNT_SERVICE_PORT;
    const accountApiBaseUrl = `${apiBaseUrl}:${accountServicePort}`;

    const response = await axios.get(
      `${accountApiBaseUrl}/api/accounts/get/account/`,
      {
        withCredentials: true,
      },
    );
    if (response.status === 200 && response.data.username) {
      username.value = response.data.username;
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      username.value = "";
    }
  } catch (error) {
    setAuthenticated(false);
    username.value = "";
    console.error("Error fetching current user:", error);
  }
}

onMounted(fetchCurrentUser);
</script>
