# API Documentation - Book Database

Complete endpoint documentation with examples.

## Base URL
```
http://localhost:5000
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Authors](#authors)
3. [Books](#books)
4. [Reviews](#reviews)
5. [Error Codes](#error-codes)

---

## Authentication

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "string (required, 3-50 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

**Success Response (201):**
```json
{
  "message": "User registered",
  "user": {
    "id": 7,
    "username": "john_doe"
  }
}
```

**Error Responses:**
- 400: Missing required fields
- 400: Email already registered
- 400: Username already taken

---

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 7,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- 400: Missing email or password
- 401: Invalid credentials

---

## Authors

### Get All Authors

**Endpoint:** `GET /authors`

**Auth Required:** No

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "George Orwell",
    "bio": "English novelist and essayist",
    "birth_year": 1903,
    "nationality": "British",
    "created_at": "2026-02-05T19:24:24.000Z"
  }
]
```

---

### Get Single Author

**Endpoint:** `GET /authors/:id`

**Auth Required:** No

**Success Response (200):**
```json
{
  "id": 1,
  "name": "George Orwell",
  "bio": "English novelist and essayist",
  "birth_year": 1903,
  "nationality": "British",
  "books": [
    {
      "id": 1,
      "title": "1984",
      "publication_year": 1949
    }
  ]
}
```

**Error Responses:**
- 404: Author not found

---

### Create Author (Admin Only)

**Endpoint:** `POST /authors`

**Auth Required:** Yes (Admin)

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "string (required)",
  "bio": "string (optional)",
  "birth_year": "integer (optional)",
  "nationality": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "message": "Author created",
  "author": {
    "id": 11,
    "name": "Stephen King",
    "bio": "American author",
    "birth_year": 1947,
    "nationality": "American"
  }
}
```

**Error Responses:**
- 400: Name required
- 401: No token provided
- 403: Admin access required

---

### Update Author (Admin Only)

**Endpoint:** `PUT /authors/:id`

**Auth Required:** Yes (Admin)

**Request Body:** Same as Create Author

**Success Response (200):**
```json
{
  "message": "Author updated",
  "author": { ... }
}
```

**Error Responses:**
- 404: Author not found
- 401/403: Authentication/Authorization errors

---

### Delete Author (Admin Only)

**Endpoint:** `DELETE /authors/:id`

**Auth Required:** Yes (Admin)

**Success Response (200):**
```json
{
  "message": "Author deleted successfully"
}
```

**Error Responses:**
- 404: Author not found
- 401/403: Authentication/Authorization errors

---

## Books

### Get All Books

**Endpoint:** `GET /books`

**Auth Required:** No

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 10)
- `search` (string, optional): Search by title, author, or genre

**Examples:**

**All books:**
```
GET /books
```

**Paginated:**
```
GET /books?page=2&limit=5
```

**Search:**
```
GET /books?search=Harry
```

**Success Response (200) - Paginated:**
```json
{
  "books": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

**Success Response (200) - Search:**
```json
{
  "books": [ ... ],
  "count": 3
}
```

---

### Get Single Book

**Endpoint:** `GET /books/:id`

**Auth Required:** No

**Success Response (200):**
```json
{
  "id": 1,
  "title": "1984",
  "author_id": 1,
  "author_name": "George Orwell",
  "isbn": "9780451524935",
  "publication_year": 1949,
  "genre": "Dystopian Fiction",
  "description": "A dystopian novel...",
  "created_at": "2026-02-05T19:24:24.000Z"
}
```

**Error Responses:**
- 404: Book not found

---

### Create Book (Admin Only)

**Endpoint:** `POST /books`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "title": "string (required)",
  "author_id": "integer (required)",
  "isbn": "string (optional)",
  "publication_year": "integer (optional)",
  "genre": "string (optional)",
  "description": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "message": "Book created",
  "book": { ... }
}
```

**Error Responses:**
- 400: Title and author_id required
- 401/403: Authentication/Authorization errors

---

### Update Book (Admin Only)

**Endpoint:** `PUT /books/:id`

**Auth Required:** Yes (Admin)

**Request Body:** Same as Create Book

**Success Response (200):**
```json
{
  "message": "Book updated",
  "book": { ... }
}
```

---

### Delete Book (Admin Only)

**Endpoint:** `DELETE /books/:id`

**Auth Required:** Yes (Admin)

**Success Response (200):**
```json
{
  "message": "Book deleted successfully"
}
```

---

## Reviews

### Get All Reviews

**Endpoint:** `GET /reviews`

**Auth Required:** No

**Success Response (200):**
```json
[
  {
    "id": 1,
    "book_id": 1,
    "user_id": 2,
    "username": "john_reader",
    "book_title": "1984",
    "rating": 5,
    "comment": "Amazing book!",
    "created_at": "2026-02-05T19:24:24.000Z"
  }
]
```

---

### Get Reviews for Book

**Endpoint:** `GET /books/:id/reviews`

**Auth Required:** No

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "username": "john_reader",
    "rating": 5,
    "comment": "Amazing!",
    "created_at": "2026-02-05T19:24:24.000Z"
  }
]
```

---

### Create Review

**Endpoint:** `POST /reviews`

**Auth Required:** Yes

**Request Body:**
```json
{
  "book_id": "integer (required)",
  "rating": "integer (required, 1-5)",
  "comment": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "message": "Review created",
  "review": { ... }
}
```

**Error Responses:**
- 400: book_id and rating required
- 400: Rating must be between 1 and 5
- 401: No token provided

---

### Update Review (Own Reviews Only)

**Endpoint:** `PUT /reviews/:id`

**Auth Required:** Yes (Owner only)

**Request Body:**
```json
{
  "rating": "integer (required, 1-5)",
  "comment": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "message": "Review updated",
  "review": { ... }
}
```

**Error Responses:**
- 403: You can only update your own reviews
- 404: Review not found

---

### Delete Review

**Endpoint:** `DELETE /reviews/:id`

**Auth Required:** Yes (Owner or Admin)

**Success Response (200):**
```json
{
  "message": "Review deleted successfully"
}
```

**Error Responses:**
- 403: You can only delete your own reviews
- 404: Review not found

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting implemented.

## Versioning

API Version: 2.0.0

---

**Last Updated:** February 20, 2026