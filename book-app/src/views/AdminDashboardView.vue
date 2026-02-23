<template>
  <div class="admin-dashboard">
    <h1>👨‍💼 Admin Dashboard</h1>

    <div class="dashboard-tabs">
      <button
        @click="activeTab = 'books'"
        :class="{ active: activeTab === 'books' }"
        class="tab-button"
      >
        📚 Manage Books
      </button>
      <button
        @click="activeTab = 'authors'"
        :class="{ active: activeTab === 'authors' }"
        class="tab-button"
      >
        ✍️ Manage Authors
      </button>
    </div>

    <!-- Books Management -->
    <div v-if="activeTab === 'books'" class="tab-content">
      <div class="section-header">
        <h2>Books</h2>
        <button @click="openBookForm()" class="btn">+ Add New Book</button>
      </div>

      <div v-if="loadingBooks" class="loading">Loading books...</div>

      <table v-else class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author_name }}</td>
            <td>{{ book.publication_year }}</td>
            <td>{{ book.genre }}</td>
            <td class="actions">
              <button @click="openBookForm(book)" class="btn-small btn-edit">
                Edit
              </button>
              <button @click="deleteBook(book.id)" class="btn-small btn-delete">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Authors Management -->
    <div v-if="activeTab === 'authors'" class="tab-content">
      <div class="section-header">
        <h2>Authors</h2>
        <button @click="openAuthorForm()" class="btn">+ Add New Author</button>
      </div>

      <div v-if="loadingAuthors" class="loading">Loading authors...</div>

      <table v-else class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Nationality</th>
            <th>Birth Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="author in authors" :key="author.id">
            <td>{{ author.id }}</td>
            <td>{{ author.name }}</td>
            <td>{{ author.nationality }}</td>
            <td>{{ author.birth_year }}</td>
            <td class="actions">
              <button
                @click="openAuthorForm(author)"
                class="btn-small btn-edit"
              >
                Edit
              </button>
              <button
                @click="deleteAuthor(author.id)"
                class="btn-small btn-delete"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Book Form Modal -->
    <div v-if="showBookForm" class="modal" @click.self="closeBookForm">
      <div class="modal-content">
        <h2>{{ editingBook ? "Edit Book" : "Add New Book" }}</h2>
        <form @submit.prevent="submitBookForm">
          <div class="form-group">
            <label>Title *</label>
            <input v-model="bookForm.title" type="text" required />
          </div>

          <div class="form-group">
            <label>Author *</label>
            <select v-model="bookForm.author_id" required>
              <option value="">Select an author</option>
              <option
                v-for="author in authors"
                :key="author.id"
                :value="author.id"
              >
                {{ author.name }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>ISBN</label>
              <input v-model="bookForm.isbn" type="text" />
            </div>

            <div class="form-group">
              <label>Publication Year</label>
              <input v-model="bookForm.publication_year" type="number" />
            </div>
          </div>

          <div class="form-group">
            <label>Genre</label>
            <input v-model="bookForm.genre" type="text" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="bookForm.description" rows="4"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn">
              {{ editingBook ? "Update" : "Create" }}
            </button>
            <button
              type="button"
              @click="closeBookForm"
              class="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Author Form Modal -->
    <div v-if="showAuthorForm" class="modal" @click.self="closeAuthorForm">
      <div class="modal-content">
        <h2>{{ editingAuthor ? "Edit Author" : "Add New Author" }}</h2>
        <form @submit.prevent="submitAuthorForm">
          <div class="form-group">
            <label>Name *</label>
            <input v-model="authorForm.name" type="text" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Birth Year</label>
              <input v-model="authorForm.birth_year" type="number" />
            </div>

            <div class="form-group">
              <label>Nationality</label>
              <input v-model="authorForm.nationality" type="text" />
            </div>
          </div>

          <div class="form-group">
            <label>Biography</label>
            <textarea v-model="authorForm.bio" rows="4"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn">
              {{ editingAuthor ? "Update" : "Create" }}
            </button>
            <button
              type="button"
              @click="closeAuthorForm"
              class="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "AdminDashboardView",
  data() {
    return {
      activeTab: "books",
      books: [],
      authors: [],
      loadingBooks: true,
      loadingAuthors: true,
      showBookForm: false,
      showAuthorForm: false,
      editingBook: null,
      editingAuthor: null,
      bookForm: {
        title: "",
        author_id: "",
        isbn: "",
        publication_year: "",
        genre: "",
        description: "",
      },
      authorForm: {
        name: "",
        bio: "",
        birth_year: "",
        nationality: "",
      },
    };
  },
  async mounted() {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      alert("Admin access required");
      this.$router.push("/");
      return;
    }

    await this.fetchBooks();
    await this.fetchAuthors();
  },
  methods: {
    async fetchBooks() {
      this.loadingBooks = true;
      try {
        const response = await api.getBooks({});
        this.books = response.data.books || response.data;
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loadingBooks = false;
      }
    },
    async fetchAuthors() {
      this.loadingAuthors = true;
      try {
        const response = await api.getAuthors();
        this.authors = response.data;
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        this.loadingAuthors = false;
      }
    },
    openBookForm(book = null) {
      if (book) {
        this.editingBook = book;
        this.bookForm = {
          title: book.title,
          author_id: book.author_id,
          isbn: book.isbn || "",
          publication_year: book.publication_year || "",
          genre: book.genre || "",
          description: book.description || "",
        };
      } else {
        this.editingBook = null;
        this.bookForm = {
          title: "",
          author_id: "",
          isbn: "",
          publication_year: "",
          genre: "",
          description: "",
        };
      }
      this.showBookForm = true;
    },
    closeBookForm() {
      this.showBookForm = false;
      this.editingBook = null;
    },
    async submitBookForm() {
      try {
        if (this.editingBook) {
          await api.updateBook(this.editingBook.id, this.bookForm);
          alert("Book updated successfully!");
        } else {
          await api.createBook(this.bookForm);
          alert("Book created successfully!");
        }
        await this.fetchBooks();
        this.closeBookForm();
      } catch (error) {
        console.error("Error saving book:", error);
        alert(error.response?.data?.error || "Failed to save book");
      }
    },
    async deleteBook(bookId) {
      if (!confirm("Are you sure you want to delete this book?")) return;

      try {
        await api.deleteBook(bookId);
        alert("Book deleted successfully!");
        await this.fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book");
      }
    },
    openAuthorForm(author = null) {
      if (author) {
        this.editingAuthor = author;
        this.authorForm = {
          name: author.name,
          bio: author.bio || "",
          birth_year: author.birth_year || "",
          nationality: author.nationality || "",
        };
      } else {
        this.editingAuthor = null;
        this.authorForm = {
          name: "",
          bio: "",
          birth_year: "",
          nationality: "",
        };
      }
      this.showAuthorForm = true;
    },
    closeAuthorForm() {
      this.showAuthorForm = false;
      this.editingAuthor = null;
    },
    async submitAuthorForm() {
      try {
        if (this.editingAuthor) {
          await api.updateAuthor(this.editingAuthor.id, this.authorForm);
          alert("Author updated successfully!");
        } else {
          await api.createAuthor(this.authorForm);
          alert("Author created successfully!");
        }
        await this.fetchAuthors();
        this.closeAuthorForm();
      } catch (error) {
        console.error("Error saving author:", error);
        alert(error.response?.data?.error || "Failed to save author");
      }
    },
    async deleteAuthor(authorId) {
      if (!confirm("Are you sure you want to delete this author?")) return;

      try {
        await api.deleteAuthor(authorId);
        alert("Author deleted successfully!");
        await this.fetchAuthors();
      } catch (error) {
        console.error("Error deleting author:", error);
        alert("Failed to delete author");
      }
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.admin-dashboard h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.dashboard-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button:hover {
  border-color: #42b983;
}

.tab-button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.tab-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #2c3e50;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
}

.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.admin-table tr:hover {
  background: #f8f9fa;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:hover {
  opacity: 0.8;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  opacity: 0.8;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b983;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
