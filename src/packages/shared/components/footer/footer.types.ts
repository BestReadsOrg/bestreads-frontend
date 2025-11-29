/**
 * Footer Component Types
 * Defines the DATA structure (not configuration structure)
 */

export interface FooterAction {
  label: string;
  action: string;
  visible: boolean;
}

/**
 * Footer data interface (actual values passed to component)
 */
export interface FooterConfig {
  copyrightText: string;
  actions?: FooterAction[];
}
