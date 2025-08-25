FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration production

FROM nginx:stable-alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Generate runtime config file consumed by InstanceBadge
ARG FRONTEND_INSTANCE_ID=frontend-1
ARG APP_NAME="MEAN POC"
RUN set -eux; \
    mkdir -p /usr/share/nginx/html/assets; \
    echo "{\"instanceId\":\"${FRONTEND_INSTANCE_ID}\",\"appName\":\"${APP_NAME}\"}" > /usr/share/nginx/html/assets/app-config.json

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
