/**
 * Login Component Types
 * Defines the DATA structure (not configuration structure)
 */

import { ActionConfig } from '@/types/config.types';

/**
 * Props for the Login component (actual data passed to component)
 */
export interface LoginProps {
  title: string;
  description?: string;
  actions?: ActionConfig[];
  styles?: {
    containerClass?: string;
    headerClass?: string;
    bodyClass?: string;
    buttonContainerClass?: string;
  };
  user?: {
    name?: string;
    email?: string;
  };
  onAction?: (action: string, data?: Record<string, unknown>) => void;
  className?: string;
}

/**
 * Action handlers type
 */
export type LoginActionHandler = (action: string, data?: Record<string, unknown>) => void;
