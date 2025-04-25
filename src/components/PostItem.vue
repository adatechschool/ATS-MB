<!-- src\components\PostItem.vue -->

<template>
  <div class="card mb-4">
    <Panel toggleable>
      <!-- En-tête du post : affiche une image d'avatar et le titre -->
      <template #header>
        <div
          class="flex cursor-pointer items-center gap-2"
          @click="goToProfile"
        >
          <PrimeAvatar
            v-if="author.profile_picture"
            :image="`data:image/png;base64,${author.profile_picture}`"
            shape="circle"
          />
          <PrimeAvatar
            v-else
            :label="author.username.charAt(0).toUpperCase()"
            shape="circle"
          />
          <span class="ml-2 font-medium">{{ author.username }}</span>
        </div>
      </template>

      <!-- <div class="p-4">
        <p>{{ post.post_content }}</p>
      </div> -->

      <!-- Pied de post : affiche la date de création et actions -->
      <template #footer>
        <div class="flex items-center justify-between p-2">
          <div class="flex items-center gap-2">
            <Button
              :icon="liked ? 'pi pi-thumbs-up-fill' : 'pi pi-thumbs-up'"
              rounded
              text
              @click="toggleLike"
            />
            <span>{{ likeCount }}</span>
          </div>
          <span class="text-sm text-surface-500">
            {{ formattedDate }}
          </span>
        </div>
      </template>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { useAuth } from "../composables/useAuth";

interface Post {
  post_id: number;
  user_id: number;
  post_content: string;
  created_at: string;
}

interface User {
  user_id: number;
  username: string;
  profile_picture: string | null;
}

const props = defineProps<{
  post: Post;
  author: User;
}>();

const { isAuthenticated } = useAuth();
const router = useRouter();
const liked = ref(false);
const likeCount = ref(0);
const toast = useToast();

// initialize like count if you have that in your DTO
// likeCount.value = props.post.likes_count || 0

// Formatage de la date de création
const formattedDate = computed(() => {
  const date = new Date(props.post.created_at);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

function goToProfile() {
  if (isAuthenticated.value) {
    router.push("/profile");
  } else {
    router.push("/login");
  }
}

const toggleLike = async () => {
  try {
    const endpoint = liked.value ? "unlike" : "like";
    await axios.post(`/api/likes/posts/${props.post.post_id}/${endpoint}/`);
    liked.value = !liked.value;
    likeCount.value += liked.value ? 1 : -1;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  }
};
</script>

<style scoped>
/* Styles optionnels pour le composant */
</style>
