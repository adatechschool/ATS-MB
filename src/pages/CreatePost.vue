<template>
  <div class="create-post">
    <h1>Créer un nouveau post</h1>
    <form @submit.prevent="submitPost">
      <div class="form-group">
        <label for="title">Titre :</label>
        <input type="text" v-model="title" id="title" required />
      </div>
      <div class="form-group">
        <label for="content">Contenu :</label>
        <textarea v-model="content" id="content" required></textarea>
      </div>
      <button type="submit">Créer le post</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      content: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async submitPost() {
      try {
        const response = await this.$http.post("/api/posts/create", {
          title: this.title,
          content: this.content,
        });
        this.successMessage = "Post créé avec succès !";
        this.errorMessage = "";
        // Optionnel : rediriger vers la page des posts après la création
        this.$router.push("/posts");
      } catch (error) {
        this.errorMessage = "Erreur lors de la création du post.";
        this.successMessage = "";
      }
    },
  },
};
</script>

<style scoped>
.create-post {
  max-width: 600px;
  margin: auto;
}

.form-group {
  margin-bottom: 15px;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
