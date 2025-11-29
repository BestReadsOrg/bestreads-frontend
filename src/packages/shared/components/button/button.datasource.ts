import { ButtonAction } from './button.types';

/**
 * Static button data
 * Used as fallback when API/CMS is unavailable
 */
export const buttonData: Record<string, ButtonAction> = {
  getStarted: {
    label: 'Get Started',
    action: 'navigate-signup',
    variant: 'primary',
    size: 'lg'
  },
  viewDemo: {
    label: 'View Demo',
    action: 'navigate-demo',
    variant: 'outline',
    size: 'lg'
  },
  login: {
    label: 'Log In',
    action: 'navigate-login',
    variant: 'ghost',
    size: 'md'
  },
  signup: {
    label: 'Sign Up',
    action: 'navigate-signup',
    variant: 'primary',
    size: 'md'
  },
  learnMore: {
    label: 'Learn More',
    action: 'scroll-features',
    variant: 'secondary',
    size: 'md'
  },
  subscribe: {
    label: 'Subscribe',
    action: 'submit-newsletter',
    variant: 'primary',
    size: 'md'
  }
};

/**
 * Fetch button data from API (for dynamic labels, A/B testing, etc.)
 * Falls back to static data if fetch fails
 */
export async function fetchButtonData(buttonId: string): Promise<ButtonAction> {
  try {
    const response = await fetch(`/api/buttons/${buttonId}`, {
      cache: 'no-store',
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn(`Failed to fetch button data for ${buttonId} from API, using static data:`, error);
  }
  
  return buttonData[buttonId] || buttonData.getStarted;
}

/**
 * Get button data with loading state
 */
export function getButtonWithLoadingState(buttonId: string, loading: boolean): ButtonAction {
  const button = buttonData[buttonId];
  return {
    ...button,
    loading,
    disabled: loading
  };
}
