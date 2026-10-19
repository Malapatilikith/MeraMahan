# ==============================================================================
# Build Stage
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build production assets
COPY . .
RUN npm run build

# ==============================================================================
# Production Runtime Stage (Nginx)
# ==============================================================================
FROM nginx:alpine-slim

LABEL maintainer="MeraMahan Platform Engineering <dev@meramahan.in>"
LABEL description="MeraMahan - Citizen Reporting & Community Awareness Platform Frontend"

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
