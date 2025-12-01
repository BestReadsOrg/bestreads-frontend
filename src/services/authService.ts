import apiClient, { handleApiError } from '../utils/api';

// Auth DTOs matching backend
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  type: string;
  username: string;
  email: string;
  roles: string[];
}

export interface User {
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

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; data: AuthResponse }>('/auth/register', data);
      
      // Store tokens and user info
      this.storeAuthData(response.data.data);
      
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; data: AuthResponse }>('/auth/login', data);
      
      // Store tokens and user info
      this.storeAuthData(response.data.data);
      
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ success: boolean; message: string; data: AuthResponse }>('/auth/refresh', refreshToken, {
        headers: { 'Content-Type': 'text/plain' }
      });

      this.storeAuthData(response.data.data);
      
      return response.data.data;
    } catch (error) {
      this.logout();
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Store authentication data
   */
  private storeAuthData(data: AuthResponse): void {
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    // Store user info
    const user: Partial<User> = {
      username: data.username,
      email: data.email,
      roles: data.roles,
    };
    localStorage.setItem('user', JSON.stringify(user));
  }
}

const authService = new AuthService();
export default authService;
