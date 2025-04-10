<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Barre de navigation -->
      <nav class="bg-white dark:bg-gray-800 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <h1 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">DevShare</h1>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <router-link to="/" class="border-indigo-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Accueil</router-link>
                <router-link to="/problems" class="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Problèmes</router-link>
                <router-link to="/solutions" class="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Solutions</router-link>
                <router-link to="/resources" class="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Ressources</router-link>
              </div>
            </div>
            <div class="flex items-center">
              <button type="button" class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Publier du code</button>
              <div class="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                <button type="button" class="bg-white dark:bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-expanded="false" aria-haspopup="true">
                  <span class="sr-only">Ouvrir le menu utilisateur</span>
                  <!--<img class="h-8 w-8 rounded-full" src="/api/placeholder/32/32" alt="Photo de profil">-->
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Contenu principal -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Barre latérale gauche -->
          <aside class="hidden md:block md:w-1/4">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sticky top-6">
              <div class="flex items-center mb-4">
                <!--<img class="h-12 w-12 rounded-full" src="/api/placeholder/48/48" alt="Photo de profil">-->
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Pierre Durand</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">@pdurand</p>
                </div>
              </div>
              <div class="mb-4">
                <div class="flex justify-between mb-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Solutions partagées</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">38</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Followers</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">215</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Contributions</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">142</span>
                </div>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Mes technologies</h3>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs rounded-full">Vue.js</span>
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">TypeScript</span>
                  <span class="px-2 py-1 bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 text-xs rounded-full">Tailwind</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">Node.js</span>
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full">JavaScript</span>
                </div>
              </div>
            </div>
          </aside>
  
          <!-- Fil d'actualité -->
          <main class="w-full md:w-2/4">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
              <div class="flex">
                <!--<img class="h-10 w-10 rounded-full" src="/api/placeholder/40/40" alt="Photo de profil">-->
                <div class="ml-3 w-full">
                  <textarea rows="3" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" placeholder="Partagez votre code ou posez une question..."></textarea>
                  <div class="flex justify-between items-center mt-3">
                    <div class="flex space-x-4">
                      <button class="text-indigo-500 hover:text-indigo-600" title="Ajouter un extrait de code">...</button>
                      <button class="text-indigo-500 hover:text-indigo-600" title="Ajouter une image">...</button>
                      <button class="text-indigo-500 hover:text-indigo-600" title="Ajouter des tags">...</button>
                    </div>
                    <button class="px-4 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Publier</button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Publications -->
            <div class="space-y-6">
              <!-- Publication 1 -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="p-4">
                  <div class="flex items-center mb-2">
                    <!--<img class="h-10 w-10 rounded-full" src="/api/placeholder/40/40" alt="Photo de Marie Dubois">-->
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Marie Dubois</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">@mariedubois · Full-stack developer · 2h</p>
                    </div>
                  </div>
                  <p class="text-gray-800 dark:text-gray-200 mb-3">J'ai créé un hook React...</p>
                  <div class="bg-gray-100 dark:bg-gray-700 rounded-md p-3 mb-3 overflow-auto">
                    <pre class="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto"><code>import { useState, useEffect } from 'react';</code></pre>
                  </div>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">React</span>
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full">JavaScript</span>
                  </div>
                  <div class="flex justify-between text-gray-500 dark:text-gray-400">
                    <button class="flex items-center space-x-1 hover:text-indigo-500">...</button>
                  </div>
                </div>
              </div>
              <!-- Ajoutez plus de publications ici -->
            </div>
          </main>
  
          <!-- Barre latérale droite -->
          <aside class="hidden md:block md:w-1/4">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
              <div class="relative">
                <input type="text" class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" placeholder="Rechercher un sujet...">
                <div class="absolute left-3 top-3 text-gray-400">...</div>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trending Techs</h2>
              <div class="space-y-4">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Frontend · Tendance</p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">#Nuxt3</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Explorez les tendances actuelles en technologie.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: "Homepage",
  };
  </script>
  
  <style scoped>
  /* Ajoutez vos styles personnalisés ici si nécessaire */
  </style>