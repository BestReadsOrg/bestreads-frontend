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

// Detailed book information from OpenLibrary Works API
export interface BookDetails extends ExternalBook {
  subjects?: string[];
  subjectPlaces?: string[];
  subjectPeople?: string[];
  subjectTimes?: string[];
  excerpts?: string[];
  links?: Array<{ title: string; url: string }>;
  covers?: number[];
  authors?: Array<{
    key: string;
    name: string;
    bio?: string;
  }>;
}

// Detailed edition information from OpenLibrary Editions API
export interface EditionDetails {
  key: string;
  title: string;
  subtitle?: string;
  authors?: Array<{ key: string; name?: string }>;
  isbn_10?: string[];
  isbn_13?: string[];
  publishers?: string[];
  publish_date?: string;
  publish_country?: string;
  number_of_pages?: number;
  covers?: number[];
  coverImage?: string;
  languages?: Array<{ key: string }>;
  physical_format?: string;
  weight?: string;
  dimensions?: string;
  description?: string | { value: string };
  notes?: string | { value: string };
  subjects?: string[];
  works?: Array<{ key: string }>;
  contributions?: string[];
  edition_name?: string;
  series?: string[];
  dewey_decimal_class?: string[];
  lc_classifications?: string[];
  ocaid?: string;
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

// OpenLibrary Works API types
interface OpenLibraryExcerpt {
  excerpt: string | { value: string };
  comment?: string;
}

interface OpenLibraryLink {
  title: string;
  url: string;
  type?: { key: string };
}

export interface OpenLibraryEdition {
  key: string;
  title: string;
  isbn_10?: string[];
  isbn_13?: string[];
  publishers?: string[];
  publish_date?: string;
  number_of_pages?: number;
  covers?: number[];
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

  /**
   * Get detailed book information by work ID
   * @param bookId - The OpenLibrary work ID (without /works/ prefix)
   */
  async getBookDetails(bookId: string): Promise<BookDetails> {
    try {
      // Fetch work details
      const workKey = bookId.startsWith('/works/') ? bookId : `/works/${bookId}`;
      const workResponse = await axios.get(`${OPENLIBRARY_API_BASE}${workKey}.json`, {
        timeout: 10000,
      });

      const work = workResponse.data;

      // Extract description
      let description: string | undefined;
      if (work.description) {
        description = typeof work.description === 'string' 
          ? work.description 
          : work.description.value;
      }

      // Fetch author details
      const authors: Array<{ key: string; name: string; bio?: string }> = [];
      if (work.authors && Array.isArray(work.authors)) {
        for (const authorRef of work.authors.slice(0, 5)) {
          try {
            const authorKey = typeof authorRef === 'object' && authorRef.author?.key 
              ? authorRef.author.key 
              : authorRef.key;
            
            if (authorKey) {
              const authorResponse = await axios.get(`${OPENLIBRARY_API_BASE}${authorKey}.json`, {
                timeout: 5000,
              });
              const authorData = authorResponse.data;
              
              let bio: string | undefined;
              if (authorData.bio) {
                bio = typeof authorData.bio === 'string' 
                  ? authorData.bio 
                  : authorData.bio.value;
              }

              authors.push({
                key: authorKey,
                name: authorData.name || 'Unknown Author',
                bio,
              });
            }
          } catch (err) {
            console.error('Failed to fetch author details:', err);
          }
        }
      }

      // Extract excerpts
      const excerpts: string[] = [];
      if (work.excerpts && Array.isArray(work.excerpts)) {
        work.excerpts.slice(0, 3).forEach((excerpt: OpenLibraryExcerpt) => {
          if (excerpt.excerpt) {
            const text = typeof excerpt.excerpt === 'string' 
              ? excerpt.excerpt 
              : excerpt.excerpt.value;
            if (text) excerpts.push(text);
          }
        });
      }

      // Extract links
      const links: Array<{ title: string; url: string }> = [];
      if (work.links && Array.isArray(work.links)) {
        work.links.forEach((link: OpenLibraryLink) => {
          if (link.url && link.title) {
            links.push({ title: link.title, url: link.url });
          }
        });
      }

      // Get cover image (large version)
      let coverImage: string | undefined;
      if (work.covers && work.covers.length > 0) {
        coverImage = `${OPENLIBRARY_COVERS_BASE}/id/${work.covers[0]}-L.jpg`;
      }

      const bookDetails: BookDetails = {
        id: bookId.replace('/works/', ''),
        key: workKey,
        title: work.title,
        author: authors[0]?.name || 'Unknown Author',
        description,
        publishedYear: work.first_publish_year,
        coverImage,
        subjects: work.subjects?.slice(0, 20) || [],
        subjectPlaces: work.subject_places?.slice(0, 10) || [],
        subjectPeople: work.subject_people?.slice(0, 10) || [],
        subjectTimes: work.subject_times?.slice(0, 10) || [],
        excerpts,
        links,
        covers: work.covers,
        authors,
      };

      return bookDetails;
    } catch (error) {
      console.error('Failed to fetch book details:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch book details');
      }
      throw new Error('An unexpected error occurred while fetching book details');
    }
  }

