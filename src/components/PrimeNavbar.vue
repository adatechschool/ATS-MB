<!-- src\components\PrimeNavbar.vue -->

<template>
  <nav class="card px-4 pt-8">
    <PrimeMenubar :model="menuItems">
      <!-- Slot de gauche: affichage de votre logo SVG -->
      <template #start>
        <p class="text-4xl font-bold">DevBlog</p>
      </template>

      <!-- Slot personnalisé pour chacun des items -->
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

      <!-- Slot de droite : zone de recherche et avatar -->
      <template #end>
        <div class="flex items-center gap-2">
          <!-- <PrimeInputText
            placeholder="Search"
            type="text"
            class="w-32 sm:w-auto"
          /> -->
          <!-- <PrimeAvatar label="P" class="mr-2" size="large" shape="circle" /> -->
          <PrimeButton
            icon="pi pi-user"
            severity="secondary"
            rounded
            variant="outlined"
            aria-label="User"
            class="mr-2"
            @click="onProfileClick"
          />
          <PrimeButton
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
import { computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const menuItems = computed(() => {
  return [
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => router.push("/profile"),
    },
  ];
});

const onProfileClick = () => {
  router.push("/login");
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
  } catch (error) {
    console.error("Error during logout:", error);
  }
  router.push("/login");
}
</script>
