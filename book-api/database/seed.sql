SET SQL_SAFE_UPDATES = 0;

-- Use the database
USE book_database;

-- Clear existing data (if any)
DELETE FROM reviews;
DELETE FROM books;
DELETE FROM authors;
DELETE FROM users;

-- Reset auto-increment counters
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE authors AUTO_INCREMENT = 1;
ALTER TABLE books AUTO_INCREMENT = 1;
ALTER TABLE reviews AUTO_INCREMENT = 1;

-- Insert Users (passwords are 'password123' hashed with bcrypt)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@bookapi.com', '$2b$10$rY8F8qgKZqXVzK.9vXqK0eF8YzJXqZqK0eF8YzJXqZqK0eF8YzJXqZ', 'admin'),
('john_reader', 'john@example.com', '$2b$10$rY8F8qgKZqXVzK.9vXqK0eF8YzJXqZqK0eF8YzJXqZqK0eF8YzJXqZ', 'user'),
('sarah_bookworm', 'sarah@example.com', '$2b$10$rY8F8qgKZqXVzK.9vXqK0eF8YzJXqZqK0eF8YzJXqZqK0eF8YzJXqZ', 'user'),
('mike_critic', 'mike@example.com', '$2b$10$rY8F8qgKZqXVzK.9vXqK0eF8YzJXqZqK0eF8YzJXqZqK0eF8YzJXqZ', 'user');

-- Insert Authors
INSERT INTO authors (name, bio, birth_year, nationality) VALUES
('George Orwell', 'English novelist and essayist, journalist and critic', 1903, 'British'),
('Jane Austen', 'English novelist known for romantic fiction', 1775, 'British'),
('F. Scott Fitzgerald', 'American novelist and short story writer', 1896, 'American'),
('Harper Lee', 'American novelist best known for To Kill a Mockingbird', 1926, 'American'),
('J.K. Rowling', 'British author, best known for Harry Potter series', 1965, 'British'),
('Agatha Christie', 'English writer known for detective novels', 1890, 'British'),
('Ernest Hemingway', 'American novelist, short-story writer, and journalist', 1899, 'American'),
('Gabriel García Márquez', 'Colombian novelist and Nobel Prize winner', 1927, 'Colombian'),
('Toni Morrison', 'American novelist, essayist, and editor', 1931, 'American'),
('Haruki Murakami', 'Japanese writer and translator', 1949, 'Japanese');

-- Insert Books
INSERT INTO books (title, author_id, isbn, publication_year, genre, description) VALUES
('1984', 1, '9780451524935', 1949, 'Dystopian Fiction', 'A dystopian social science fiction novel and cautionary tale about totalitarianism'),
('Animal Farm', 1, '9780451526342', 1945, 'Political Satire', 'An allegorical novella about Soviet totalitarianism'),
('Pride and Prejudice', 2, '9780141439518', 1813, 'Romance', 'A romantic novel of manners following Elizabeth Bennet'),
('Emma', 2, '9780141439587', 1815, 'Romance', 'A novel about youthful hubris and romantic misunderstandings'),
('The Great Gatsby', 3, '9780743273565', 1925, 'Literary Fiction', 'A novel about the American Dream in the Jazz Age'),
('To Kill a Mockingbird', 4, '9780061120084', 1960, 'Southern Gothic', 'A novel about racial injustice in the American South'),
('Harry Potter and the Philosophers Stone', 5, '9780747532699', 1997, 'Fantasy', 'The first novel in the Harry Potter series'),
('Harry Potter and the Chamber of Secrets', 5, '9780747538493', 1998, 'Fantasy', 'The second novel in the Harry Potter series'),
('Murder on the Orient Express', 6, '9780062693662', 1934, 'Mystery', 'A detective novel featuring Hercule Poirot'),
('Death on the Nile', 6, '9780062073556', 1937, 'Mystery', 'A mystery novel featuring Hercule Poirot'),
('The Old Man and the Sea', 7, '9780684801223', 1952, 'Literary Fiction', 'A short novel about an aging fisherman'),
('A Farewell to Arms', 7, '9780684837888', 1929, 'War Fiction', 'A semi-autobiographical novel about World War I'),
('One Hundred Years of Solitude', 8, '9780060883287', 1967, 'Magical Realism', 'A multi-generational story of the Buendía family'),
('Love in the Time of Cholera', 8, '9780307389732', 1985, 'Romance', 'A love story spanning fifty years'),
('Beloved', 9, '9781400033416', 1987, 'Historical Fiction', 'A novel about the aftermath of slavery'),
('Song of Solomon', 9, '9781400033423', 1977, 'Literary Fiction', 'A novel exploring African-American identity'),
('Norwegian Wood', 10, '9780375704024', 1987, 'Literary Fiction', 'A nostalgic story of loss and sexuality'),
('Kafka on the Shore', 10, '9781400079278', 2002, 'Magical Realism', 'A surreal tale of two parallel narratives'),
('1Q84', 10, '9780307476463', 2009, 'Speculative Fiction', 'A dystopian romance novel'),
('The Wind-Up Bird Chronicle', 10, '9780679775430', 1994, 'Surrealism', 'A surrealist novel about a man searching for his cat');

