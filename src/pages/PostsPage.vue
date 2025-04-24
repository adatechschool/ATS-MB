<!-- src\pages\PostsPage.vue -->

<template>
  <div class="flex flex-col items-center p-4">
    <!-- Loading indicator -->
    <div v-if="loading" class="flex h-64 items-center justify-center">
      <PrimeProgressSpinner />
    </div>
    <!-- Error message -->
    <div v-if="error" class="w-full max-w-xl">
      <PrimeMessage severity="error" :text="error" />
    </div>
    <!-- Posts list -->
    <div v-if="!loading && !error" class="w-full max-w-2xl space-y-4">
      <PostItem v-for="post in posts" :key="post.post_id" :post="post" />
      <div v-if="posts.length === 0" class="text-center text-gray-500">
        Aucun post disponible.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import PostItem from "../components/PostItem.vue";
import PrimeMessage from "primevue/message";
import PrimeProgressSpinner from "primevue/progressspinner";

type Post = {
  post_id: number;
  user_id: number;
  post_content: string;
  created_at: string;
};

const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchPosts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get("/api/posts/list/");
    const data = response.data;
    if (data.status === "success" && Array.isArray(data.data)) {
      posts.value = data.data;
    } else {
      error.value = "Impossible de charger les posts.";
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des posts", err);
    error.value = "Erreur réseau lors de la récupération des posts.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPosts);
</script>

<style scoped>
/* Optional: center the spinner and messages */
</style>
