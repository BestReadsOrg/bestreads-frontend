'use client';

import React from 'react';
import { ContainerProps } from './layout.types';

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = 'md',
  centered = true,
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: 'px-0',
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8'
  };

  const centeredClass = centered ? 'mx-auto' : '';

  return (
    <div className={`${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${centeredClass} ${className}`}>
      {children}
    </div>
  );
};
