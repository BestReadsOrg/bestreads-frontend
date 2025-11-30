'use client';

import React, { useEffect, useState } from 'react';
import { Section } from '@/packages/shared/components/layout';
import { getConfig } from '@/utils/getConfig';
import { Step, HowItWorksConfig } from './how-it-works.types';

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  description?: string;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
  steps?: Step[];
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  title,
  subtitle,
  description,
  background,
  steps
}) => {
  const [config, setConfig] = useState<HowItWorksConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const loadedConfig = await getConfig('HowItWorks.Component.Route') as unknown as HowItWorksConfig;
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Failed to load how-it-works configuration:', error);
      }
    }
    loadConfig();
  }, []);

  const componentTitle = title || config?.data?.title || 'Start Your Reading Journey in 4 Simple Steps';
  const componentSubtitle = subtitle || config?.data?.subtitle || 'How It Works';
  const componentDescription = description || config?.data?.description || 'Get up and running in minutes with our intuitive platform.';
  const componentBackground = background || config?.data?.background || 'white';
  const componentSteps = steps || config?.data?.steps || [];

  return (
    <Section
      id="how-it-works"
      subtitle={componentSubtitle}
      title={componentTitle}
      description={componentDescription}
      background={componentBackground}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {componentSteps.map((step) => (
          <div key={step.id} className="relative">
            {/* Step number */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-600 text-white text-2xl font-bold rounded-full shadow-lg">
              {step.number}
            </div>
            
            {/* Icon */}
            <div className="text-5xl text-center mb-4">{step.icon}</div>
            
            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
              {step.title}
            </h3>
            <p className="text-gray-600 text-center">
              {step.description}
            </p>

            {/* Connector line (except last item) */}
            {step.number < componentSteps.length && (
              <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-full h-0.5 bg-linear-to-r from-blue-300 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};
