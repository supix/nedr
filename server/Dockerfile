# syntax=docker/dockerfile:1
FROM node:22-alpine

WORKDIR /usr/src/app

# Add curl for healthchecks
RUN apk add --no-cache curl

# Install only production dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy source
COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/index.js"]
