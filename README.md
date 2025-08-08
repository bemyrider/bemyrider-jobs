# Bemyrider Jobs

Portale annunci per la ricerca di rider nella tua zona. Gli esercenti possono pubblicare annunci e i rider possono candidarsi direttamente.

## 🚀 Caratteristiche

- **Per gli esercenti**: 
  - Dashboard personale per gestire annunci
  - Pubblicazione semplificata di annunci di lavoro
  - Visualizzazione candidature in tempo reale
  - Autenticazione Google per accesso sicuro
- **Per i rider**: 
  - Ricerca e candidatura ad annunci geolocalizzati
  - Form di candidatura integrato
  - Notifiche automatiche via email
- **Sistema di filtri**: Cerca per città e tipo di mezzo
- **Design responsive**: Mobile-first e moderno
- **Gestione annunci**: Attivazione/disattivazione e modifica

## 🛠️ Stack Tecnico

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Autenticazione**: NextAuth.js con Google OAuth
- **Email**: Resend
- **Hosting**: Vercel

## 📦 Installazione

### Prerequisiti

- Node.js 18+
- PostgreSQL database (consigliato: [Neon](https://neon.tech))
- Account Resend per le email
- Google OAuth credentials

### Setup

1. **Clona il repository**
   ```bash
   git clone [repository-url]
   cd bemyrider-job-portal
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Modifica il file `.env` con i tuoi dati:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
   RESEND_API_KEY="your-resend-api-key"
   FROM_EMAIL="noreply@yourdomain.com"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup del database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed  # Popola il database con dati di esempio
   ```

5. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

L'applicazione sarà disponibile su [http://localhost:3000](http://localhost:3000)

## 🎯 Utilizzo

### Per gli esercenti
1. **Accesso**: Clicca su "Accedi" e autenticati con Google
2. **Dashboard**: Gestisci i tuoi annunci dalla dashboard personale
3. **Pubblicazione**: Vai su `/publish` e compila il form
4. **Gestione**: Attiva/disattiva annunci e visualizza candidature
5. **Notifiche**: Ricevi candidature via email

### Per i rider
1. **Ricerca**: Visita la homepage `/`
2. **Filtri**: Usa i filtri per città e tipo di mezzo
3. **Candidatura**: Clicca su "Candidati" per inviare la tua candidatura
4. **Form**: Compila i dettagli personali e la disponibilità
5. **Conferma**: L'esercente riceverà i tuoi dati via email

## 📁 Struttura del Progetto

```
bemyrider-job-portal/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth routes
│   │   ├── applications/  # Gestione candidature
│   │   ├── dashboard/     # API dashboard esercenti
│   │   └── job-offers/    # API annunci
│   ├── dashboard/         # Dashboard esercenti
│   │   ├── edit/          # Modifica annunci
│   │   └── page.tsx       # Dashboard principale
│   ├── publish/           # Pagina pubblicazione annunci
│   ├── globals.css        # Stili globali
│   ├── layout.tsx         # Layout principale
│   └── page.tsx           # Homepage
├── components/            # Componenti React
│   ├── ui/               # Componenti UI (shadcn/ui)
│   ├── create-job-offer-form.tsx
│   ├── job-offers-list.tsx
│   ├── application-form.tsx
│   ├── application-modal.tsx
│   ├── job-offer-actions.tsx
│   ├── user-menu.tsx
│   └── navigation.tsx
├── lib/                  # Utilità e configurazioni
│   ├── prisma.ts         # Configurazione Prisma
│   ├── email.ts          # Configurazione email
│   ├── auth.ts           # Configurazione NextAuth
│   └── utils.ts          # Funzioni di utilità
├── prisma/               # Schema database
│   └── schema.prisma
├── scripts/              # Script di utilità
│   └── seed.js           # Popolamento database
└── public/              # File statici
```

## 🚀 Deploy su Vercel

1. **Push su GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Importa su Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Importa il repository
   - Aggiungi le variabili d'ambiente nel dashboard Vercel
   - Deploy!

## 🔧 Variabili d'ambiente

| Variabile | Descrizione | Esempio |
|-----------|-------------|---------|
| `DATABASE_URL` | URL del database PostgreSQL | `postgresql://...` |
| `RESEND_API_KEY` | API key per Resend | `re_123456789...` |
| `FROM_EMAIL` | Email mittente | `noreply@bemyrider.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-...` |
| `NEXTAUTH_SECRET` | Secret per NextAuth | `your-secret-key` |
| `NEXTAUTH_URL` | URL dell'applicazione | `http://localhost:3000` |

## 📝 Schema Database

### JobOffers
- `id`: CUID primario
- `businessName`: Nome attività
- `city`: Città
- `zone`: Zona (opzionale)
- `schedule`: Orari lavoro (es. "18:00-22:00")
- `days`: Array giorni lavorativi (es. ["Lun", "Mar", "Mer"])
- `vehicleType`: Array tipi di mezzo (es. ["bici", "scooter"])
- `hourlyRate`: Retribuzione oraria (opzionale)
- `details`: Dettagli aggiuntivi
- `contactEmail`: Email contatto

- `isActive`: Stato attivo/inattivo
- `createdByEmail`: Email dell'esercente
- `createdAt`: Data creazione
- `updatedAt`: Ultima modifica

### Applications
- `id`: CUID primario
- `jobOfferId`: Riferimento all'annuncio
- `fullName`: Nome completo candidato
- `email`: Email candidato
- `phone`: Telefono candidato
- `vehicleType`: Tipo di mezzo
- `availability`: Disponibilità oraria
- `cvLink`: Link CV (opzionale)
- `message`: Messaggio di presentazione (opzionale)
- `createdAt`: Data candidatura

## 🎨 Design System

- **Colori principali**: 
  - Blu scuro: `#333366` (bemyrider-blue)
  - Arancione: `#ff9900` (bemyrider-orange)
- **Font**: Inter per il testo, Manrope per il logo
- **Componenti**: shadcn/ui per consistenza

## 🤝 Contributi

Le contribuzioni sono benvenute! Sentiti libero di aprire una issue o una pull request.

## 📄 Licenza

MIT License - vedi il file [LICENSE](LICENSE) per i dettagli.
