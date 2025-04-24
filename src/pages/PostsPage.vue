<template>
  <main class="flex flex-1 flex-col items-center justify-center p-4">
    <h1 class="mb-4 text-2xl font-bold">Timeline</h1>
    <div
      v-if="loading"
      class="flex flex-1 items-center justify-center text-center"
    >
      <PrimeProgressSpinner />
    </div>
    <section v-else class="flex w-full flex-1 items-center justify-center">
      <div v-if="posts.length === 0" class="text-center text-3xl">
        No posts available.
      </div>
      <div v-else class="flex w-full justify-center">
        <PrimeVirtualScroller
          :items="posts"
          :itemSize="50"
          showLoader
          :delay="250"
          class="w-full max-w-md rounded border border-surface-200 dark:border-surface-700"
        >
          <template v-slot:item="{ posts, options }">
            <div
              :class="[
                'p-4',
                { 'bg-surface-100 dark:bg-surface-700': options.odd },
              ]"
            >
              <PostItem
                v-for="post in posts"
                :key="post.post_id"
                :post="post"
              />
            </div>
          </template>
        </PrimeVirtualScroller>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import api from "../axios-instance";
import PostItem from "../components/PostItem.vue";

type Post = {
  post_id: number;
  user_id: number;
  post_content: string;
  created_at: string;
};

const toast = useToast();
const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchPosts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get("/api/posts/list/");
    if (Array.isArray(response.data)) {
      posts.value = response.data;
    } else {
      error.value = "Could not load posts.";
    }
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: (err as Error).message,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPosts);
</script>

<style scoped>
/* Optional: center the spinner and messages */
</style>
