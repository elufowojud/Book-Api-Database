# 📚 Book Database API - Full Stack Application

**Module:** 6005CMD - Full Stack Development  
**Student:** Elufowoju David  
**Student ID:** 13122803 
**GitHub:** elufowojud
**Submission Date:** March 2026

---

## 🎯 Project Overview

A comprehensive full-stack web application for managing a book database with user authentication, reviews, and admin controls. Built with Node.js/Koa backend and Vue.js frontend.

**Live Demo:** [If deployed, add link here]  
**Repository:** https://github.coventry.ac.uk/elufowojud/6005CMD-book-api

---

## ✨ Key Features

### User Features
- ✅ User registration and authentication (JWT-based)
- ✅ Browse books with search and pagination
- ✅ View detailed book information
- ✅ Browse authors and their books
- ✅ Write, edit, and delete own reviews
- ✅ Star rating system (1-5 stars)
- ✅ Responsive design (mobile, tablet, desktop)

### Admin Features
- ✅ Admin dashboard for managing content
- ✅ Create, edit, delete books
- ✅ Create, edit, delete authors
- ✅ Delete any user reviews
- ✅ View all database statistics

### Technical Features
- ✅ RESTful API architecture
- ✅ JWT token-based authentication
- ✅ Role-based authorization (user/admin)
- ✅ Password hashing with bcrypt
- ✅ Input validation and error handling
- ✅ CORS configuration
- ✅ Pagination for large datasets
- ✅ Search functionality
- ✅ Responsive UI with Vue.js
- ✅ MySQL database with relationships

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js v24
- **Framework:** Koa.js
- **Database:** MySQL 8.0
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Environment Variables:** dotenv
- **CORS:** @koa/cors

### Frontend
- **Framework:** Vue.js 3
- **HTTP Client:** Axios
- **Routing:** Vue Router
- **State Management:** Vuex
- **Build Tool:** Vue CLI
- **Linting:** ESLint + Prettier

### Development Tools
- **API Testing:** Postman
- **Database Tool:** MySQL Workbench
- **Version Control:** Git & GitHub
- **IDE:** VS Code
- **Package Manager:** npm

---

## 📁 Project Structure
```
6005CMD-book-api/
├── book-api/                      # Backend API
│   ├── database/
│   │   ├── schema.sql            # Database schema
│   │   └── seed.sql              # Sample data
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # MySQL connection
│   │   ├── middleware/
│   │   │   └── auth.js           # Authentication middleware
│   │   ├── models/
│   │   │   ├── user.js           # User model
│   │   │   ├── author.js         # Author model
│   │   │   ├── book.js           # Book model
│   │   │   └── review.js         # Review model
│   │   └── index.js              # Main server file
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── README.md
│
├── book-app/                      # Frontend Vue.js App
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/               # Images, styles
│   │   ├── components/           # Reusable components
│   │   ├── views/                # Page components
│   │   │   ├── HomeView.vue
│   │   │   ├── BooksView.vue
│   │   │   ├── BookDetailView.vue
│   │   │   ├── AuthorsView.vue
│   │   │   ├── AuthorDetailView.vue
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── AdminDashboardView.vue
│   │   │   └── NotFoundView.vue
│   │   ├── router/
│   │   │   └── index.js          # Routes
│   │   ├── store/
│   │   │   └── index.js          # Vuex store
│   │   ├── api.js                # API client
│   │   ├── App.vue               # Root component
│   │   └── main.js               # Entry point
│   └── package.json
│
├── API_DOCUMENTATION.md           # Complete API docs
├── TESTING.md                     # Testing documentation
├── SUBMISSION.md                  # Submission checklist
└── README.md                      # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v24 or higher
- MySQL 8.0 or higher
- Git

### 1. Clone Repository
```bash
git clone https://github.coventry.ac.uk/elufowojud/6005CMD-book-api.git
cd 6005CMD-book-api
```

### 2. Backend Setup
```bash
cd book-api
npm install
```

**Create `.env` file:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=book_database
DB_PORT=3306
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Setup Database:**
1. Open MySQL Workbench
2. Create database: `CREATE DATABASE book_database;`
3. Run `database/schema.sql`
4. Run `database/seed.sql`

**Start Backend:**
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd book-app
npm install
```

