/**
 * BookCard Component Types
 */

export interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  genres?: string[];
  rating?: number;
  status?: 'reading' | 'completed' | 'want-to-read' | 'did-not-finish';
  progress?: number; // 0-100
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export interface BookCardAction {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}
