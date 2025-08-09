"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { 
  AppNotification, 
  NotificationSettings, 
  defaultNotificationSettings,
  notificationStorage,
  playNotificationSound,
  showBrowserNotification,
  requestNotificationPermission
} from '@/lib/notifications'

interface NotificationContextType {
  notifications: AppNotification[]
  unreadCount: number
  settings: NotificationSettings
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  updateSettings: (settings: Partial<NotificationSettings>) => void
  requestPermission: () => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  const [permissionGranted, setPermissionGranted] = useState(false)

  // Carica notifiche e impostazioni dal localStorage all'avvio
  useEffect(() => {
    const savedNotifications = notificationStorage.load()
    const savedSettings = notificationStorage.loadSettings()
    
    console.log('🏁 Caricamento iniziale - Notifiche salvate:', savedNotifications.length)
    console.log('🏁 Impostazioni salvate:', savedSettings)
    
    setNotifications(savedNotifications)
    setSettings(savedSettings)

    // Controlla se abbiamo già i permessi per le notifiche
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted')
    }
  }, [])

  // Salva notifiche quando cambiano
  useEffect(() => {
    console.log('💾 Salvando notifiche nel localStorage:', notifications.length, 'notifiche')
    notificationStorage.save(notifications)
  }, [notifications])

  // Salva impostazioni quando cambiano
  useEffect(() => {
    notificationStorage.saveSettings(settings)
  }, [settings])

  const addNotification = useCallback((notificationData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const notification: AppNotification = {
      ...notificationData,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }

    console.log('📝 Aggiungendo notifica:', notification.title, notification.message)
    setNotifications(prev => {
      const newNotifications = [notification, ...prev]
      console.log('📝 Notifiche totali dopo aggiunta:', newNotifications.length)
      return newNotifications
    })

    // Riproduci suono se abilitato
    if (settings.soundEnabled && settings.visualEnabled) {
      console.log('🔊 Riproduzione suono notifica')
      playNotificationSound(notification.type)
    }

    // Mostra notifica del browser se abilitata e se abbiamo i permessi
    if (settings.visualEnabled && permissionGranted) {
      console.log('🌐 Mostra notifica browser')
      showBrowserNotification(notification.title, notification.message)
    }
  }, [settings, permissionGranted])

  // Utilizza useRef per evitare re-render continui
  const lastCheckTimeRef = useRef<Date>(new Date())
  const processedIdsRef = useRef<Set<string>>(new Set())

  // Inizializza il timestamp dall'ultimo controllo salvato
  useEffect(() => {
    const savedTime = notificationStorage.loadLastCheckTime()
    lastCheckTimeRef.current = savedTime
  }, [])

  // Polling per nuove notifiche (solo se autenticato)
  useEffect(() => {
    if (!session?.user?.email) return

    const checkForNewNotifications = async () => {
      try {
        const currentCheckTime = new Date()
        console.log('⏰ Controllo notifiche - Ultimo controllo:', lastCheckTimeRef.current.toISOString(), 'Controllo attuale:', currentCheckTime.toISOString())
        
        // Controlla nuove candidature
        if (settings.applicationNotifications) {
          try {
            const response = await fetch(`/api/applications?since=${lastCheckTimeRef.current.toISOString()}`)
            if (response.ok) {
              const data = await response.json()
              console.log('📊 API applications risposta:', data.length, 'candidature totali')
              const newApplications = data.filter((app: { id: string; createdAt: string; jobOffer: { createdByEmail: string } }) => {
                const appDate = new Date(app.createdAt)
                const isNew = appDate > lastCheckTimeRef.current
                const isOwnJob = app.jobOffer.createdByEmail === session.user?.email
                const notProcessed = !processedIdsRef.current.has(`app-${app.id}`)
                console.log(`📊 App ${app.id}: data=${appDate.toISOString()}, lastCheck=${lastCheckTimeRef.current.toISOString()}, isNew=${isNew}, isOwnJob=${isOwnJob}, notProcessed=${notProcessed}`)
                return isNew && isOwnJob && notProcessed
              })

              newApplications.forEach((app: { id: string; fullName: string; jobOfferId: string; jobOffer: { businessName: string } }) => {
                console.log('🔔 Nuova candidatura rilevata:', app.fullName, 'per', app.jobOffer.businessName)
                
                addNotification({
                  type: 'application',
                  title: 'Nuova Candidatura',
                  message: `${app.fullName} si è candidato per "${app.jobOffer.businessName}"`,
                  data: {
                    applicationId: app.id,
                    jobOfferId: app.jobOfferId,
                    businessName: app.jobOffer.businessName,
                    applicantName: app.fullName
                  }
                })

                // Aggiungi l'ID ai processati
                processedIdsRef.current.add(`app-${app.id}`)
              })
            } else {
              console.error('⚠️ Errore API applications:', response.status, response.statusText)
            }
          } catch (error) {
            console.error('⚠️ Errore fetch applications:', error)
          }
        }

        // Le notifiche per i nuovi annunci di lavoro sono state rimosse
        // perché non sono necessarie - gli utenti possono vedere i nuovi annunci 
        // direttamente nella homepage

        // Aggiorna il timestamp solo se abbiamo effettivamente controllato
        lastCheckTimeRef.current = currentCheckTime
        notificationStorage.saveLastCheckTime(currentCheckTime)
      } catch (error) {
        console.error('Error checking for notifications:', error)
      }
    }

    // Controlla immediatamente e poi ogni 30 secondi
    console.log('🔍 Avvio controllo notifiche per utente:', session.user.email)
    checkForNewNotifications()
    const intervalId = setInterval(checkForNewNotifications, 30000)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [session?.user?.email, settings.applicationNotifications])

  // Ascolta eventi di test delle notifiche
  useEffect(() => {
    const handleTestNotification = (event: CustomEvent<{ type: 'job-offer' | 'application'; title: string; message: string }>) => {
      const { type, title, message } = event.detail
      addNotification({
        type,
        title,
        message,
        data: {
          businessName: 'Test Business',
          applicantName: 'Test User'
        }
      })
    }

    window.addEventListener('test-notification', handleTestNotification as EventListener)
    return () => window.removeEventListener('test-notification', handleTestNotification as EventListener)
  }, [addNotification])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission()
    setPermissionGranted(granted)
    return granted
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    requestPermission
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
