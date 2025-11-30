'use client';

import React, { useEffect, useState } from 'react';
import { Section } from '@/packages/shared/components/layout';
import { getConfig } from '@/utils/getConfig';
import { IntegrationsConfig } from './integrations.types';


export const Integrations: React.FC = () => {
  const [config, setConfig] = useState<IntegrationsConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const loadedConfig = await getConfig('Integrations.Component.Route') as unknown as IntegrationsConfig;
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Failed to load integrations configuration:', error);
      }
    }
    loadConfig();
  }, []);

  const componentTitle = config?.data?.title || 'Connect with Your Favorite Platforms';
  const componentSubtitle = config?.data?.subtitle || 'Integrations';
  const componentDescription = config?.data?.description || 'Seamlessly integrate with popular reading platforms and import your existing library.';
  const componentBackground = config?.data?.background || 'white';
  const componentIntegrations = config?.data?.integrations || [];

  return (
    <Section
      id="integrations"
      subtitle={componentSubtitle}
      title={componentTitle}
      description={componentDescription}
      background={componentBackground}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {componentIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="flex flex-col items-center text-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="text-4xl mb-3">{integration.icon}</div>
            <h4 className="font-bold text-gray-900 mb-2">{integration.name}</h4>
            <p className="text-sm text-gray-600">{integration.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
