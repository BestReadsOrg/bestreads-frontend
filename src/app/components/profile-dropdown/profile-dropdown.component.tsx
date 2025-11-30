'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ProfileDropdownProps, DropdownMenuItem } from './profile-dropdown.types';
import { MenuItem, MenuDivider } from '@/packages/shared/components/menu-item';
import { getInitials } from '@/utils/userUtils';
import profileConfig from './profile-dropdown.configuration.json';

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  onNavigate,
  onLogout,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menu items from configuration
  const menuItems = profileConfig.menuItems as DropdownMenuItem[];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (item: DropdownMenuItem) => {
    if (item.action === 'navigate' && item.path) {
      onNavigate(item.path);
    } else if (item.action === 'logout') {
      onLogout();
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Profile Button */}
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.username}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(user.username)}
          </div>
        )}
        
        {/* Dropdown indicator */}
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.username}
            </p>
            {user.email && (
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => {
              if (item.divider) {
                return <MenuDivider key={item.id} />;
              }

              return (
                <MenuItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => handleMenuItemClick(item)}
                  variant={item.action === 'logout' ? 'danger' : 'default'}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
