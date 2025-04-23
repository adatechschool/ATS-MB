<!-- src\components\PostItem2.vue -->

<template>
  <div class="rounded-border bg-surface-50 p-5 shadow dark:bg-surface-950">
    <div
      class="flex items-center gap-4 bg-surface-50 pb-1 pl-4 dark:bg-surface-950"
    >
      <p class="text-surface-900 dark:text-surface-0">Jacob Jones</p>
      <p class="text-xs text-surface-500 dark:text-surface-300">1 minute ago</p>
    </div>
    <div class="rounded-border bg-surface-50 px-4 py-0.5 dark:bg-surface-950">
      <p class="text-sm text-surface-900 dark:text-surface-0">
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
