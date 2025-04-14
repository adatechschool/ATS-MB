<!-- src\pages\ProfilePage.vue -->

<template>
  <main class="container mx-auto flex flex-1 flex-col p-8">
    <div class="flex w-full items-center gap-4">
      <PrimeAvatar label="P" class="mr-2" size="xlarge" shape="circle" />
      <div class="flex flex-1 flex-col gap-0.5">
        <h1 class="text-xl font-bold">Phil</h1>
        <div class="flex gap-8">
          <div class="gap-0.0625 flex flex-col text-sm">
            <p class="font-bold">Followers</p>
            <p>100</p>
          </div>
          <div class="gap-0.0625 flex flex-col text-sm">
            <p class="font-bold">Followings</p>
            <p>100</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
/* You can add additional styling if needed */
</style>
