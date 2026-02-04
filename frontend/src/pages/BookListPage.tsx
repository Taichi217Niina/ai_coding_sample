import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../types';
import { booksApi } from '../services/api';
import Layout from '../components/Layout';

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await booksApi.getAll();
      setBooks(data);
    } catch {
      setError('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await booksApi.delete(id);
      setBooks(books.filter((book) => book.id !== id));
    } catch {
      setError('Failed to delete book');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>My Books</h1>
        <Link to="/books/new" className="btn btn-primary">
          Add Book
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {books.length === 0 ? (
        <div className="empty-state">
          <p>No books yet. Add your first book!</p>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-card-content">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}
                {book.publishedDate && (
                  <p className="book-date">Published: {book.publishedDate}</p>
                )}
                {book.description && (
                  <p className="book-description">{book.description}</p>
                )}
              </div>
              <div className="book-card-actions">
                <Link to={`/books/${book.id}/edit`} className="btn btn-outline btn-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
