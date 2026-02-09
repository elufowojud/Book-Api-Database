const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = new Router({ prefix: '/auth' });

// POST /auth/register - Register new user
router.post('/register', async (ctx) => {
  try {
    const { username, email, password } = ctx.request.body;

    // Validation
    if (!username || !email || !password) {
      ctx.status = 400;
      ctx.body = { error: 'Username, email, and password are required' };
      return;
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      ctx.status = 400;
      ctx.body = { error: 'Email already registered' };
      return;
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      ctx.status = 400;
      ctx.body = { error: 'Username already taken' };
      return;
    }

    // Create user
    const user = await User.create(username, email, password);

    ctx.status = 201;
    ctx.body = {
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Registration failed' };
  }
});

// POST /auth/login - Login user
router.post('/login', async (ctx) => {
  try {
    const { email, password } = ctx.request.body;

    // Validation
    if (!email || !password) {
      ctx.status = 400;
      ctx.body = { error: 'Email and password are required' };
      return;
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid email or password' };
      return;
    }

    // Verify password
    const isValid = await User.verifyPassword(password, user.password);
    if (!isValid) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid email or password' };
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    ctx.body = {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Login failed' };
  }
});

// GET /auth/me - Get current user (requires authentication)
router.get('/me', async (ctx) => {
  // This will be protected by middleware later
  ctx.body = { message: 'This endpoint will be protected' };
});

module.exports = router;