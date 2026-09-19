# ===================================================
# DropoutGuard AI - Enterprise Backend API
# Node.js 20 Alpine with Express & Datastore/MongoDB
# ===================================================

FROM node:20-alpine

WORKDIR /app

# Install curl for container health check
RUN apk add --no-cache curl

# Install production dependencies first (layer caching)
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy application source code
COPY controllers/ ./controllers/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY routes/ ./routes/
COPY services/ ./services/
COPY server.js ./

# Set environment defaults
ENV NODE_ENV=production \
    PORT=5000

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start server
CMD ["node", "server.js"]
