export type ActivityType = 
  | 'book_added'
  | 'book_completed'
  | 'book_started'
  | 'review_posted'
  | 'rating_updated'
  | 'goal_completed'
  | 'friend_added';

export interface Activity {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  type: ActivityType;
  timestamp: string;
  book?: {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
  };
  review?: {
    id: string;
    rating: number;
    text?: string;
  };
  metadata?: Record<string, any>;
}

export interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  showViewMore?: boolean;
  viewMoreLink?: string;
  emptyMessage?: string;
  className?: string;
}
