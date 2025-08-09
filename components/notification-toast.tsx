"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { X, Briefcase, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useNotifications } from './notification-context'
import { AppNotification } from '@/lib/notifications'

interface ToastNotificationProps {
  notification: AppNotification
  onClose: () => void
  onMarkAsRead: () => void
}

function ToastNotification({ notification, onClose, onMarkAsRead }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Aspetta la fine dell'animazione
  }, [onClose])

  useEffect(() => {
    // Animazione di entrata
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto-close dopo 5 secondi
    const autoCloseTimer = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(autoCloseTimer)
    }
  }, [handleClose])

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead()
    }
    handleClose()
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'job-offer':
        return <Briefcase className="h-5 w-5 text-blue-500" />
      case 'application':
        return <FileText className="h-5 w-5 text-green-500" />
      default:
        return <div className="h-5 w-5" />
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case 'job-offer':
        return 'border-blue-200 bg-blue-50'
      case 'application':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <Card
      className={`
        ${getBgColor()}
        border-l-4 shadow-lg cursor-pointer transition-all duration-300 ease-in-out transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        hover:shadow-xl
      `}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(notification.timestamp).toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            className="h-6 w-6 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function NotificationToastContainer() {
  const { notifications, markAsRead, removeNotification } = useNotifications()
  const [visibleToasts, setVisibleToasts] = useState<AppNotification[]>([])

  useEffect(() => {
    // Mostra solo le notifiche non lette più recenti (max 3)
    const unreadNotifications = notifications
      .filter(n => !n.read)
      .slice(0, 3)

    setVisibleToasts(unreadNotifications)
  }, [notifications])

  if (visibleToasts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 w-80 max-w-sm">
      {visibleToasts.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <ToastNotification
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            onMarkAsRead={() => markAsRead(notification.id)}
          />
        </div>
      ))}
    </div>
  )
}
