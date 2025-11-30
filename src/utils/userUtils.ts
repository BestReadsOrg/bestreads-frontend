/**
 * Utility functions for user-related operations
 */

/**
 * Get user initials from username
 * @param username - User's full name or username
 * @returns Initials (max 2 characters, uppercase)
 * 
 * @example
 * getInitials('John Doe') // Returns 'JD'
 * getInitials('Alice') // Returns 'AL'
 * getInitials('Bob Smith Jr.') // Returns 'BS'
 */
export const getInitials = (username: string): string => {
  if (!username) return '';
  
  return username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Format user display name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Formatted full name
 */
export const formatUserName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return 'User';
  if (!lastName) return firstName || 'User';
  if (!firstName) return lastName;
  return `${firstName} ${lastName}`;
};

/**
 * Get user avatar color based on username
 * Generates consistent colors for the same username
 * @param username - User's username
 * @returns Tailwind gradient classes
 */
export const getUserAvatarColor = (username: string): string => {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-pink-500 to-rose-600',
    'from-orange-500 to-red-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600',
  ];
  
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
