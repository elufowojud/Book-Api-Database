<template>
  <div class="home">
    <div class="hero">
      <h1>📚 Welcome to Book Database</h1>
      <p>Discover, review, and manage your favorite books</p>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>{{ stats.books }}</h3>
        <p>Books</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.authors }}</h3>
        <p>Authors</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.reviews }}</h3>
        <p>Reviews</p>
      </div>
    </div>

    <div class="card">
      <h2>Recent Books</h2>
      <div v-if="loading">Loading...</div>
      <div v-else class="book-grid">
        <div v-for="book in recentBooks" :key="book.id" class="book-item">
          <h3>{{ book.title }}</h3>
          <p>by {{ book.author_name }}</p>
          <p class="genre">{{ book.genre }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "HomeView",
  data() {
    return {
      loading: true,
      recentBooks: [],
      stats: {
        books: 0,
        authors: 0,
        reviews: 0,
      },
    };
  },
  async mounted() {
    try {
      const [booksRes, authorsRes, reviewsRes] = await Promise.all([
        api.getBooks({ limit: 6 }),
        api.getAuthors(),
        api.getReviews(),
      ]);

      this.recentBooks = booksRes.data.books || booksRes.data;
      this.stats.books =
        booksRes.data.pagination?.total || booksRes.data.length;
      this.stats.authors = authorsRes.data.length;
      this.stats.reviews = reviewsRes.data.length;
      this.loading = false;
    } catch (error) {
      console.error("Error loading data:", error);
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  font-size: 3rem;
  color: #42b983;
  margin-bottom: 0.5rem;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.book-item {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}

.book-item h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.book-item p {
  color: #7f8c8d;
  margin: 0.25rem 0;
}

.genre {
  display: inline-block;
  background: #42b983;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
