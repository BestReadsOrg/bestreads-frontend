import React from 'react';
import { PageConfig } from '@/types/config.types';
import { getVisibleComponents } from '@/utils/getConfig';
import { componentsRegistry } from '@/registry/componentsRegistry';

interface PageRendererProps {
  pageConfig: PageConfig;
  componentData?: Record<string, unknown>;
}

/**
 * PageRenderer Component
 * 
 * Dynamically renders all components defined in a page configuration
 * Components are rendered in order based on their configuration
 * 
 * @example
 * const pageConfig = await getConfig('landing.page');
 * <PageRenderer pageConfig={pageConfig} />
 */
export const PageRenderer: React.FC<PageRendererProps> = ({ 
  pageConfig,
  componentData = {}
}) => {
  const visibleComponents = getVisibleComponents(pageConfig);

  return (
    <>
      {visibleComponents.map((componentConfig) => {
        // Get the component from registry
        const registryEntry = componentsRegistry[componentConfig.id];
        // console.log('Rendering component:', componentConfig.id, registryEntry);
        
        if (!registryEntry) {
          console.warn(`Component "${componentConfig.id}" not found in registry`);
          return null;
        }

        const Component = registryEntry.component;
        // console.log(`Rendering component "${componentConfig.id}" with config:`, componentConfig);

        
        // Merge props from config and passed data
        const componentProps = {
          ...componentConfig.props,
          ...(componentData[componentConfig.id] || {})
        };
        // TODO: Coming as {} - investigate
        // console.log('Rendering component with props:', componentProps);

        return (
          <Component
            key={componentConfig.id}
            {...componentProps}
          />
        );
      })}
    </>
  );
};

export default PageRenderer;
