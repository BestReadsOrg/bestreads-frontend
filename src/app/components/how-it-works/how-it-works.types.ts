export interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface HowItWorksConfig {
  data: {
    title: string;
    subtitle: string;
    description: string;
    background: 'white' | 'gray' | 'gradient' | 'dark';
    steps: Step[];
  };
}