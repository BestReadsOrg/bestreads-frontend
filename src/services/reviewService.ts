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
    const response = await api.post(this.BASE_URL, reviewData);
    return response.data;
  }

  /**
   * Update an existing review
   */
  async updateReview(reviewId: string, reviewData: UpdateReviewDTO): Promise<Review> {
    const response = await api.put(`${this.BASE_URL}/${reviewId}`, reviewData);
    return response.data;
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${reviewId}`);
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
