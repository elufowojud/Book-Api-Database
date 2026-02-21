# Book Database API

A RESTful API for managing a book database with user authentication, reviews, and admin controls.

**Module:** 6005CMD - Full Stack Development  
**Student:** Elufowoju David 
**Student ID:** 13122803
**Academic Year:** 2025/2026

---

## Features

- ✅ User authentication with JWT tokens
- ✅ Role-based authorization (User/Admin)
- ✅ Full CRUD operations for Books, Authors, and Reviews
- ✅ Search and pagination for books
- ✅ User-specific review management
- ✅ Admin-only endpoints for data management
- ✅ MySQL database with relationships
- ✅ RESTful API design

---

## Tech Stack

**Backend:**
- Node.js v24
- Koa.js (Web Framework)
- MySQL 8.0
- JWT for authentication
- Bcrypt for password hashing

**Dependencies:**
- koa
- koa-router
- koa-bodyparser
- koa-cors
- mysql2
- jsonwebtoken
- bcrypt
- dotenv

**Dev Dependencies:**
- nodemon

---

## Installation & Setup

### Prerequisites

- Node.js v24 or higher
- MySQL Server 8.0 or higher
- Git

### 1. Clone Repository
```bash
git clone https://github.coventry.ac.uk/elufowojud/6005CMD-book-api.git
cd 6005CMD-book-api/book-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

**Create Database:**

Open MySQL Workbench and run:
```sql
CREATE DATABASE book_database;
USE book_database;
```

**Run Schema:**

Execute the SQL file: `database/schema.sql`

**Seed Data:**

Execute the SQL file: `database/seed.sql`

This will populate:
- 10 Authors
- 20 Books
- 30 Reviews
- 4 Test Users (1 admin, 3 regular users)

### 4. Environment Configuration

Create a `.env` file in the `book-api` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=book_database
DB_PORT=3306
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

**Important:** Replace `your_mysql_password` and `your_secret_key_here` with your actual values!

### 5. Start Server
```bash
npm run dev
```

Server will start at: `http://localhost:5000`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |

### Authors

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/authors` | Get all authors | No |
| GET | `/authors/:id` | Get single author with books | No |
| POST | `/authors` | Create author | Admin |
| PUT | `/authors/:id` | Update author | Admin |
| DELETE | `/authors/:id` | Delete author | Admin |

### Books

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/books` | Get all books | No |
| GET | `/books?page=1&limit=10` | Get paginated books | No |
| GET | `/books?search=query` | Search books | No |
| GET | `/books/:id` | Get single book | No |
| POST | `/books` | Create book | Admin |
| PUT | `/books/:id` | Update book | Admin |
| DELETE | `/books/:id` | Delete book | Admin |

### Reviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reviews` | Get all reviews | No |
| GET | `/books/:id/reviews` | Get reviews for book | No |
| POST | `/reviews` | Create review | Yes |
| PUT | `/reviews/:id` | Update own review | Yes (Owner) |
| DELETE | `/reviews/:id` | Delete review | Yes (Owner/Admin) |

### Utility

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API info | No |
| GET | `/health` | Health check | No |

---

## Example Requests

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered",
  "user": {
    "id": 7,
    "username": "john_doe"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 7,
    "username": "john_doe",
    "role": "user"
  }
}
```

### Get All Books (Paginated)
```http
GET /books?page=1&limit=5
```

**Response:**
```json
{
  "books": [
    {
      "id": 1,
      "title": "1984",
      "author_name": "George Orwell",
      "publication_year": 1949,
      "genre": "Dystopian Fiction"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 20,
    "totalPages": 4
  }
}
```

### Search Books
```http
GET /books?search=Harry
```

**Response:**
```json
{
  "books": [
    {
      "id": 7,
      "title": "Harry Potter and the Philosophers Stone",
      "author_name": "J.K. Rowling"
    }
  ],
  "count": 2
}
```

### Create Review (Authenticated)
```http
POST /reviews
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "book_id": 1,
  "rating": 5,
  "comment": "Absolutely brilliant book!"
}
```

**Response:**
```json
{
  "message": "Review created",
  "review": {
    "id": 31,
    "book_id": 1,
    "user_id": 7,
    "rating": 5,
    "comment": "Absolutely brilliant book!"
  }
}
```

### Create Book (Admin Only)
```http
POST /books
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "title": "The Hobbit",
  "author_id": 11,
  "isbn": "9780547928227",
  "publication_year": 1937,
  "genre": "Fantasy",
  "description": "A fantasy novel and children's book"
}
```

---

## Authentication

Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get a token by calling `/auth/login`.

**Token expires in:** 7 days (configurable in `.env`)

---

## Authorization Levels

**Public:** Anyone can access
- GET endpoints for books, authors, reviews

**Authenticated:** Logged-in users
- POST /reviews
- PUT /reviews/:id (own reviews only)
- DELETE /reviews/:id (own reviews only)

**Admin Only:**
- POST, PUT, DELETE for /books
- POST, PUT, DELETE for /authors
- DELETE any review

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Title and author_id required"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Book not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection failed"
}
```

---

## Testing

### Default Admin Account

**Email:** `admin@bookapi.com`  
**Password:** `password123`  
**Note:** Password from seed data doesn't work. Create new admin:

1. Register user via `/auth/register`
2. Update in MySQL: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com';`

### Test Users

From seed data (passwords won't work - register new users):
- john@example.com
- sarah@example.com
- mike@example.com

---

## Project Structure
```
6005CMD-book-api/
├── book-api/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # MySQL connection
│   │   ├── models/
│   │   │   ├── user.js           # User model
│   │   │   ├── author.js         # Author model
│   │   │   ├── book.js           # Book model
│   │   │   └── review.js         # Review model
│   │   ├── middleware/
│   │   │   └── auth.js           # Authentication middleware
│   │   └── index.js              # Main server file
│   ├── database/
│   │   ├── schema.sql            # Database schema
│   │   └── seed.sql              # Seed data
│   ├── .env                      # Environment variables (not in git)
│   ├── .gitignore
│   └── package.json
└── README.md
```

---

## Database Schema

### Users
- id (PK)
- username (unique)
- email (unique)
- password (hashed)
- role (user/admin)
- created_at

### Authors
- id (PK)
- name
- bio
- birth_year
- nationality
- created_at

### Books
- id (PK)
- title
- author_id (FK → authors)
- isbn (unique)
- publication_year
- genre
- description
- created_at

### Reviews
- id (PK)
- book_id (FK → books)
- user_id (FK → users)
- rating (1-5)
- comment
- created_at

---

## Development

### Run in Development Mode
```bash
npm run dev
```

Uses nodemon for auto-restart on file changes.

### Environment Variables

All configuration in `.env` file:
- `PORT` - Server port (default: 5000)
- `DB_*` - Database credentials
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time

---

## Security Notes

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for authentication
- Environment variables for sensitive data
- `.env` file excluded from Git
- SQL injection prevention via parameterized queries
- Authorization checks on protected routes

---

## Known Issues

- Seed data passwords are placeholder hashes and don't work
- Solution: Register new users via API

---

## Future Enhancements

- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Book cover image uploads
- [ ] Advanced search filters
- [ ] Review voting system
- [ ] User profile pages
- [ ] Book recommendations

---

## License

This project is for educational purposes (Coventry University coursework).

---

## Contact

**Student:** [Your Name]  
**Email:** [Your Coventry Email]  
**Module:** 6005CMD Full Stack Development

---

## Acknowledgments

- Coventry University
- Module Leader: ae2851@coventry.ac.uk