"use client"

import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, Step } from 'react-joyride';

/*
 * Step per il tour della homepage - seguendo le specifiche BeMyRider
 */
const homeSteps = [
  {
    target: '.home-title',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">👋 Benvenuto su BeMyRider Jobs!</h4>
        <p>Questa è la piattaforma dove puoi trovare opportunità di lavoro come rider o pubblicare annunci per la tua attività.</p>
      </div>
    ),
    placement: 'bottom' as const,
  },
  {
    target: '.user-menu',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">🏪 Sei un Esercente?</h4>
        <p>Se hai un&apos;attività e vuoi pubblicare annunci di lavoro, clicca qui per fare login con Google e accedere alla dashboard!</p>
      </div>
    ),
    placement: 'bottom-start' as const,
  },
  {
    target: '.job-offers-grid',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">📋 Offerte di Lavoro</h4>
        <p>Qui trovi tutte le offerte di lavoro disponibili. <strong>Per i candidati:</strong> basta cliccare su &quot;Candidati&quot; per applicare, non serve registrarsi!</p>
      </div>
    ),
    placement: 'top' as const,
  },
  {
    target: '.search-filters',
    content: (
      <div>
        <h4 className="text-lg font-semibold mb-2">🔍 Filtri di Ricerca</h4>
        <p>Usa questi filtri per trovare offerte nella tua città o che richiedono il tuo tipo di mezzo (bici, scooter, auto, ecc.).</p>
      </div>
    ),
    placement: 'bottom' as const,
  },
];

interface JoyrideTourProps {
  run?: boolean;
  onFinish?: () => void;
  steps?: Step[];
  debug?: boolean;
}

export default function JoyrideTour({ 
  run = false, 
  onFinish, 
  steps = homeSteps,
  debug = false 
}: JoyrideTourProps) {
  const [runTour, setRunTour] = useState(run);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setRunTour(run);
  }, [run]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (debug) {
      console.log('Joyride callback:', { action, index, status, type });
    }

    if (type === 'step:after' || type === 'error:target_not_found') {
      // Aggiorna l'indice dello step
      setStepIndex(index + (action === 'prev' ? -1 : 1));
    } else if (status === 'finished' || status === 'skipped') {
      // Tour finito
      setRunTour(false);
      setStepIndex(0);
      onFinish?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      stepIndex={stepIndex}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      scrollToFirstStep={true}
      spotlightPadding={4}
      spotlightClicks={false}
      disableOverlayClose={false}
      disableCloseOnEsc={false}
      hideBackButton={false}
      scrollDuration={300}
      scrollOffset={20}
      callback={handleJoyrideCallback}
      debug={debug}
      styles={{
        options: {
          primaryColor: '#333366', // BeMyRider blue
          textColor: '#333',
          backgroundColor: 'white',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          width: 350,
        },
        buttonNext: {
          backgroundColor: '#FF6B35', // BeMyRider orange
          borderRadius: '6px',
          fontSize: '14px',
          padding: '8px 16px',
          fontWeight: '500',
        },
        buttonBack: {
          color: '#333366',
          marginRight: '8px',
          fontSize: '14px',
          padding: '8px 12px',
          borderRadius: '6px',
          border: `1px solid #333366`,
        },
        buttonSkip: {
          color: '#666',
          fontSize: '14px',
          padding: '8px 12px',
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
          fontSize: '14px',
          lineHeight: '1.6',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        },
        tooltipTitle: {
          fontSize: '18px',
          marginBottom: '8px',
          fontWeight: '600',
        },
        tooltipContent: {
          fontSize: '14px',
          lineHeight: '1.5',
        },
        spotlight: {
          borderRadius: '8px',
        },
      }}
      locale={{
        back: 'Indietro',
        close: 'Chiudi',
        last: 'Fine',
        next: 'Avanti',
        nextLabelWithProgress: 'Avanti ({step} di {steps})',
        skip: 'Salta tour',
      }}
    />
  );
}
