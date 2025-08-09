export interface AppNotification {
  id: string
  type: 'job-offer' | 'application'
  title: string
  message: string
  timestamp: Date
  read: boolean
  data?: {
    jobOfferId?: string
    applicationId?: string
    businessName?: string
    applicantName?: string
  }
}

export interface NotificationSettings {
  soundEnabled: boolean
  visualEnabled: boolean
  jobOfferNotifications: boolean
  applicationNotifications: boolean
}

export const defaultNotificationSettings: NotificationSettings = {
  soundEnabled: true,
  visualEnabled: true,
  jobOfferNotifications: true,
  applicationNotifications: true,
}

// Suoni per le notifiche (usando tone generati programmaticamente)
export const notificationSounds = {
  jobOffer: 'job-offer-tone',
  application: 'application-tone', 
  default: 'default-tone',
}

// Funzione per generare toni audio
const generateTone = (frequency: number, duration: number, volume: number = 0.3): AudioBuffer | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const sampleRate = audioContext.sampleRate
    const samples = duration * sampleRate
    const buffer = audioContext.createBuffer(1, samples, sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < samples; i++) {
      data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * volume * (1 - i / samples) // Fade out
    }
    
    return buffer
  } catch (error) {
    console.error('Error generating tone:', error)
    return null
  }
}

// Funzione per riprodurre suoni
export const playNotificationSound = (type: 'job-offer' | 'application' | 'default' = 'default') => {
  if (typeof window === 'undefined') return

  try {
    // Genera toni diversi per ogni tipo di notifica
    let frequency = 800 // Default
    let duration = 0.3
    
    switch (type) {
      case 'job-offer':
        frequency = 600 // Tono più basso per annunci di lavoro
        duration = 0.4
        break
      case 'application':
        frequency = 900 // Tono più alto per candidature
        duration = 0.3
        break
      default:
        frequency = 750
        duration = 0.3
        break
    }

    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const buffer = generateTone(frequency, duration)
    
    if (buffer) {
      const source = audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(audioContext.destination)
      source.start()
    }
  } catch (error) {
    console.error('Error playing notification sound:', error)
    // Fallback: prova a usare un beep del sistema
    try {
      console.log('\u0007') // ASCII bell character
    } catch {
      // Silently fail
    }
  }
}

// Funzione per mostrare notifica nativa del browser
export const showBrowserNotification = (title: string, message: string, icon?: string) => {
  if (typeof window === 'undefined') return

  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: message,
      icon: icon || '/bemyrider.svg',
      badge: '/bemyrider.svg',
      tag: 'bemyrider-notification',
      requireInteraction: false,
      silent: false,
    })

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000)

    return notification
  }
}

// Funzione per richiedere permessi di notifica
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false

  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// Storage locale per le notifiche
export const notificationStorage = {
  save: (notifications: AppNotification[]) => {
    if (typeof window === 'undefined') return
    
    // Mantieni solo le notifiche degli ultimi 30 giorni
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentNotifications = notifications.filter(n => 
      new Date(n.timestamp) > thirtyDaysAgo
    )
    
    // Mantieni massimo 100 notifiche per performance
    const limitedNotifications = recentNotifications.slice(0, 100)
    
    localStorage.setItem('bemyrider-notifications', JSON.stringify(limitedNotifications))
  },
  
  load: (): AppNotification[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('bemyrider-notifications')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.map((n: AppNotification) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })).filter((n: AppNotification) => {
          // Filtra notifiche più vecchie di 30 giorni al caricamento
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return new Date(n.timestamp) > thirtyDaysAgo
        })
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error)
    }
    return []
  },

  saveSettings: (settings: NotificationSettings) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('bemyrider-notification-settings', JSON.stringify(settings))
  },

  loadSettings: (): NotificationSettings => {
    if (typeof window === 'undefined') return defaultNotificationSettings
    try {
      const stored = localStorage.getItem('bemyrider-notification-settings')
      if (stored) {
        return { ...defaultNotificationSettings, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('Error loading notification settings from storage:', error)
    }
    return defaultNotificationSettings
  },

  saveLastCheckTime: (timestamp: Date) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('bemyrider-last-notification-check', timestamp.toISOString())
  },

  loadLastCheckTime: (): Date => {
    if (typeof window === 'undefined') return new Date()
    try {
      const stored = localStorage.getItem('bemyrider-last-notification-check')
      if (stored) {
        const date = new Date(stored)
        // Se è più vecchio di 1 ora, usa data attuale per evitare troppe notifiche al riavvio
        const oneHourAgo = new Date()
        oneHourAgo.setHours(oneHourAgo.getHours() - 1)
        return date > oneHourAgo ? date : new Date()
      }
    } catch (error) {
      console.error('Error loading last check time from storage:', error)
    }
    return new Date()
  }
}
