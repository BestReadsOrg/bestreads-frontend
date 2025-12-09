export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string, searchType: 'title' | 'isbn') => void;
  className?: string;
  autoFocus?: boolean;
  showDropdown?: boolean; // Enable dropdown preview
  onViewAllResults?: () => void; // Callback when "View All" is clicked
}

export interface SearchResult {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  publishYear?: string;
}
