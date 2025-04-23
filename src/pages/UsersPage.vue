<!-- src\pages\UsersPage.vue -->

<template>
  <main class="container mx-auto flex flex-1 flex-col p-8">
    <div class="card">
      <PrimeDataTable :value="users" tableStyle="min-width: 50rem">
        <PrimeColumn field="username" header="Username" />
        <PrimeColumn field="email" header="Email" />
        <PrimeColumn field="bio" header="Bio" />
      </PrimeDataTable>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface User {
  username: string;
  email: string;
  bio: string;
}

const users = ref<User[]>([]);

const fetchAllUsers = async () => {
  try {
    const response = await axios.get<{
      status: string;
      data: User[];
      error: unknown;
    }>("/api/users/get/users/");
    users.value = response.data.data;
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

onMounted(fetchAllUsers);
</script>
