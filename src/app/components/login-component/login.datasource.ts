/**
 * Login Data Source
 * Provides actual data for the Login component
 * Separates data from structure/configuration
 */

import { LoginProps } from './login.types';

/**
 * Default login page data
 * In production, this would come from CMS, API, or database
 */
export const defaultLoginData: Pick<LoginProps, 'title' | 'description' | 'actions'> = {
  title: 'Welcome to BestReads',
  description: 'Sign in to your account to continue reading',
  actions: [
    {
      label: 'Sign In with Email',
      action: 'signInEmail',
      visible: true,
      variant: 'primary',
    },
    {
      label: 'Sign In with Google',
      action: 'signInGoogle',
      visible: true,
      variant: 'secondary',
    },
    {
      label: 'Create Account',
      action: 'createAccount',
      visible: true,
      variant: 'ghost',
    },
    {
      label: 'Reset Password',
      action: 'resetPassword',
      visible: false, // Hidden by default, shown when user clicks "Forgot Password"
      variant: 'danger',
    },
  ],
};

/**
 * Fetch login page data from API or CMS
 */
export async function fetchLoginData(): Promise<Pick<LoginProps, 'title' | 'description' | 'actions'>> {
  // In production, this would fetch from your backend API or CMS
  // Example: const response = await fetch('/api/pages/login');
  
  return defaultLoginData;
}

/**
 * Get login data with user context (for returning users)
 */
export function getLoginDataWithUser(email: string): Pick<LoginProps, 'title' | 'description' | 'actions' | 'user'> {
  return {
    ...defaultLoginData,
    title: 'Welcome Back!',
    description: `Sign in to continue as ${email}`,
    user: {
      email,
    },
  };
}

/**
 * Get password reset flow data
 */
export function getPasswordResetData(): Pick<LoginProps, 'title' | 'description' | 'actions'> {
  return {
    title: 'Reset Your Password',
    description: 'Enter your email to receive a password reset link',
    actions: [
      {
        label: 'Send Reset Link',
        action: 'sendResetEmail',
        visible: true,
        variant: 'primary',
      },
      {
        label: 'Back to Login',
        action: 'backToLogin',
        visible: true,
        variant: 'ghost',
      },
    ],
  };
}
