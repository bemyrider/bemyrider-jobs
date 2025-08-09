"use client"

import React from 'react'
import { Volume2, VolumeX, Eye, Briefcase, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useNotifications } from './notification-context'

interface NotificationSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationSettingsModal({ open, onOpenChange }: NotificationSettingsModalProps) {
  const { settings, updateSettings, requestPermission } = useNotifications()

  const handlePermissionRequest = async () => {
    const granted = await requestPermission()
    if (granted) {
      updateSettings({ visualEnabled: true })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Impostazioni Notifiche</DialogTitle>
          <DialogDescription>
            Personalizza come ricevere le notifiche per nuovi annunci e candidature.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notifiche visive */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <Label htmlFor="visual-notifications" className="text-sm font-medium">
                  Notifiche Visive
                </Label>
              </div>
              <Switch
                id="visual-notifications"
                checked={settings.visualEnabled}
                onCheckedChange={(checked) => updateSettings({ visualEnabled: checked })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Mostra notifiche popup del browser per nuovi eventi.
            </p>
            
            {settings.visualEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-800 mb-2">
                  Permesso notifiche browser richiesto
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePermissionRequest}
                  className="text-xs"
                >
                  Consenti Notifiche
                </Button>
              </div>
            )}
          </div>

          {/* Notifiche sonore */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
                <Label htmlFor="sound-notifications" className="text-sm font-medium">
                  Notifiche Sonore
                </Label>
              </div>
              <Switch
                id="sound-notifications"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Riproduci un suono quando arrivano nuove notifiche.
            </p>
          </div>

          {/* Tipi di notifiche */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Tipi di Notifiche</h4>
            


            {/* Notifiche candidature */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <Label htmlFor="application-notifications" className="text-sm">
                  Nuove Candidature
                </Label>
              </div>
              <Switch
                id="application-notifications"
                checked={settings.applicationNotifications}
                onCheckedChange={(checked) => updateSettings({ applicationNotifications: checked })}
              />
            </div>
          </div>

          {/* Test notifiche */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium">Test Notifica Candidatura</h4>
            <div className="flex gap-2">

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Test notifica candidatura
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('test-notification', {
                      detail: {
                        type: 'application',
                        title: 'Test - Nuova Candidatura',
                        message: 'Questa è una notifica di test per una nuova candidatura'
                      }
                    }))
                  }
                }}
                className="text-xs"
              >
                Test Candidatura
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
