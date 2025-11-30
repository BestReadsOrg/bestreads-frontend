/**
 * Component Registry
 * Central registry mapping component IDs to their React component implementations
 */

import React from 'react';
import { ComponentRegistryEntry } from '@/types/config.types';

// Import shared components
import { Header } from '@/packages/shared/components/header';
import { Footer } from '@/packages/shared/components/footer';

// Import app components
import { Hero } from '@/app/components/hero';
import { Features } from '@/app/components/features';
import { HowItWorks } from '@/app/components/how-it-works';
import { Testimonials } from '@/app/components/testimonials';
import { Integrations } from '@/app/components/integrations';
import { Newsletter } from '@/app/components/newsletter';
import AuthForm from '@/app/auth';

/**
 * Registry mapping component IDs to component implementations
 * Add new components here as they are created
 * 
 * Note: Component IDs should match those used in page configuration files
 */
export const componentsRegistry: Record<string, ComponentRegistryEntry> = {
  // Shared Components
  'Header.Component.Route': {
    component: Header,
    configPath: 'packages/shared/components/header/header.configuration.json',
  },
  'Footer.Component.Route': {
    component: Footer,
    configPath: 'packages/shared/components/footer/footer.configuration.json',
  },
  
  // App Components
  'Hero.Component.Route': {
    component: Hero,
    configPath: 'app/components/hero/hero.configuration.json',
  },
  'Features.Component.Route': {
    component: Features,
    configPath: 'app/components/features/features.configuration.json',
  },
  'HowItWorks.Component.Route': {
    component: HowItWorks,
    configPath: 'app/components/how-it-works/how-it-works.configuration.json',
  },
  'Testimonials.Component.Route': {
    component: Testimonials,
    configPath: 'app/components/testimonials/testimonials.configuration.json',
  },
  'Integrations.Component.Route': {
    component: Integrations,
    configPath: 'app/components/integrations/integrations.configuration.json',
  },
  'Newsletter.Component.Route': {
    component: Newsletter,
    configPath: 'app/components/newsletter/newsletter.configuration.json',
  },
  
  // Auth Components
  'Auth.Component.Route': {
    component: AuthForm,
    configPath: 'app/auth/auth.configuration.json',
  },
};

/**
 * Retrieves a component from the registry
 * 
 * @param componentId - The unique identifier for the component
 * @returns The component entry or undefined if not found
 * 
 * @example
 * const entry = getComponent('Login');
 * if (entry) {
 *   const Component = entry.component;
 * }
 */
export function getComponent(componentId: string): ComponentRegistryEntry | undefined {
  return componentsRegistry[componentId];
}

/**
 * Checks if a component exists in the registry
 * 
 * @param componentId - The unique identifier for the component
 * @returns True if the component exists, false otherwise
 */
export function hasComponent(componentId: string): boolean {
  return componentId in componentsRegistry;
}

/**
 * Registers a new component dynamically
 * Useful for lazy-loaded or plugin components
 * 
 * @param componentId - The unique identifier for the component
 * @param entry - The component registry entry
 * 
 * @example
 * registerComponent('CustomWidget', {
 *   component: CustomWidget,
 *   configPath: 'app/components/custom-widget/custom-widget.configuration.json'
 * });
 */
export function registerComponent(
  componentId: string,
  entry: ComponentRegistryEntry
): void {
  if (hasComponent(componentId)) {
    console.warn(`Component ${componentId} is already registered. Overwriting...`);
  }
  componentsRegistry[componentId] = entry;
}

/**
 * Gets all registered component IDs
 * 
 * @returns Array of all registered component IDs
 */
export function getAllComponentIds(): string[] {
  return Object.keys(componentsRegistry);
}

/**
 * Type guard to check if a value is a valid React component
 */
export function isValidComponent(component: unknown): component is React.ComponentType {
  return typeof component === 'function' || typeof component === 'object';
}
