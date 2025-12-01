export interface ProfileDropdownProps {
  user: {
    username: string;
    email?: string;
    avatar?: string;
  };
  onNavigate: (path: string) => void;
  onLogout: () => void;
  className?: string;
}

export interface DropdownMenuItem {
  id: string;
  label?: string;
  icon?: string;
  action?: 'navigate' | 'logout';
  type: 'route' | 'action' | 'divider';
  target?: string;
  variant?: 'default' | 'danger';
  visible?: boolean;
  // Legacy support
  path?: string;
  divider?: boolean;
}
