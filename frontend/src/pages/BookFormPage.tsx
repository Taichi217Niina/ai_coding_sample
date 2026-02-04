import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { BookRequest, ApiError } from '../types';
import { booksApi } from '../services/api';
import Layout from '../components/Layout';
import type { AxiosError } from 'axios';

export default function BookFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<BookRequest>({
    title: '',
    author: '',
    isbn: '',
    publishedDate: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      loadBook(parseInt(id));
    }
  }, [id, isEdit]);

  const loadBook = async (bookId: number) => {
    try {
      const book = await booksApi.getById(bookId);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        publishedDate: book.publishedDate || '',
        description: book.description || '',
      });
    } catch {
      setError('Failed to load book');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const dataToSubmit: BookRequest = {
      ...formData,
      isbn: formData.isbn || undefined,
      publishedDate: formData.publishedDate || undefined,
      description: formData.description || undefined,
    };

    try {
      if (isEdit && id) {
        await booksApi.update(parseInt(id), dataToSubmit);
      } else {
        await booksApi.create(dataToSubmit);
      }
      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || 'Failed to save book');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="form-page">
        <h1>{isEdit ? 'Edit Book' : 'Add New Book'}</h1>

        <form onSubmit={handleSubmit} className="book-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="publishedDate">Published Date</label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
