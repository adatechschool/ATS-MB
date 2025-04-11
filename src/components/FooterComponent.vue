<!-- src\components\FooterComponent.vue -->

<template>
  <footer class="bg-gray-800 py-4 text-white">
    <div class="container mx-auto text-center">
      <p>&copy; {{ currentYear }} DevBlog. Tous droits réservés.</p>
      <p>
        Voir le dépôt GitHub :
        <a
          href="https://github.com/adatechschool/ATS-MB"
          target="_blank"
          class="underline hover:text-gray-400"
        >
          github.com/adatechschool/ATS-MB
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style scoped>
/* Vous pouvez ajouter ici des styles supplémentaires si besoin */
</style>
