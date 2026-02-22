<template>
  <div class="books-page">
    <div class="page-header">
      <h1>📚 Books</h1>
      <div class="search-bar">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search books by title, author, or genre..."
          class="search-input"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">Loading books...</div>

    <div v-else>
      <div class="books-grid">
        <div v-for="book in books" :key="book.id" class="book-card">
          <div class="book-header">
            <h3>{{ book.title }}</h3>
            <span class="genre-badge">{{ book.genre }}</span>
          </div>
          <p class="author">by {{ book.author_name }}</p>
          <p class="year">Published: {{ book.publication_year }}</p>
          <p class="description">{{ truncate(book.description, 100) }}</p>
          <router-link :to="`/books/${book.id}`" class="btn btn-small">
            View Details
          </router-link>
        </div>
      </div>

      <div v-if="pagination && !searchQuery" class="pagination">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="btn btn-secondary"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </span>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
          class="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "BooksView",
  data() {
    return {
      books: [],
      loading: true,
      searchQuery: "",
      pagination: null,
      currentPage: 1,
    };
  },
  async mounted() {
    await this.fetchBooks();
  },
  methods: {
    async fetchBooks(page = 1) {
      this.loading = true;
      try {
        const response = await api.getBooks({ page, limit: 12 });
        if (response.data.books) {
          this.books = response.data.books;
          this.pagination = response.data.pagination;
        } else {
          this.books = response.data;
          this.pagination = null;
        }
        this.currentPage = page;
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
      }
    },
    async handleSearch() {
      if (this.searchQuery.trim()) {
        this.loading = true;
        try {
          const response = await api.getBooks({ search: this.searchQuery });
          this.books = response.data.books || response.data;
          this.pagination = null;
        } catch (error) {
          console.error("Error searching books:", error);
        } finally {
          this.loading = false;
        }
      } else {
        await this.fetchBooks(1);
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.fetchBooks(page);
        window.scrollTo(0, 0);
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
.books-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.search-bar {
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
}

.loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #7f8c8d;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.book-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.book-card h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  margin: 0;
  flex: 1;
}

.genre-badge {
  background: #42b983;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.author {
  color: #7f8c8d;
  font-style: italic;
  margin: 0.5rem 0;
}

.year {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.description {
  color: #555;
  line-height: 1.6;
  margin: 1rem 0;
  flex-grow: 1;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
}

.page-info {
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