-- Insert Reviews
INSERT INTO reviews (book_id, user_id, rating, comment) VALUES
(1, 2, 5, 'A masterpiece! Orwells vision of a dystopian future is chilling and relevant.'),
(1, 3, 5, 'Essential reading. The concepts of Big Brother and thoughtcrime are prophetic.'),
(2, 2, 4, 'Clever political allegory. Short but powerful.'),
(3, 3, 5, 'My favorite classic! Elizabeth Bennet is such a strong character.'),
(3, 4, 4, 'Witty and romantic. Austens prose is delightful.'),
(4, 2, 4, 'Another Austen gem. Emma is a flawed but loveable protagonist.'),
(5, 3, 5, 'The American Dream dissected brilliantly. Fitzgeralds prose is gorgeous.'),
(5, 4, 5, 'A Jazz Age masterpiece. The green light symbolism is haunting.'),
(6, 2, 5, 'Powerful and moving. Atticus Finch is an inspirational character.'),
(6, 3, 5, 'A timeless story about justice and morality. Everyone should read this.'),
(7, 2, 5, 'The book that started it all! Magical and engaging.'),
(7, 3, 5, 'Nostalgia at its finest. Rowling created a world I never want to leave.'),
(7, 4, 4, 'Great start to an epic series. Perfect for all ages.'),
(8, 2, 4, 'The mystery of the Chamber keeps you hooked!'),
(9, 3, 5, 'Christie is the queen of mystery. Poirot is brilliant.'),
(9, 4, 5, 'One of the best whodunits ever written. The solution is ingenious.'),
(10, 2, 4, 'Another classic Christie. The Egyptian setting is atmospheric.'),
(11, 3, 5, 'Hemingways prose is simple yet profound. A meditation on perseverance.'),
(11, 4, 4, 'Short but impactful. The old mans struggle is universal.'),
(12, 2, 4, 'A poignant love story set against the backdrop of war.'),
(13, 3, 5, 'García Márquezs magnum opus. The magical realism is breathtaking.'),
(13, 4, 5, 'An epic family saga. Every page is rich with detail and beauty.'),
(14, 2, 4, 'A beautiful meditation on love and time.'),
(15, 3, 5, 'Morrisons prose is haunting. A difficult but important read.'),
(15, 4, 5, 'Powerful exploration of trauma and memory. Unforgettable.'),
(16, 2, 4, 'A compelling exploration of identity and heritage.'),
(17, 3, 4, 'Murakamis most accessible novel. Nostalgic and melancholic.'),
(18, 4, 5, 'Surreal and captivating. Murakami at his best.'),
(19, 2, 4, 'Epic in scope. The parallel narratives are fascinating.'),
(20, 3, 4, 'Strange and wonderful. Murakamis imagination knows no bounds.');

SELECT 'Database seeded successfully!' AS message;