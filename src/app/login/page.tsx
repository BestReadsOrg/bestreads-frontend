'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import { Notification } from '@/packages/shared/components/notification';
import { AuthForm, defaultLoginData } from '@/app/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { notification, showError, hideNotification } = useNotification();
  
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (data: Record<string, string>): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.usernameOrEmail?.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAction = async (actionId: string, data?: Record<string, unknown>) => {
    switch (actionId) {
      case 'auth.login.submit':
        await handleLoginSubmit(data as Record<string, string>);
        break;
      
      case 'auth.navigate.register':
        router.push('/register');
        break;
      
      default:
        console.warn(`Unhandled action: ${actionId}`);
    }
  };

  const handleLoginSubmit = async (data: Record<string, string>) => {
    if (!validateForm(data)) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(data.usernameOrEmail, data.password);
      // Navigate to user's dashboard after successful login
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.username) {
        router.push(`/${currentUser.username}/dashboard`);
      } else {
        router.push('/');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      showError(errorMessage, 'Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={hideNotification}
        duration={notification.duration}
      />
      <AuthForm
        {...defaultLoginData}
        onAction={handleAction}
        onFieldChange={handleFieldChange}
        formData={formData}
        errors={errors}
        loading={isLoading}
      />
    </>
  );
}
