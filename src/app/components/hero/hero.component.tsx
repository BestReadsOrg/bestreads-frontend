'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/packages/shared/components/layout';
import { Button } from '@/packages/shared/components/button';
import { getConfig } from '@/utils/getConfig';
import { HeroData } from './hero.types';

interface HeroConfig {
  data: HeroData;
}

export const Hero: React.FC<Partial<HeroData>> = (props) => {
  const router = useRouter();
  const [config, setConfig] = useState<HeroConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const loadedConfig = await getConfig('Hero.Component.Route') as unknown as HeroConfig;
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Failed to load hero configuration:', error);
      }
    }
    loadConfig();
  }, []);

  // Merge props with config data (props take precedence)
  const data = {
    headline: props.headline || config?.data?.headline || '',
    subtext: props.subtext || config?.data?.subtext || '',
    primaryButton: props.primaryButton || config?.data?.primaryButton,
    secondaryButton: props.secondaryButton || config?.data?.secondaryButton,
    image: props.image || config?.data?.image,
    backgroundGradient: props.backgroundGradient || config?.data?.backgroundGradient || 'from-blue-50 to-white'
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'navigate-signup':
        router.push('/register');
        break;
      case 'navigate-demo':
        router.push('/dashboard');
        break;
      case 'scroll-features':
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (!data.headline) {
    return null; // Don't render until config is loaded
  }

  return (
    <section className={`relative overflow-hidden bg-linear-to-br ${data.backgroundGradient}`}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px] py-20">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              {data.headline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
              {data.subtext}
            </p>
            <div className="flex flex-wrap gap-4">
              {data.primaryButton && (
                <Button
                  {...data.primaryButton}
                  onClick={handleButtonClick}
                />
              )}
              {data.secondaryButton && (
                <Button
                  {...data.secondaryButton}
                  onClick={handleButtonClick}
                />
              )}
            </div>
          </div>

          {data.image && (
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={data.image}
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
