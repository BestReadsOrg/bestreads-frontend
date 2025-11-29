/**
 * Configuration loader utility
 * Loads configuration from local files in development or remote URLs in production
 * Supports both component configs and page configs
 */

import { BaseComponentConfig, ConfigLoaderOptions, PageConfig, PageComponentConfig } from '@/types/config.types';

// Import all configuration files statically for proper bundling
import landingPageConfig from '@/app/landing/landing.configuration.json';
import loginPageConfig from '@/app/login/login.configuration.json';
import registerPageConfig from '@/app/register/register.configuration.json';
import dashboardPageConfig from '@/app/dashboard/dashboard.configuration.json';

import headerConfig from '@/packages/shared/components/header/header.configuration.json';
import footerConfig from '@/packages/shared/components/footer/footer.configuration.json';
import buttonConfig from '@/packages/shared/components/button/button.configuration.json';
import cardConfig from '@/packages/shared/components/card/card.configuration.json';

import heroConfig from '@/app/components/hero/hero.configuration.json';
import authConfig from '@/app/components/auth/auth.configuration.json';
import loginComponentConfig from '@/app/components/login-component/login.configuration.json';
import featuresConfig from '@/app/components/features/features.configuration.json';
import howItWorksConfig from '@/app/components/how-it-works/how-it-works.configuration.json';
import testimonialsConfig from '@/app/components/testimonials/testimonials.configuration.json';
import integrationsConfig from '@/app/components/integrations/integrations.configuration.json';
import newsletterConfig from '@/app/components/newsletter/newsletter.configuration.json';

/**
 * Static configuration map for all configs
 * This allows Next.js to properly bundle the configuration files
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LOCAL_CONFIG_MAP: Record<string, any> = {
  // Page configurations
  'landing.page': landingPageConfig,
  'login.page': loginPageConfig,
  'register.page': registerPageConfig,
  'dashboard.page': dashboardPageConfig,
  
  // Shared component configurations
  'header.route': headerConfig,
  'Header.Component.Route': headerConfig,
  'header': headerConfig,
  'Header': headerConfig,
  
  'footer.route': footerConfig,
  'Footer.Component.Route': footerConfig,
  'footer': footerConfig,
  'Footer': footerConfig,
  
  'button.route': buttonConfig,
  'Button.Component.Route': buttonConfig,
  'button': buttonConfig,
  'Button': buttonConfig,
  
  'card.route': cardConfig,
  'Card.Component.Route': cardConfig,
  'card': cardConfig,
  'Card': cardConfig,
  
  // App component configurations
  'hero.route': heroConfig,
  'Hero.Component.Route': heroConfig,
  'hero': heroConfig,
  
  'auth.route': authConfig,
  'Auth.Component.Route': authConfig,
  'auth': authConfig,
  
  'login.route': loginComponentConfig,
  'Login.Component.Route': loginComponentConfig,
  'login': loginComponentConfig,
  'Login': loginComponentConfig,
  
  'features.route': featuresConfig,
  'Features.Component.Route': featuresConfig,
  'features': featuresConfig,
  
  'how-it-works.route': howItWorksConfig,
  'HowItWorks.Component.Route': howItWorksConfig,
  'how-it-works': howItWorksConfig,
  
  'testimonials.route': testimonialsConfig,
  'Testimonials.Component.Route': testimonialsConfig,
  'testimonials': testimonialsConfig,
  
  'integrations.route': integrationsConfig,
  'Integrations.Component.Route': integrationsConfig,
  'integrations': integrationsConfig,
  
  'newsletter.route': newsletterConfig,
  'Newsletter.Component.Route': newsletterConfig,
  'newsletter': newsletterConfig,
};

/**
 * Default remote base URL for production config files
 * Replace with your actual GitHub repository raw URL
 */
const DEFAULT_REMOTE_BASE_URL = 'https://raw.githubusercontent.com/BestReadsOrg/bestreads-configs/main';

/**
 * Cache for loaded configurations to avoid redundant fetches
 */
const configCache = new Map<string, BaseComponentConfig | PageConfig>();

