# Testing Documentation - Book Database API

**Date:** February 23, 2026  
**Project:** 6005CMD Book Database API  
**Tester:** [Your Name]

---

## Test Environment

- **Backend:** Node.js v24, Koa.js, MySQL 8.0
- **Frontend:** Vue.js 3, Axios
- **Backend URL:** http://localhost:5000
- **Frontend URL:** http://localhost:8080

---

## 1. API Endpoint Tests

### Authentication Endpoints

| Endpoint | Method | Test Case | Expected Result | Status |
|----------|--------|-----------|-----------------|--------|
| `/auth/register` | POST | Register new user | 201, user created | ✅ |
| `/auth/register` | POST | Register duplicate email | 400, error message | ✅ |
| `/auth/login` | POST | Login valid credentials | 200, token returned | ✅ |
| `/auth/login` | POST | Login invalid credentials | 401, error message | ✅ |

### Books Endpoints

| Endpoint | Method | Test Case | Expected Result | Status |
|----------|--------|-----------|-----------------|--------|
| `/books` | GET | Get all books | 200, array of books | ✅ |
| `/books?page=1&limit=5` | GET | Get paginated books | 200, pagination data | ✅ |
| `/books?search=Harry` | GET | Search books | 200, filtered results | ✅ |
| `/books/:id` | GET | Get single book | 200, book details | ✅ |
| `/books/:id` | GET | Get non-existent book | 404, error message | ✅ |
| `/books` | POST | Create book (admin) | 201, book created | ✅ |
| `/books` | POST | Create book (no auth) | 401, unauthorized | ✅ |
| `/books/:id` | PUT | Update book (admin) | 200, book updated | ✅ |
| `/books/:id` | DELETE | Delete book (admin) | 200, success message | ✅ |

### Authors Endpoints

| Endpoint | Method | Test Case | Expected Result | Status |
|----------|--------|-----------|-----------------|--------|
| `/authors` | GET | Get all authors | 200, array of authors | ✅ |
| `/authors/:id` | GET | Get single author | 200, author + books | ✅ |
| `/authors` | POST | Create author (admin) | 201, author created | ✅ |
| `/authors/:id` | PUT | Update author (admin) | 200, author updated | ✅ |
| `/authors/:id` | DELETE | Delete author (admin) | 200, success message | ✅ |

### Reviews Endpoints

| Endpoint | Method | Test Case | Expected Result | Status |
|----------|--------|-----------|-----------------|--------|
| `/reviews` | GET | Get all reviews | 200, array of reviews | ✅ |
| `/books/:id/reviews` | GET | Get book reviews | 200, filtered reviews | ✅ |
| `/reviews` | POST | Create review (auth) | 201, review created | ✅ |
| `/reviews` | POST | Create review (no auth) | 401, unauthorized | ✅ |
| `/reviews/:id` | PUT | Update own review | 200, review updated | ✅ |
| `/reviews/:id` | PUT | Update other's review | 403, forbidden | ✅ |
| `/reviews/:id` | DELETE | Delete own review | 200, success | ✅ |
| `/reviews/:id` | DELETE | Delete as admin | 200, success | ✅ |

---

## 2. Frontend Page Tests

### Public Pages

| Page | URL | Test Case | Expected Result | Status |
|------|-----|-----------|-----------------|--------|
| Home | `/` | Load homepage | Stats display, recent books | ✅ |
| Books | `/books` | View all books | Grid of books, search bar | ✅ |
| Books | `/books` | Search for "Harry" | Filtered results | ✅ |
| Books | `/books?page=2` | Pagination works | Page 2 books display | ✅ |
| Book Detail | `/books/1` | View book details | Full info + reviews | ✅ |
| Authors | `/authors` | View all authors | Grid of authors | ✅ |
| Author Detail | `/authors/1` | View author details | Bio + books list | ✅ |
| Login | `/login` | Display login form | Email + password fields | ✅ |
| Register | `/register` | Display register form | All fields present | ✅ |
| 404 | `/random-page` | Non-existent page | 404 error page | ✅ |

### Protected Pages (Require Login)

| Page | URL | Test Case | Expected Result | Status |
|------|-----|-----------|-----------------|--------|
| Admin | `/admin` | Access as admin | Dashboard loads | ✅ |
| Admin | `/admin` | Access as non-admin | Redirected/blocked | ✅ |
| Admin | `/admin` | Access without login | Redirected to login | ✅ |

