const db = require('../config/database');

class Review {
  // Get all reviews
  static async getAll() {
    const [rows] = await db.query(`
      SELECT r.*, 
             u.username, 
             b.title as book_title
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN books b ON r.book_id = b.id
      ORDER BY r.created_at DESC
    `);
    return rows;
  }

  // Get reviews for a specific book
  static async getByBookId(bookId) {
    const [rows] = await db.query(`
      SELECT r.*, 
             u.username
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.book_id = ?
      ORDER BY r.created_at DESC
    `, [bookId]);
    return rows;
  }

  // Get single review by ID
  static async getById(id) {
    const [rows] = await db.query(`
      SELECT r.*, 
             u.username, 
             b.title as book_title
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN books b ON r.book_id = b.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  }

  // Get reviews by user
  static async getByUserId(userId) {
    const [rows] = await db.query(`
      SELECT r.*, 
             b.title as book_title
      FROM reviews r
      LEFT JOIN books b ON r.book_id = b.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);
    return rows;
  }

  // Create new review
  static async create(bookId, userId, rating, comment) {
    const [result] = await db.query(
      'INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [bookId, userId, rating, comment]
    );
    
    return this.getById(result.insertId);
  }

  // Update review
  static async update(id, rating, comment) {
    await db.query(
      'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
      [rating, comment, id]
    );
    
    return this.getById(id);
  }

  // Delete review
  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM reviews WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  // Check if review belongs to user
  static async belongsToUser(reviewId, userId) {
    const [rows] = await db.query(
      'SELECT id FROM reviews WHERE id = ? AND user_id = ?',
      [reviewId, userId]
    );
    return rows.length > 0;
  }
}

module.exports = Review;