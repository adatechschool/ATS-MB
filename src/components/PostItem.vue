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
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <Button :icon="likeIcon" rounded text @click="toggleLike" />
            <Button
              icon="pi pi-bookmark"
              severity="secondary"
              rounded
              text
            ></Button>
          </div>
          <span class="text-surface-500 dark:text-surface-400">{{
            formattedDate
          }}</span>
        </div>
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
import axios from "axios";
import Avatar from "primevue/avatar";
import Panel from "primevue/panel";
import Button from "primevue/button";
import Menu from "primevue/menu";
import { useToast } from "primevue/usetoast";

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

const toast = useToast();

// Gestion de l'état "like"
const liked = ref(false);

const token = "774510dbb0111f03beace204e7f39d5d722bf09d";

const toggleLike = async () => {
  try {
    if (!liked.value) {
      // Appel API pour "liker"
      await axios.post(
        `/api/likes/posts/${props.post.id}/like/`,
        {},
        { headers: { Authorization: `Token ${token}` } },
      );
      liked.value = true;
      toast.add({
        severity: "success",
        summary: "Post liké",
        detail: "Vous avez aimé ce post.",
        life: 3000,
      });
    } else {
      // Appel API pour "unliker"
      await axios.post(
        `/api/likes/posts/${props.post.id}/unlike/`,
        {},
        { headers: { Authorization: `Token ${token}` } },
      );
      liked.value = false;
      toast.add({
        severity: "success",
        summary: "Like retiré",
        detail: "Vous n'aimez plus ce post.",
        life: 3000,
      });
    }
  } catch (error: unknown) {
    console.error("Erreur lors de l'actualisation du like", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "L'opération n'a pas pu être effectuée.",
      life: 3000,
    });
  }
};

// Propriété calculée pour choisir l'icône
const likeIcon = computed(() =>
  liked.value ? "pi pi-thumbs-up-fill" : "pi pi-thumbs-up",
);

// Formatage de la date de création. Ici, on affiche la valeur brute, mais vous pouvez l'adapter pour du format "il y a X temps".
const formattedDate = computed(() => {
  return props.post.created_at;
});
</script>