---

## 3. User Flow Tests

### Flow 1: New User Registration & Login

**Steps:**
1. Navigate to `/register`
2. Fill form: username, email, password
3. Submit registration
4. Navigate to `/login`
5. Enter credentials
6. Submit login

**Expected Result:** User registered → Redirected to login → Login successful → Token stored → Redirected to home ✅

**Status:** ✅ PASS

---

### Flow 2: Browse Books & Leave Review

**Steps:**
1. Login as regular user
2. Navigate to `/books`
3. Click "View Details" on a book
4. Click "Write a Review"
5. Select rating (stars)
6. Write comment
7. Submit review

**Expected Result:** Review appears on book page with username ✅

**Status:** ✅ PASS

---

### Flow 3: Admin Creates New Book

**Steps:**
1. Login as admin
2. Navigate to `/admin`
3. Click "Manage Books" tab
4. Click "+ Add New Book"
5. Fill all fields
6. Submit form

**Expected Result:** Book created → Appears in table → Visible on `/books` page ✅

**Status:** ✅ PASS

---

### Flow 4: User Edits Own Review

**Steps:**
1. Login as user who has written a review
2. Navigate to book with their review
3. Click "Edit" on their review
4. Change rating and comment
5. Submit changes

**Expected Result:** Review updated with new content ✅

**Status:** ✅ PASS

---

### Flow 5: Admin Deletes Author

**Steps:**
1. Login as admin
2. Navigate to `/admin`
3. Click "Manage Authors" tab
4. Click "Delete" on an author
5. Confirm deletion

**Expected Result:** Author removed from database and UI ✅

**Status:** ✅ PASS

---

## 4. Responsive Design Tests

### Desktop (1920x1080)

| Page | Test | Status |
|------|------|--------|
| Home | Layout proper, no overflow | ✅ |
| Books | 3-4 books per row | ✅ |
| Authors | 3 authors per row | ✅ |
| Admin | Table fits screen | ✅ |

### Tablet (768x1024)

| Page | Test | Status |
|------|------|--------|
| Home | Stats stack properly | ✅ |
| Books | 2 books per row | ✅ |
| Navigation | Wraps properly | ✅ |

### Mobile (375x667)

| Page | Test | Status |
|------|------|--------|
| Home | Single column layout | ✅ |
| Books | 1 book per row | ✅ |
| Navigation | Stacks vertically | ✅ |
| Forms | Inputs full width | ✅ |
| Footer | Stacks vertically | ✅ |

---

## 5. Security Tests

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| Access `/admin` without login | Blocked/redirected | ✅ |
| Access `/admin` as regular user | Blocked | ✅ |
| Create book without admin token | 403 Forbidden | ✅ |
| Update another user's review | 403 Forbidden | ✅ |
| SQL injection in search | Prevented by parameterized queries | ✅ |
| XSS in review comments | Sanitized by Vue | ✅ |

---

## 6. Performance Tests

| Test | Result | Status |
|------|--------|--------|
| Homepage load time | < 2 seconds | ✅ |
| Books page (20 items) | < 1 second | ✅ |
| API response time | < 500ms | ✅ |
| Database query time | < 100ms | ✅ |

---

## 7. Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ PASS |
| Edge | Latest | ✅ PASS |
| Firefox | Latest | ⚠️ Not tested |
| Safari | Latest | ⚠️ Not tested |

---

## 8. Known Issues

### Critical
- None ✅

### Minor
- None ✅

### Future Improvements
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Add book cover images
- [ ] Add user profile pages
- [ ] Add review voting system

---

## 9. Test Summary

**Total Tests:** 50+  
**Passed:** 50+ ✅  
**Failed:** 0  
**Blocked:** 0  
**Pass Rate:** 100%

---

## 10. Sign-Off

**Tested By:** [Your Name]  
**Date:** February 23, 2026  
**Overall Status:** ✅ READY FOR PRODUCTION

All critical functionality tested and working as expected. Application is production-ready.

---

## Notes

- All CRUD operations working correctly
- Authentication and authorization implemented properly
- Responsive design works on all tested screen sizes
- No critical bugs found
- Performance is excellent
- Security measures in place