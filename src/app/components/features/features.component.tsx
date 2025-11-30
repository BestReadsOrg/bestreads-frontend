'use client';

import React, { useEffect, useState } from 'react';
import { Section } from '@/packages/shared/components/layout';
import { Card, FeatureCardData } from '@/packages/shared/components/card';
import { getConfig } from '@/utils/getConfig';
import { FeaturesConfig } from './features.types';

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
  features?: FeatureCardData[];
}

export const Features: React.FC<FeaturesProps> = ({ 
  title,
  subtitle,
  description,
  background,
  features = [] // Default to empty array to prevent undefined errors
}) => {
  const [config, setConfig] = useState<FeaturesConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const loadedConfig = await getConfig('Features.Component.Route') as unknown as FeaturesConfig;
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Failed to load features configuration:', error);
      }
    }
    loadConfig();
  }, []);

  const componentTitle = title || config?.data?.title || 'Everything You Need to Master Your Reading';
  const componentSubtitle = subtitle || config?.data?.subtitle || 'Features';
  const componentDescription = description || config?.data?.description || 'Track, discover, and analyze your reading journey with powerful tools designed for book lovers.';
  const componentBackground = background || config?.data?.background || 'gray';

  // Don't render if no features available
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <Section
      id="features"
      subtitle={componentSubtitle}
      title={componentTitle}
      description={componentDescription}
      background={componentBackground}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => (
          <Card
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            variant={feature.variant || 'elevated'}
            hoverable={feature.hoverable || true}
          />
        ))}
      </div>
    </Section>
  );
};
