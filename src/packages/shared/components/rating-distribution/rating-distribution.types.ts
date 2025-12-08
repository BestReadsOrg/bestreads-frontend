export interface RatingDistributionProps {
  ratings: number[]; // Array of all rating values
  totalReviews: number;
  averageRating: number;
  onRatingFilter: (rating: number | null) => void;
  selectedRating: number | null;
}
