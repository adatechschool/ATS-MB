<template>
    <div class="home-container">
      <div class="post-creation">
        <div class="post-input-container">
          <div class="avatar">
            <img v-if="currentUser.avatar" :src="currentUser.avatar" alt="Votre avatar" />
            <div v-else class="avatar-placeholder">{{ getUserInitials() }}</div>
          </div>
          <div class="post-input">
            <textarea 
              v-model="newPostContent" 
              placeholder="Qu'avez-vous à partager aujourd'hui ?" 
              :maxlength="maxPostLength"
              rows="3"
              @input="adjustTextareaHeight"
              ref="postTextarea"
            ></textarea>
            <div class="post-actions">
              <div class="char-counter" :class="{ 'near-limit': isNearCharLimit }">
                {{ newPostContent.length }}/{{ maxPostLength }}
              </div>
              <div class="post-buttons">
                <button class="add-media-btn">
                  <span class="icon">📷</span>
                </button>
                <button 
                  class="post-submit-btn" 
                  :disabled="!newPostContent.trim()" 
                  @click="submitPost"
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="feed-toggle">
        <button 
          :class="['toggle-btn', { active: feedType === 'forYou' }]" 
          @click="setFeedType('forYou')"
        >
          Pour vous
        </button>
        <button 
          :class="['toggle-btn', { active: feedType === 'following' }]" 
          @click="setFeedType('following')"
        >
          Abonnements
        </button>
      </div>
  
      <div class="feed-content">
        <div v-if="loading" class="loading-state">
          <p>Chargement des publications...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="fetchPosts" class="retry-btn">Réessayer</button>
        </div>
        
        <div v-else-if="posts.length === 0" class="empty-state">
          <p v-if="feedType === 'following'">
            Aucune publication des personnes que vous suivez.
            <br>Commencez à suivre d'autres utilisateurs pour voir leur contenu ici.
          </p>
          <p v-else>
            Aucune publication disponible pour le moment.
            <br>Soyez le premier à partager quelque chose !
          </p>
        </div>
        
        <div v-else class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post-card">
            <div class="post-header">
              <div class="post-avatar">
                <img v-if="post.author.avatar" :src="post.author.avatar" alt="Avatar" />
                <div v-else class="avatar-placeholder">{{ getAuthorInitials(post.author) }}</div>
              </div>
              <div class="post-author-info">
                <div class="author-name">
                  <router-link :to="`/profile/${post.author.username}`">
                    {{ post.author.displayName || post.author.username }}
                  </router-link>
                  <span class="author-username">@{{ post.author.username }}</span>
                </div>
                <div class="post-time">{{ formatPostTime(post.createdAt) }}</div>
              </div>
              <div class="post-menu">
                <button class="menu-btn">⋮</button>
                <!-- Menu dropdown pourrait être ajouté ici -->
              </div>
            </div>
            
            <div class="post-content">
              <p>{{ post.content }}</p>
              <div v-if="post.media && post.media.length" class="post-media">
                <!-- Ici vous pourriez afficher les images ou autres médias -->
                <img v-for="(media, index) in post.media" 
                    :key="index" 
                    :src="media.url" 
                    :alt="media.description || 'Media attaché'" />
              </div>
            </div>
            
            <div class="post-actions-bar">
              <button :class="['action-btn', 'like-btn', { 'active': post.isLiked }]" @click="toggleLike(post)">
                <span class="icon">❤️</span>
                <span class="count">{{ post.likesCount }}</span>
              </button>
              <button class="action-btn comment-btn" @click="focusCommentInput(post.id)">
                <span class="icon">💬</span>
                <span class="count">{{ post.commentsCount }}</span>
              </button>
              <button class="action-btn share-btn">
                <span class="icon">🔄</span>
                <span class="count">{{ post.sharesCount }}</span>
              </button>
            </div>
            
            <div v-if="post.comments && post.comments.length" class="post-comments">
              <div v-for="comment in post.comments.slice(0, 2)" :key="comment.id" class="comment">
                <div class="comment-avatar">
                  <img v-if="comment.author.avatar" :src="comment.author.avatar" alt="Avatar" />
                  <div v-else class="avatar-placeholder small">{{ getAuthorInitials(comment.author) }}</div>
                </div>
                <div class="comment-content">
                  <div class="comment-author">{{ comment.author.displayName || comment.author.username }}</div>
                  <p>{{ comment.content }}</p>
                  <div class="comment-time">{{ formatPostTime(comment.createdAt) }}</div>
                </div>
              </div>
              <div v-if="post.commentsCount > 2" class="view-more-comments">
                <router-link :to="`/post/${post.id}`">
                  Voir les {{ post.commentsCount - 2 }} autres commentaires
                </router-link>
              </div>
            </div>
            
            <div class="add-comment">
              <div class="comment-avatar">
                <img v-if="currentUser.avatar" :src="currentUser.avatar" alt="Votre avatar" />
                <div v-else class="avatar-placeholder small">{{ getUserInitials() }}</div>
              </div>
              <div class="comment-input-container">
                <input
                  :ref="`commentInput_${post.id}`"
                  type="text"
                  v-model="commentInputs[post.id]"
                  placeholder="Ajouter un commentaire..."
                  @keyup.enter="submitComment(post.id)"
                />
                <button 
                  class="submit-comment-btn"
                  :disabled="!commentInputs[post.id] || !commentInputs[post.id].trim()"
                  @click="submitComment(post.id)"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="posts.length > 0 && !loading && hasMorePosts" class="load-more">
          <button @click="loadMorePosts" :disabled="loadingMore" class="load-more-btn">
            {{ loadingMore ? 'Chargement...' : 'Charger plus' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView',
    data() {
      return {
        // Information de l'utilisateur courant (à récupérer depuis votre système d'authentification)
        currentUser: {
          id: 'user1',
          username: 'utilisateur',
          displayName: 'Utilisateur Test',
          avatar: null
        },
        
        // Données pour la création de post
        newPostContent: '',
        maxPostLength: 280,
        
        // Données du fil d'actualité
        feedType: 'forYou', // 'forYou' ou 'following'
        posts: [],
        loading: true,
        loadingMore: false,
        error: null,
        page: 1,
        hasMorePosts: true,
        
        // Stockage des valeurs de commentaires
        commentInputs: {}
      };
    },
    
    computed: {
      isNearCharLimit() {
        return this.newPostContent.length > this.maxPostLength * 0.8;
      }
    },
    
    created() {
      this.fetchPosts();
    },
    
    methods: {
      // Méthodes liées à la création de posts
      adjustTextareaHeight() {
        const textarea = this.$refs.postTextarea;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      },
      
      submitPost() {
        if (!this.newPostContent.trim()) return;
        
        // Simuler l'envoi d'un post (à remplacer par votre appel API)
        const newPost = {
          id: 'temp_' + Date.now(),
          content: this.newPostContent,
          author: this.currentUser,
          createdAt: new Date(),
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          isLiked: false,
          comments: []
        };
        
        // Ajouter temporairement le post au début de la liste
        this.posts.unshift(newPost);
        
        // Réinitialiser le champ de saisie
        this.newPostContent = '';
        if (this.$refs.postTextarea) {
          this.$refs.postTextarea.style.height = 'auto';
        }
        
        // Ici vous feriez votre véritable appel API pour enregistrer le post
        // Et mettriez à jour l'ID temporaire avec l'ID réel retourné par l'API
      },
      
      // Méthodes liées au fil d'actualité
      setFeedType(type) {
        if (this.feedType !== type) {
          this.feedType = type;
          this.posts = [];
          this.page = 1;
          this.hasMorePosts = true;
          this.fetchPosts();
        }
      },
      
      fetchPosts() {
        this.loading = true;
        this.error = null;
        
        // Simuler une requête API (à remplacer par votre véritable appel API)
        setTimeout(() => {
          try {
            // Exemple de données, à remplacer par votre logique d'API
            this.posts = this.generateMockPosts(10);
            this.loading = false;
          } catch (err) {
            this.error = "Impossible de charger les publications. Veuillez réessayer.";
            this.loading = false;
          }
        }, 1000);
      },
      
      loadMorePosts() {
        if (this.loadingMore) return;
        
        this.loadingMore = true;
        this.page += 1;
        
        // Simuler une requête API (à remplacer par votre véritable appel API)
        setTimeout(() => {
          const morePosts = this.generateMockPosts(5);
          
          // S'il n'y a plus de posts à charger
          if (morePosts.length === 0 || this.page >= 3) {
            this.hasMorePosts = false;
          } else {
            this.posts = [...this.posts, ...morePosts];
          }
          
          this.loadingMore = false;
        }, 1000);
      },
      
      // Méthodes liées aux interactions
      toggleLike(post) {
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;
        
        // Ici vous feriez votre appel API pour enregistrer le like/unlike
      },
      
      focusCommentInput(postId) {
        // Initialiser la valeur du commentaire si elle n'existe pas
        if (!this.commentInputs[postId]) {
          this.$set(this.commentInputs, postId, '');
        }
        
        // Focus sur le champ de commentaire
        this.$nextTick(() => {
          const input = this.$refs[`commentInput_${postId}`][0];
          if (input) {
            input.focus();
          }
        });
      },
      
      submitComment(postId) {
        const commentContent = this.commentInputs[postId];
        if (!commentContent || !commentContent.trim()) return;
        
        // Trouver le post concerné
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        // Créer un nouveau commentaire
        const newComment = {
          id: 'comment_' + Date.now(),
          content: commentContent,
          author: this.currentUser,
          createdAt: new Date()
        };
        
        // Ajouter le commentaire au post
        if (!post.comments) {
          post.comments = [];
        }
        post.comments.push(newComment);
        post.commentsCount += 1;
        
        // Réinitialiser le champ de commentaire
        this.$set(this.commentInputs, postId, '');
        
        // Ici vous feriez votre appel API pour enregistrer le commentaire
      },
      
      // Méthodes utilitaires
      getUserInitials() {
        if (this.currentUser.displayName) {
          return this.currentUser.displayName
            .split(' ')
            .map(name => name.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
        }
        return this.currentUser.username.substring(0, 2).toUpperCase();
      },
      
      getAuthorInitials(author) {
        if (author.displayName) {
          return author.displayName
            .split(' ')
            .map(name => name.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
        }
        return author.username.substring(0, 2).toUpperCase();
      },
      
      formatPostTime(dateString) {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffMs = now - postDate;
        const diffSec = Math.floor(diffMs / 1000);
        
        if (diffSec < 60) {
          return `${diffSec}s`;
        }
        
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) {
          return `${diffMin}m`;
        }
        
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) {
          return `${diffHour}h`;
        }
        
        const diffDay = Math.floor(diffHour / 24);
        if (diffDay < 7) {
          return `${diffDay}j`;
        }
        
        // Format de date complet pour les posts plus anciens
        return postDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      },
      
      // Génération de données fictives (à remplacer par vos appels API)
      generateMockPosts(count) {
        const posts = [];
        const authors = [
          { id: 'user2', username: 'marie', displayName: 'Marie Dupont', avatar: null },
          { id: 'user3', username: 'thomas', displayName: 'Thomas Martin', avatar: null },
          { id: 'user4', username: 'sophie', displayName: 'Sophie Leclerc', avatar: null },
          { id: 'user5', username: 'paul', displayName: 'Paul Bernard', avatar: null }
        ];
        
        const contents = [
          "J'ai découvert une nouvelle technologie aujourd'hui ! #tech #innovation",
          "Magnifique journée pour une randonnée en montagne. La nature est tellement apaisante.",
          "Qui veut participer au hackathon le mois prochain ? Cherche des développeurs motivés !",
          "Nouveau tutoriel en ligne sur mon blog : comment créer une application Vue.js de A à Z.",
          "Parfois le meilleur code est celui qu'on ne doit pas écrire. #philosophieDeCode",
          "Visiter Paris est toujours une expérience incroyable. Tant de culture et d'histoire !",
          "Apprendre une nouvelle langue est un défi passionnant. Je progresse en espagnol !",
          "Les meetings qui auraient pu être des emails... On connaît tous. #VieDeDevs",
          "Je viens de terminer ce livre formidable sur l'intelligence artificielle.",
          "Le café : meilleur ami des développeurs depuis toujours. ☕"
        ];
        
        for (let i = 0; i < count; i++) {
          const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
          const randomContent = contents[Math.floor(Math.random() * contents.length)];
          const likesCount = Math.floor(Math.random() * 50);
          const commentsCount = Math.floor(Math.random() * 10);
          
          const post = {
            id: `post_${Date.now()}_${i}`,
            author: randomAuthor,
            content: randomContent,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
            likesCount,
            commentsCount,
            sharesCount: Math.floor(Math.random() * 5),
            isLiked: Math.random() > 0.7,
            comments: []
          };
          
          // Générer quelques commentaires aléatoires si nécessaire
          if (commentsCount > 0) {
            const commentAuthors = [...authors, this.currentUser];
            const commentContents = [
              "Totalement d'accord avec toi !",
              "Intéressant, j'aimerais en savoir plus.",
              "Super publication ! Merci du partage.",
              "Ça me fait penser à une situation similaire que j'ai vécue.",
              "J'adore ton point de vue sur ce sujet."
            ];
            
            for (let j = 0; j < Math.min(commentsCount, 5); j++) {
              const commentAuthor = commentAuthors[Math.floor(Math.random() * commentAuthors.length)];
              const commentContent = commentContents[Math.floor(Math.random() * commentContents.length)];
              
              post.comments.push({
                id: `comment_${Date.now()}_${i}_${j}`,
                author: commentAuthor,
                content: commentContent,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000))
              });
            }
          }
          
          posts.push(post);
        }
        
        // Trier par date de création décroissante
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }
  };
  </script>
  
  <style scoped>
  .home-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  /* Styles pour la création de post */
  .post-creation {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .post-input-container {
    display: flex;
  }
  
  .avatar, .post-avatar, .comment-avatar {
    margin-right: 12px;
  }
  
  .avatar img, .post-avatar img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #3498db;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .avatar-placeholder.small {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
  
  .post-input {
    flex: 1;
  }
  
  .post-input textarea {
    width: 100%;
    border: none;
    resize: none;
    font-size: 1rem;
    font-family: inherit;
    padding: 8px 0;
    margin-bottom: 10px;
    outline: none;
    min-height: 80px;
  }
  
  .post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .char-counter {
    color: #666;
    font-size: 0.85rem;
  }
  
  .char-counter.near-limit {
    color: #e74c3c;
  }
  
  .post-buttons {
    display: flex;
    gap: 10px;
  }
  
  .add-media-btn, .post-submit-btn {
    border: none;
    border-radius: 20px;
    padding: 8px 15px;
    cursor: pointer;
  }
  
  .add-media-btn {
    background-color: transparent;
    color: #3498db;
  }
  
  .post-submit-btn {
    background-color: #3498db;
    color: white;
    font-weight: bold;
  }
  
  .post-submit-btn:disabled {
    background-color: #a0cfee;
    cursor: not-allowed;
  }
  
  /* Styles pour les onglets de fil d'actualité */
  .feed-toggle {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .toggle-btn {
    flex: 1;
    background: none;
    border: none;
    padding: 12px 0;
    font-size: 1rem;
    font-weight: bold;
    color: #666;
    cursor: pointer;
    position: relative;
  }
  
  .toggle-btn.active {
    color: #3498db;
  }
  
  .toggle-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #3498db;
    border-radius: 3px 3px 0 0;
  }
  
  /* Styles pour le contenu du fil d'actualité */
  .loading-state, .error-state, .empty-state {
    text-align: center;
    padding: 40px 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .retry-btn {
    margin-top: 15px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 20px;
    cursor: pointer;
    font-weight: bold;
  }
  
  /* Styles pour les posts */
  .post-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .post-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  
  .post-author-info {
    flex: 1;
    min-width: 0;
  }
  
  .author-name {
    font-weight: bold;
    margin-bottom: 2px;
  }
  
  .author-name a {
    color: #333;
    text-decoration: none;
  }
  
  .author-name a:hover {
    text-decoration: underline;
  }
  
  .author-username {
    color: #666;
    font-weight: normal;
    margin-left: 5px;
    font-size: 0.9rem;
  }
  
  .post-time {
    color: #888;
    font-size: 0.85rem;
  }
  
  .post-menu {
    margin-left: 8px;
  }
  
  .menu-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 5px;
  }
  
  .post-content {
    margin-bottom: 15px;
  }
  
  .post-content p {
    margin: 0 0 12px 0;
    line-height: 1.4;
  }
  
  .post-media {
    margin-top: 10px;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .post-media img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
  }
  
  /* Styles pour les actions sur le post */
  .post-actions-bar {
    display: flex;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 8px 0;
    margin-bottom: 12px;
  }
  
  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #666;
    padding: 5px;
    cursor: pointer;
    gap: 5px;
  }
  
  .action-btn:hover {
    color: #3498db;
  }
  
  .action-btn.active {
    color: #e74c3c;
  }
  
  .action-btn .count {
    font-size: 0.9rem;
  }
  
  /* Styles pour les commentaires */
  .post-comments {
    margin-bottom: 15px;
  }
  
  .comment {
    display: flex;
    margin-bottom: 12px;
  }
  
  .comment-content {
    flex: 1;
    background-color: #f9f9f9;
    border-radius: 12px;
    padding: 8px 12px;
  }
  
  .comment-author {
    font-weight: bold;
    margin-bottom: 2px;
    font-size: 0.9rem;
  }
  
  .comment-content p {
    margin: 0;
    font-size: 0.95rem;
  }
  
  .comment-time {
    color: #888;
    font-size: 0.8rem;
    margin-top: 3px;
  }
  
  .view-more-comments {
    text-align: center;
    font-size: 0.9rem;
    margin: 8px 0;
  }
  
  .view-more-comments a {
    color: #3498db;
    text-decoration: none;
  }
  
  /* Styles pour l'ajout de commentaire */
  .add-comment {
    display: flex;
    align-items: center;
  }
  
  .comment-avatar img, .comment-avatar .avatar-placeholder {
    width: 36px;
    height: 36px;
  }
  
  .comment-input-container {
    flex: 1;
    display: flex;
    background-color: #f5f5f5;
    border-radius: 20px;
    padding: 0 5px 0 15px;
  }
  
  .comment-input-container input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 10px 0;
    outline: none;
    font-size: 0.95rem;
  }
  
  .submit-comment-btn {
    background: none;
    color: #3498db;
    border: none;
    padding: 0 10px;
    font-weight: bold;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .submit-comment-btn:disabled {
    color: #a0cfee;
    cursor: not-allowed;
  }
  
  /* Styles pour le bouton "Charger plus" */
  .load-more {
    text-align: center;
    margin: 20px 0;
  }
  
  .load-more-btn {
    background-color: #f5f5f5;
    color: #666;
    border: none;
    border-radius: 20px;
    padding: 10px 25px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .load-more-btn:hover {
    background-color: #e8e8e8;
  }
  
  .load-more-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  </style>