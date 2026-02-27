<template>
  <div class="book-detail">
    <div v-if="loading" class="loading">Loading book details...</div>

    <div v-else-if="book" class="book-container">
      <div class="book-info">
        <div class="book-header">
          <h1>{{ book.title }}</h1>
          <span class="genre-badge">{{ book.genre }}</span>
        </div>

        <div class="book-meta">
          <p class="author">
            by
            <router-link :to="`/authors/${book.author_id}`">
              {{ book.author_name }}
            </router-link>
          </p>
          <p class="details">
            <strong>ISBN:</strong> {{ book.isbn || "N/A" }}<br />
            <strong>Published:</strong> {{ book.publication_year }}<br />
            <strong>Genre:</strong> {{ book.genre }}
          </p>
        </div>

        <div class="description">
          <h3>Description</h3>
          <p>{{ book.description || "No description available." }}</p>
        </div>
      </div>

      <div class="reviews-section">
        <div class="reviews-header">
          <h2>Reviews ({{ reviews.length }})</h2>
          <button
            v-if="isLoggedIn && !userReview"
            @click="showReviewForm = true"
            class="btn"
          >
            Write a Review
          </button>
          <router-link v-if="!isLoggedIn" to="/login" class="btn">
            Login to Review
          </router-link>
        </div>

        <!-- Review Form -->
        <div v-if="showReviewForm" class="review-form card">
          <h3>{{ editingReview ? "Edit Review" : "Write a Review" }}</h3>
          <form @submit.prevent="submitReview">
            <div class="form-group">
              <label>Rating</label>
              <div class="rating-input">
                <span
                  v-for="star in 5"
                  :key="star"
                  @click="reviewForm.rating = star"
                  class="star"
                  :class="{ active: star <= reviewForm.rating }"
                >
                  ★
                </span>
              </div>
            </div>

            <div class="form-group">
              <label>Comment</label>
              <textarea
                v-model="reviewForm.comment"
                rows="4"
                placeholder="Share your thoughts about this book..."
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn" :disabled="!reviewForm.rating">
                {{ editingReview ? "Update Review" : "Submit Review" }}
              </button>
              <button
                type="button"
                @click="cancelReview"
                class="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Reviews List -->
        <div class="reviews-list">
          <div v-if="reviews.length === 0" class="no-reviews">
            No reviews yet. Be the first to review this book!
          </div>

          <div v-for="review in reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div>
                <strong>{{ review.username }}</strong>
                <div class="rating">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="star"
                    :class="{ active: star <= review.rating }"
                  >
                    ★
                  </span>
                </div>
              </div>
              <div v-if="canEditReview(review)" class="review-actions">
                <button @click="editReview(review)" class="btn-link">
                  Edit
                </button>
                <button
                  @click="deleteReview(review.id)"
                  class="btn-link delete"
                >
                  Delete
                </button>
              </div>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
            <p class="review-date">
              {{ new Date(review.created_at).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error">Book not found</div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "BookDetailView",
  data() {
    return {
      book: null,
      reviews: [],
      loading: true,
      showReviewForm: false,
      editingReview: null,
      reviewForm: {
        rating: 0,
        comment: "",
      },
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("token");
    },
    currentUser() {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    },
    userReview() {
      if (!this.currentUser) return null;
      return this.reviews.find((r) => r.user_id === this.currentUser.id);
    },
  },
  async mounted() {
    await this.fetchBookDetails();
  },
  methods: {
    async fetchBookDetails() {
      const bookId = this.$route.params.id;
      try {
        const [bookRes, reviewsRes] = await Promise.all([
          api.getBook(bookId),
          api.getBookReviews(bookId),
        ]);
        this.book = bookRes.data;
        this.reviews = reviewsRes.data;
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        this.loading = false;
      }
    },
    async submitReview() {
      try {
        if (this.editingReview) {
          await api.updateReview(this.editingReview.id, this.reviewForm);
        } else {
          await api.createReview({
            book_id: this.book.id,
            ...this.reviewForm,
          });
        }
        await this.fetchBookDetails();
        this.cancelReview();
      } catch (error) {
        console.error("Error submitting review:", error);
        alert(error.response?.data?.error || "Failed to submit review");
      }
    },
    editReview(review) {
      this.editingReview = review;
      this.reviewForm = {
        rating: review.rating,
        comment: review.comment,
      };
      this.showReviewForm = true;
    },
    async deleteReview(reviewId) {
      if (!confirm("Are you sure you want to delete this review?")) return;

      try {
        await api.deleteReview(reviewId);
        await this.fetchBookDetails();
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review");
      }
    },
    cancelReview() {
      this.showReviewForm = false;
      this.editingReview = null;
      this.reviewForm = { rating: 0, comment: "" };
    },
    canEditReview(review) {
      if (!this.currentUser) return false;
      return (
        review.user_id === this.currentUser.id ||
        this.currentUser.role === "admin"
      );
    },
  },
};
</script>

<style scoped>
.book-detail {
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

.book-container {
  display: grid;
  gap: 3rem;
}

.book-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.book-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin: 0;
}

.genre-badge {
  background: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  white-space: nowrap;
}

.book-meta {
  margin-bottom: 2rem;
}

.author {
  font-size: 1.3rem;
  color: #7f8c8d;
  font-style: italic;
  margin-bottom: 1rem;
}

.author a {
  color: #42b983;
  text-decoration: none;
}

.author a:hover {
  text-decoration: underline;
}

.details {
  color: #555;
  line-height: 1.8;
}

.description h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.description p {
  color: #555;
  line-height: 1.8;
  font-size: 1.1rem;
}

.reviews-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.reviews-header h2 {
  color: #2c3e50;
  margin: 0;
}

.review-form {
  margin-bottom: 2rem;
  padding: 1.5rem;
}

.review-form h3 {
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

.rating-input {
  display: flex;
  gap: 0.5rem;
}

.star {
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star.active {
  color: #ffd700;
}

.star:hover {
  color: #ffd700;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #42b983;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-reviews {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-style: italic;
}

.review-card {
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.review-header strong {
  color: #2c3e50;
  font-size: 1.1rem;
}

.rating {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.review-actions {
  display: flex;
  gap: 1rem;
}

.btn-link {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.btn-link.delete {
  color: #e74c3c;
}

.review-comment {
  color: #555;
  line-height: 1.6;
  margin: 1rem 0;
}

.review-date {
  color: #95a5a6;
  font-size: 0.9rem;
}
@media (max-width: 768px) {
  .book-header h1 {
    font-size: 1.8rem;
  }

  .book-info,
  .reviews-section {
    padding: 1.5rem;
  }

  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