  /**
   * Get editions of a book by work ID
   * @param bookId - The OpenLibrary work ID
   * @param limit - Number of editions to fetch
   */
  async getBookEditions(bookId: string, limit: number = 10): Promise<OpenLibraryEdition[]> {
    try {
      const workKey = bookId.startsWith('/works/') ? bookId : `/works/${bookId}`;
      const response = await axios.get(`${OPENLIBRARY_API_BASE}${workKey}/editions.json`, {
        params: { limit },
        timeout: 10000,
      });

      return response.data.entries || [];
    } catch (error) {
      console.error('Failed to fetch editions:', error);
      return [];
    }
  }

  /**
   * Get all editions of a book (unpaginated)
   * @param bookId - The OpenLibrary work ID
   */
  async getAllBookEditions(bookId: string): Promise<OpenLibraryEdition[]> {
    try {
      const workKey = bookId.startsWith('/works/') ? bookId : `/works/${bookId}`;
      const response = await axios.get(`${OPENLIBRARY_API_BASE}${workKey}/editions.json`, {
        params: { limit: 1000 },
        timeout: 15000,
      });

      return response.data.entries || [];
    } catch (error) {
      console.error('Failed to fetch all editions:', error);
      return [];
    }
  }

  /**
   * Get specific edition details by edition key
   * @param editionKey - The OpenLibrary edition key (e.g., "OL7353617M" or "/books/OL7353617M")
   */
  async getEditionDetails(editionKey: string): Promise<EditionDetails> {
    try {
      const key = editionKey.startsWith('/books/') ? editionKey : `/books/${editionKey}`;
      const response = await axios.get(`${OPENLIBRARY_API_BASE}${key}.json`, {
        timeout: 10000,
      });

      const edition = response.data;

      // Fetch author names if available
      if (edition.authors && Array.isArray(edition.authors)) {
        for (const authorRef of edition.authors) {
          if (authorRef.key && !authorRef.name) {
            try {
              const authorResponse = await axios.get(`${OPENLIBRARY_API_BASE}${authorRef.key}.json`, {
                timeout: 5000,
              });
              authorRef.name = authorResponse.data.name;
            } catch (err) {
              console.error('Failed to fetch author name:', err);
            }
          }
        }
      }

      // Generate cover image URL
      let coverImage: string | undefined;
      if (edition.covers && edition.covers.length > 0) {
        coverImage = `${OPENLIBRARY_COVERS_BASE}/id/${edition.covers[0]}-L.jpg`;
      } else if (edition.isbn_13 && edition.isbn_13.length > 0) {
        coverImage = `${OPENLIBRARY_COVERS_BASE}/isbn/${edition.isbn_13[0]}-L.jpg`;
      } else if (edition.isbn_10 && edition.isbn_10.length > 0) {
        coverImage = `${OPENLIBRARY_COVERS_BASE}/isbn/${edition.isbn_10[0]}-L.jpg`;
      }

      return {
        ...edition,
        coverImage,
      };
    } catch (error) {
      console.error('Failed to fetch edition details:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch edition details');
      }
      throw new Error('An unexpected error occurred while fetching edition details');
    }
  }

  /**
   * Search for a specific edition by ISBN within a book's editions
   * @param bookId - The OpenLibrary work ID
   * @param isbn - The ISBN to search for (can be ISBN-10 or ISBN-13)
   */
  async searchEditionByISBN(bookId: string, isbn: string): Promise<OpenLibraryEdition | null> {
    try {
      const cleanISBN = isbn.replace(/[-\s]/g, '');
      const editions = await this.getAllBookEditions(bookId);

      // Search for matching ISBN in this book's editions
      const matchingEdition = editions.find(edition => {
        const isbn10Match = edition.isbn_10?.some(i => i.replace(/[-\s]/g, '') === cleanISBN);
        const isbn13Match = edition.isbn_13?.some(i => i.replace(/[-\s]/g, '') === cleanISBN);
        return isbn10Match || isbn13Match;
      });

      return matchingEdition || null;
    } catch (error) {
      console.error('Failed to search edition by ISBN:', error);
      return null;
    }
  }

  /**
   * Get the default edition for a book (first available edition)
   * @param bookId - The OpenLibrary work ID
   */
  async getDefaultEdition(bookId: string): Promise<OpenLibraryEdition | null> {
    try {
      const editions = await this.getBookEditions(bookId, 1);
      return editions.length > 0 ? editions[0] : null;
    } catch (error) {
      console.error('Failed to fetch default edition:', error);
      return null;
    }
  }
}

const searchService = new SearchService();
export default searchService;
