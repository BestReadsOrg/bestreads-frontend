import { HeroData } from './hero.types';

export const heroData: HeroData = {
  headline: 'Your Personal Companion for Smarter Reading',
  subtext: 'Track your reading progress, discover personalized book recommendations, and gain insights from your reading journey. BestReads helps you read more, remember better, and enjoy every page.',
  primaryButton: {
    label: 'Get Started Free',
    action: 'navigate-signup',
    variant: 'primary',
    size: 'lg',
    icon: '🚀'
  },
  secondaryButton: {
    label: 'View Demo',
    action: 'navigate-demo',
    variant: 'outline',
    size: 'lg',
    icon: '▶️'
  },
  image: '/images/hero-dashboard.png',
  backgroundGradient: 'from-blue-50 via-white to-purple-50'
};

/**
 * Fetch hero data from CMS/API
 * Falls back to static data if fetch fails
 */
export async function fetchHeroData(): Promise<HeroData> {
  try {
    const response = await fetch('/api/hero', {
      cache: 'no-store',
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Failed to fetch hero data from API, using static data:', error);
  }
  
  return heroData;
}

/**
 * Get hero data for A/B testing
 */
export function getHeroDataVariant(variant: 'a' | 'b'): HeroData {
  if (variant === 'b') {
    return {
      ...heroData,
      headline: 'Master Your Reading Journey',
      subtext: 'Join thousands of readers who track, discover, and analyze their reading habits with BestReads.'
    };
  }
  return heroData;
}
