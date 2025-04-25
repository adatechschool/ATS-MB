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
        <PostItem
          v-for="post in posts"
          :key="post.post_id"
          :post="post"
          :author="usersMap[post.user_id]"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { useAuth } from "../composables/useAuth";
import PostItem from "../components/PostItem.vue";

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

const toast = useToast();
const posts = ref<Post[]>([]);
const usersMap = ref<Record<number, User>>({});
const loading = ref(true);
const { isAuthenticated } = useAuth();
const error = ref<string | null>(null);

const fetchPostsAndUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [postRes, userRes] = await Promise.all([
      axios.get("/api/posts/list/"),
      axios.get("/api/users/get/users/"),
    ]);
    posts.value = postRes.data.data;
    userRes.data.data.forEach((u: User) => {
      usersMap.value[u.user_id] = u;
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.message,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPostsAndUsers);
</script>

<style scoped>
/* Optional: center the spinner and messages */
</style>
