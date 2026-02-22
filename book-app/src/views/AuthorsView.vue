<template>
  <div class="authors-page">
    <div class="page-header">
      <h1>✍️ Authors</h1>
    </div>

    <div v-if="loading" class="loading">Loading authors...</div>

    <div v-else class="authors-grid">
      <div v-for="author in authors" :key="author.id" class="author-card">
        <div class="author-header">
          <h2>{{ author.name }}</h2>
          <span class="nationality">{{ author.nationality }}</span>
        </div>
        <p v-if="author.birth_year" class="birth-year">
          Born: {{ author.birth_year }}
        </p>
        <p class="bio">{{ truncate(author.bio, 150) }}</p>
        <router-link :to="`/authors/${author.id}`" class="btn btn-small">
          View Books
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "AuthorsView",
  data() {
    return {
      authors: [],
      loading: true,
    };
  },
  async mounted() {
    await this.fetchAuthors();
  },
  methods: {
    async fetchAuthors() {
      try {
        const response = await api.getAuthors();
        this.authors = response.data;
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        this.loading = false;
      }
    },
    truncate(text, length) {
      if (!text) return "";
      return text.length > length ? text.substring(0, length) + "..." : text;
    },
  },
};
</script>

<style scoped>
.authors-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #7f8c8d;
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.author-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.author-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.author-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.author-card h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0;
}

.nationality {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  white-space: nowrap;
}

.birth-year {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.bio {
  color: #555;
  line-height: 1.6;
  margin: 1rem 0;
  min-height: 4.5rem;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  text-decoration: none;
  display: inline-block;
}
</style>
