# Dockerfile per bemyrider-job-portal
FROM node:18-alpine AS base

# Installa dipendenze necessarie per Prisma
RUN apk add --no-cache libc6-compat openssl

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione delle dipendenze
COPY package*.json ./
COPY prisma ./prisma/

# Installa le dipendenze
RUN npm ci --only=production && npm cache clean --force

# Genera il client Prisma
RUN npx prisma generate

# Stage di build
FROM node:18-alpine AS builder
WORKDIR /app

# Copia le dipendenze dal stage base
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./
COPY --from=base /app/prisma ./prisma

# Copia il codice sorgente
COPY . .

# Genera il client Prisma e builda l'applicazione
RUN npx prisma generate
RUN npm run build

# Stage di produzione
FROM node:18-alpine AS runner
WORKDIR /app

# Imposta l'utente non-root per sicurezza
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia i file necessari dal builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Cambia proprietario dei file
RUN chown -R nextjs:nodejs /app

# Passa all'utente nextjs
USER nextjs

# Esponi la porta
EXPOSE 3000

# Variabile d'ambiente per la porta
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando di avvio
CMD ["node", "server.js"]
