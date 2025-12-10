export interface BookShelfBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage?: string;
  userRating?: number;
  status?: string;
  progress?: {
    current: number;
    total: number;
  };
}

export interface BookShelfProps {
  title: string;
  books: BookShelfBook[];
  viewMoreLink?: string;
  emptyMessage?: string;
  loading?: boolean;
  onBookClick?: (bookId: string) => void;
  maxVisible?: number;
  className?: string;
}
