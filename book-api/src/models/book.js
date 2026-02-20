const db = require('../config/database');

class Book {
  // Get all books (with author info)
  static async getAll() {
    const [rows] = await db.query(`
      SELECT b.*, a.name as author_name 
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      ORDER BY b.title ASC
    `);
    return rows;
  }

  // Get all books with pagination
  static async getAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM books');
    const total = countResult[0].total;
    
    // Get paginated results
    const [rows] = await db.query(`
      SELECT b.*, a.name as author_name 
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      ORDER BY b.title ASC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    return {
      books: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get single book by ID
  static async getById(id) {
    const [rows] = await db.query(`
      SELECT b.*, a.name as author_name 
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      WHERE b.id = ?
    `, [id]);
    return rows[0];
  }

  // Create new book
  static async create(title, author_id, isbn, publication_year, genre, description) {
    const [result] = await db.query(
      'INSERT INTO books (title, author_id, isbn, publication_year, genre, description) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author_id, isbn, publication_year, genre, description]
    );
    
    return this.getById(result.insertId);
  }

  // Update book
  static async update(id, title, author_id, isbn, publication_year, genre, description) {
    await db.query(
      'UPDATE books SET title = ?, author_id = ?, isbn = ?, publication_year = ?, genre = ?, description = ? WHERE id = ?',
      [title, author_id, isbn, publication_year, genre, description, id]
    );
    
    return this.getById(id);
  }

  // Delete book
  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM books WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  // Search books by title, genre, or author
  static async search(query) {
    const [rows] = await db.query(`
      SELECT b.*, a.name as author_name 
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      WHERE b.title LIKE ? OR b.genre LIKE ? OR a.name LIKE ?
      ORDER BY b.title ASC
    `, [`%${query}%`, `%${query}%`, `%${query}%`]);
    return rows;
  }
}

module.exports = Book;