/**
 * Determines if the application is running in development mode
 */
const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Mapping of route IDs to their configuration file paths
 * Format: 'componentId.route' -> path to configuration file
 */
const CONFIG_ROUTES: Record<string, string> = {
  // Shared components
  'header.route': 'packages/shared/components/header/header',
  'footer.route': 'packages/shared/components/footer/footer',
  'button.route': 'packages/shared/components/button/button',
  'card.route': 'packages/shared/components/card/card',
  'input.route': 'packages/shared/components/input/input',
  
  // App components
  'hero.route': 'app/components/hero/hero',
  'auth.route': 'app/components/auth/auth',
  'features.route': 'app/components/features/features',
  'how-it-works.route': 'app/components/how-it-works/how-it-works',
  'testimonials.route': 'app/components/testimonials/testimonials',
  'integrations.route': 'app/components/integrations/integrations',
  'newsletter.route': 'app/components/newsletter/newsletter',
  'login.route': 'app/components/login-component/login',
  
  // Page configurations
  'landing.page': 'app/landing/landing',
  'login.page': 'app/login/login',
  'register.page': 'app/register/register',
  'dashboard.page': 'app/dashboard/dashboard',
};

/**
 * Resolves a route ID to its configuration file path
 * 
 * @param routeId - The route ID (e.g., 'header.route', 'landing.page')
 * @returns The resolved configuration path
 */
function resolveConfigPath(routeId: string): string {
  // Check if it's a predefined route
  if (CONFIG_ROUTES[routeId]) {
    return CONFIG_ROUTES[routeId];
  }
  
  // If not found, try to infer the path from the ID
  // Remove '.route' or '.page' suffix and convert to lowercase
  const baseName = routeId.replace(/\.(route|page)$/, '').toLowerCase();
  
  // Try common locations
  return baseName;
}

/**
 * Loads configuration from local file (development mode)
 * Uses dynamic import to load JSON configuration files
 * Supports both route IDs (e.g., 'header.route') and component names
 * 
 * @param identifier - The component identifier or route ID
 * @returns Promise resolving to the configuration object
 */
/**
 * Loads configuration from local file (development mode)
 * Uses static configuration map for proper Next.js bundling
 * 
 * @param identifier - The component identifier or route ID
 * @returns Promise resolving to the configuration object
 */
async function loadLocalConfig(identifier: string): Promise<BaseComponentConfig | PageConfig> {
  // Check if the configuration exists in our static map
  if (LOCAL_CONFIG_MAP[identifier]) {
    console.log(`✓ Successfully loaded config for: ${identifier}`);
    return LOCAL_CONFIG_MAP[identifier];
  }
  
  // If not found, throw detailed error
  const availableKeys = Object.keys(LOCAL_CONFIG_MAP);
  const errorMessage = `Configuration file not found for: ${identifier}\n\nAvailable configurations:\n${availableKeys.join('\n')}\n\nPlease ensure the configuration file exists and is imported in getConfig.ts`;
  console.error(errorMessage);
  throw new Error(`Configuration file not found for: ${identifier}. Check console for available configurations.`);
}

/**
 * Fetches configuration from remote URL (production mode)
 * 
 * @param identifier - The component identifier or route ID
 * @param remoteBaseUrl - Base URL for remote config repository
 * @returns Promise resolving to the configuration object
 */
