'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Building, 
  Phone, 
  Globe, 
  Settings,
  Save,
  Camera,
  AlertCircle,
  CheckCircle,
  Users,
  Shield
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company?: string;
  job_title?: string;
  phone?: string;
  timezone: string;
  locale: string;
  preferences: {
    email_notifications: boolean;
    marketing_emails: boolean;
    theme: string;
    language: string;
  };
  onboarding_completed: boolean;
  roles?: Array<{
    role_name: string;
    granted_at: string;
  }>;
  organizations?: Array<{
    organizations: {
      name: string;
      slug: string;
      plan: string;
    };
    role: string;
  }>;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users/profile');
      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (err: any) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: Partial<UserProfile>) => {
    try {
      setIsSaving(true);
      setError('');
      setMessage('');

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (profile) {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  const handlePreferencesChange = (key: string, value: any) => {
    if (profile) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          [key]: value
        }
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
          >
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">{message}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
          >
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'profile', name: 'Profile', icon: User },
              { id: 'preferences', name: 'Preferences', icon: Settings },
              { id: 'organizations', name: 'Organizations', icon: Users },
              { id: 'security', name: 'Security', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profile' && (
            <ProfileTab 
              profile={profile} 
              onChange={handleInputChange}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'preferences' && (
            <PreferencesTab
              profile={profile}
              onChange={handlePreferencesChange}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'organizations' && (
            <OrganizationsTab profile={profile} />
          )}

          {activeTab === 'security' && (
            <SecurityTab profile={profile} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Profile Tab Component
const ProfileTab = ({ profile, onChange, onSave, isSaving }: any) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      full_name: profile?.full_name,
      company: profile?.company,
      job_title: profile?.job_title,
      phone: profile?.phone,
      timezone: profile?.timezone,
      locale: profile?.locale
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile?.full_name || ''}
              onChange={(e) => onChange('full_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              value={profile?.company || ''}
              onChange={(e) => onChange('company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={profile?.job_title || ''}
              onChange={(e) => onChange('job_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profile?.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={profile?.timezone || 'UTC'}
              onChange={(e) => onChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

// Preferences Tab Component  
const PreferencesTab = ({ profile, onChange, onSave, isSaving }: any) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      preferences: profile?.preferences
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive notifications about account activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile?.preferences?.email_notifications || false}
                onChange={(e) => onChange('email_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Marketing Emails</h4>
              <p className="text-sm text-gray-500">Receive updates about new features and tips</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile?.preferences?.marketing_emails || false}
                onChange={(e) => onChange('marketing_emails', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mt-8 mb-6">Display Preferences</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={profile?.preferences?.theme || 'system'}
              onChange={(e) => onChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={profile?.preferences?.language || 'en'}
              onChange={(e) => onChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </form>
  );
};

// Organizations Tab Component
const OrganizationsTab = ({ profile }: any) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Organizations</h3>
      
      {profile?.organizations && profile.organizations.length > 0 ? (
        <div className="space-y-4">
          {profile.organizations.map((org: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {org.organizations.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Role: {org.role} • Plan: {org.organizations.plan}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {org.role}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {org.organizations.plan}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">You're not a member of any organizations yet.</p>
        </div>
      )}
    </div>
  );
};

// Security Tab Component
const SecurityTab = ({ profile }: any) => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Account Security</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-500">Last updated via Google OAuth</p>
            </div>
            <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              Manage via Google
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Managed by Google Account</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>

          {profile?.roles && profile.roles.length > 0 && (
            <div className="py-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Account Roles</h4>
              <div className="space-y-2">
                {profile.roles.map((role: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{role.role_name}</span>
                    <span className="text-xs text-gray-500">
                      Since {new Date(role.granted_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 mb-4">
          These actions cannot be undone. Please be careful.
        </p>
        <button className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Deactivate Account
        </button>
      </div>
    </div>
  );
};