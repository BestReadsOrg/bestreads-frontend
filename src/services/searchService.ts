import axios from 'axios';

// OpenLibrary API base URL
const OPENLIBRARY_API_BASE = 'https://openlibrary.org';
const OPENLIBRARY_COVERS_BASE = 'https://covers.openlibrary.org/b';

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
  key?: string; // OpenLibrary work key
}

// OpenLibrary API response types
interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  isbn?: string[];
  publisher?: string[];
  publish_year?: number[];
  number_of_pages_median?: number;
  language?: string[];
  cover_i?: number;
  cover_edition_key?: string;
  edition_count?: number;
  first_publish_year?: number;
  ratings_average?: number;
  ratings_count?: number;
}

interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OpenLibraryDoc[];
}

// Pagination result
export interface PaginatedSearchResult {
  books: ExternalBook[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

class SearchService {
  /**
   * Convert OpenLibrary doc to our ExternalBook format
   */
  private mapToExternalBook(doc: OpenLibraryDoc): ExternalBook {
    const isbn = doc.isbn?.[0];
    const coverId = doc.cover_i || doc.cover_edition_key;
    
    // Generate cover image URL
    let coverImage: string | undefined;
    if (coverId) {
      if (typeof coverId === 'number') {
        coverImage = `${OPENLIBRARY_COVERS_BASE}/id/${coverId}-M.jpg`;
      } else if (isbn) {
        coverImage = `${OPENLIBRARY_COVERS_BASE}/isbn/${isbn}-M.jpg`;
      }
    }

    return {
      id: doc.key.replace('/works/', ''),
      key: doc.key,
      title: doc.title,
      author: doc.author_name?.[0] || 'Unknown Author',
      isbn,
      publisher: doc.publisher?.[0],
      publishedYear: doc.first_publish_year || doc.publish_year?.[0],
      coverImage,
      pages: doc.number_of_pages_median,
      language: doc.language?.[0],
      rating: doc.ratings_average,
      ratingCount: doc.ratings_count,
      editionCount: doc.edition_count,
    };
  }

  /**
   * Search books using OpenLibrary API with pagination
   * @param query - Search query string
   * @param type - Search type: 'title', 'isbn', or 'author'
   * @param page - Page number (1-indexed)
   * @param limit - Number of results per page
   */
  async searchBooks(
    query: string,
    type: 'title' | 'isbn' | 'author' = 'title',
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedSearchResult> {
    try {
      if (!query.trim()) {
        return {
          books: [],
          total: 0,
          page,
          limit,
          hasMore: false,
        };
      }

      // Build search query based on type
      let searchParam: string;
      switch (type) {
        case 'isbn':
          searchParam = `isbn:${query.trim()}`;
          break;
        case 'author':
          searchParam = `author:${query.trim()}`;
          break;
        case 'title':
        default:
          searchParam = `title:${query.trim()}`;
          break;
      }

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Make request to OpenLibrary Search API
      const response = await axios.get<OpenLibrarySearchResponse>(
        `${OPENLIBRARY_API_BASE}/search.json`,
        {
          params: {
            q: searchParam,
            fields: 'key,title,author_name,isbn,publisher,publish_year,number_of_pages_median,language,cover_i,cover_edition_key,edition_count,first_publish_year,ratings_average,ratings_count',
            limit,
            offset,
          },
          timeout: 10000,
        }
      );

      const { docs, numFound } = response.data;
      const books = docs.map(doc => this.mapToExternalBook(doc));

      return {
        books,
        total: numFound,
        page,
        limit,
        hasMore: offset + books.length < numFound,
      };
    } catch (error) {
      console.error('OpenLibrary API error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message || 'Failed to search books');
      }
      throw new Error('An unexpected error occurred while searching');
    }
  }

  /**
   * Search books by title (convenience method)
   */
  async searchByTitle(query: string, page: number = 1, limit: number = 20): Promise<PaginatedSearchResult> {
    return this.searchBooks(query, 'title', page, limit);
  }

  /**
   * Search books by ISBN (convenience method)
   */
  async searchByIsbn(isbn: string, page: number = 1, limit: number = 20): Promise<PaginatedSearchResult> {
    return this.searchBooks(isbn, 'isbn', page, limit);
  }

  /**
   * Search books by author (convenience method)
   */
  async searchByAuthor(author: string, page: number = 1, limit: number = 20): Promise<PaginatedSearchResult> {
    return this.searchBooks(author, 'author', page, limit);
  }

  /**
   * Quick search for dropdown preview (limited results, no pagination)
   */
  async quickSearch(query: string, type: 'title' | 'isbn' = 'title'): Promise<ExternalBook[]> {
    const result = await this.searchBooks(query, type, 1, 8);
    return result.books;
  }
}

const searchService = new SearchService();
export default searchService;
