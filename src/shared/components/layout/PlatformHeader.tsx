import React from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Search,
  Home,
  BarChart3,
  Target,
  Users,
  FileText,
  Zap
} from 'lucide-react'

interface PlatformHeaderProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onMenuToggle: () => void
  onNotificationClick: () => void
  onSettingsClick: () => void
  onProfileClick: () => void
  onLogout: () => void
  className?: string
}

export default function PlatformHeader({
  user,
  onMenuToggle,
  onNotificationClick,
  onSettingsClick,
  onProfileClick,
  onLogout,
  className = ''
}: PlatformHeaderProps) {
  return (
    <header className={`bg-background-primary border-b border-border-standard px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
            title="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Revenue Intelligence</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
            title="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  H&S Platform
                </h1>
                <p className="text-xs text-text-muted">
                  Revenue Intelligence
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          <button
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-danger rounded-full text-xs"></span>
          </button>

          <button
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {user && (
            <div className="flex items-center gap-3 pl-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-text-primary">
                    {user.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={onLogout}
                  className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
