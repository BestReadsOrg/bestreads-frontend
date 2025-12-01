import apiClient from '@/utils/api';

export interface UserSettings {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImage?: string;
  darkMode: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface UpdateSettingsRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImage?: string;
  darkMode?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const settingsService = {
  /**
   * Get current user settings
   */
  async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get<UserSettings>('/settings');
    return response.data;
  },

  /**
   * Update user settings
   */
  async updateSettings(settings: UpdateSettingsRequest): Promise<ApiResponse<UserSettings>> {
    const response = await apiClient.put<ApiResponse<UserSettings>>('/settings', settings);
    return response.data;
  },

  /**
   * Update dark mode preference only
   */
  async updateDarkMode(darkMode: boolean): Promise<ApiResponse<boolean>> {
    const response = await apiClient.patch<ApiResponse<boolean>>('/settings/dark-mode', { darkMode });
    return response.data;
  },
};

export default settingsService;