async function loadRemoteConfig(
  identifier: string,
  remoteBaseUrl: string = DEFAULT_REMOTE_BASE_URL
): Promise<BaseComponentConfig | PageConfig> {
  try {
    const configPath = resolveConfigPath(identifier);
    const configUrl = `${remoteBaseUrl}/${configPath}.configuration.json`;
    
    const response = await fetch(configUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh config in production
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const config: BaseComponentConfig | PageConfig = await response.json();
    return config;
  } catch (error) {
    console.error(`Failed to fetch remote config for ${identifier}:`, error);
    throw new Error(`Failed to load remote configuration for: ${identifier}`);
  }
}

/**
 * Main configuration loader function
 * Automatically selects local or remote loading based on environment
 * Implements caching to avoid redundant loads
 * 
 * @param options - Configuration loader options or identifier string
 * @returns Promise resolving to the component/page configuration
 * 
 * @example
 * // Simple usage with component ID
 * const config = await getConfig('Login');
 * 
 * @example
 * // Using route ID
 * const config = await getConfig('header.route');
 * 
 * @example
 * // Loading page configuration
 * const pageConfig = await getConfig('landing.page');
 * 
 * @example
 * // Advanced usage with options
 * const config = await getConfig({
 *   componentId: 'header.route',
 *   environment: 'production',
 *   remoteBaseUrl: 'https://custom-url.com/configs'
 * });
 */
export async function getConfig(
  options: ConfigLoaderOptions | string
): Promise<BaseComponentConfig | PageConfig> {
  // Normalize options
  const normalizedOptions: ConfigLoaderOptions = 
    typeof options === 'string' 
      ? { componentId: options }
      : options;

  const { componentId, environment, remoteBaseUrl } = normalizedOptions;

  // Validate component ID
  if (!componentId || typeof componentId !== 'string') {
    throw new Error('Component ID must be a non-empty string');
  }

  // Check cache first
  const cacheKey = `${componentId}-${environment || 'auto'}`;
  if (configCache.has(cacheKey)) {
    return configCache.get(cacheKey)!;
  }

  // Determine environment
  const isDevEnvironment = environment === 'development' || 
    (environment === undefined && isDevelopment());

  // Load configuration based on environment
  let config: BaseComponentConfig | PageConfig;
  
  if (isDevEnvironment) {
    config = await loadLocalConfig(componentId);
  } else {
    config = await loadRemoteConfig(componentId, remoteBaseUrl);
  }

  // Ensure id or configId is set in config
  if ('id' in config && !config.id) {
    config.id = componentId;
  }

  // Cache the loaded config
  configCache.set(cacheKey, config);

  return config;
}

/**
 * Type guard to check if config is a PageConfig
 */
export function isPageConfig(config: BaseComponentConfig | PageConfig): config is PageConfig {
  return 'components' in config && Array.isArray(config.components);
}

/**
 * Type guard to check if config is a ComponentConfig
 */
export function isComponentConfig(config: BaseComponentConfig | PageConfig): config is BaseComponentConfig {
  return 'schema' in config && typeof config.schema === 'object';
}

/**
 * Clears the configuration cache
 * Useful for testing or forcing config reload
 */
export function clearConfigCache(): void {
  configCache.clear();
}

/**
 * Preloads multiple configurations in parallel
 * Useful for optimizing initial page load
 * 
 * @param componentIds - Array of component IDs to preload
 * @returns Promise resolving when all configs are loaded
 * 
 * @example
 * await preloadConfigs(['Login', 'Header', 'Footer']);
 */
export async function preloadConfigs(componentIds: string[]): Promise<void> {
  await Promise.all(
    componentIds.map(id => getConfig(id).catch(err => {
      console.warn(`Failed to preload config for ${id}:`, err);
    }))
  );
}

/**
 * Gets configuration for a specific component from a page configuration
 * 
 * @param pageConfig - The page configuration object
 * @param componentId - The component ID to find
 * @returns The component configuration or undefined if not found
 * 
 * @example
 * const pageConfig = await getConfig('landing.page');
 * const headerComponent = getComponentFromPage(pageConfig, 'header');
 */
export function getComponentFromPage(
  pageConfig: PageConfig,
  componentId: string
): PageComponentConfig | undefined {
  return pageConfig.components.find(comp => comp.id === componentId);
}

/**
 * Gets all visible components from a page configuration, sorted by order
 * 
 * @param pageConfig - The page configuration object
 * @returns Array of visible components sorted by order
 * 
 * @example
 * const pageConfig = await getConfig('landing.page');
 * const visibleComponents = getVisibleComponents(pageConfig);
 */
export function getVisibleComponents(pageConfig: PageConfig): PageComponentConfig[] {
  return pageConfig.components
    .filter(comp => comp.visible)
    .sort((a, b) => a.order - b.order);
}

