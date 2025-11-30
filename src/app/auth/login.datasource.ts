/**
 * Login Form Data Source
 * Provides the actual content/data for the login form
 * Separated from configuration to allow easy CMS/API integration
 */

import { AuthFormConfig } from './auth.types';

/**
 * Default login form data
 * In production, fetch this from CMS, API, or i18n system
 */
export const defaultLoginData: AuthFormConfig = {
  id: 'login-form',
  header: {
    title: 'Welcome Back',
    subtitle: 'Sign in to continue your reading journey'
  },
  fields: [
    {
      type: 'text',
      name: 'usernameOrEmail',
      label: 'Username or Email',
      placeholder: 'Enter your username or email',
      required: true,
      autoComplete: 'username',
      validation: {
        minLength: 3,
        customMessage: 'Username or email is required'
      }
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      required: true,
      autoComplete: 'current-password',
      validation: {
        minLength: 6,
        customMessage: 'Password must be at least 6 characters'
      }
    }
  ],
  actions: [
    {
      label: 'Sign In',
      actionId: 'auth.login.submit',
      type: 'submit',
      variant: 'primary',
      size: 'lg'
    },
    {
      label: 'Create an Account',
      actionId: 'auth.navigate.register',
      type: 'link',
      href: '/register',
      variant: 'outline',
      size: 'lg'
    }
  ],
  footer: {
    text: 'New to BestReads?',
    links: [
      {
        label: 'Forgot password?',
        href: '/forgot-password'
      },
      {
        label: '← Back to Home',
        href: '/landing'
      }
    ]
  },
  features: [
    {
      icon: '📚',
      label: 'Track Books'
    },
    {
      icon: '📊',
      label: 'Analytics'
    },
    {
      icon: '🎯',
      label: 'Set Goals'
    }
  ]
};

/**
 * Fetch login form data from API/CMS
 * Allows for A/B testing, localization, personalization
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchLoginData(_locale?: string): Promise<AuthFormConfig> {
  // In production:
  // const response = await fetch(`/api/forms/login?locale=${_locale}`);
  // return response.json();
  
  return defaultLoginData;
}

/**
 * Get login data variant for A/B testing
 */
export function getLoginDataVariant(variant: 'a' | 'b'): AuthFormConfig {
  if (variant === 'b') {
    return {
      ...defaultLoginData,
      header: {
        title: 'Sign In',
        subtitle: 'Access your BestReads account'
      }
    };
  }
  return defaultLoginData;
}
