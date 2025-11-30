import apiClient, { handleApiError } from '../utils/api';

export enum ReadingStatus {
  WANT_TO_READ = 'WANT_TO_READ',
  CURRENTLY_READING = 'CURRENTLY_READING',
  COMPLETED = 'COMPLETED',
  DID_NOT_FINISH = 'DID_NOT_FINISH',
}

export interface UserBook {
  id: string;
  userId: string;
  bookId: string;
  title: string;
  author: string;
  isbn?: string;
  coverImage?: string;
  status: ReadingStatus;
  userRating?: number;
  userReview?: string;
  currentPage?: number;
  totalPages?: number;
  addedAt: string;
  startedAt?: string;
  completedAt?: string;
  favorite: boolean;
}

export interface UserBookRequest {
  bookId: string;
  title: string;
  author: string;
  isbn?: string;
  coverImage?: string;
  status: ReadingStatus;
  userRating?: number;
  userReview?: string;
  currentPage?: number;
  totalPages?: number;
  favorite?: boolean;
}

export interface ReadingStats {
  total: number;
  wantToRead: number;
  currentlyReading: number;
  completed: number;
}

class UserBookService {
  // Add a book to user's collection
  async addBookToCollection(data: UserBookRequest): Promise<UserBook> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; data: UserBook }>(
        '/user/books',
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get all books in user's collection
  async getUserBooks(): Promise<UserBook[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: UserBook[] }>(
        '/user/books'
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get books by reading status
  async getUserBooksByStatus(status: ReadingStatus): Promise<UserBook[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: UserBook[] }>(
        `/user/books/status/${status}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get user's favorite books
  async getFavoriteBooks(): Promise<UserBook[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: UserBook[] }>(
        '/user/books/favorites'
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update a book in user's collection
  async updateUserBook(userBookId: string, data: UserBookRequest): Promise<UserBook> {
    try {
      const response = await apiClient.put<{ success: boolean; message: string; data: UserBook }>(
        `/user/books/${userBookId}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Remove a book from user's collection
  async removeBookFromCollection(userBookId: string): Promise<void> {
    try {
      await apiClient.delete(`/user/books/${userBookId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get user's reading statistics
  async getReadingStats(): Promise<ReadingStats> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: ReadingStats }>(
        '/user/books/stats'
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

const userBookService = new UserBookService();
export default userBookService;
