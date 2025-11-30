/**
 * Header Component Types
 * Defines the DATA structure (not configuration structure)
 * Note: For user-related headers, use headerv2 component
 */

export interface HeaderAction {
  label: string;
  action: string;
  type: 'scroll' | 'route' | 'external';
  target: string;
  visible: boolean;
  roles?: string[];
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
  className?: string;
}
