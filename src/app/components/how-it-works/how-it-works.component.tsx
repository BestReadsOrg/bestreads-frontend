'use client';

import React from 'react';
import { Section } from '@/packages/shared/components/layout';

interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
}

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  description?: string;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
  steps?: Step[];
}

// TODO: take these from configuration
const defaultSteps: Step[] = [
  {
    id: 'step-1',
    number: 1,
    title: 'Add Your Books',
    description: 'Search our vast database or manually add books to your personal library.',
    icon: '📚'
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Track Your Reading',
    description: 'Log your progress, update page numbers, and mark books as complete.',
    icon: '📖'
  },
  {
    id: 'step-3',
    number: 3,
    title: 'Gain Insights & Set Goals',
    description: 'View analytics, set reading goals, and track your achievements.',
    icon: '🎯'
  },
  {
    id: 'step-4',
    number: 4,
    title: 'Share Your Progress',
    description: 'Connect with friends, share reviews, and discover new recommendations.',
    icon: '🤝'
  }
];

// TODO: take these from configuration
export const HowItWorks: React.FC<HowItWorksProps> = ({
  title = 'Start Your Reading Journey in 4 Simple Steps',
  subtitle = 'How It Works',
  description = 'Get up and running in minutes with our intuitive platform.',
  background = 'white',
  steps = defaultSteps
}) => {
  return (
    <Section
      id="how-it-works"
      subtitle={subtitle}
      title={title}
      description={description}
      background={background}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {steps.map((step) => (
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
            {step.number < steps.length && (
              <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-full h-0.5 bg-linear-to-r from-blue-300 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};
