# ===================================================
# DropoutGuard AI - Client Frontend
# Multi-Stage Build: Node 20 Alpine -> Nginx Alpine
# ===================================================

# Stage 1: Build production assets with Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for layer caching
COPY package*.json ./
RUN npm install

# Copy source files
COPY index.html ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY public/ ./public/
COPY src/ ./src/

# Set API URL build argument (defaults to '/api' for Nginx reverse-proxy)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Compile production bundle
RUN npm run build

# Stage 2: Serve optimized assets with Nginx
FROM nginx:alpine AS runner

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built distribution from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
