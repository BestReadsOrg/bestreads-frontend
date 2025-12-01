'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import settingsService, { UserSettings, UpdateSettingsRequest } from '@/services/settingsService';
import { HeaderV2 } from '@/packages/shared/components/headerv2';

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profileImage: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          bio: data.bio || '',
          profileImage: data.profileImage || '',
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setMessage({ type: 'error', text: 'Failed to load settings' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updateData: UpdateSettingsRequest = {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        bio: formData.bio || undefined,
        profileImage: formData.profileImage || undefined,
      };

      const response = await settingsService.updateSettings(updateData);
      setSettings(response.data);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <HeaderV2 
          title="BestReads"
          userData={user ? {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: 'user',
            avatar: null,
          } : undefined} 
        />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-gray-600 dark:text-gray-400">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderV2 
        title="BestReads"
        userData={user ? {
          userId: user.id,
          username: user.username,
          email: user.email,
          role: 'user',
          avatar: null,
        } : undefined} 
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mx-6 mt-4 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Account Information (Read-only) */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={settings?.username || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Username cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                    {settings?.emailVerified && (
                      <span className="ml-2 text-green-600 dark:text-green-400">✓ Verified</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={settings?.createdAt ? new Date(settings.createdAt).toLocaleDateString() : ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Profile Information (Editable) */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    id="profileImage"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
