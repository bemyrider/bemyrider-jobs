# Sistema di Notifiche - BeMyRider Jobs

Questo documento descrive il sistema di notifiche implementato per l'applicazione BeMyRider Jobs, che include notifiche acustiche e visive per nuovi annunci di lavoro e candidature.

## 🚀 Funzionalità

### Tipologie di Notifiche
- **Nuove Candidature**: Notifica gli esercenti quando ricevono nuove candidature per i loro annunci
- **Nuovi Annunci di Lavoro**: Notifica tutti gli utenti quando vengono pubblicati nuovi annunci

### Modalità di Notifica
- **Notifiche Visive**:
  - Popup toast in-app nell'angolo superiore destro
  - Notifiche native del browser (richiede permessi)
  - Campanella animata nella navigation con badge del conteggio

- **Notifiche Acustiche**:
  - Toni audio generati programmaticamente (Web Audio API)
  - Frequenze diverse per ogni tipo di notifica:
    - 600Hz per annunci di lavoro (tono più basso)
    - 900Hz per candidature (tono più alto)
    - 750Hz per notifiche generiche

## 🏗️ Architettura

### Componenti Principali

1. **NotificationContext** (`/components/notification-context.tsx`)
   - Context React per gestire stato globale delle notifiche
   - Polling automatico ogni 30 secondi per nuove notifiche
   - Gestione delle impostazioni utente (localStorage)

2. **NotificationBell** (`/components/notification-bell.tsx`)
   - Campanella di notifica nella navigation
   - Dropdown con lista delle notifiche recenti
   - Contatore visuale delle notifiche non lette

3. **NotificationToastContainer** (`/components/notification-toast.tsx`)
   - Sistema di toast per notifiche in-app
   - Animazioni di entrata/uscita
   - Auto-dismiss dopo 5 secondi

4. **NotificationSettingsModal** (`/components/notification-settings-modal.tsx`)
   - Interfaccia per configurare le impostazioni
   - Toggle per abilitare/disabilitare notifiche visive e sonore
   - Funzioni di test per verificare il funzionamento

5. **Notification Utils** (`/lib/notifications.ts`)
   - Funzioni utility per audio, storage e permessi
   - Generazione toni audio con Web Audio API
   - Gestione permessi notifiche browser

### API Endpoints Aggiornati

- **GET /api/applications** - Aggiunto parametro `since` per polling notifiche
- **GET /api/job-offers** - Aggiunto parametro `since` per polling notifiche

## 📱 Utilizzo

### Per Utenti

1. **Abilitazione Notifiche**:
   - Cliccare sulla campanella nella navigation
   - Accedere alle impostazioni (icona ingranaggio)
   - Configurare preferenze audio/visive
   - Autorizzare permessi browser se richiesto

2. **Visualizzazione Notifiche**:
   - Badge rosso sulla campanella indica notifiche non lette
   - Click sulla campanella per aprire il dropdown
   - Toast automatici in alto a destra per nuove notifiche

3. **Gestione Notifiche**:
   - Click su notifica per segnarla come letta
   - "Segna tutte" per leggere tutte insieme
   - Bottone X per rimuovere singole notifiche

### Per Sviluppatori

1. **Aggiungere Nuovi Tipi di Notifica**:
```typescript
// In notification-context.tsx
addNotification({
  type: 'custom-type',
  title: 'Titolo Notifica',
  message: 'Messaggio della notifica',
  data: {
    customField: 'valore'
  }
})
```

2. **Personalizzare Suoni**:
```typescript
// In lib/notifications.ts
// Modificare le frequenze nella funzione playNotificationSound
case 'custom-type':
  frequency = 500
  duration = 0.5
  break
```

## 🔧 Configurazione

### Impostazioni Predefinite
```typescript
const defaultNotificationSettings = {
  soundEnabled: true,
  visualEnabled: true,
  jobOfferNotifications: true,
  applicationNotifications: true,
}
```

### Storage Locale
- Notifiche salvate in `localStorage` con chiave `bemyrider-notifications`
- Impostazioni salvate con chiave `bemyrider-notification-settings`
- Dati persistono tra sessioni browser

### Polling
- Intervallo: 30 secondi
- Attivo solo per utenti autenticati
- Controlla timestamp dell'ultima verifica per evitare duplicati

## 🎨 Styling

### CSS Classes Personalizzate
- `.notification-bell-pulse` - Animazione campanella
- `.notification-badge-animate` - Animazione badge contatore
- `.notification-toast-*` - Animazioni toast
- `.line-clamp-2` - Troncamento testo su 2 righe

### Responsive Design
- Toast container si adatta alle dimensioni schermo
- Dropdown notifiche ottimizzato per mobile
- Icone e spacing consistenti con design system

## ⚡ Performance

### Ottimizzazioni
- Debouncing del polling per evitare richieste eccessive
- Lazy loading dei componenti non critici
- Cleanup automatico di event listeners
- Storage efficiente con compressione automatica

### Gestione Memoria
- Limite massimo notifiche in memoria (non implementato, ma consigliato)
- Cleanup automatico notifiche vecchie oltre 30 giorni
- Rimozione listener al dismount componenti

## 🐛 Testing

### Funzioni di Test
Nel modal delle impostazioni sono disponibili pulsanti per testare:
- Notifica annuncio di lavoro
- Notifica candidatura

### Eventi Personalizzati
```javascript
// Test notifica programmatico
window.dispatchEvent(new CustomEvent('test-notification', {
  detail: {
    type: 'job-offer',
    title: 'Test Notification',
    message: 'This is a test notification'
  }
}))
```

## 🚦 Stato del Progetto

✅ **Completato**:
- Sistema di notifiche base
- Notifiche visive (toast + bell)
- Notifiche acustiche
- Polling automatico
- Impostazioni utente
- Integrazione API

🔄 **Da Migliorare** (future versioni):
- Push notifications per mobile
- Raggruppamento notifiche simili
- Statistiche utilizzo notifiche
- Template personalizzabili
- Integrazione email notifications

## 📦 Dipendenze

### Nuove Dipendenze Aggiunte
- `@radix-ui/react-label`: ^2.1.4
- `@radix-ui/react-switch`: ^1.1.1

### API Browser Utilizzate
- **Web Audio API**: Generazione toni audio
- **Notification API**: Notifiche native browser
- **localStorage**: Persistenza dati
- **setInterval**: Polling automatico

---

**Note**: Il sistema è progettato per essere estensibile e modulare. Ogni componente può essere facilmente personalizzato o esteso per nuove funzionalità.
