<template>
  <main class="flex flex-1 flex-col items-center justify-center p-4">
    <h1 class="mb-4 text-2xl font-bold">Timeline</h1>
    <div
      v-if="loading"
      class="flex flex-1 items-center justify-center text-center"
    >
      <PrimeProgressSpinner />
    </div>
    <section v-else class="flex flex-1 items-center justify-center">
      <div v-if="posts.length === 0" class="text-center text-3xl">
        No posts available.
      </div>
      <div v-else>
        <PostItem v-for="post in posts" :key="post.post_id" :post="post" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import PostItem from "../components/PostItem.vue";

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
