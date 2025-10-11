import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PlatformHeader from './PlatformHeader'
import PlatformSidebar from './PlatformSidebar'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface PlatformLayoutProps {
  children: React.ReactNode
  user: User
  onLogout: () => void
  className?: string
}

export default function PlatformLayout({
  children,
  user,
  onLogout,
  className = ''
}: PlatformLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
  }

  const handleSettingsClick = () => {
    console.log('Settings clicked')
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className={`min-h-screen bg-background-primary ${className}`}>
      <PlatformHeader
        user={user}
        onMenuToggle={handleMenuToggle}
        onNotificationClick={() => {}}
        onSettingsClick={() => {}}
        onProfileClick={() => {}}
        onLogout={onLogout}
      />

      <div className="flex">
        
        <PlatformSidebar
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
        />

        <main className="flex-1 lg:ml-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
