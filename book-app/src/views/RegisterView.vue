<template>
  <div class="register-page">
    <div class="register-container">
      <h1>📝 Register</h1>

      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="Choose a username"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="your@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="At least 6 characters"
            minlength="6"
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? "Creating Account..." : "Register" }}
        </button>
      </form>

      <p class="login-link">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "RegisterView",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      error: "",
      success: "",
      loading: false,
    };
  },
  methods: {
    async handleRegister() {
      this.error = "";
      this.success = "";
      this.loading = true;

      try {
        await api.register({
          username: this.username,
          email: this.email,
          password: this.password,
        });

        this.success = "Registration successful! Redirecting to login...";
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          "Registration failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.register-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.register-container h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.success-message {
  background: #efe;
  border: 1px solid #cfc;
  color: #3c3;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
}

.form-group input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
}

.btn-primary {
  background: #42b983;
  color: white;
  padding: 1rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #359268;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #7f8c8d;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
