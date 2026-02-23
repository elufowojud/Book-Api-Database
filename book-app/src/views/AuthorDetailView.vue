<template>
  <div class="author-detail">
    <div v-if="loading" class="loading">Loading author details...</div>

    <div v-else-if="author" class="author-container">
      <div class="author-info card">
        <div class="author-header">
          <h1>{{ author.name }}</h1>
          <span class="nationality-badge">{{ author.nationality }}</span>
        </div>

        <p v-if="author.birth_year" class="birth-year">
          Born: {{ author.birth_year }}
        </p>

        <div class="bio">
          <h3>Biography</h3>
          <p>{{ author.bio || "No biography available." }}</p>
        </div>
      </div>

      <div class="books-section">
        <h2>Books by {{ author.name }} ({{ author.books?.length || 0 }})</h2>

        <div v-if="author.books && author.books.length > 0" class="books-grid">
          <div v-for="book in author.books" :key="book.id" class="book-card">
            <h3>{{ book.title }}</h3>
            <p class="year">Published: {{ book.publication_year }}</p>
            <p class="genre">{{ book.genre }}</p>
            <router-link :to="`/books/${book.id}`" class="btn btn-small">
              View Details
            </router-link>
          </div>
        </div>

        <div v-else class="no-books">No books found for this author.</div>
      </div>
    </div>

    <div v-else class="error">Author not found</div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "AuthorDetailView",
  data() {
    return {
      author: null,
      loading: true,
    };
  },
  async mounted() {
    await this.fetchAuthorDetails();
  },
  methods: {
    async fetchAuthorDetails() {
      const authorId = this.$route.params.id;
      try {
        const response = await api.getAuthor(authorId);
        this.author = response.data;
      } catch (error) {
        console.error("Error fetching author details:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.author-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.error {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #7f8c8d;
}

.author-container {
  display: grid;
  gap: 3rem;
}

.author-info {
  padding: 2rem;
}

.author-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.author-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin: 0;
}

.nationality-badge {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  white-space: nowrap;
}

.birth-year {
  color: #95a5a6;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.bio h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.bio p {
  color: #555;
  line-height: 1.8;
  font-size: 1.1rem;
}

.books-section h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.book-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-4px);
}

.book-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.year {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.genre {
  color: #42b983;
  font-weight: 600;
  margin: 0.5rem 0 1rem;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  text-decoration: none;
  display: inline-block;
}

.no-books {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-style: italic;
  background: white;
  border-radius: 12px;
}
</style>
