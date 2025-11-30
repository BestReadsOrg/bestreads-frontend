/**
 * Register Form Data Source
 * Provides the actual content/data for the registration form
 */

import { AuthFormConfig } from './auth.types';

/**
 * Password validation requirements
 */
export const passwordRequirements = [
  {
    id: 'length',
    label: 'At least 6 characters',
    validator: (password: string) => password.length >= 6
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    validator: (password: string) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    validator: (password: string) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    label: 'One number',
    validator: (password: string) => /\d/.test(password)
  }
];

/**
 * Default register form data
 */
export const defaultRegisterData: AuthFormConfig = {
  id: 'register-form',
  header: {
    title: 'Create Your Account',
    subtitle: 'Join thousands of readers tracking their journey'
  },
  fields: [
    {
      type: 'text',
      name: 'username',
      label: 'Username',
      placeholder: 'Choose a unique username',
      required: true,
      autoComplete: 'username',
      validation: {
        minLength: 3,
        pattern: '^[a-zA-Z0-9_]+$',
        customMessage: 'Username must be at least 3 characters (letters, numbers, underscores only)'
      }
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email Address',
      placeholder: 'your.email@example.com',
      required: true,
      autoComplete: 'email',
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        customMessage: 'Please enter a valid email address'
      }
    },
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name (Optional)',
      placeholder: 'John',
      required: false,
      autoComplete: 'given-name'
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name (Optional)',
      placeholder: 'Doe',
      required: false,
      autoComplete: 'family-name'
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      placeholder: 'Create a strong password',
      required: true,
      autoComplete: 'new-password',
      validation: {
        minLength: 6,
        customMessage: 'Password must meet all requirements below'
      }
    },
    {
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: 'Re-enter your password',
      required: true,
      autoComplete: 'new-password',
      validation: {
        customMessage: 'Passwords must match'
      }
    }
  ],
  actions: [
    {
      label: 'Create Account',
      actionId: 'auth.register.submit',
      type: 'submit',
      variant: 'primary',
      size: 'lg'
    },
    {
      label: 'Sign In',
      actionId: 'auth.navigate.login',
      type: 'link',
      href: '/login',
      variant: 'outline',
      size: 'lg'
    }
  ],
  footer: {
    text: 'Already have an account?',
    links: [
      {
        label: '← Back to Home',
        href: '/landing'
      }
    ]
  },
  passwordRequirements
};

/**
 * Fetch register form data from API/CMS
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchRegisterData(_locale?: string): Promise<AuthFormConfig> {
  // In production:
  // const response = await fetch(`/api/forms/register?locale=${_locale}`);
  // return response.json();
  
  return defaultRegisterData;
}
