/**
 * Base types for the configuration-driven UI system
 */

/**
 * Represents an action button in the UI
 */
export interface ActionConfig {
  label: string;
  action: string;
  visible: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: string;
}

/**
 * Schema field definition
 */
export interface SchemaField {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  default?: unknown;
  enum?: string[];
  itemSchema?: Record<string, Omit<SchemaField, 'itemSchema'>>;
  properties?: Record<string, string>;
}

/**
 * Component schema definition
 */
export interface ComponentSchema {
  [key: string]: SchemaField;
}

/**
 * Component behavior configuration
 */
export interface BehaviorConfig {
  [key: string]: boolean | string | number;
}

/**
 * Component styling configuration
 */
export interface StylingConfig {
  [key: string]: string;
}

/**
 * Base configuration interface that all component configs extend
 * Configuration contains STRUCTURE, not DATA
 */
export interface BaseComponentConfig {
  id: string;
  configId: string;
  schema: ComponentSchema;
  behavior?: BehaviorConfig;
  [key: string]: unknown; // Allow additional custom properties
}

/**
 * Environment types for determining config source
 */
export type Environment = 'development' | 'production';

/**
 * Configuration loader options
 */
export interface ConfigLoaderOptions {
  componentId: string;
  environment?: Environment;
  remoteBaseUrl?: string;
}

/**
 * Component registry entry
 */
export interface ComponentRegistryEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  configPath?: string;
}

/**
 * Props for RenderComponent
 */
export interface RenderComponentProps {
  id: string;
  props?: Record<string, unknown>;
  fallback?: React.ReactNode;
}

/**
 * Page component configuration
 */
export interface PageComponentConfig {
  id: string;
  configId: string;
  order: number;
  visible: boolean;
  props?: Record<string, unknown>;
}

/**
 * Page configuration
 */
export interface PageConfig {
  id: string;
  configId: string;
  title: string;
  description: string;
  components: PageComponentConfig[];
  meta?: {
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    requiresAuth?: boolean;
    redirectIfAuthenticated?: string;
    redirectIfNotAuthenticated?: string;
  };
}
