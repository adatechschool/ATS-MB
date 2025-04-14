<!-- src\pages\ProfilePage.vue -->

<template>
  <main class="container mx-auto flex flex-1 flex-col p-8">
    <div class="bg-surface-0 dark:bg-surface-950 p-10 md:p-20">
      <div class="bg-surface-0 dark:bg-surface-950">
        <div
          class="text-surface-900 dark:text-surface-0 mb-4 text-3xl font-medium"
        >
          Account Information
        </div>
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
        <div class="text-surface-500 dark:text-surface-300 mb-8">
          Joined on 2022-01-01
        </div>
        <ul class="m-0 list-none p-0">
          <li
            class="border-surface flex flex-wrap items-center border-t px-2 py-4"
          >
            <div
              class="text-surface-500 dark:text-surface-300 w-6/12 font-medium md:w-2/12"
            >
              Email
            </div>
            <div
              class="text-surface-900 dark:text-surface-0 order-1 w-full md:order-none md:w-8/12"
            >
              guy@example.com
            </div>
            <div class="flex w-6/12 justify-end md:w-2/12">
              <PrimeButton label="Edit" icon="pi pi-pencil" text />
            </div>
          </li>
          <li
            class="border-surface flex flex-wrap items-center border-t border-b px-2 py-4"
          >
            <div
              class="text-surface-500 dark:text-surface-300 w-6/12 font-medium md:w-2/12"
            >
              Bio
            </div>
            <div
              class="text-surface-900 dark:text-surface-0 order-1 w-full leading-normal md:order-none md:w-8/12"
            >
              A group of professional bank robbers start to feel the heat from
              police when they unknowingly leave a clue at their latest heist.
            </div>
            <div class="flex w-6/12 justify-end md:w-2/12">
              <PrimeButton label="Edit" icon="pi pi-pencil" text />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
/* You can add additional styling if needed */
</style>
