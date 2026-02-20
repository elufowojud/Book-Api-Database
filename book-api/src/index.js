require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');

const db = require('./config/database');
const User = require('./models/user');
const Author = require('./models/author');
const Book = require('./models/book');
const Review = require('./models/review');
const { authenticate, requireAdmin } = require('./middleware/auth');

const app = new Koa();
app.use(bodyParser());

app.use(async (ctx) => {
  const path = ctx.path;
  const method = ctx.method;
  console.log(`${method} ${path}`);

  // ROOT
  if (path === '/' && method === 'GET') {
    ctx.body = {
      message: 'Book Database API',
      endpoints: {
        authors: 'GET /authors',
        books: 'GET /books',
        reviews: 'GET /reviews',
        login: 'POST /auth/login'
      }
    };
    return;
  }

  // HEALTH
  if (path === '/health' && method === 'GET') {
    try {
      await db.query('SELECT 1');
      ctx.body = { status: 'healthy', database: 'connected' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    return;
  }

  // REGISTER
  if (path === '/auth/register' && method === 'POST') {
    try {
      const { username, email, password } = ctx.request.body;
      if (!username || !email || !password) {
        ctx.status = 400;
        ctx.body = { error: 'Username, email, and password required' };
        return;
      }
      const user = await User.create(username, email, password);
      ctx.status = 201;
      ctx.body = { message: 'User registered', user: { id: user.id, username: user.username } };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    return;
  }

  // LOGIN
  if (path === '/auth/login' && method === 'POST') {
    try {
      const { email, password } = ctx.request.body;
      if (!email || !password) {
        ctx.status = 400;
        ctx.body = { error: 'Email and password required' };
        return;
      }
      const user = await User.findByEmail(email);
      if (!user || !(await User.verifyPassword(password, user.password))) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid credentials' };
        return;
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      ctx.body = { message: 'Login successful', token, user: { id: user.id, username: user.username, role: user.role } };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    return;
  }

  // GET ALL AUTHORS
  if (path === '/authors' && method === 'GET') {
    try {
      const authors = await Author.getAll();
      ctx.body = authors;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    return;
  }

  // GET SINGLE AUTHOR
  if (path.match(/^\/authors\/\d+$/) && method === 'GET') {
    try {
      const id = path.split('/')[2];
      const author = await Author.getById(id);
      if (!author) {
        ctx.status = 404;
        ctx.body = { error: 'Author not found' };
        return;
      }
      const books = await Author.getBooks(id);
      ctx.body = { ...author, books };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    return;
  }

  // CREATE AUTHOR (ADMIN)
  if (path === '/authors' && method === 'POST') {
    try {
      await authenticate(ctx, async () => {
        await requireAdmin(ctx, async () => {
          const { name, bio, birth_year, nationality } = ctx.request.body;
          if (!name) {
            ctx.status = 400;
            ctx.body = { error: 'Name required' };
            return;
          }
          const author = await Author.create(name, bio, birth_year, nationality);
          ctx.status = 201;
          ctx.body = { message: 'Author created', author };
        });
      });
    } catch (error) {
      if (!ctx.body) {
        ctx.status = 500;
        ctx.body = { error: error.message };
      }
    }
    return;
  }

  // GET ALL BOOKS
  if (path === '/books' && method === 'GET') {
    try {
      const books = await Book.getAll();
      ctx.body = books;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    return;
  }

  // GET SINGLE BOOK
  if (path.match(/^\/books\/\d+$/) && method === 'GET') {
    try {
      const id = path.split('/')[2];
      const book = await Book.getById(id);
      if (!book) {
        ctx.status = 404;
        ctx.body = { error: 'Book not found' };
        return;
      }
      ctx.body = book;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    return;
  }

  // CREATE BOOK (ADMIN)
  if (path === '/books' && method === 'POST') {
    try {
      await authenticate(ctx, async () => {
        await requireAdmin(ctx, async () => {
          const { title, author_id, isbn, publication_year, genre, description } = ctx.request.body;
          if (!title || !author_id) {
            ctx.status = 400;
            ctx.body = { error: 'Title and author_id required' };
            return;
          }
          const book = await Book.create(title, author_id, isbn, publication_year, genre, description);
          ctx.status = 201;
          ctx.body = { message: 'Book created', book };
        });
      });
    } catch (error) {
      if (!ctx.body) {
        ctx.status = 500;
        ctx.body = { error: error.message };
      }
    }
    return;
  }

  // ========== REVIEWS: GET ALL ==========
  if (path === '/reviews' && method === 'GET') {
    try {
      const reviews = await Review.getAll();
      ctx.body = reviews;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    return;
  }

  // ========== REVIEWS: GET BY BOOK ID ==========
  if (path.match(/^\/books\/\d+\/reviews$/) && method === 'GET') {
    try {
      const bookId = path.split('/')[2];
      const reviews = await Review.getByBookId(bookId);
      ctx.body = reviews;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
    return;
  }

  // ========== REVIEWS: CREATE (AUTHENTICATED) ==========
  if (path === '/reviews' && method === 'POST') {
    try {
      await authenticate(ctx, async () => {
        const { book_id, rating, comment } = ctx.request.body;

        if (!book_id || !rating) {
          ctx.status = 400;
          ctx.body = { error: 'book_id and rating are required' };
          return;
        }

        if (rating < 1 || rating > 5) {
          ctx.status = 400;
          ctx.body = { error: 'Rating must be between 1 and 5' };
          return;
        }

        const review = await Review.create(book_id, ctx.state.user.id, rating, comment);
        ctx.status = 201;
        ctx.body = { message: 'Review created', review };
      });
    } catch (error) {
      if (!ctx.body) {
        ctx.status = 500;
        ctx.body = { error: error.message };
      }
    }
    return;
  }

  // ========== REVIEWS: UPDATE (OWN REVIEWS ONLY) ==========
  if (path.match(/^\/reviews\/\d+$/) && method === 'PUT') {
    try {
      await authenticate(ctx, async () => {
        const reviewId = path.split('/')[2];
        const { rating, comment } = ctx.request.body;

        if (!rating) {
          ctx.status = 400;
          ctx.body = { error: 'Rating is required' };
          return;
        }

        if (rating < 1 || rating > 5) {
          ctx.status = 400;
          ctx.body = { error: 'Rating must be between 1 and 5' };
          return;
        }

        const belongsToUser = await Review.belongsToUser(reviewId, ctx.state.user.id);
        if (!belongsToUser) {
          ctx.status = 403;
          ctx.body = { error: 'You can only update your own reviews' };
          return;
        }

        const review = await Review.update(reviewId, rating, comment);
        ctx.body = { message: 'Review updated', review };
      });
    } catch (error) {
      if (!ctx.body) {
        ctx.status = 500;
        ctx.body = { error: error.message };
      }
    }
    return;
  }

  // ========== REVIEWS: DELETE (OWN REVIEWS ONLY OR ADMIN) ==========
  if (path.match(/^\/reviews\/\d+$/) && method === 'DELETE') {
    try {
      await authenticate(ctx, async () => {
        const reviewId = path.split('/')[2];

        const belongsToUser = await Review.belongsToUser(reviewId, ctx.state.user.id);
        const isAdmin = ctx.state.user.role === 'admin';

        if (!belongsToUser && !isAdmin) {
          ctx.status = 403;
          ctx.body = { error: 'You can only delete your own reviews' };
          return;
        }

        const deleted = await Review.delete(reviewId);
        if (!deleted) {
          ctx.status = 404;
          ctx.body = { error: 'Review not found' };
          return;
        }

        ctx.body = { message: 'Review deleted successfully' };
      });
    } catch (error) {
      if (!ctx.body) {
        ctx.status = 500;
        ctx.body = { error: error.message };
      }
    }
    return;
  }

  // 404
  ctx.status = 404;
  ctx.body = { error: 'Not found', path, method };
});

app.listen(5000, '0.0.0.0');
console.log('Server on 5000');