import { HeaderUserData } from './headerv2.types';
import userService from '@/services/userService';

/**
 * Fetch user data for header
 * Returns user-specific information (role, avatar, etc.)
 */
export async function fetchHeaderUserData(): Promise<HeaderUserData> {
  try {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // User not authenticated, return guest data
      return {
        userId: null,
        username: null,
        email: null,
        role: 'guest',
        avatar: null,
      };
    }

    // Fetch current user from backend
    const user = await userService.getCurrentUserProfile();
    
    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.roles?.includes('ROLE_ADMIN') ? 'admin' : 'user',
      avatar: user.profileImage || null,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Fallback to guest data on error
    return {
      userId: null,
      username: null,
      email: null,
      role: 'guest',
      avatar: null,
    };
  }
}