**Start Frontend:**
```bash
npm run serve
```
App runs on `http://localhost:8080`

---

## 📖 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Books
- `GET /books` - Get all books (supports pagination & search)
- `GET /books/:id` - Get single book
- `POST /books` - Create book (admin only)
- `PUT /books/:id` - Update book (admin only)
- `DELETE /books/:id` - Delete book (admin only)

### Authors
- `GET /authors` - Get all authors
- `GET /authors/:id` - Get author with books
- `POST /authors` - Create author (admin only)
- `PUT /authors/:id` - Update author (admin only)
- `DELETE /authors/:id` - Delete author (admin only)

### Reviews
- `GET /reviews` - Get all reviews
- `GET /books/:id/reviews` - Get reviews for specific book
- `POST /reviews` - Create review (authenticated)
- `PUT /reviews/:id` - Update own review
- `DELETE /reviews/:id` - Delete own review (or any as admin)

**Full API Documentation:** See `API_DOCUMENTATION.md`

---

## 👤 Default Accounts

### Admin Account
- **Email:** admin@test.com
- **Password:** admin123
- **Role:** admin

### Test User
- **Email:** testuser@example.com
- **Password:** password123
- **Role:** user

---

## 🧪 Testing

Comprehensive testing performed on all features:
- ✅ 50+ API endpoint tests
- ✅ User flow testing
- ✅ Admin functionality testing
- ✅ Responsive design testing
- ✅ Security testing
- ✅ Performance testing

**Testing Documentation:** See `TESTING.md`

**Test Results:** 100% pass rate, 0 critical bugs

---

## 🎨 Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Books Page
![Books](screenshots/books.png)

### Admin Dashboard
![Admin](screenshots/admin.png)


---

## 📊 Database Schema

### Tables
- **users** (id, username, email, password, role, created_at)
- **authors** (id, name, bio, birth_year, nationality, created_at)
- **books** (id, title, author_id, isbn, publication_year, genre, description, created_at)
- **reviews** (id, book_id, user_id, rating, comment, created_at)

### Relationships
- Books → Authors (many-to-one)
- Reviews → Books (many-to-one)
- Reviews → Users (many-to-one)

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication
- ✅ Role-based authorization
- ✅ Protected routes (admin-only endpoints)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (Vue sanitization)
- ✅ CORS configuration
- ✅ Environment variables for sensitive data

---

## 🎯 Learning Outcomes Achieved

### Backend Development
- ✅ Built RESTful API with Koa.js
- ✅ Implemented authentication & authorization
- ✅ Database design and relationships
- ✅ CRUD operations
- ✅ Error handling and validation

### Frontend Development
- ✅ Built SPA with Vue.js 3
- ✅ Component-based architecture
- ✅ State management
- ✅ Routing and navigation
- ✅ API integration with Axios
- ✅ Responsive design

### Full Stack Integration
- ✅ Connected frontend to backend API
- ✅ Handled CORS
- ✅ Implemented token-based auth flow
- ✅ Form handling and validation

---

## 🚀 Future Enhancements

- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Book cover image uploads
- [ ] User profile pages with avatar
- [ ] Review voting system
- [ ] Advanced search filters
- [ ] Book recommendations
- [ ] Export data to CSV/PDF
- [ ] Deployment to cloud (Heroku/AWS)

---

## 📝 Documentation Files

- **README.md** - Project overview and setup (this file)
- **API_DOCUMENTATION.md** - Complete API endpoint documentation
- **TESTING.md** - Testing procedures and results
- **SUBMISSION.md** - Submission checklist and deliverables

---

## 🙏 Acknowledgments

- **Module Leader:** ae2851@coventry.ac.uk
- **University:** Coventry University
- **Module:** 6005CMD Full Stack Development
- **Academic Year:** 2025/2026

---

## 📄 License

This project is submitted as coursework for Coventry University and is for educational purposes only.

---

## 📧 Contact

**Student:** Elufowoju David  
**Email:** elufowojud@coventry.ac.uk  
**Student ID:** 13122803  
**Submission Date:** March 2026

---

**Grade Target:** First Class Honours ⭐

**Estimated Development Time:** 100+ hours across 14 days

**Lines of Code:** ~5000+ (Backend + Frontend)

---

*Last Updated: February 23, 2026*
