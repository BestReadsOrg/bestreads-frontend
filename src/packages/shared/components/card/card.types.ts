export interface CardProps {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  hoverable?: boolean;
}

export interface TestimonialCardData {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  comment: string;
  date?: string;
}
