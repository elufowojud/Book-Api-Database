require('dotenv').config();
const Koa = require('koa');
const db = require('./config/database'); // Add this line

const app = new Koa();

// Simple route handler
app.use(async (ctx) => {
  console.log('Request:', ctx.method, ctx.path);
  
  if (ctx.path === '/') {
    ctx.body = {
      message: 'Welcome to Book Database API',
      status: 'Server is running',
      timestamp: new Date().toISOString()
    };
  } else if (ctx.path === '/health') {
    // Test database connection
    try {
      await db.query('SELECT 1');
      ctx.body = {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message
      };
    }
  } else {
    ctx.status = 404;
    ctx.body = { message: 'Not Found' };
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});