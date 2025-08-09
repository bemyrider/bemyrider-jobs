"use client"

import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "./tooltip-provider"
import { NotificationProvider } from "./notification-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </NotificationProvider>
    </SessionProvider>
  )
} 