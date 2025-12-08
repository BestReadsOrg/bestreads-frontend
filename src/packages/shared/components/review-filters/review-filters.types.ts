export type ReviewSortOption = 'most-popular' | 'most-recent' | 'highest-rated' | 'lowest-rated';

export interface ReviewFiltersProps {
  currentFilter: ReviewSortOption;
  onFilterChange: (filter: ReviewSortOption) => void;
  totalReviews: number;
  className?: string;
}

export interface SortOptionConfig {
  value: ReviewSortOption;
  label: string;
  icon: string;
  description: string;
}
