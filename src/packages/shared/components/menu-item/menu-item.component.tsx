import React from 'react';

export interface MenuItemProps {
  icon?: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  className?: string;
}

/**
 * Reusable Menu Item Component for Dropdowns
 * 
 * @example
 * <MenuItem
 *   icon="👤"
 *   label="Profile"
 *   onClick={() => navigate('/profile')}
 * />
 * 
 * @example
 * <MenuItem
 *   icon="🚪"
 *   label="Logout"
 *   onClick={handleLogout}
 *   variant="danger"
 * />
 */
export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onClick,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    danger: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2 text-sm text-left transition-colors ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="mr-3 text-base">{icon}</span>}
      <span className="flex-1">{label}</span>
    </button>
  );
};

export interface MenuDividerProps {
  className?: string;
}

/**
 * Menu Divider Component
 * 
 * @example
 * <MenuDivider />
 */
export const MenuDivider: React.FC<MenuDividerProps> = ({ className = '' }) => {
  return <div className={`my-1 border-t border-gray-200 dark:border-gray-700 ${className}`} />;
};

export default MenuItem;
