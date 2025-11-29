'use client';

import React from 'react';
import { Section } from '@/packages/shared/components/layout';
import { Card, FeatureCardData } from '@/packages/shared/components/card';

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
  features: FeatureCardData[];
}

// TODO: take these from configuration
export const Features: React.FC<FeaturesProps> = ({ 
  title = 'Everything You Need to Master Your Reading',
  subtitle = 'Features',
  description = 'Track, discover, and analyze your reading journey with powerful tools designed for book lovers.',
  background = 'gray',
  features 
}) => {
  return (
    <Section
      id="features"
      subtitle={subtitle}
      title={title}
      description={description}
      background={background}
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
