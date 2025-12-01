/**
 * StatCard Component Types
 */

export interface StatCardProps {
  label: string;
  value: number | string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
}
