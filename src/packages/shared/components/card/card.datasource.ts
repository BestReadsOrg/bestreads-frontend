import { FeatureCardData, TestimonialCardData } from './card.types';

/**
 * Static feature cards data
 * Used as fallback when API/CMS is unavailable
 */
export const featureCards: FeatureCardData[] = [
  {
    id: 'track-progress',
    title: 'Track Your Reading Progress',
    description: 'Monitor your reading journey with detailed progress tracking, page counts, and reading speed analytics.',
    icon: '📚',
    variant: 'elevated'
  },
  {
    id: 'personalized-recommendations',
    title: 'Discover Personalized Recommendations',
    description: 'Get smart book suggestions based on your reading history, preferences, and community insights.',
    icon: '✨',
    variant: 'elevated'
  },
  {
    id: 'digital-library',
    title: 'Manage Your Digital Library Effortlessly',
    description: 'Organize your books with custom shelves, tags, and categories. Search and filter with ease.',
    icon: '📖',
    variant: 'elevated'
  },
  {
    id: 'reading-analytics',
    title: 'Reading Analytics & Insights Dashboard',
    description: 'Visualize your reading patterns, set goals, and track achievements with beautiful dashboards.',
    icon: '📊',
    variant: 'elevated'
  }
];

/**
 * Static testimonials data
 * Used as fallback when API/CMS is unavailable
 */
export const testimonials: TestimonialCardData[] = [
  {
    id: 'testimonial-1',
    name: 'Sarah Johnson',
    role: 'Book Enthusiast',
    avatar: '/avatars/sarah.jpg',
    rating: 5,
    comment: 'BestReads has completely transformed how I manage my reading list. The analytics feature is a game-changer!',
    date: '2025-11-15'
  },
  {
    id: 'testimonial-2',
    name: 'Michael Chen',
    role: 'Software Engineer',
    avatar: '/avatars/michael.jpg',
    rating: 5,
    comment: 'Finally, a reading tracker that understands what I need. The recommendations are spot-on and the UI is beautiful.',
    date: '2025-11-10'
  },
  {
    id: 'testimonial-3',
    name: 'Emma Williams',
    role: 'Teacher',
    avatar: '/avatars/emma.jpg',
    rating: 5,
    comment: 'I love how easy it is to track my students\' reading progress and share recommendations with them.',
    date: '2025-11-05'
  }
];

/**
 * Fetch feature cards from API
 * Falls back to static data if fetch fails
 */
export async function fetchFeatureCards(): Promise<FeatureCardData[]> {
  try {
    const response = await fetch('/api/features', {
      cache: 'no-store',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Failed to fetch feature cards from API, using static data:', error);
  }
  
  return featureCards;
}

/**
 * Fetch testimonials from API
 * Falls back to static data if fetch fails
 */
export async function fetchTestimonials(): Promise<TestimonialCardData[]> {
  try {
    const response = await fetch('/api/testimonials', {
      cache: 'no-store',
      next: { revalidate: 300 }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Failed to fetch testimonials from API, using static data:', error);
  }
  
  return testimonials;
}
