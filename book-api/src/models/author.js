const db = require('../config/database');

class Author {
  // Get all authors
  static async getAll() {
    const [rows] = await db.query(
      'SELECT * FROM authors ORDER BY name ASC'
    );
    return rows;
  }

  // Get single author by ID
  static async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM authors WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Create new author
  static async create(name, bio, birth_year, nationality) {
    const [result] = await db.query(
      'INSERT INTO authors (name, bio, birth_year, nationality) VALUES (?, ?, ?, ?)',
      [name, bio, birth_year, nationality]
    );
    
    return {
      id: result.insertId,
      name,
      bio,
      birth_year,
      nationality
    };
  }

  // Update author
  static async update(id, name, bio, birth_year, nationality) {
    await db.query(
      'UPDATE authors SET name = ?, bio = ?, birth_year = ?, nationality = ? WHERE id = ?',
      [name, bio, birth_year, nationality, id]
    );
    
    return this.getById(id);
  }

  // Delete author
  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM authors WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  // Get books by author
  static async getBooks(authorId) {
    const [rows] = await db.query(
      'SELECT * FROM books WHERE author_id = ?',
      [authorId]
    );
    return rows;
  }
}

module.exports = Author;