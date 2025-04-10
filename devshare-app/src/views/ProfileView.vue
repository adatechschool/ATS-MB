<template>
    <div class="profile-container">
      <div v-if="loading" class="loading-state">
        <p>Chargement du profil...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="profile-content">
        <header class="profile-header">
          <div class="profile-avatar">
            <img v-if="user.avatar" :src="user.avatar" alt="Photo de profil" />
            <div v-else class="avatar-placeholder">{{ getUserInitials() }}</div>
          </div>
          
          <div class="profile-info">
            <h1>{{ user.displayName || user.username }}</h1>
            <p class="username">@{{ user.username }}</p>
            <p v-if="user.bio" class="bio">{{ user.bio }}</p>
            
            <div class="stats">
              <div class="stat">
                <span class="count">{{ user.postsCount || 0 }}</span>
                <span class="label">Publications</span>
              </div>
              <div class="stat">
                <span class="count">{{ user.followersCount || 0 }}</span>
                <span class="label">Abonnés</span>
              </div>
              <div class="stat">
                <span class="count">{{ user.followingCount || 0 }}</span>
                <span class="label">Abonnements</span>
              </div>
            </div>
            
            <button v-if="isCurrentUser" class="edit-profile-btn" @click="editProfile">
              Modifier le profil
            </button>
            <button v-else class="follow-btn" @click="toggleFollow">
              {{ isFollowing ? 'Se désabonner' : 'S\'abonner' }}
            </button>
          </div>
        </header>
        
        <section class="user-posts">
          <h2>Publications</h2>
          <div v-if="posts.length === 0" class="no-posts">
            <p>Aucune publication pour le moment.</p>
          </div>
          <div v-else class="posts-grid">
            <!-- Vous pouvez importer et utiliser un composant pour afficher les posts -->
            <div v-for="post in posts" :key="post.id" class="post-item">
              <!-- Contenu de chaque post -->
              <!-- À remplacer par votre composant de post -->
              <div class="post-preview">
                <p>{{ post.content }}</p>
                <span class="post-date">{{ formatDate(post.createdAt) }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProfileView',
    data() {
      return {
        user: {
          username: '',
          displayName: '',
          bio: '',
          avatar: null,
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
        },
        posts: [],
        loading: true,
        error: null,
        isFollowing: false,
        isCurrentUser: false
      };
    },
    created() {
      this.fetchUserProfile();
    },
    watch: {
      '$route.params.username'() {
        this.fetchUserProfile();
      }
    },
    methods: {
      fetchUserProfile() {
        this.loading = true;
        this.error = null;
        
        // Récupérer le nom d'utilisateur depuis les paramètres de route
        const username = this.$route.params.username;
        
        // Simuler une requête API, à remplacer par votre véritable appel API
        setTimeout(() => {
          // Exemple de données, à remplacer par votre logique d'API
          this.user = {
            username: username,
            displayName: `Utilisateur ${username}`,
            bio: "Ceci est une biographie d'exemple pour l'utilisateur.",
            avatar: null,
            postsCount: Math.floor(Math.random() * 50),
            followersCount: Math.floor(Math.random() * 100),
            followingCount: Math.floor(Math.random() * 80),
          };
          
          // Générer des posts fictifs, à remplacer par votre logique d'API
          this.posts = Array.from({ length: 5 }, (_, i) => ({
            id: i,
            content: `Ceci est un exemple de publication ${i + 1} par ${username}`,
            createdAt: new Date(Date.now() - i * 86400000) // Chaque jour dans le passé
          }));
          
          // Vérifier si c'est l'utilisateur actuel (à adapter selon votre logique d'authentification)
          // Par exemple, comparer avec un utilisateur stocké dans un store comme Vuex
          this.isCurrentUser = (username === 'votre_nom_utilisateur');
          
          // Simuler l'état d'abonnement, à remplacer par votre logique
          this.isFollowing = Math.random() > 0.5;
          
          this.loading = false;
        }, 800);
      },
      
      editProfile() {
        // Rediriger vers la page d'édition du profil
        this.$router.push('/edit-profile');
      },
      
      toggleFollow() {
        // Logique pour s'abonner ou se désabonner
        this.isFollowing = !this.isFollowing;
        
        // Mettre à jour le compteur d'abonnés
        if (this.isFollowing) {
          this.user.followersCount++;
        } else {
          this.user.followersCount--;
        }
        
        // Appel API à implémenter ici
      },
      
      getUserInitials() {
        // Récupérer les initiales de l'utilisateur pour l'avatar par défaut
        if (this.user.displayName) {
          return this.user.displayName
            .split(' ')
            .map(name => name.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
        }
        return this.user.username.substring(0, 2).toUpperCase();
      },
      
      formatDate(date) {
        // Formater la date, par exemple: "21 Avril 2024"
        return new Date(date).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .loading-state, .error-state {
    text-align: center;
    padding: 40px 0;
  }
  
  .profile-header {
    display: flex;
    margin-bottom: 30px;
  }
  
  .profile-avatar {
    margin-right: 30px;
  }
  
  .profile-avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #3498db;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
  }
  
  .profile-info {
    flex: 1;
  }
  
  .profile-info h1 {
    margin: 0 0 5px 0;
    font-size: 1.8rem;
  }
  
  .username {
    color: #666;
    margin: 0 0 10px 0;
  }
  
  .bio {
    margin-bottom: 15px;
    line-height: 1.4;
  }
  
  .stats {
    display: flex;
    margin-bottom: 15px;
  }
  
  .stat {
    margin-right: 20px;
    text-align: center;
  }
  
  .count {
    display: block;
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .label {
    color: #666;
    font-size: 0.9rem;
  }
  
  .edit-profile-btn, .follow-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .edit-profile-btn {
    background-color: #f1f1f1;
    color: #333;
  }
  
  .follow-btn {
    background-color: #3498db;
    color: white;
  }
  
  .user-posts {
    margin-top: 40px;
  }
  
  .user-posts h2 {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .no-posts {
    text-align: center;
    padding: 30px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .post-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
    transition: transform 0.2s;
  }
  
  .post-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .post-preview {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .post-preview p {
    flex: 1;
    margin-bottom: 10px;
  }
  
  .post-date {
    color: #888;
    font-size: 0.8rem;
  }
  </style>