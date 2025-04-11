<!-- src\components\PostItem.vue -->

<template>
  <div class="card mb-4">
    <Panel toggleable>
      <!-- En-tête du post : affiche une image d'avatar et le titre -->
      <template #header>
        <div class="flex items-center gap-2">
          <Avatar :image="avatarUrl" shape="circle" />
          <span class="font-bold">{{ post.title }}</span>
        </div>
      </template>

      <!-- Pied de post : affiche la date de création -->
      <template #footer>
        <span class="text-surface-500 dark:text-surface-400">{{
          formattedDate
        }}</span>
      </template>

      <!-- Boutons d'action (icône de configuration par exemple) -->
      <template #icons>
        <Button
          icon="pi pi-cog"
          severity="secondary"
          rounded
          text
          @click="toggle"
        />
        <Menu ref="menu" :model="menuItems" popup />
      </template>

      <!-- Corps du post : le contenu textuel -->
      <p class="m-0">{{ post.content }}</p>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Avatar from "primevue/avatar";
import Panel from "primevue/panel";
import Button from "primevue/button";
import Menu from "primevue/menu";

// Définition des props attendues : un objet post avec id, title, content et created_at
const props = defineProps<{
  post: {
    id: number;
    title: string;
    content: string;
    created_at: string;
  };
}>();

// Utilisation d'une image d'avatar statique ; dans une application réelle, vous pourrez utiliser une valeur dynamique
const avatarUrl =
  "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png";

// Configuration du menu d'actions (exemple : refresh, search, delete)
const menuItems = ref([
  { label: "Refresh", icon: "pi pi-refresh" },
  { label: "Search", icon: "pi pi-search" },
  { separator: true },
  { label: "Delete", icon: "pi pi-times" },
]);

const menu = ref<any>(null);
const toggle = (event: Event) => {
  menu.value.toggle(event);
};

// Formatage de la date de création. Ici, on affiche la valeur brute, mais vous pouvez l'adapter pour du format "il y a X temps".
const formattedDate = computed(() => {
  return props.post.created_at;
});
</script>
