'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '@/packages/shared/components/layout';
import { Button } from '@/packages/shared/components/button';
import { HeroData } from './hero.types';

export const Hero: React.FC<HeroData> = ({
  headline,
  subtext,
  primaryButton,
  secondaryButton,
  image,
  backgroundGradient
}) => {
  const handleButtonClick = (action: string) => {
    console.log('Hero action:', action);
    // Handle navigation based on action
    switch (action) {
      case 'navigate-signup':
        window.location.href = '/register';
        break;
      case 'navigate-demo':
        window.location.href = '/dashboard';
        break;
      case 'scroll-features':
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <section className={`relative overflow-hidden bg-linear-to-br ${backgroundGradient || 'from-blue-50 to-white'}`}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px] py-20">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              {headline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
              {subtext}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                {...primaryButton}
                onClick={handleButtonClick}
              />
              {secondaryButton && (
                <Button
                  {...secondaryButton}
                  onClick={handleButtonClick}
                />
              )}
            </div>
          </div>

          {image && (
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt="BestReads Dashboard"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
