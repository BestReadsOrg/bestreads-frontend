import { HeaderProps } from './header.types';

/**
 * Static header data
 * Used as fallback when API/CMS is unavailable
 */
export const headerData: Partial<HeaderProps> = {
  title: 'BestReads',
  actions: [
    {
      label: 'Home',
      action: 'navigateHome',
      visible: true,
    },
    {
      label: 'Features',
      action: 'navigateFeatures',
      visible: true,
    },
    {
      label: 'Pricing',
      action: 'navigatePricing',
      visible: true,
    },
    {
      label: 'Login',
      action: 'navigateLogin',
      visible: true,
    },
  ],
};

/**
 * Fetch header data from API or CMS
 * Falls back to static data if fetch fails
 */
export async function fetchHeaderData(): Promise<Partial<HeaderProps>> {
  try {
    // In production, fetch from your backend API or CMS
    const response = await fetch('/api/header', {
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Failed to fetch header data from API, using static data:', error);
  }
  
  // Fallback to static data
  return headerData;
}
