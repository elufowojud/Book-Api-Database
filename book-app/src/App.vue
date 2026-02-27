<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="logo">📚 Book Database</router-link>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/books">Books</router-link>
          <router-link to="/authors">Authors</router-link>
          <router-link v-if="isAdmin" to="/admin">Admin</router-link>
          <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
          <button v-if="isLoggedIn" @click="logout" class="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
    <main class="container">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container footer-content">
        <p>&copy; 2026 Book Database. Built with Vue.js & Node.js</p>
        <p class="footer-links">
          <router-link to="/">Home</router-link> |
          <router-link to="/books">Books</router-link> |
          <router-link to="/authors">Authors</router-link>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("token");
    },
    isAdmin() {
      const user = localStorage.getItem("user");
      if (!user) return false;
      const userData = JSON.parse(user);
      return userData.role === "admin";
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.logo:hover {
  color: #42b983;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #42b983;
}

.btn-logout {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
}

.btn-logout:hover {
  background: #c0392b;
}

main.container {
  display: block;
  padding: 2rem;
  flex: 1;
}

.btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
}

.btn:hover {
  background: #359268;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #95a5a6;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.footer {
  background: #2c3e50;
  color: white;
  padding: 2rem 0;
  margin-top: 4rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer p {
  margin: 0;
}

.footer-links a {
  color: white;
  text-decoration: none;
  margin: 0 0.5rem;
}

.footer-links a:hover {
  color: #42b983;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar .container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  main.container {
    padding: 1rem;
  }
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus Styles for Accessibility */
a:focus,
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #42b983;
  outline-offset: 2px;
}
</style>
