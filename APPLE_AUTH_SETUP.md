# Configurazione Autenticazione Apple

## Prerequisiti

1. **Apple Developer Account**: Devi avere un account Apple Developer (99$ all'anno)
2. **App ID**: Devi creare un App ID nel portale Apple Developer
3. **Service ID**: Devi creare un Service ID per l'autenticazione web

## Passi per la Configurazione

### 1. Creare un App ID

1. Vai su [Apple Developer Portal](https://developer.apple.com/account/)
2. Vai su "Certificates, Identifiers & Profiles"
3. Clicca su "Identifiers" → "+" → "App IDs"
4. Seleziona "App" e clicca "Continue"
5. Compila i dettagli:
   - **Description**: `bemyrider-jobs`
   - **Bundle ID**: `it.bemyrider.app.bemyrider-jobs`
   - **Capabilities**: Abilita "Sign In with Apple"
6. Clicca "Continue" e "Register"

### 2. Creare un Service ID

1. Nella sezione "Identifiers", clicca "+" → "Services IDs"
2. Seleziona "Services IDs" e clicca "Continue"
3. Compila i dettagli:
   - **Description**: `bemyrider-jobs-web`
   - **Identifier**: `it.bemyrider.app.bemyrider-jobs.web`
4. Clicca "Continue" e "Register"
5. Clicca sul Service ID appena creato
6. Abilita "Sign In with Apple" e clicca "Configure"
7. Seleziona l'App ID creato nel passo precedente
8. Aggiungi i domini autorizzati:
   - `localhost` (per sviluppo)
   - `app.bemyrider.it` (per produzione)
9. Aggiungi le Return URLs:
   - `http://localhost:3000/api/auth/callback/apple` (sviluppo)
   - `https://app.bemyrider.it/api/auth/callback/apple` (produzione)
10. Clicca "Save"

### 3. Creare una Private Key

1. Vai su "Keys" → "+"
2. Compila i dettagli:
   - **Key Name**: `bemyrider-jobs-signin`
   - **Key ID**: verrà generato automaticamente
3. Abilita "Sign In with Apple"
4. Clicca "Configure" e seleziona l'App ID
5. Clicca "Save"
6. **IMPORTANTE**: Scarica il file `.p8` - non potrai più scaricarlo in futuro!

### 4. Generare il Client Secret

Il Client Secret per Apple deve essere generato usando la chiave privata. Puoi usare questo script Node.js:

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('path/to/your/AuthKey_XXXXXXXXXX.p8');
const teamId = 'YOUR_TEAM_ID'; // Trovalo nel portale Apple Developer
const clientId = 'it.bemyrider.app.bemyrider-jobs.web'; // Il tuo Service ID
const keyId = 'YOUR_KEY_ID'; // L'ID della chiave creata

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  audience: 'https://appleid.apple.com',
  issuer: teamId,
  subject: clientId,
  keyid: keyId
});

console.log(token);
```

### 5. Configurare le Variabili d'Ambiente

#### Per Sviluppo (`.env.local`)
```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth
APPLE_ID=it.bemyrider.app.bemyrider-jobs.web
APPLE_SECRET=your-generated-jwt-token

# Database
DATABASE_URL="your-neon-developer-branch-url"
```

#### Per Produzione (Vercel/Deploy)
```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-production-nextauth-secret
NEXTAUTH_URL=https://app.bemyrider.it

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth
APPLE_ID=it.bemyrider.app.bemyrider-jobs.web
APPLE_SECRET=your-generated-jwt-token

# Database
DATABASE_URL="your-neon-production-branch-url"
```

## Note Importanti

1. **Client ID**: Usa il Service ID (non l'App ID) come `APPLE_ID`
2. **Client Secret**: Usa il JWT token generato come `APPLE_SECRET`
3. **Domini**: Assicurati che i domini siano configurati correttamente nel Service ID
4. **HTTPS**: In produzione, Apple richiede HTTPS (✅ app.bemyrider.it)
5. **Scadenza**: Il JWT token scade dopo 180 giorni, dovrai rigenerarlo
6. **Return URLs**: Devono corrispondere esattamente ai domini configurati

## Test

### Sviluppo
1. Avvia il server di sviluppo: `npm run dev`
2. Vai su `http://localhost:3000/signin`
3. Clicca su "Continua con Apple"
4. Dovresti essere reindirizzato al login di Apple

### Produzione
1. Deploy su `https://app.bemyrider.it`
2. Vai su `https://app.bemyrider.it/signin`
3. Clicca su "Continua con Apple"
4. Dovresti essere reindirizzato al login di Apple

## Risoluzione Problemi

- **"Invalid client"**: Verifica che il Client ID sia il Service ID corretto
- **"Invalid client secret"**: Rigenera il JWT token
- **"Invalid redirect URI"**: Verifica che il dominio e la return URL siano autorizzati nel Service ID
- **"Invalid scope"**: Assicurati che "Sign In with Apple" sia abilitato nel Service ID
- **"Domain not authorized"**: Aggiungi `app.bemyrider.it` ai domini autorizzati

## Produzione

Per la produzione su `https://app.bemyrider.it`, ricorda di:
1. Aggiornare i domini autorizzati nel Service ID con `app.bemyrider.it`
2. Aggiungere la return URL: `https://app.bemyrider.it/api/auth/callback/apple`
3. Usare HTTPS (già configurato)
4. Aggiornare `NEXTAUTH_URL=https://app.bemyrider.it`
5. Rigenerare il JWT token se necessario
6. Testare l'autenticazione in ambiente di produzione 