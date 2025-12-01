import apiClient, { handleApiError } from '../utils/api';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImage?: string;
  roles: string[];
  emailVerified: boolean;
  active: boolean;
  darkMode?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImage?: string;
}

class UserService {
  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<UserResponse> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: UserResponse }>('/users/me');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserResponse> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: UserResponse }>(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<UserResponse> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: UserResponse }>(`/users/username/${username}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(page: number = 0, size: number = 20): Promise<UserResponse[]> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string; data: UserResponse[] }>('/users', {
        params: { page, size },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response = await apiClient.put<{ success: boolean; message: string; data: UserResponse }>(`/users/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

const userService = new UserService();
export default userService;
