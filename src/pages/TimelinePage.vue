<!-- src\pages\TimelinePage.vue -->

<template>
  <main class="flex flex-1 flex-col gap-4 p-4">
    <h1 class="mb-4 text-2xl font-bold">Fil d'actualité</h1>
    <PostItem2 />
    <!-- Affichage d'un indicateur de chargement -->
    <div
      v-if="loading"
      class="flex flex-1 items-center justify-center text-center"
    >
      <PrimeProgressSpinner />
    </div>
    <!-- Si la récupération est terminée -->
    <section v-else class="flex flex-1 items-center justify-center">
      <!-- Message si aucun post n'est disponible -->
      <div v-if="posts.length === 0">
        <p class="text-3xl">Aucun post à afficher.</p>
      </div>
      <!-- Boucle sur la liste des posts -->
      <div v-else>
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import PostItem from "../components/PostItem.vue";
import PostItem2 from "../components/PostItem2.vue";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const posts = ref<Post[]>([]);
const loading = ref(true);

// Fonction de récupération des posts via l'API
const fetchPosts = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DJANGO_API_URL}/api/posts/list/`,
    );
    posts.value = response.data;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des posts", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPosts();
});
</script>
