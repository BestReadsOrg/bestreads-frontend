'use client';

import { useState, useCallback } from 'react';
import { NotificationType } from '@/packages/shared/components/notification';

export interface NotificationState {
  isOpen: boolean;
  title?: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const showNotification = useCallback((
    message: string,
    type: NotificationType = 'info',
    title?: string,
    duration: number = 5000
  ) => {
    setNotification({
      isOpen: true,
      message,
      type,
      title,
      duration,
    });
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showNotification(message, 'success', title);
  }, [showNotification]);

  const showError = useCallback((message: string, title?: string) => {
    showNotification(message, 'error', title);
  }, [showNotification]);

  const showWarning = useCallback((message: string, title?: string) => {
    showNotification(message, 'warning', title);
  }, [showNotification]);

  const showInfo = useCallback((message: string, title?: string) => {
    showNotification(message, 'info', title);
  }, [showNotification]);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };
};
