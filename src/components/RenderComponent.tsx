/**
 * RenderComponent
 * Dynamic component renderer that loads configuration and renders components from registry
 */

'use client';

import React, { useEffect, useState } from 'react';
import { BaseComponentConfig, RenderComponentProps } from '@/types/config.types';
import { getConfig } from '@/utils/getConfig';
import { getComponent } from '@/registry/componentsRegistry';

/**
 * Error display component for failed component renders
 */
function ComponentError({ 
  componentId, 
  error 
}: { 
  componentId: string; 
  error: string;
}) {
  return (
    <div className="border border-red-300 bg-red-50 p-4 rounded-md">
      <h3 className="text-red-800 font-semibold">Component Error: {componentId}</h3>
      <p className="text-red-600 text-sm mt-1">{error}</p>
    </div>
  );
}

/**
 * Loading component displayed while configuration is being fetched
 */
function ComponentLoading({ componentId }: { componentId: string }) {
  return (
    <div className="animate-pulse bg-gray-100 p-4 rounded-md">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <p className="text-gray-500 text-xs mt-2">Loading {componentId}...</p>
    </div>
  );
}

/**
 * RenderComponent
 * 
 * A dynamic component renderer that:
 * 1. Loads configuration for the specified component ID
 * 2. Retrieves the component from the registry
 * 3. Renders the component with merged config and props
 * 
 * @param props - RenderComponentProps containing id, props, and optional fallback
 * @returns Rendered component or error/loading state
 * 
 * @example
 * // Basic usage
 * <RenderComponent id="Login" />
 * 
 * @example
 * // With additional props
 * <RenderComponent 
 *   id="Login" 
 *   props={{ user: currentUser, onSuccess: handleSuccess }} 
 * />
 * 
 * @example
 * // With custom fallback
 * <RenderComponent 
 *   id="Login" 
 *   fallback={<CustomLoader />}
 * />
 */
export function RenderComponent({ 
  id, 
  props = {}, 
  fallback 
}: RenderComponentProps): React.ReactElement {
  const [config, setConfig] = useState<BaseComponentConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load configuration on mount or when id changes
  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        setLoading(true);
        setError(null);

        // Validate component ID
        if (!id || typeof id !== 'string') {
          throw new Error('Component ID must be a non-empty string');
        }

        // Load configuration
        const loadedConfig = await getConfig(id);
        
        if (isMounted) {
          setConfig(loadedConfig);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          setError(errorMessage);
          setLoading(false);
        }
      }
    }

    loadConfig();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Show loading state
  if (loading) {
    return fallback ? <>{fallback}</> : <ComponentLoading componentId={id} />;
  }

  // Show error state
  if (error || !config) {
    return <ComponentError componentId={id} error={error || 'Configuration not found'} />;
  }

  // Get component from registry
  const componentEntry = getComponent(id);
  
  if (!componentEntry) {
    return (
      <ComponentError 
        componentId={id} 
        error={`Component not found in registry. Available components: ${Object.keys(getComponent).join(', ')}`}
      />
    );
  }

  const Component = componentEntry.component;

  // Merge configuration with additional props
  const mergedProps = {
    ...config,
    ...props,
  };

  // Render the component
  return <Component {...mergedProps} />;
}

/**
 * Higher-order component version for class components or advanced usage
 * 
 * @param componentId - The component ID to render
 * @param additionalProps - Additional props to pass to the component
 * @returns A function that returns the rendered component
 * 
 * @example
 * const LoginWithConfig = withConfig('Login', { theme: 'dark' });
 * <LoginWithConfig user={currentUser} />
 */
export function withConfig(
  componentId: string,
  additionalProps: Record<string, unknown> = {}
) {
  return function WrappedComponent(props: Record<string, unknown>) {
    return (
      <RenderComponent 
        id={componentId} 
        props={{ ...additionalProps, ...props }} 
      />
    );
  };
}

/**
 * Batch render multiple components
 * Useful for rendering a list of dynamic components
 * 
 * @param componentIds - Array of component IDs to render
 * @param propsMap - Optional map of component IDs to their props
 * @returns Array of rendered components
 * 
 * @example
 * <div>
 *   {renderComponents(['Header', 'Login', 'Footer'], {
 *     Login: { user: currentUser }
 *   })}
 * </div>
 */
export function renderComponents(
  componentIds: string[],
  propsMap: Record<string, Record<string, unknown>> = {}
): React.ReactElement[] {
  return componentIds.map((id, index) => (
    <RenderComponent 
      key={`${id}-${index}`} 
      id={id} 
      props={propsMap[id] || {}} 
    />
  ));
}
