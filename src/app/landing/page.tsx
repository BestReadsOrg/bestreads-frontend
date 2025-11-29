'use client';

import React, { useEffect, useState } from 'react';
import { PageConfig } from '@/types/config.types';
import { getConfig, isPageConfig } from '@/utils/getConfig';
import { PageRenderer } from '@/components/PageRenderer';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import { ErrorDisplay } from '@/packages/shared/components/error/error.component';
import { headerData } from '@/packages/shared/components/header';
import { footerData } from '@/packages/shared/components/footer';
import { heroData } from '@/app/components/hero';
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

  // Component data mapping - in production, this would come from API/CMS
  // TODO: remove datasource and mockData for which only configuration is enough (no user/statistics related data)
  const componentData = {
    header: headerData,
    hero: heroData,
    features: { features: featureCards },
    testimonials: { testimonials },
    footer: footerData,
  };

  return (
    <main className="min-h-screen bg-white">
      <PageRenderer 
        pageConfig={pageConfig} 
        componentData={componentData}
      />
    </main>
  );
}
