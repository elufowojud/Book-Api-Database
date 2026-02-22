import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export default {
  // Auth
  register(data) {
    return api.post("/auth/register", data);
  },
  login(data) {
    return api.post("/auth/login", data);
  },

  // Books
  getBooks(params) {
    return api.get("/books", { params });
  },
  getBook(id) {
    return api.get(`/books/${id}`);
  },
  createBook(data) {
    return api.post("/books", data);
  },
  updateBook(id, data) {
    return api.put(`/books/${id}`, data);
  },
  deleteBook(id) {
    return api.delete(`/books/${id}`);
  },

  // Authors
  getAuthors() {
    return api.get("/authors");
  },
  getAuthor(id) {
    return api.get(`/authors/${id}`);
  },
  createAuthor(data) {
    return api.post("/authors", data);
  },
  updateAuthor(id, data) {
    return api.put(`/authors/${id}`, data);
  },
  deleteAuthor(id) {
    return api.delete(`/authors/${id}`);
  },

  // Reviews
  getReviews() {
    return api.get("/reviews");
  },
  getBookReviews(bookId) {
    return api.get(`/books/${bookId}/reviews`);
  },
  createReview(data) {
    return api.post("/reviews", data);
  },
  updateReview(id, data) {
    return api.put(`/reviews/${id}`, data);
  },
  deleteReview(id) {
    return api.delete(`/reviews/${id}`);
  },
};
