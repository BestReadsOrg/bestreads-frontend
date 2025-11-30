import apiClient, { handleApiError } from '../utils/api';

// External book from OpenLibrary API
export interface ExternalBook {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  publisher?: string;
  publishedYear?: number;
  coverImage?: string;
  pages?: number;
  language?: string;
  rating?: number;
  ratingCount?: number;
  editionCount?: number;
}

class SearchService {
  /**
   * Search books using OpenLibrary API
   */
  async searchBooks(query: string, type: 'title' | 'isbn' = 'title'): Promise<ExternalBook[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: ExternalBook[] }>(
        '/search/books',
        {
          params: { q: query, type },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search books by title
   */
  async searchByTitle(query: string): Promise<ExternalBook[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: ExternalBook[] }>(
        '/search/books/title',
        {
          params: { q: query },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search books by ISBN
   */
  async searchByIsbn(isbn: string): Promise<ExternalBook[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: ExternalBook[] }>(
        '/search/books/isbn',
        {
          params: { q: isbn },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search books by author
   */
  async searchByAuthor(author: string): Promise<ExternalBook[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: ExternalBook[] }>(
        '/search/books/author',
        {
          params: { q: author },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

const searchService = new SearchService();
export default searchService;
