export interface StarRatingProps {
  rating: number; // 0 to 5, supports .5 increments
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}
