"use client"

import { useState, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { Button } from './ui/button'
import { useTooltip } from './tooltip-provider'

interface HelpButtonProps {
  tourType: 'home' | 'dashboard' | 'publish' | 'application'
  className?: string
}

export function HelpButton({ tourType, className = '' }: HelpButtonProps) {
  const { startHomeTour, startDashboardTour, startPublishTour, startApplicationTour } = useTooltip()
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)

  // Mostra il messaggio di benvenuto solo la prima volta su ogni pagina
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(`bemyrider-welcome-${tourType}`)
    if (!hasSeenWelcome) {
      // Delay per permettere al DOM di renderizzare completamente
      const timer = setTimeout(() => {
        setShowWelcomeMessage(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [tourType])

  const handleStartTour = () => {
    // Marca come visto e nasconde il messaggio
    localStorage.setItem(`bemyrider-welcome-${tourType}`, 'true')
    setShowWelcomeMessage(false)

    // Avvia il tour appropriato
    switch (tourType) {
      case 'home':
        startHomeTour()
        break
      case 'dashboard':
        startDashboardTour()
        break
      case 'publish':
        startPublishTour()
        break
      case 'application':
        startApplicationTour()
        break
    }
  }

  const handleDismissWelcome = () => {
    localStorage.setItem(`bemyrider-welcome-${tourType}`, 'true')
    setShowWelcomeMessage(false)
  }

  const getTourMessage = () => {
    switch (tourType) {
      case 'home':
        return {
          title: "👋 Prima volta qui?",
          description: "Ti mostriamo come funziona! Clicca per una guida rapida."
        }
      case 'dashboard':
        return {
          title: "🎉 Benvenuto nella Dashboard!",
          description: "Scopri come gestire i tuoi annunci e vedere le candidature."
        }
      case 'publish':
        return {
          title: "📝 Stai per pubblicare un annuncio?",
          description: "Ti guidiamo passo passo nella creazione del tuo annuncio."
        }
      case 'application':
        return {
          title: "🎯 Pronto a candidarti?",
          description: "Ti mostriamo come compilare al meglio la candidatura."
        }
    }
  }

  const message = getTourMessage()

  return (
    <>
      {/* Pulsante di aiuto fisso */}
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <Button
          onClick={handleStartTour}
          className="h-12 w-12 rounded-full bg-bemyrider-blue hover:bg-bemyrider-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          title="Aiuto e guida"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Messaggio di benvenuto */}
      {showWelcomeMessage && (
        <div className="fixed bottom-20 right-6 z-50 max-w-sm">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-bemyrider-blue">
                {message.title}
              </h4>
              <button
                onClick={handleDismissWelcome}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {message.description}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleStartTour}
                size="sm"
                className="flex-1 bg-bemyrider-orange hover:bg-bemyrider-orange/90"
              >
                Inizia la guida
              </Button>
              <Button
                onClick={handleDismissWelcome}
                variant="outline"
                size="sm"
                className="text-gray-600"
              >
                No, grazie
              </Button>
            </div>
            {/* Freccia che punta al pulsante di aiuto */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45"></div>
          </div>
        </div>
      )}
    </>
  )
}



