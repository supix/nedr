# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json tsconfig.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy sources and build
COPY src ./src
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

# Add curl for healthchecks
RUN apk add --no-cache curl

ENV NODE_ENV=production

# Install only production deps
COPY package.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy built files and public assets
COPY --from=build /usr/src/app/dist ./dist
COPY public ./public

EXPOSE 3000
CMD ["node", "dist/app.js"]
