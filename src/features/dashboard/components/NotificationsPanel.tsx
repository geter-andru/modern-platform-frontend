

'use client'

import React from 'react'
import { 
  BellIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: 'level_up' | 'tool_unlock' | 'milestone_achieved' | 'progress_update'
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface NotificationsPanelProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

function NotificationItem({ notification, onDismiss }: { notification: Notification, onDismiss: (id: string) => void }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'level_up':
        return <TrophyIcon className="h-5 w-5 text-yellow-500" />
      case 'tool_unlock':
        return <SparklesIcon className="h-5 w-5 text-blue-500" />
      case 'milestone_achieved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'progress_update':
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getBorderColor = () => {
    switch (notification.type) {
      case 'level_up':
        return 'border-yellow-200 bg-yellow-50'
      case 'tool_unlock':
        return 'border-blue-200 bg-blue-50'
      case 'milestone_achieved':
        return 'border-green-200 bg-green-50'
      case 'progress_update':
        return 'border-gray-200 bg-white'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={`rounded-lg border p-4 ${getBorderColor()} ${!notification.read ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-700 mb-2">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimestamp(notification.timestamp)}
              </p>
            </div>
            <button
              onClick={() => onDismiss(notification.id)}
              className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationStats({ notifications }: { notifications: Notification[] }) {
  const unreadCount = notifications.filter(n => !n.read).length
  const totalCount = notifications.length

  const typeCounts = notifications.reduce((acc, notification) => {
    acc[notification.type] = (acc[notification.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Notification Summary</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          unreadCount > 0 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {unreadCount} unread
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold text-gray-900">{totalCount}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{unreadCount}</div>
          <div className="text-xs text-gray-500">Unread</div>
        </div>
      </div>

      {Object.keys(typeCounts).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">By Type</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeCounts).map(([type, count]) => (
              <span
                key={type}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {type.replace('_', ' ')}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-sm font-medium text-gray-900 mb-2">No Notifications</h3>
      <p className="text-sm text-gray-500">
        You're all caught up! New notifications will appear here as you progress.
      </p>
    </div>
  )
}

export function NotificationsPanel({ notifications, onDismiss }: NotificationsPanelProps) {
  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      
      <NotificationStats notifications={notifications} />

      {unreadNotifications.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Unread ({unreadNotifications.length})
          </h3>
          <div className="space-y-3">
            {unreadNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDismiss={onDismiss}
              />
            ))}
          </div>
        </div>
      )}

      {readNotifications.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Read ({readNotifications.length})
          </h3>
          <div className="space-y-3">
            {readNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDismiss={onDismiss}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
