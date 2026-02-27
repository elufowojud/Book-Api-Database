import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BooksView from "../views/BooksView.vue";
import BookDetailView from "../views/BookDetailView.vue";
import AuthorsView from "../views/AuthorsView.vue";
import AuthorDetailView from "../views/AuthorDetailView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/books",
    name: "books",
    component: BooksView,
  },
  {
    path: "/books/:id",
    name: "book-detail",
    component: BookDetailView,
  },
  {
    path: "/authors",
    name: "authors",
    component: AuthorsView,
  },
  {
    path: "/authors/:id",
    name: "author-detail",
    component: AuthorDetailView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminDashboardView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
