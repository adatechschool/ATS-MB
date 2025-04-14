<!-- src\components\PrimeNavbar.vue -->

<template>
  <nav class="card px-4 pt-8">
    <PrimeMenubar :model="items">
      <!-- Slot de gauche: affichage de votre logo SVG -->
      <template #start>
        <p class="mr-32 text-3xl font-bold">DevBlog</p>
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
            class="border-surface bg-emphasis text-muted-color ml-auto rounded border p-1 text-xs"
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
          <PrimeInputText
            placeholder="Search"
            type="text"
            class="w-32 sm:w-auto"
          />
          <PrimeAvatar label="P" class="mr-2" size="large" shape="circle" />
        </div>
      </template>
    </PrimeMenubar>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const items = ref([
  {
    label: "Fil d’actualité",
    icon: "pi pi-list",
    command: () => router.push("/timeline"),
  },
  {
    label: "Register",
    icon: "pi pi-user-plus",
    command: () => router.push("/register"),
  },
  {
    label: "Login",
    icon: "pi pi-sign-in",
    command: () => router.push("/login"),
  },
  {
    label: "Profile",
    icon: "pi pi-user",
    command: () => router.push("/profile"),
  },
]);
</script>
