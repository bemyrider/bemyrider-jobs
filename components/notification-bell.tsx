"use client"

import React, { useState } from 'react'
import { Bell, BellRing, Check, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from './notification-context'
import { NotificationSettingsModal } from './notification-settings-modal'

export function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotifications()
  const [showSettings, setShowSettings] = useState(false)

  // Debug per vedere lo stato delle notifiche
  console.log('🔔 NotificationBell - Notifiche totali:', notifications.length, 'Non lette:', unreadCount)

  const recentNotifications = notifications.slice(0, 10) // Mostra più notifiche nello storico

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Ora'
    if (minutes < 60) return `${minutes}m fa`
    if (hours < 24) return `${hours}h fa`
    return `${days}g fa`
  }

  const getNotificationIcon = (type: 'job-offer' | 'application') => {
    return type === 'job-offer' ? '💼' : '📝'
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={`relative ${unreadCount > 0 ? 'notification-bell-pulse' : ''}`}>
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5 text-orange-500" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs notification-badge-animate"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="font-semibold">Notifiche {unreadCount > 0 && <span className="text-xs text-blue-500">({unreadCount})</span>}</h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 px-2 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Segna tutte
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="h-8 w-8"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <DropdownMenuSeparator />
          
          {recentNotifications.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              Nessuna notifica
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {recentNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0 text-lg">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <p className={`text-xs mt-1 line-clamp-2 ${!notification.read ? 'text-gray-700' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
          
          {notifications.length > 10 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                {notifications.length - 10} altre notifiche...
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <NotificationSettingsModal 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </>
  )
}
