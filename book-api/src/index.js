require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');
const db = require('./config/database');
const User = require('./models/user');

const app = new Koa();
app.use(bodyParser());

app.use(async (ctx) => {
  const path = ctx.path;
  const method = ctx.method;

  // Root
  if (path === '/' && method === 'GET') {
    ctx.body = { 
      message: 'Book Database API',
      endpoints: {
        health: 'GET /health',
        register: 'POST /auth/register',
        login: 'POST /auth/login'
      }
    };
    return;
  }

  // Health
  if (path === '/health' && method === 'GET') {
    try {
      await db.query('SELECT 1');
      ctx.body = { status: 'healthy', database: 'connected' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { status: 'unhealthy', error: error.message };
    }
    return;
  }

  // Register
  if (path === '/auth/register' && method === 'POST') {
    try {
      const { username, email, password } = ctx.request.body;

      if (!username || !email || !password) {
        ctx.status = 400;
        ctx.body = { error: 'Username, email, and password are required' };
        return;
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        ctx.status = 400;
        ctx.body = { error: 'Email already registered' };
        return;
      }

      const user = await User.create(username, email, password);
      ctx.status = 201;
      ctx.body = {
        message: 'User registered successfully',
        user: { id: user.id, username: user.username, email: user.email }
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Registration failed', details: error.message };
    }
    return;
  }

  // Login
  if (path === '/auth/login' && method === 'POST') {
    try {
      const { email, password } = ctx.request.body;

      if (!email || !password) {
        ctx.status = 400;
        ctx.body = { error: 'Email and password are required' };
        return;
      }

      const user = await User.findByEmail(email);
      if (!user) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid email or password' };
        return;
      }

      const isValid = await User.verifyPassword(password, user.password);
      if (!isValid) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid email or password' };
        return;
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      ctx.body = {
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Login failed', details: error.message };
    }
    return;
  }

  // 404
  ctx.status = 404;
  ctx.body = { error: 'Not found' };
});

app.listen(5000, '0.0.0.0');
console.log('🚀 Server running on http://localhost:5000');