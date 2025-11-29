import apiClient, { handleApiError } from '../utils/api';

// Book DTOs matching backend
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  publisher?: string;
  publishedYear?: number;
  genres?: string[];
  pages?: number;
  language?: string;
  coverImage?: string;
  rating?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookRequest {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  publisher?: string;
  publishedYear?: number;
  genres?: string[];
  pages?: number;
  language?: string;
  coverImage?: string;
}

export interface BooksResponse {
  books: Book[];
  totalCount: number;
  page: number;
  pageSize: number;
}

class BookService {
  /**
   * Get all books with pagination
   */
  async getAllBooks(page: number = 0, size: number = 20): Promise<Book[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: Book[] }>('/books', {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get book by ID
   */
  async getBookById(id: string): Promise<Book> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: Book }>(`/books/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search books by title or author
   */
  async searchBooks(query: string): Promise<Book[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: Book[] }>('/books/search', {
        params: { q: query },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get books by genre
   */
  async getBooksByGenre(genre: string): Promise<Book[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: Book[] }>(`/books/genre/${genre}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new book
   */
  async createBook(data: BookRequest): Promise<Book> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; data: Book }>('/books', data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update a book
   */
  async updateBook(id: string, data: Partial<BookRequest>): Promise<Book> {
    try {
      const response = await apiClient.put<{ success: boolean; message: string; data: Book }>(`/books/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete a book
   */
  async deleteBook(id: string): Promise<void> {
    try {
      await apiClient.delete(`/books/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

const bookService = new BookService();
export default bookService;
