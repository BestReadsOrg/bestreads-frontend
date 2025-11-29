/**
 * Header Component Types
 * Defines the DATA structure (not configuration structure)
 */

export interface HeaderAction {
  label: string;
  action: string;
  visible: boolean;
  roles?: string[];
}

/**
 * User-specific data from API/mock
 */
export interface HeaderUserData {
  userId: string | null;
  username: string | null;
  email: string | null;
  role: 'guest' | 'user' | 'admin';
  avatar: string | null;
}

/**
 * Header configuration (from configuration.json)
 */
export interface HeaderConfig {
  title: string;
  actions?: HeaderAction[];
}

/**
 * Props passed to Header component
 */
export interface HeaderProps extends HeaderConfig {
  userData?: HeaderUserData;
  className?: string;
}
