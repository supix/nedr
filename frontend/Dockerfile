# syntax=docker/dockerfile:1

# 1) Build Angular app using Node
FROM node:20-alpine AS build
ENV NG_CLI_ANALYTICS=ci
WORKDIR /app/frontend

# Copy project sources (exclude node_modules via .dockerignore)
COPY frontend/ ./

# Install dependencies and build for production
# Use npm ci if lockfile exists, otherwise fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi \
    && npm run build -- --configuration production

# 2) NGINX stage to serve built assets and proxy /api to backend
FROM nginx:1.27-alpine

# Copy NGINX config that serves SPA and proxies /api to the server service
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular output into NGINX html root
COPY --from=build /app/frontend/dist/frontend/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
