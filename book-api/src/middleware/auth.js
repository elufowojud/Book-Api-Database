const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to verify JWT token
async function authenticate(ctx, next) {
  try {
    // Get token from Authorization header
    const authHeader = ctx.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: 'No token provided' };
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'User not found' };
      return;
    }

    // Attach user to context
    ctx.state.user = user;

    await next();
  } catch (error) {
    console.error('Authentication error:', error);
    ctx.status = 401;
    ctx.body = { error: 'Invalid or expired token' };
  }
}

// Middleware to check if user is admin
async function requireAdmin(ctx, next) {
  if (!ctx.state.user) {
    ctx.status = 401;
    ctx.body = { error: 'Authentication required' };
    return;
  }

  if (ctx.state.user.role !== 'admin') {
    ctx.status = 403;
    ctx.body = { error: 'Admin access required' };
    return;
  }

  await next();
}

module.exports = { authenticate, requireAdmin };