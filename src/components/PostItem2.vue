<!-- src\components\PostItem2.vue -->

<template>
  <div class="bg-surface-50 dark:bg-surface-950 rounded-border p-5 shadow">
    <div
      class="bg-surface-0 dark:bg-surface-900 flex items-center gap-4 pb-1 pl-4"
    >
      <p class="text-surface-900 dark:text-surface-0">Jacob Jones</p>
      <p class="text-surface-500 dark:text-surface-300 text-xs">1 minute ago</p>
    </div>
    <div class="bg-surface-0 dark:bg-surface-900 rounded-border px-4 py-0.5">
      <p class="text-surface-900 dark:text-surface-0 text-sm">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae ullam
        expedita perspiciatis beatae repudiandae incidunt doloremque blanditiis
        maxime adipisci nihil, assumenda quidem, eius, ducimus praesentium
        accusamus? Ab numquam, vitae distinctio id ipsam dolores expedita
        adipisci fugit a omnis voluptates tempore quod quia ut aliquam quos,
        dolore repudiandae libero tempora facere.
      </p>
    </div>
    <div class="flex gap-4">
      <div class="gap-0.1 flex items-center">
        <PrimeButton
          icon="pi pi-heart"
          severity="secondary"
          variant="text"
          rounded
          aria-label="Favorite"
        />
        <span>15</span>
      </div>
      <div class="gap-0.1 flex items-center">
        <PrimeButton
          icon="pi pi-comment"
          severity="secondary"
          variant="text"
          rounded
          aria-label="Favorite"
        />
        <span>15</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
