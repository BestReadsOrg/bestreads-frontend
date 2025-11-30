'use client';

import React, { useEffect, useState } from 'react';
import { PageConfig } from '@/types/config.types';
import { getConfig, isPageConfig } from '@/utils/getConfig';
import { PageRenderer } from '@/components/PageRenderer';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { ErrorDisplay } from '@/packages/shared/components/error/error.component';
import { ScrollToTop } from '@/packages/shared/components/scroll-to-top';
import { featureCards, testimonials } from '@/packages/shared/components/card';

interface LandingPageProps {
  pageId?: string;
}

export default function LandingPage({ pageId = 'landing.page' }: LandingPageProps) {
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPageConfig() {
      try {
        const config = await getConfig(pageId);
        console.log('Loaded page config:', config)
        
        if (isPageConfig(config)) {
          setPageConfig(config);
        } else {
          throw new Error('Invalid page configuration');
        }
      } catch (err) {
        console.error('Failed to load page configuration:', err);
        setError(err instanceof Error ? err.message : 'Failed to load page configuration');
      } finally {
        setLoading(false);
      }
    }

    loadPageConfig();
  }, [pageId]);

  if (loading) {
    return <LoadingSkeleton variant="page" message="Loading page..." />;
  }

  if (error || !pageConfig) {
    return (
      <ErrorDisplay 
        error={error || 'Failed to load page'} 
        onRetry={() => window.location.reload()}
        variant="page"
      />
    );
  }

  // Only pass dynamic data that can't come from configuration (user-specific or API data)
  // Components will read their static content from their respective configuration files
  const componentData = {
    'Features.Component.Route': { features: featureCards },
    'Testimonials.Component.Route': { testimonials },
  };

  return (
    <main className="min-h-screen bg-white">
      <PageRenderer 
        pageConfig={pageConfig} 
        componentData={componentData}
      />
      <ScrollToTop />
    </main>
  );
}
