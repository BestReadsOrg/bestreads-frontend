export interface BookReviewProps {
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  reviewText: string;
  reviewHtml?: string;
  helpful: number;
  isHelpfulByCurrentUser?: boolean;
  onToggleHelpful?: () => Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
  isCurrentUserReview?: boolean;
  isFriendReview?: boolean;
  onHelpful?: () => void;
  className?: string;
}
