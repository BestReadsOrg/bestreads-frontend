/**
 * Example: Using Configuration System
 * 
 * This file demonstrates how to use the configuration-driven architecture
 * to build dynamic pages and components.
 */

import { getConfig, isPageConfig, isComponentConfig, getVisibleComponents } from '@/utils/getConfig';
import { PageConfig, BaseComponentConfig } from '@/types/config.types';

// ============================================================================
// Example 1: Loading a Single Component Configuration
// ============================================================================

async function loadHeaderConfig() {
  // Load header configuration using route ID
  const config = await getConfig('header.route');
  
  // Type-safe access
  if (isComponentConfig(config)) {
    console.log('Component ID:', config.id);
    console.log('Config ID:', config.configId);
    console.log('Schema:', config.schema);
    console.log('Behavior:', config.behavior);
  }
  
  return config;
}

// Usage in component:
// const headerConfig = await loadHeaderConfig();
// <Header {...headerConfig} />


// ============================================================================
// Example 2: Loading a Page Configuration
// ============================================================================

async function loadLandingPageConfig(): Promise<PageConfig | null> {
  const config = await getConfig('landing.page');
  
  // Type-safe check
  if (isPageConfig(config)) {
    console.log('Page ID:', config.id);
    console.log('Config ID:', config.configId);
    console.log('Number of components:', config.components.length);
    
    // Get all visible components
    const visibleComponents = getVisibleComponents(config);
    console.log('Visible components:', visibleComponents.map(c => c.id));
    
    return config;
  }
  
  return null;
}

// Usage in page component:
// const pageConfig = await loadLandingPageConfig();
// <PageRenderer pageConfig={pageConfig} />


// ============================================================================
// Example 3: Dynamic Component Rendering Based on User Role
// ============================================================================

async function loadPageForUserRole(role: 'guest' | 'user' | 'admin') {
  const pageConfig = await getConfig('landing.page');
  
  if (!isPageConfig(pageConfig)) return null;
  
  // Modify visibility based on user role
  pageConfig.components.forEach(component => {
    // Hide auth components for logged-in users
    if (component.id === 'auth' && role !== 'guest') {
      component.visible = false;
    }
    
    // Show admin-only components
    if (component.id === 'admin-panel' && role === 'admin') {
      component.visible = true;
    }
  });
  
  return pageConfig;
}

// Usage:
// const userRole = getUserRole();
// const customizedPage = await loadPageForUserRole(userRole);
// <PageRenderer pageConfig={customizedPage} />


// ============================================================================
// Example 4: A/B Testing with Configuration
// ============================================================================

async function loadHeroVariant(variant: 'a' | 'b'): Promise<BaseComponentConfig | null> {
  const config = await getConfig('hero.route');
  
  // Type-safe check
  if (!isComponentConfig(config)) {
    return null;
  }
  
  // Modify configuration based on variant
  if (variant === 'b') {
    // Variant B: Different behavior settings
    if (config.behavior) {
      config.behavior.animateOnScroll = true;
      config.behavior.parallaxEffect = true;
    }
  }
  
  return config;
}

// Usage with A/B testing:
// const variant = getABTestVariant(); // Returns 'a' or 'b'
// const heroConfig = await loadHeroVariant(variant);
// <Hero config={heroConfig} {...heroData} />


// ============================================================================
// Example 5: Preloading Configurations for Performance
// ============================================================================

import { preloadConfigs } from '@/utils/getConfig';

async function preloadLandingPageConfigs() {
  // Preload all configs needed for landing page
  await preloadConfigs([
    'header.route',
    'hero.route',
    'features.route',
    'how-it-works.route',
    'testimonials.route',
    'integrations.route',
    'newsletter.route',
    'footer.route',
  ]);
  
  console.log('All landing page configs preloaded!');
}

// Usage in app initialization:
// useEffect(() => {
//   preloadLandingPageConfigs();
// }, []);


// ============================================================================
// Example 6: Building a Dynamic Page with Custom Data
// ============================================================================

interface ComponentDataMap {
  [componentId: string]: Record<string, unknown>;
}

async function buildDynamicPage(pageId: string, userData?: { name: string; email: string }) {
  // Load page configuration
  const pageConfig = await getConfig(`${pageId}.page`);
  
  if (!isPageConfig(pageConfig)) {
    throw new Error('Invalid page configuration');
  }
  
  // Prepare component data
  const componentData: ComponentDataMap = {};
  
  // Get visible components
  const visibleComponents = getVisibleComponents(pageConfig);
  
  // Load data for each component
  for (const component of visibleComponents) {
    switch (component.id) {
      case 'header':
        componentData.header = {
          title: 'BestReads',
          userData: userData ? {
            userId: '123',
            username: userData.name,
            email: userData.email,
            role: 'user',
            avatar: null,
          } : undefined,
        };
        break;
        
      case 'hero':
        componentData.hero = {
          headline: 'Welcome to BestReads!',
          subtext: 'Your personal reading companion',
          primaryButton: {
            label: 'Get Started',
            action: 'navigate-signup',
          },
        };
        break;
        
      case 'features':
        componentData.features = {
          features: [
            { title: 'Track Reading', description: 'Monitor your progress' },
            { title: 'Discover Books', description: 'Find your next read' },
            { title: 'Reading Analytics', description: 'Understand your habits' },
          ],
        };
        break;
    }
  }
  
  return {
    pageConfig,
    componentData,
  };
}

// Usage:
// const { pageConfig, componentData } = await buildDynamicPage('landing', currentUser);
// <PageRenderer pageConfig={pageConfig} componentData={componentData} />


