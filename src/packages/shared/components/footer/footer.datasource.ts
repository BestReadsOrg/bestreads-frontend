/**
 * Footer Data Source
 * Provides actual data for the Footer component
 * Separates data from structure/configuration
 */

import { FooterConfig } from './footer.types';

/**
 * Static footer data
 * Used as fallback when API/CMS is unavailable
 */
export const footerData: Omit<FooterConfig, 'componentId'> = {
  copyrightText: `© ${new Date().getFullYear()} BestReads. All rights reserved.`,
  actions: [
    {
      label: 'Privacy Policy',
      action: 'navigatePrivacy',
      visible: true,
    },
    {
      label: 'Terms of Service',
      action: 'navigateTerms',
      visible: true,
    },
    {
      label: 'Contact Us',
      action: 'navigateContact',
      visible: true,
    },
    {
      label: 'API Docs',
      action: 'navigateApiDocs',
      visible: false, // Only visible to developers/admins
    },
  ],
};

/**
 * Fetch footer data from API or CMS
 * Falls back to static data if fetch fails
 */
export async function fetchFooterData(): Promise<Omit<FooterConfig, 'componentId'>> {
  try {
    const response = await fetch('/api/footer', {
      cache: 'no-store',
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Failed to fetch footer data from API, using static data:', error);
  }
  
  return footerData;
}

/**
 * Get footer data based on user role
 */
export function getFooterDataForRole(role: 'admin' | 'user' | 'guest'): Omit<FooterConfig, 'componentId'> {
  const data = { ...footerData };
  
  if (role === 'admin') {
    // Show API docs link for admins
    data.actions = data.actions?.map(action => 
      action.action === 'navigateApiDocs' ? { ...action, visible: true } : action
    );
  }
  
  return data;
}
