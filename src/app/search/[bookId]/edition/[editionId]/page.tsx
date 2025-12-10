'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Container } from '@/packages/shared/components/layout';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { BookReview } from '@/packages/shared/components/book-review';
import { ReviewModal } from '@/packages/shared/components/review-modal';
import { RatingDistribution } from '@/packages/shared/components/rating-distribution';
import { ReviewFilters, ReviewSortOption } from '@/packages/shared/components/review-filters';
import { Notification } from '@/packages/shared/components/notification';
import { ConfirmModal } from '@/packages/shared/components/confirm-modal';
import useAuth from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import searchService, { BookDetails, EditionDetails, OpenLibraryEdition } from '@/services/searchService';
import userBookService, { ReadingStatus } from '@/services/userBookService';
import reviewService, { Review, PagedReviewResponse } from '@/services/reviewService';

export default function EditionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const editionId = params.editionId as string;
  const { user, isAuthenticated } = useAuth();
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();

  const [book, setBook] = useState<BookDetails | null>(null);
  const [edition, setEdition] = useState<EditionDetails | null>(null);
  const [allEditions, setAllEditions] = useState<OpenLibraryEdition[]>([]);
  const [filteredEditions, setFilteredEditions] = useState<OpenLibraryEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCollection, setAddingToCollection] = useState(false);
  const [isbnSearch, setIsbnSearch] = useState('');
  const [showAllEditions, setShowAllEditions] = useState(false);
  const [currentBookStatus, setCurrentBookStatus] = useState<ReadingStatus | null>(null);
  const [userBookId, setUserBookId] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [friendsReviews, setFriendsReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingFriendsReviews, setLoadingFriendsReviews] = useState(true);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [reviewSortOption, setReviewSortOption] = useState<ReviewSortOption>('most-popular');
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; onConfirm: () => void }>({ isOpen: false, onConfirm: () => {} });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  useEffect(() => {
    if (!bookId || !editionId) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [bookData, editionData, editionsData] = await Promise.all([
          searchService.getBookDetails(bookId),
          searchService.getEditionDetails(editionId),
          searchService.getAllBookEditions(bookId),
        ]);

        setBook(bookData);
        setEdition(editionData);
        setAllEditions(editionsData);
        setFilteredEditions(editionsData.slice(0, 10)); // Show first 10 by default

        // Check if book is already in user's collection
        if (isAuthenticated) {
          try {
            const userBooks = await userBookService.getUserBooks();
            const existingBook = userBooks.find(ub => ub.bookId === bookId);
            if (existingBook) {
              setCurrentBookStatus(existingBook.status);
              setUserBookId(existingBook.id);
            }
          } catch (err) {
            console.error('Failed to fetch user books:', err);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load edition details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, editionId, isAuthenticated]);

  // Fetch reviews with pagination
  useEffect(() => {
    if (!bookId || !editionId) return;

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        // Fetch paginated reviews from MongoDB
        const pagedResponse: PagedReviewResponse = await reviewService.getReviewsForBookPaginated(
          bookId, 
          editionId, 
          currentPage, 
          pageSize
        );
        
        setReviews(pagedResponse.reviews);
        setTotalPages(pagedResponse.totalPages);
        setTotalReviews(pagedResponse.totalElements);
        setHasNextPage(pagedResponse.hasNext);
        setHasPreviousPage(pagedResponse.hasPrevious);

        // If user is authenticated and has a book in collection, fetch their review for this session
        if (isAuthenticated && userBookId) {
          const userReviewData = await reviewService.getUserReviewForSession(userBookId);
          setUserReview(userReviewData);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        showError('Failed to load reviews', 'Error');
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [bookId, editionId, isAuthenticated, userBookId, currentPage, pageSize]);

  // Fetch friends' reviews
  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingFriendsReviews(false);
      return;
    }

    const fetchFriendsReviews = async () => {
      try {
        const friendReviews = await reviewService.getFriendsReviews(bookId, editionId);
        setFriendsReviews(friendReviews);
      } catch (err) {
        console.error('Failed to fetch friends reviews:', err);
      } finally {
        setLoadingFriendsReviews(false);
      }
    };

    fetchFriendsReviews();
  }, [bookId, editionId, isAuthenticated]);

  // Reset page to 0 when rating filter or sort option changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedRatingFilter, reviewSortOption]);

  // Helper function to refetch reviews after modifications
  const refetchReviews = async () => {
    try {
      const pagedResponse: PagedReviewResponse = await reviewService.getReviewsForBookPaginated(
        bookId, 
        editionId, 
        currentPage, 
        pageSize
      );
      
      setReviews(pagedResponse.reviews);
      setTotalPages(pagedResponse.totalPages);
      setTotalReviews(pagedResponse.totalElements);
      setHasNextPage(pagedResponse.hasNext);
      setHasPreviousPage(pagedResponse.hasPrevious);

      // Refetch user review
      if (isAuthenticated && userBookId) {
        const userReviewData = await reviewService.getUserReviewForSession(userBookId);
        setUserReview(userReviewData);
      }
    } catch (err) {
      console.error('Failed to refetch reviews:', err);
    }
  };

  const handleSubmitReview = async (rating: number, reviewText: string, reviewHtml: string) => {
    if (!userBookId) {
      showWarning('Please add this book to your collection first');
      return;
    }

    // Validate book status - only allow reviews for completed or did not finish books
    if (currentBookStatus !== ReadingStatus.COMPLETED && currentBookStatus !== ReadingStatus.DID_NOT_FINISH) {
      showError(
        'You can only review books that you have completed or marked as "Did Not Finish"',
        'Review Not Allowed'
      );
      return;
    }

    try {
      if (userReview) {
        // Update existing review
        await reviewService.updateReview(userReview.id, { rating, reviewText, reviewHtml });
        
        // Refetch reviews from MongoDB after successful update
        await refetchReviews();
        
        showSuccess('Your review has been updated successfully!', 'Review Updated');
      } else {
        // Create new review
        await reviewService.createReview({
          bookId,
          editionId,
          userBookId,
          rating,
          reviewText,
          reviewHtml,
        });
        
        // Refetch reviews from MongoDB after successful create
        await refetchReviews();
        
        showSuccess('Your review has been posted successfully!', 'Review Posted');
      }
      
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit review. Please try again.';
      showError(errorMessage, 'Submission Failed');
      throw error;
    }
  };

  const handleEditReview = () => {
    // Validate book status - only allow editing reviews for completed or did not finish books
    if (currentBookStatus !== ReadingStatus.COMPLETED && currentBookStatus !== ReadingStatus.DID_NOT_FINISH) {
      showError(
        'You can only edit reviews for books that are marked as completed or \"Did Not Finish\"',
        'Edit Not Allowed'
      );
      return;
    }
    
    setShowReviewModal(true);
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      await reviewService.deleteReview(userReview.id);
      
      // Refetch reviews from MongoDB after successful deletion
      await refetchReviews();
      
      showSuccess('Your review has been deleted successfully', 'Review Deleted');
    } catch (error) {
      console.error('Error deleting review:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete review. Please try again.';
      showError(errorMessage, 'Deletion Failed');
    }
  };

  const handleDeleteReviewLegacy = async () => {
    if (!userReview) return;
    
    setConfirmModal({
      isOpen: true,
      onConfirm: async () => {
        try {
          await reviewService.deleteReview(userReview.id);
          setUserReview(null);
          setReviews(prev => prev.filter(r => r.id !== userReview.id));
          showSuccess('Review deleted successfully');
        } catch (error) {
          console.error('Error deleting review:', error);
          showError('Failed to delete review');
        }
        setConfirmModal({ isOpen: false, onConfirm: () => {} });
      },
    });
  };

  const handleToggleHelpful = async (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    try {
      if (review.isHelpfulByCurrentUser) {
        await reviewService.removeHelpful(reviewId);
      } else {
        await reviewService.markHelpful(reviewId);
      }

      // Update the review in state
      setReviews(prev => prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            isHelpfulByCurrentUser: !r.isHelpfulByCurrentUser,
            helpfulCount: r.isHelpfulByCurrentUser ? r.helpfulCount - 1 : r.helpfulCount + 1,
          };
        }
        return r;
      }));
    } catch (error) {
      console.error('Error toggling helpful:', error);
      throw error;
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!userBookId) {
      showWarning('Please add this book to your collection first before writing a review');
      return;
    }

    // Validate book status - only allow reviews for completed or did not finish books
    if (currentBookStatus !== ReadingStatus.COMPLETED && currentBookStatus !== ReadingStatus.DID_NOT_FINISH) {
      showError(
        'You can only review books that you have completed or marked as "Did Not Finish"',
        'Review Not Allowed'
      );
      return;
    }

    setShowReviewModal(true);
  };

  // Sort reviews based on selected option
  const sortReviews = (reviewsList: Review[], sortOption: ReviewSortOption): Review[] => {
    const sorted = [...reviewsList];
    
    switch (sortOption) {
      case 'most-popular':
        return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
      case 'most-recent':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'highest-rated':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest-rated':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  };

  // Separate reviews into categories
  const userReviews = reviews.filter(r => r.userId === user?.id);
  const friendReviewsList = friendsReviews.filter(r => r.userId !== user?.id);
  const otherReviews = reviews.filter(r => 
    r.userId !== user?.id && !friendsReviews.some(fr => fr.id === r.id)
  );

  // Apply rating filter if selected
  const filterByRating = (reviewsList: Review[]) => {
    if (selectedRatingFilter === null) return reviewsList;
    return reviewsList.filter(r => Math.round(r.rating * 2) / 2 === selectedRatingFilter);
  };

  // Get sorted and filtered reviews for each category
  const sortedUserReviews = sortReviews(filterByRating(userReviews), reviewSortOption);
  const sortedFriendReviews = sortReviews(filterByRating(friendReviewsList), reviewSortOption);
  const sortedOtherReviews = sortReviews(filterByRating(otherReviews), reviewSortOption);

  const handleAddToCollection = async (status: ReadingStatus) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!book || !edition) return;

    setAddingToCollection(true);
    setShowStatusDropdown(false);
    
    try {
      const isbn = edition.isbn_13?.[0] || edition.isbn_10?.[0];
      
      if (userBookId) {
        // Update existing book
        await userBookService.updateUserBook(userBookId, {
          bookId: book.id,
          title: edition.title,
          author: edition.authors?.[0]?.name || book.author,
          isbn,
          coverImage: edition.coverImage || book.coverImage,
          status,
          totalPages: edition.number_of_pages,
          favorite: false,
        });
        setCurrentBookStatus(status);
        showSuccess(`Status updated to ${getStatusLabel(status)}!`, 'Book Updated');
      } else {
        // Add new book
        const newBook = await userBookService.addBookToCollection({
          bookId: book.id,
          title: edition.title,
          author: edition.authors?.[0]?.name || book.author,
          isbn,
          coverImage: edition.coverImage || book.coverImage,
          status,
          totalPages: edition.number_of_pages,
          favorite: false,
        });
        setCurrentBookStatus(status);
        setUserBookId(newBook.id);
        
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const username = currentUser.username || user?.username || 'user';
        
        showSuccess(
          `"${edition.title}" added to your collection!`,
          'Book Added',
          5000,
          [
            {
              label: 'View Collection',
              onClick: () => router.push(`/${username}/lists`),
              variant: 'primary',
              closeOnClick: true,
            }
          ]
        );
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update book');
    } finally {
      setAddingToCollection(false);
    }
  };

  const getStatusLabel = (status: ReadingStatus): string => {
    switch (status) {
      case ReadingStatus.WANT_TO_READ:
        return 'Want to Read';
      case ReadingStatus.CURRENTLY_READING:
        return 'Currently Reading';
      case ReadingStatus.COMPLETED:
        return 'Completed';
      case ReadingStatus.DID_NOT_FINISH:
        return 'Did Not Finish';
      default:
        return 'Unknown';
    }
  };

  const getMainButtonConfig = () => {
    if (!currentBookStatus) {
      return {
        text: 'Want to Read',
        status: ReadingStatus.WANT_TO_READ,
        color: 'bg-blue-600 hover:bg-blue-700',
      };
    }

    switch (currentBookStatus) {
      case ReadingStatus.WANT_TO_READ:
        return {
          text: 'Start Reading',
          status: ReadingStatus.CURRENTLY_READING,
          color: 'bg-green-600 hover:bg-green-700',
        };
      case ReadingStatus.CURRENTLY_READING:
        return {
          text: 'Mark as Completed',
          status: ReadingStatus.COMPLETED,
          color: 'bg-purple-600 hover:bg-purple-700',
        };
      case ReadingStatus.COMPLETED:
        return {
          text: 'Read Again',
          status: ReadingStatus.CURRENTLY_READING,
          color: 'bg-green-600 hover:bg-green-700',
        };
      case ReadingStatus.DID_NOT_FINISH:
        return {
          text: 'Pick Up Again',
          status: ReadingStatus.CURRENTLY_READING,
          color: 'bg-green-600 hover:bg-green-700',
        };
      default:
        return {
          text: 'Want to Read',
          status: ReadingStatus.WANT_TO_READ,
          color: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  // Filter editions based on ISBN search input
  useEffect(() => {
    if (!isbnSearch.trim()) {
      // No search, show default editions
      if (showAllEditions) {
        setFilteredEditions(allEditions);
      } else {
        setFilteredEditions(allEditions.slice(0, 10));
      }
      return;
    }

    const cleanISBN = isbnSearch.replace(/[-\s]/g, '');

    // Filter editions based on ISBN match - search both ISBN-10 and ISBN-13
    const filtered = allEditions.filter(ed => {
      // Check ISBN-10
      const matchesISBN10 = ed.isbn_10?.some(isbn => 
        isbn.replace(/[-\s]/g, '').startsWith(cleanISBN)
      );
      
      // Check ISBN-13
      const matchesISBN13 = ed.isbn_13?.some(isbn => 
        isbn.replace(/[-\s]/g, '').startsWith(cleanISBN)
      );
      
      // Return true if matches either
      return matchesISBN10 || matchesISBN13;
    });

    setFilteredEditions(filtered);
  }, [isbnSearch, allEditions, showAllEditions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showStatusDropdown && !target.closest('.status-dropdown-container')) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStatusDropdown]);

  const handleISBNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and hyphens
    const cleaned = value.replace(/[^\d-]/g, '');
    setIsbnSearch(cleaned);
  };

  const handleISBNSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If there's exactly one match, navigate to it
    if (filteredEditions.length === 1) {
      const editionKey = filteredEditions[0].key.replace('/books/', '');
      router.push(`/search/${bookId}/edition/${editionKey}`);
    } else if (filteredEditions.length === 0) {
      showWarning('No edition found with this ISBN for this book.', 'Not Found');
    }
    // If multiple matches, user can see them in the filtered list below
  };

  const clearISBNSearch = () => {
    setIsbnSearch('');
  };

  const handleEditionChange = (selectedEditionKey: string) => {
    const editionKey = selectedEditionKey.replace('/books/', '');
    router.push(`/search/${bookId}/edition/${editionKey}`);
  };

  const toggleShowAllEditions = () => {
    if (!showAllEditions) {
      setFilteredEditions(allEditions);
    } else {
      setFilteredEditions(allEditions.slice(0, 10));
    }
    setShowAllEditions(!showAllEditions);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderV2
          title="BestReads"
          userData={isAuthenticated ? {
            userId: user?.id || null,
            username: user?.username || null,
            email: user?.email || null,
            role: 'user',
            avatar: null,
          } : undefined}
        />
        <Container className="py-8">
          <LoadingSkeleton variant="section" message="Loading edition details..." />
        </Container>
      </div>
    );
  }

  if (error || !book || !edition) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderV2
          title="BestReads"
          userData={isAuthenticated ? {
            userId: user?.id || null,
            username: user?.username || null,
            email: user?.email || null,
            role: 'user',
            avatar: null,
          } : undefined}
        />
        <Container className="py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Edition not found'}
            </h2>
            <button
              onClick={() => router.push(`/search/${bookId}`)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to book details
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderV2
        title="BestReads"
        userData={isAuthenticated ? {
          userId: user?.id || null,
          username: user?.username || null,
          email: user?.email || null,
          role: 'user',
          avatar: null,
        } : undefined}
      />

      <Container className="py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/search/${bookId}`)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all book details
        </button>

        {/* Main Edition Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Edition Cover */}
            <div className="shrink-0">
              <div className="w-64 h-96 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg overflow-hidden shadow-lg">
                {edition.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={edition.coverImage}
                    alt={edition.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    📚
                  </div>
                )}
              </div>
            </div>

            {/* Edition Info */}
            <div className="flex-1">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
                  {edition.edition_name || 'Edition'}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {edition.title}
              </h1>

              {edition.subtitle && (
                <h2 className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
                  {edition.subtitle}
                </h2>
              )}

              {/* Authors */}
              {edition.authors && edition.authors.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-2xl text-gray-700 dark:text-gray-300">
                    by {edition.authors.map(a => a.name || 'Unknown Author').join(', ')}
                  </h3>
                </div>
              )}

              {/* Edition Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 text-sm">
                {edition.publishers && edition.publishers.length > 0 && (
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Publisher:</span>
                    <span className="text-gray-600 dark:text-gray-400">{edition.publishers.join(', ')}</span>
                  </div>
                )}

                {edition.publish_date && (
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Published:</span>
                    <span className="text-gray-600 dark:text-gray-400">{edition.publish_date}</span>
                  </div>
                )}

                {edition.number_of_pages && (
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Pages:</span>
                    <span className="text-gray-600 dark:text-gray-400">{edition.number_of_pages}</span>
                  </div>
                )}

                {edition.physical_format && (
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Format:</span>
                    <span className="text-gray-600 dark:text-gray-400">{edition.physical_format}</span>
                  </div>
                )}

                {edition.languages && edition.languages.length > 0 && (
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Language:</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {edition.languages.map(l => l.key.replace('/languages/', '')).join(', ')}
                    </span>
                  </div>
                )}

                {edition.publish_country && (
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Country:</span>
                    <span className="text-gray-600 dark:text-gray-400">{edition.publish_country}</span>
                  </div>
                )}
              </div>

              {/* ISBNs */}
              <div className="space-y-2 mb-6">
                {edition.isbn_13 && edition.isbn_13.length > 0 && (
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">ISBN-13:</span>
                    <span className="text-gray-600 dark:text-gray-400">{edition.isbn_13.join(', ')}</span>
                  </div>
                )}

                {edition.isbn_10 && edition.isbn_10.length > 0 && (
                  <div className="flex items-start">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">ISBN-10:</span>
                    <span className="text-gray-600 dark:text-gray-400">{edition.isbn_10.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Main Action Button */}
                <button
                  onClick={() => handleAddToCollection(getMainButtonConfig().status)}
                  disabled={addingToCollection}
                  className={`px-6 py-3 ${getMainButtonConfig().color} disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium flex items-center gap-2`}
                >
                  {addingToCollection ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentBookStatus && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {getMainButtonConfig().text}
                    </>
                  )}
                </button>

                {/* Status Dropdown Button */}
                <div className="relative status-dropdown-container">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    disabled={addingToCollection}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-400 text-gray-900 dark:text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    {currentBookStatus ? getStatusLabel(currentBookStatus) : 'Set Status'}
                    <svg className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showStatusDropdown && (
                    <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 min-w-[200px]">
                      <button
                        onClick={() => handleAddToCollection(ReadingStatus.WANT_TO_READ)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                          currentBookStatus === ReadingStatus.WANT_TO_READ ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        } rounded-t-lg`}
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </div>
                        <span className="text-gray-900 dark:text-white">Want to Read</span>
                        {currentBookStatus === ReadingStatus.WANT_TO_READ && (
                          <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleAddToCollection(ReadingStatus.CURRENTLY_READING)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                          currentBookStatus === ReadingStatus.CURRENTLY_READING ? 'bg-green-50 dark:bg-green-900/20' : ''
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <span className="text-gray-900 dark:text-white">Currently Reading</span>
                        {currentBookStatus === ReadingStatus.CURRENTLY_READING && (
                          <svg className="w-5 h-5 ml-auto text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleAddToCollection(ReadingStatus.COMPLETED)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                          currentBookStatus === ReadingStatus.COMPLETED ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-900 dark:text-white">Completed</span>
                        {currentBookStatus === ReadingStatus.COMPLETED && (
                          <svg className="w-5 h-5 ml-auto text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleAddToCollection(ReadingStatus.DID_NOT_FINISH)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                          currentBookStatus === ReadingStatus.DID_NOT_FINISH ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                        } rounded-b-lg`}
                      >
                        <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-gray-900 dark:text-white">Did Not Finish</span>
                        {currentBookStatus === ReadingStatus.DID_NOT_FINISH && (
                          <svg className="w-5 h-5 ml-auto text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Current Status Indicator */}
                {currentBookStatus && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 italic">
                    In your collection
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edition Description/Notes */}
        {(edition.description || edition.notes) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            {edition.description && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About this edition
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
                  {typeof edition.description === 'string' ? edition.description : edition.description.value}
                </p>
              </>
            )}
            {edition.notes && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Notes
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {typeof edition.notes === 'string' ? edition.notes : edition.notes.value}
                </p>
              </>
            )}
          </div>
        )}

        {/* Book Description from Work */}
        {book.description && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About the book
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {showFullDescription || book.description.length <= 500 ? (
                <p>{book.description}</p>
              ) : (
                <p>{book.description.substring(0, 500)}...</p>
              )}
            </div>
            {book.description.length > 500 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
              >
                {showFullDescription ? (
                  <>
                    Show less
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Show more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h2>
            <div className="flex items-center gap-3">
              {reviews.length > 0 && (
                <ReviewFilters
                  currentFilter={reviewSortOption}
                  onFilterChange={setReviewSortOption}
                  totalReviews={reviews.length}
                />
              )}
              <button 
                onClick={handleWriteReview}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
              >
                {userReview ? 'Edit Your Review' : 'Write a Review'}
              </button>
            </div>
          </div>
          
          {loadingReviews ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Be the first to share your thoughts about this book!
              </p>
              {isAuthenticated && userBookId && (
                currentBookStatus === ReadingStatus.COMPLETED || currentBookStatus === ReadingStatus.DID_NOT_FINISH ? (
                  <button
                    onClick={handleWriteReview}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Write the First Review
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Reviews can only be written after completing or marking as "Did Not Finish"
                  </p>
                )
              )}
            </div>
          ) : (
            <>
              {/* Rating Distribution Graph */}
              <div className="mb-8">
                <RatingDistribution
                  ratings={reviews.map(r => r.rating)}
                  totalReviews={totalReviews}
                  averageRating={reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0}
                  onRatingFilter={setSelectedRatingFilter}
                  selectedRating={selectedRatingFilter}
                />
              </div>

              {/* Friends' Reviews Section */}
              {isAuthenticated && friendsReviews.length > 0 && (
                <div className="mb-8 border-t border-b border-gray-200 dark:border-gray-700 py-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Reviews from Friends ({friendsReviews.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {friendsReviews.slice(0, 3).map((review) => (
                      <BookReview
                        key={review.id}
                        userName={review.userName}
                        userAvatar={review.userAvatar}
                        rating={review.rating}
                        date={review.createdAt}
                        reviewText={review.reviewText}
                        reviewHtml={review.reviewHtml}
                        helpful={review.helpfulCount}
                        isHelpfulByCurrentUser={review.isHelpfulByCurrentUser}
                        onToggleHelpful={() => handleToggleHelpful(review.id)}
                        isFriendReview={true}
                      />
                    ))}
                    {friendsReviews.length > 3 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
                        {friendsReviews.length - 3} more friend{friendsReviews.length - 3 > 1 ? 's' : ''} reviewed this book
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Your Review Section */}
              {isAuthenticated && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Your Review
                    </h3>
                  </div>
                  {userReview ? (
                    <div className="space-y-4">
                      <BookReview
                        key={userReview.id}
                        userName={userReview.userName}
                        userAvatar={userReview.userAvatar}
                        rating={userReview.rating}
                        date={userReview.createdAt}
                        reviewText={userReview.reviewText}
                        reviewHtml={userReview.reviewHtml}
                        helpful={userReview.helpfulCount}
                        isHelpfulByCurrentUser={userReview.isHelpfulByCurrentUser}
                        onToggleHelpful={() => handleToggleHelpful(userReview.id)}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                        isCurrentUserReview={true}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        You haven&apos;t reviewed this book yet
                      </p>
                      {userBookId ? (
                        currentBookStatus === ReadingStatus.COMPLETED || currentBookStatus === ReadingStatus.DID_NOT_FINISH ? (
                          <button
                            onClick={handleWriteReview}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                          >
                            Write Your Review
                          </button>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p className="mb-2">Reviews can only be written after you&apos;ve completed or marked the book as "Did Not Finish"</p>
                            <p className="text-xs">Current status: <span className="font-semibold">{getStatusLabel(currentBookStatus!)}</span></p>
                          </div>
                        )
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add this book to your collection to write a review
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Friends' Reviews Section */}
              {isAuthenticated && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Reviews from Friends {sortedFriendReviews.length > 0 && `(${sortedFriendReviews.length})`}
                    </h3>
                  </div>
                  {sortedFriendReviews.length > 0 ? (
                    <div className="space-y-4">
                      {sortedFriendReviews.map((review) => (
                        <BookReview
                          key={review.id}
                          userName={review.userName}
                          userAvatar={review.userAvatar}
                          rating={review.rating}
                          date={review.createdAt}
                          reviewText={review.reviewText}
                          reviewHtml={review.reviewHtml}
                          helpful={review.helpfulCount}
                          isHelpfulByCurrentUser={review.isHelpfulByCurrentUser}
                          onToggleHelpful={() => handleToggleHelpful(review.id)}
                          isFriendReview={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400">
                        None of your friends have reviewed this book yet
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Friends' Reviews Section */}
              {isAuthenticated && sortedFriendReviews.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Reviews from Friends ({sortedFriendReviews.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {sortedFriendReviews.map((review) => (
                      <BookReview
                        key={review.id}
                        userName={review.userName}
                        userAvatar={review.userAvatar}
                        rating={review.rating}
                        date={review.createdAt}
                        reviewText={review.reviewText}
                        reviewHtml={review.reviewHtml}
                        helpful={review.helpfulCount}
                        isHelpfulByCurrentUser={review.isHelpfulByCurrentUser}
                        onToggleHelpful={() => handleToggleHelpful(review.id)}
                        isFriendReview={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Other Reviews Section */}
              {sortedOtherReviews.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      All Reviews ({sortedOtherReviews.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {sortedOtherReviews.map((review) => (
                      <BookReview
                        key={review.id}
                        userName={review.userName}
                        userAvatar={review.userAvatar}
                        rating={review.rating}
                        date={review.createdAt}
                        reviewText={review.reviewText}
                        reviewHtml={review.reviewHtml}
                        helpful={review.helpfulCount}
                        isHelpfulByCurrentUser={review.isHelpfulByCurrentUser}
                        onToggleHelpful={isAuthenticated ? () => handleToggleHelpful(review.id) : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No reviews message for filtered view */}
              {sortedUserReviews.length === 0 && sortedFriendReviews.length === 0 && sortedOtherReviews.length === 0 && selectedRatingFilter !== null && (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  No reviews with {selectedRatingFilter} stars rating
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={!hasPreviousPage}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i;
                      } else if (currentPage < 3) {
                        pageNum = i;
                      } else if (currentPage > totalPages - 4) {
                        pageNum = totalPages - 5 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={!hasNextPage}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                    Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalReviews)} of {totalReviews} reviews
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
          initialRating={userReview?.rating || 0}
          initialReviewText={userReview?.reviewText || ''}
          initialReviewHtml={userReview?.reviewHtml || ''}
          isEditMode={!!userReview}
          bookTitle={edition?.title || ''}
        />

        {/* ISBN Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Search Edition by ISBN
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Type an ISBN to instantly filter editions {isbnSearch && `(${filteredEditions.length} ${filteredEditions.length === 1 ? 'match' : 'matches'})`}
          </p>
          <form onSubmit={handleISBNSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={isbnSearch}
                onChange={handleISBNChange}
                placeholder="Enter ISBN (10 or 13 digits)..."
                maxLength={17}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
              {isbnSearch && (
                <button
                  type="button"
                  onClick={clearISBNSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!isbnSearch.trim() || filteredEditions.length !== 1}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
            >
              {filteredEditions.length === 1 ? 'Go to Edition' : 'Filter'}
            </button>
          </form>
          {isbnSearch && filteredEditions.length === 0 && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">
              No editions found with ISBN starting with &quot;{isbnSearch}&quot;
            </p>
          )}
        </div>

        {/* Available Editions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isbnSearch ? `Filtered Editions (${filteredEditions.length})` : `Available Editions (${allEditions.length})`}
            </h2>
            {allEditions.length > 10 && !isbnSearch && (
              <button
                onClick={toggleShowAllEditions}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {showAllEditions ? 'Show Less' : 'Show All'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEditions.map((ed) => {
              const editionKey = ed.key.replace('/books/', '');
              const isCurrentEdition = editionKey === editionId;

              return (
                <button
                  key={ed.key}
                  onClick={() => !isCurrentEdition && handleEditionChange(ed.key)}
                  disabled={isCurrentEdition}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    isCurrentEdition
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 cursor-default'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {isCurrentEdition && (
                    <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded mb-2">
                      Current Edition
                    </span>
                  )}
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {ed.title}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {ed.publishers && ed.publishers.length > 0 && (
                      <p className="truncate">Publisher: {ed.publishers[0]}</p>
                    )}
                    {ed.publish_date && (
                      <p>Published: {ed.publish_date}</p>
                    )}
                    {ed.isbn_13 && ed.isbn_13.length > 0 && (
                      <p className="truncate">ISBN-13: {ed.isbn_13[0]}</p>
                    )}
                    {ed.isbn_10 && ed.isbn_10.length > 0 && !ed.isbn_13 && (
                      <p className="truncate">ISBN-10: {ed.isbn_10[0]}</p>
                    )}
                    {ed.number_of_pages && (
                      <p>{ed.number_of_pages} pages</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Notification Component */}
      {notification.isOpen && (
        <Notification
          isOpen={notification.isOpen}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={hideNotification}
        />
      )}

      {/* Notification */}
      <Notification
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        duration={notification.duration}
        actions={notification.actions}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Review"
        message="Are you sure you want to delete your review? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, onConfirm: () => {} })}
      />
    </div>
  );
}