// ============================================================================
// Example 7: Conditional Component Loading
// ============================================================================

import { getComponentFromPage } from '@/utils/getConfig';

async function customizeLandingPage(options: {
  hideNewsletter?: boolean;
  showTestimonials?: boolean;
  customHeroData?: Record<string, unknown>;
}) {
  const pageConfig = await getConfig('landing.page');
  
  if (!isPageConfig(pageConfig)) return null;
  
  // Hide newsletter if user is already subscribed
  if (options.hideNewsletter) {
    const newsletter = getComponentFromPage(pageConfig, 'newsletter');
    if (newsletter) newsletter.visible = false;
  }
  
  // Show testimonials based on flag
  if (options.showTestimonials !== undefined) {
    const testimonials = getComponentFromPage(pageConfig, 'testimonials');
    if (testimonials) testimonials.visible = options.showTestimonials;
  }
  
  // Add custom props to hero
  if (options.customHeroData) {
    const hero = getComponentFromPage(pageConfig, 'hero');
    if (hero) hero.props = { ...hero.props, ...options.customHeroData };
  }
  
  return pageConfig;
}

// Usage:
// const customPage = await customizeLandingPage({
//   hideNewsletter: userIsSubscribed,
//   showTestimonials: true,
//   customHeroData: { variant: 'premium' }
// });


// ============================================================================
// Example 8: Creating a New Component with Configuration
// ============================================================================

/**
 * Step 1: Create configuration file
 * File: src/app/components/pricing/pricing.configuration.json
 * 
 * {
 *   "id": "Pricing.Component.Route",
 *   "configId": "Pricing.Configuration.json",
 *   "schema": {
 *     "plans": {
 *       "type": "array",
 *       "required": true,
 *       "description": "Pricing plans"
 *     },
 *     "title": {
 *       "type": "string",
 *       "required": true,
 *       "description": "Section title"
 *     }
 *   },
 *   "behavior": {
 *     "showAnnualToggle": true,
 *     "highlightPopular": true
 *   }
 * }
 */

/**
 * Step 2: Create datasource file
 * File: src/app/components/pricing/pricing.datasource.ts
 */
export const defaultPricingData = {
  title: "Choose Your Plan",
  plans: [
    {
      name: "Free",
      price: 0,
      features: ["Track up to 50 books", "Basic analytics"],
      popular: false,
    },
    {
      name: "Pro",
      price: 9.99,
      features: ["Unlimited books", "Advanced analytics", "Priority support"],
      popular: true,
    },
    {
      name: "Team",
      price: 29.99,
      features: ["Everything in Pro", "Team collaboration", "Custom reports"],
      popular: false,
    },
  ],
};

/**
 * Step 3: Create component
 * File: src/app/components/pricing/pricing.component.tsx
 */
// import { defaultPricingData } from './pricing.datasource';
// 
// export function Pricing({ title, plans }: PricingProps) {
//   return (
//     <section className="py-20 bg-gray-50">
//       <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
//       <div className="grid md:grid-cols-3 gap-8">
//         {plans.map(plan => (
//           <PricingCard key={plan.name} {...plan} />
//         ))}
//       </div>
//     </section>
//   );
// }

/**
 * Step 4: Register in componentsRegistry.ts
 */
// import { Pricing } from '@/app/components/pricing';
// 
// export const componentsRegistry = {
//   'pricing': {
//     component: Pricing,
//     configPath: 'app/components/pricing/pricing.configuration.json',
//   },
// };

/**
 * Step 5: Add route in getConfig.ts
 */
// const CONFIG_ROUTES = {
//   'pricing.route': 'app/components/pricing/pricing',
// };

/**
 * Step 6: Use in page configuration
 */
// {
//   "id": "pricing",
//   "configId": "pricing.route",
//   "order": 4,
//   "visible": true,
//   "props": {}
// }


// ============================================================================
// Example 9: Environment-Specific Configuration
// ============================================================================

async function loadConfigForEnvironment(componentId: string) {
  const isDev = process.env.NODE_ENV === 'development';
  
  const config = await getConfig({
    componentId,
    environment: isDev ? 'development' : 'production',
    remoteBaseUrl: isDev 
      ? undefined // Use local files
      : 'https://cdn.bestreads.com/configs', // Use CDN in production
  });
  
  return config;
}


// ============================================================================
// Example 10: Full Page Implementation
// ============================================================================

/**
 * Complete example of a page using the configuration system
 * File: src/app/about/page.tsx
 */
/*
'use client';

import { useState, useEffect } from 'react';
import { PageConfig } from '@/types/config.types';
import { getConfig, isPageConfig } from '@/utils/getConfig';
import { PageRenderer } from '@/components/PageRenderer';

export default function AboutPage() {
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      try {
        const config = await getConfig('about.page');
        
        if (isPageConfig(config)) {
          setPageConfig(config);
        }
      } catch (error) {
        console.error('Failed to load page config:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pageConfig) {
    return <div>Failed to load page</div>;
  }

  const componentData = {
    header: { title: 'About Us' },
    footer: { copyrightText: '© 2024 BestReads' },
    // Add data for other components
  };

  return (
    <main>
      <PageRenderer 
        pageConfig={pageConfig} 
        componentData={componentData}
      />
    </main>
  );
}
*/

export {
  loadHeaderConfig,
  loadLandingPageConfig,
  loadPageForUserRole,
  loadHeroVariant,
  preloadLandingPageConfigs,
  buildDynamicPage,
  customizeLandingPage,
  loadConfigForEnvironment,
};
