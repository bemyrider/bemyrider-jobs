# Contributing to Bemyrider Job Portal

Grazie per il tuo interesse a contribuire al progetto Bemyrider Job Portal! 🚀

## Come Contribuire

### Segnalare Bug

Se trovi un bug, per favore:

1. **Cerca** nelle issue esistenti per vedere se è già stato segnalato
2. **Crea una nuova issue** con:
   - Descrizione chiara del problema
   - Passi per riprodurre il bug
   - Screenshot (se applicabile)
   - Informazioni sul browser/sistema operativo

### Richiedere Funzionalità

Per richiedere nuove funzionalità:

1. **Cerca** nelle issue esistenti per vedere se è già stata richiesta
2. **Crea una nuova issue** con:
   - Descrizione dettagliata della funzionalità
   - Caso d'uso specifico
   - Benefici per gli utenti

### Contribuire al Codice

#### Setup Locale

1. **Fork** il repository
2. **Clona** il tuo fork:
   ```bash
   git clone https://github.com/your-username/bemyrider-job-portal.git
   cd bemyrider-job-portal
   ```
3. **Installa** le dipendenze:
   ```bash
   npm install
   ```
4. **Configura** le variabili d'ambiente:
   ```bash
   cp .env.example .env
   # Modifica .env con i tuoi dati
   ```
5. **Setup** il database:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

#### Sviluppo

1. **Crea** un branch per la tua feature:
   ```bash
   git checkout -b feature/nome-feature
   ```
2. **Sviluppa** la tua funzionalità
3. **Testa** il codice:
   ```bash
   npm run build
   npm run lint
   ```
4. **Commits** significativi:
   ```bash
   git commit -m "feat: aggiunge funzionalità X"
   git commit -m "fix: risolve problema Y"
   git commit -m "docs: aggiorna documentazione"
   ```

#### Pull Request

1. **Push** il tuo branch:
   ```bash
   git push origin feature/nome-feature
   ```
2. **Crea** una Pull Request su GitHub
3. **Descrivi** chiaramente le modifiche
4. **Riferisci** le issue correlate

## Linee Guida del Codice

### TypeScript
- Usa **TypeScript** per tutto il codice
- Definisci **interfacce** per i tipi
- Evita `any` - usa tipi specifici

### Styling
- Usa **Tailwind CSS** per lo styling
- Segui il **design system** del progetto
- Colori: `bemyrider-blue` (#333366), `bemyrider-orange` (#ff9900)

### Componenti
- Usa **shadcn/ui** per i componenti base
- Crea componenti **riutilizzabili**
- Segui le **convenzioni** React/Next.js

### Database
- Usa **Prisma** per le query
- Aggiorna lo **schema** se necessario
- Esegui **migrazioni** per le modifiche

## Struttura del Progetto

```
bemyrider-job-portal/
├── app/                    # Next.js App Router
├── components/            # Componenti React
├── lib/                  # Utilità e configurazioni
├── prisma/               # Schema database
└── scripts/              # Script di utilità
```

## Test

Prima di inviare una PR, assicurati che:

- ✅ Il **build** funzioni: `npm run build`
- ✅ Il **linting** sia pulito: `npm run lint`
- ✅ I **test** passino (se presenti)
- ✅ La **documentazione** sia aggiornata

## Licenza

Contribuendo al progetto, accetti che le tue modifiche saranno rilasciate sotto la licenza MIT.

## Supporto

Se hai domande o bisogno di aiuto:

- Apri una **issue** su GitHub
- Contatta il team di sviluppo

Grazie per il tuo contributo! 🙏 