export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string, searchType: 'title' | 'isbn') => void;
  className?: string;
  autoFocus?: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  publishYear?: string;
}
