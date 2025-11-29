'use client';

import React from 'react';
import Image from 'next/image';
import { CardProps } from './card.types';

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  image,
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className = ''
}) => {
  const baseClass = 'rounded-xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white',
    bordered: 'bg-white border-2 border-gray-200',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    flat: 'bg-gray-50'
  };
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantClass = variantClasses[variant] || variantClasses.default;
  const paddingClass = paddingClasses[padding] || paddingClasses.md;
  const hoverClass = hoverable ? 'hover:scale-105 hover:shadow-xl cursor-pointer' : '';
  const clickableClass = clickable ? 'cursor-pointer active:scale-95' : '';

  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`${baseClass} ${variantClass} ${paddingClass} ${hoverClass} ${clickableClass} ${className}`}
    >
      {image && (
        <div className="mb-4 overflow-hidden rounded-lg relative h-48">
          <Image 
            src={image} 
            alt={title || 'Card image'} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      {icon && (
        <div className="text-4xl mb-4">{icon}</div>
      )}
      
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};
