'use client';

import React from 'react';
import { Section } from '@/packages/shared/components/layout';

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const integrations: Integration[] = [
  {
    id: 'goodreads',
    name: 'Goodreads',
    icon: '📚',
    description: 'Import your Goodreads library seamlessly'
  },
  {
    id: 'kindle',
    name: 'Kindle',
    icon: '📱',
    description: 'Sync your Kindle highlights and notes'
  },
  {
    id: 'pdf',
    name: 'PDF Files',
    icon: '📄',
    description: 'Upload and track PDF documents'
  },
  {
    id: 'epub',
    name: 'EPUB Files',
    icon: '📖',
    description: 'Support for EPUB format books'
  },
  {
    id: 'openlibrary',
    name: 'Open Library',
    icon: '🌐',
    description: 'Access millions of book records'
  },
  {
    id: 'googlebooks',
    name: 'Google Books',
    icon: '🔍',
    description: 'Search and import from Google Books'
  }
];

export const Integrations: React.FC = () => {
  return (
    <Section
      id="integrations"
      subtitle="Integrations"
      title="Connect with Your Favorite Platforms"
      description="Seamlessly integrate with popular reading platforms and import your existing library."
      background="white"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {integrations.map((integration) => (
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
