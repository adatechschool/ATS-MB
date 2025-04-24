<!-- src\components\PostItem.vue -->

<template>
  <div class="card mb-4">
    <Panel toggleable>
      <!-- En-tête du post : affiche une image d'avatar et le titre -->
      <template #header>
        <div class="flex items-center gap-2">
          <Avatar :image="avatarUrl" shape="circle" />
        </div>
      </template>

      <!-- Corps du post : le contenu textuel -->
      <div class="p-4">
        <p class="m-0 text-base text-gray-800 dark:text-gray-200">
          {{ props.post.post_content }}
        </p>
      </div>

      <!-- Pied de post : affiche la date de création et actions -->
      <template #footer>
        <div class="flex flex-wrap items-center justify-between gap-4 p-2">
          <div class="flex items-center gap-2">
            <Button :icon="likeIcon" rounded text @click="toggleLike" />
          </div>
          <span class="text-sm text-surface-500 dark:text-surface-400">
            {{ formattedDate }}
          </span>
        </div>
      </template>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Avatar from "primevue/avatar";
import Panel from "primevue/panel";
import Button from "primevue/button";
import axios from "axios";

interface Post {
  post_id: number;
  user_id: number;
  post_content: string;
  created_at: string;
}

const props = defineProps<{ post: Post }>();

// Avatar statique pour exemple
const avatarUrl =
  "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png";

const liked = ref(false);

// Détermine l'icône en fonction de l'état
const likeIcon = computed(() =>
  liked.value ? "pi pi-thumbs-up-fill" : "pi pi-thumbs-up",
);

// Formatage de la date de création
const formattedDate = computed(() => {
  const date = new Date(props.post.created_at);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const toggleLike = async () => {
  try {
    const endpoint = liked.value ? "unlike" : "like";
    await axios.post(
      `/api/likes/posts/${props.post.post_id}/${endpoint}/`,
      {},
      { headers: { Authorization: `Token ${token}` } },
    );
    liked.value = !liked.value;
  } catch (error) {
    console.error("Erreur like/unlike", error);
  }
};

// Token statique pour exemple, à remplacer par auth real
const token = "774510dbb0111f03beace204e7f39d5d722bf09d";
</script>

<style scoped>
/* Styles optionnels pour le composant */
</style>
