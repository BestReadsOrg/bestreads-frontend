import { ButtonAction } from '@/packages/shared/components/button/button.types';

export interface HeroData {
  headline: string;
  subtext: string;
  primaryButton: ButtonAction;
  secondaryButton: ButtonAction;
  image?: string;
  backgroundGradient?: string;
}
