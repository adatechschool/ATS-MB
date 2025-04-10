import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Post {
  id: string;
  content: string;
  code?: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  createdAt: Date;
  likes: number;
  comments: number;
  tags: string[];
  isQuestion: boolean;
  isSolution: boolean;
}

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Ici, vous pourriez implémenter des fonctions pour charger les posts depuis une API,
  // ajouter, supprimer ou modifier des posts, etc.

  function fetchPosts() {
    isLoading.value = true;
    // Simuler un appel API
    setTimeout(() => {
      // Des posts de test pour le moment
      posts.value = [
        {
          id: '1',
          content: 'J\'ai créé un hook React personnalisé pour gérer les requêtes API qui simplifie énormément l\'utilisation des async/await.',
          code: 'import { useState, useEffect } from \'react\';\n\nconst useApi = (url, options = {}) => {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        setLoading(true);\n        const response = await fetch(url, options);\n        const json = await response.json();\n        setData(json);\n        setError(null);\n      } catch (err) {\n        setError(err);\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchData();\n  }, [url]);\n\n  return { data, loading, error };\n};',
          authorId: '101',
          authorName: 'Marie Dubois',
          authorUsername: 'mariedubois',
          createdAt: new Date(),
          likes: 24,
          comments: 8,
          tags: ['React', 'JavaScript', 'Hooks'],
          isQuestion: false,
          isSolution: false
        },
        // Ajoutez d'autres posts ici...
      ];
      isLoading.value = false;
    }, 500);
  }

  return { posts, isLoading, error, fetchPosts };
});