# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# --ignore-scripts skips better-sqlite3 native compile (unused dep)
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ── Production stage ─────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Built frontend from builder
COPY --from=builder /app/dist ./dist

# Server files
COPY server.ts ./
COPY tsconfig.json ./

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]
