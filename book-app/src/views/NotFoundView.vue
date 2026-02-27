<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/" class="btn">Go Home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundView",
};
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
}

.content h1 {
  font-size: 8rem;
  color: #42b983;
  margin: 0;
  line-height: 1;
}

.content h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 1rem 0;
}

.content p {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}
</style>
