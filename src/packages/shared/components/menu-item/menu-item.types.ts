export interface MenuItemProps {
  icon?: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  className?: string;
}

export interface MenuDividerProps {
  className?: string;
}
