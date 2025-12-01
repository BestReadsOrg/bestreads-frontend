/**
 * Header Data Source
 * Provides actual data for Header component
 * Separates data from structure/configuration
 */

import { HeaderConfig } from './header.types';

/**
 * Default header data
 */
export const headerData: HeaderConfig = {
  title: 'BestReads',
  actions: [
    {
      label: 'My Books',
      action: 'navigateBooks',
      type: 'route',
      target: '/my-books',
      visible: true,
      roles: ['user', 'admin'],
    },
    {
      label: 'Browse',
      action: 'navigateBrowse',
      type: 'route',
      target: '/browse',
      visible: true,
      roles: ['user', 'admin'],
    },
    {
      label: 'Profile',
      action: 'navigateProfile',
      type: 'route',
      target: '/profile',
      visible: true,
      roles: ['user', 'admin'],
    },
  ],
};

/**
 * Fetch header data from API (if needed)
 */
export async function fetchHeaderData(): Promise<HeaderConfig> {
  // In production, fetch from your backend API
  // For now, return default data
  return headerData;
}

/**
 * Get header data customized for user role
 */
export function getHeaderDataForRole(role: 'guest' | 'user' | 'admin'): HeaderConfig {
  const data = { ...headerData };
  
  // Filter actions based on role
  if (data.actions) {
    data.actions = data.actions.filter(action => 
      !action.roles || action.roles.includes(role)
    );
  }
  
  return data;
}
