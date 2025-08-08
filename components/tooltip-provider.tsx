"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react'

interface Step {
  target: string
  content: React.ReactNode
  placement?: string
}

interface TooltipContextType {
  startHomeTour: () => void
  startDashboardTour: () => void
  startPublishTour: () => void
  startApplicationTour: () => void
  isRunning: boolean
  currentStep: number
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined)

export const useTooltip = () => {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider')
  }
  return context
}

// Definizione degli step per ogni tour
const HOME_TOUR_STEPS: Step[] = [
  {
    target: '.home-title',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">👋 Benvenuto su BeMyRider Jobs!</h4>
        <p>Questa è la piattaforma dove puoi trovare opportunità di lavoro come rider o pubblicare annunci per la tua attività.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '.user-menu',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">🏪 Sei un Esercente?</h4>
        <p>Se hai un&apos;attività e vuoi pubblicare annunci di lavoro, clicca qui per fare login con Google e accedere alla dashboard!</p>
      </div>
    ),
    placement: 'bottom-start',
  },
  {
    target: '.job-offers-grid',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">📋 Offerte di Lavoro</h4>
        <p>Qui trovi tutte le offerte di lavoro disponibili. <strong>Per i candidati:</strong> basta cliccare su &quot;Candidati&quot; per applicare, non serve registrarsi!</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.search-filters',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">🔍 Filtri di Ricerca</h4>
        <p>Usa questi filtri per trovare offerte nella tua città o che richiedono il tuo tipo di mezzo (bici, scooter, auto, ecc.).</p>
      </div>
    ),
    placement: 'bottom',
  },
]

const DASHBOARD_TOUR_STEPS: Step[] = [
  {
    target: '.dashboard-welcome',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">🎉 Benvenuto nella Dashboard!</h4>
        <p>Qui puoi gestire tutti i tuoi annunci di lavoro e vedere le candidature ricevute.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '.publish-button',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">➕ Pubblica Annuncio</h4>
        <p>Clicca qui per pubblicare un nuovo annuncio di lavoro. È veloce e semplice!</p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '.job-offers-list',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">📊 I Tuoi Annunci</h4>
        <p>Qui vedi tutti i tuoi annunci pubblicati. Puoi modificarli, eliminarli e vedere tutte le candidature ricevute.</p>
      </div>
    ),
    placement: 'top',
  },
]

const PUBLISH_TOUR_STEPS: Step[] = [
  {
    target: '.publish-form',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">📝 Crea il Tuo Annuncio</h4>
        <p>Compila questo modulo per creare un nuovo annuncio. Più dettagli fornisci, più candidati qualificati riceverai!</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.business-name-input',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">🏪 Nome Attività</h4>
        <p>Inserisci il nome della tua attività o ristorante.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '.city-zone-inputs',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">📍 Dove Lavoreranno?</h4>
        <p>Specifica la città e, se necessario, la zona specifica dove i rider dovranno lavorare.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '.vehicle-type-input',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">🚲 Mezzo Richiesto</h4>
        <p>Seleziona che tipo di mezzo deve avere il rider (bicicletta, scooter, auto, o nessun mezzo specifico).</p>
      </div>
    ),
    placement: 'bottom',
  },
]

const APPLICATION_TOUR_STEPS: Step[] = [
  {
    target: '.application-modal',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">🎯 Candidati Subito!</h4>
        <p>Perfetto! Hai trovato un&apos;offerta interessante. Compila questo modulo per candidarti - non serve registrazione!</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.contact-fields',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">📧 I Tuoi Contatti</h4>
        <p>Inserisci i tuoi dati di contatto. L&apos;esercente ti contatterà direttamente se interessato.</p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '.presentation-field',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">💬 Presentati!</h4>
        <p>Questo è il momento di fare una buona impressione. Scrivi brevemente chi sei e perché sei il candidato ideale!</p>
      </div>
    ),
    placement: 'top',
  },
]

interface TooltipProviderProps {
  children: ReactNode
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [activeSteps, setActiveSteps] = useState<Step[]>([])
  const [mounted, setMounted] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isRunning && activeSteps.length > 0 && currentStep < activeSteps.length) {
      const step = activeSteps[currentStep]
      const targetElement = document.querySelector(step.target)
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
        
        // Posiziona il tooltip sopra l'elemento target
        setTooltipPosition({
          top: rect.top + scrollTop - 10,
          left: rect.left + scrollLeft + rect.width / 2
        })
        
        // Scroll smooth all'elemento
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Highlight dell'elemento
        targetElement.classList.add('tour-highlight')
      }
    }
  }, [isRunning, currentStep, activeSteps])

  const startTour = (tourSteps: Step[]) => {
    setActiveSteps(tourSteps)
    setCurrentStep(0)
    setIsRunning(true)
  }

  const nextStep = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      finishTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const finishTour = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setActiveSteps([])
    // Rimuovi tutti gli highlight
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight')
    })
  }

  const startHomeTour = () => startTour(HOME_TOUR_STEPS)
  const startDashboardTour = () => startTour(DASHBOARD_TOUR_STEPS)
  const startPublishTour = () => startTour(PUBLISH_TOUR_STEPS)
  const startApplicationTour = () => startTour(APPLICATION_TOUR_STEPS)

  return (
    <TooltipContext.Provider
      value={{
        startHomeTour,
        startDashboardTour,
        startPublishTour,
        startApplicationTour,
        isRunning,
        currentStep,
      }}
    >
      {children}
      {mounted && isRunning && activeSteps.length > 0 && currentStep < activeSteps.length && (
        <>
          {/* Overlay scuro */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={finishTour}
          />
          
          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className="fixed z-50 bg-white rounded-lg shadow-xl p-4 max-w-sm transform -translate-x-1/2 -translate-y-full"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
          >
            {/* Freccia */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
            </div>
            
            {/* Contenuto */}
            <div className="mb-4">
              {activeSteps[currentStep].content}
            </div>
            
            {/* Progress bar */}
            <div className="mb-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-bemyrider-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                {currentStep + 1} di {activeSteps.length}
              </div>
            </div>
            
            {/* Pulsanti */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-3 py-1 text-sm text-bemyrider-blue disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Indietro
              </button>
              
              <button
                onClick={finishTour}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                Salta
              </button>
              
              <button
                onClick={nextStep}
                className="px-4 py-2 text-sm bg-bemyrider-blue text-white rounded hover:bg-bemyrider-blue/90"
              >
                {currentStep === activeSteps.length - 1 ? 'Fine' : 'Avanti'}
              </button>
            </div>
          </div>
        </>
      )}
    </TooltipContext.Provider>
  )
}

