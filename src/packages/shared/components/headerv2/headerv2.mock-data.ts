import { HeaderUserData } from './headerv2.types';

/**
 * Mock user data - regular user
 */
export const mockUserData: HeaderUserData = {
  userId: 'user-123',
  username: 'johndoe',
  email: 'john@example.com',
  role: 'user',
  avatar: null,
};

/**
 * Mock user data - admin user
 */
export const mockAdminData: HeaderUserData = {
  userId: 'admin-456',
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  avatar: null,
};

/**
 * Mock user data - guest (not logged in)
 */
export const mockGuestData: HeaderUserData = {
  userId: null,
  username: null,
  email: null,
  role: 'guest',
  avatar: null,
};
