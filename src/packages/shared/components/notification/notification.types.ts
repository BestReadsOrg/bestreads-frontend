export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  closeOnClick?: boolean;
}

export interface NotificationProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: NotificationType;
  duration?: number; // milliseconds, 0 for no auto-close
  onClose: () => void;
  actions?: NotificationAction[];
}
