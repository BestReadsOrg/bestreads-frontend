import api from '@/utils/api';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  bookId: string;
  editionId: string;
  userBookId: string; // Links to specific reading session
  rating: number; // 1-5
  reviewText: string;
  reviewHtml?: string; // HTML formatted review
  createdAt: string;
  updatedAt: string;
  helpfulCount: number;
  isHelpfulByCurrentUser?: boolean;
}

export interface PagedReviewResponse {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CreateReviewDTO {
  bookId: string;
  editionId: string;
  userBookId: string;
  rating: number;
  reviewText: string;
  reviewHtml?: string;
}

export interface UpdateReviewDTO {
  rating: number;
  reviewText: string;
  reviewHtml?: string;
}

class ReviewService {
  private readonly BASE_URL = '/api/reviews';

  /**
   * Get all reviews for a specific book/edition
   */
  async getReviewsForBook(bookId: string, editionId: string): Promise<Review[]> {
    try {
      const response = await api.get(`${this.BASE_URL}/book/${bookId}/edition/${editionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  /**
   * Get all reviews for a specific book/edition with pagination
   */
  async getReviewsForBookPaginated(bookId: string, editionId: string, page: number = 0, size: number = 10): Promise<PagedReviewResponse> {
    try {
      const response = await api.get(`${this.BASE_URL}/book/${bookId}/edition/${editionId}/paginated`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated reviews:', error);
      return {
        reviews: [],
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: size,
        hasNext: false,
        hasPrevious: false
      };
    }
  }

  /**
   * Get user's review for a specific reading session
   */
  async getUserReviewForSession(userBookId: string): Promise<Review | null> {
    try {
      const response = await api.get(`${this.BASE_URL}/user-book/${userBookId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user review:', error);
      return null;
    }
  }

  /**
   * Get all reviews by current user for a specific book (across all reading sessions)
   */
  async getUserReviewsForBook(bookId: string): Promise<Review[]> {
    try {
      const response = await api.get(`${this.BASE_URL}/my-reviews/book/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews for book:', error);
      return [];
    }
  }

  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewDTO): Promise<Review> {
    try {
      const response = await api.post(this.BASE_URL, reviewData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create review';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update an existing review
   */
  async updateReview(reviewId: string, reviewData: UpdateReviewDTO): Promise<Review> {
    try {
      const response = await api.put(`${this.BASE_URL}/${reviewId}`, reviewData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update review';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<void> {
    try {
      await api.delete(`${this.BASE_URL}/${reviewId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete review';
      throw new Error(errorMessage);
    }
  }

  /**
   * Mark a review as helpful (toggle on)
   */
  async markHelpful(reviewId: string): Promise<void> {
    await api.post(`${this.BASE_URL}/${reviewId}/helpful`);
  }

  /**
   * Remove helpful mark (toggle off)
   */
  async removeHelpful(reviewId: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${reviewId}/helpful`);
  }

  /**
   * Get reviews from user's friends for a specific book/edition
   */
  async getFriendsReviews(bookId: string, editionId: string): Promise<Review[]> {
    try {
      const response = await api.get(`${this.BASE_URL}/friends/book/${bookId}/edition/${editionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching friends reviews:', error);
      return [];
    }
  }
}

const reviewService = new ReviewService();
export default reviewService;
