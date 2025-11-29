import { HeaderUserData } from './headerv2.types';
import { mockGuestData } from './headerv2.mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * Fetch user data for header
 * Returns user-specific information (role, avatar, etc.)
 */
export async function fetchHeaderUserData(): Promise<HeaderUserData> {
  if (USE_MOCK_DATA) {
    // Return mock user data during development
    const { mockUserData } = await import('./headerv2.mock-data');
    return mockUserData;
  }

  try {
    const response = await fetch('/api/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      // User not authenticated, return guest data
      return mockGuestData;
    }
    
    const data = await response.json();
    const user = data.data;
    
    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.roles?.includes('ROLE_ADMIN') ? 'admin' : 'user',
      avatar: user.avatar || null,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Fallback to guest data on error
    return mockGuestData;
  }
}
