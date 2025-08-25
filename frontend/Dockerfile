# syntax=docker/dockerfile:1

# 1) Build Angular app using Node
FROM node:20-alpine AS build
ENV NG_CLI_ANALYTICS=ci
WORKDIR /app/frontend

# Copy only necessary files to avoid context issues and improve caching
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./
COPY proxy.conf.json ./
COPY src ./src
COPY public ./public

# Install dependencies and build for production
# Use npm ci if lockfile exists, otherwise fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi \
    && npm run build -- --configuration production

# 2) NGINX stage to serve built assets and proxy /api to the backend
FROM nginx:1.27-alpine

# Install curl for container healthcheck
RUN apk add --no-cache curl

# Copy NGINX config that serves SPA and proxies /api to the server service
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular output into NGINX html root (Angular application builder outputs to 'browser')
COPY --from=build /app/frontend/dist/frontend/browser/ /usr/share/nginx/html/

# Generate runtime config file consumed by InstanceBadge
ARG FRONTEND_INSTANCE_ID=frontend-1
ARG APP_NAME="MEAN POC"
RUN set -eux; \
    mkdir -p /usr/share/nginx/html/assets; \
    echo "{\"instanceId\":\"${FRONTEND_INSTANCE_ID}\",\"appName\":\"${APP_NAME}\"}" > /usr/share/nginx/html/assets/app-config.json

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
