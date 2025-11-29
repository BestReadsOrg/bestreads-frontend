'use client';

import React from 'react';
import { SectionProps } from './layout.types';
import { Container } from './container.component';

export const Section: React.FC<SectionProps> = ({
  id,
  title,
  subtitle,
  description,
  children,
  background = 'white',
  padding = 'xl',
  className = ''
}) => {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    dark: 'bg-gray-900 text-white'
  };

  const paddingClasses = {
    none: 'py-0',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20'
  };

  return (
    <section 
      id={id}
      className={`${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}
    >
      <Container>
        {(title || subtitle || description) && (
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
};
