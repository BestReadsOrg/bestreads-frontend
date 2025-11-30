export interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface IntegrationsConfig {
  data: {
    title: string;
    subtitle: string;
    description: string;
    background: 'white' | 'gray' | 'gradient' | 'dark';
    integrations: Integration[];
  };
}