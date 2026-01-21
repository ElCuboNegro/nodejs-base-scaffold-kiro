# Multi-stage Dockerfile for AI Voice Verification Agent
# Follows Google JavaScript Style Guide and security best practices

# Development stage with all tools and dependencies
FROM node:24.13.0-alpine AS development

# Set working directory
WORKDIR /app

# Set environment variable to allow npm install in Docker
ENV DOCKER_CONTAINER=true

# Install system dependencies for security scanning and quality tools
RUN apk add --no-cache \
    git \
    bash \
    curl \
    python3 \
    py3-pip \
    build-base \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./
COPY .nvmrc ./

# Set ownership before installing dependencies
RUN chown -R nodejs:nodejs /app
USER nodejs

# Install all dependencies (including dev dependencies)
RUN npm install --include=dev

# Copy source code and configuration (as nodejs user)
COPY --chown=nodejs:nodejs . .

# Expose application port
EXPOSE 5253

# Default command for development
CMD ["npm", "run", "dev"]

# Testing stage - optimized for running tests
FROM development AS test

# Switch back to root for test setup
USER root

# Create reports directory with proper permissions
RUN mkdir -p /app/reports && \
    chown -R nodejs:nodejs /app/reports

# Switch back to nodejs user
USER nodejs

# Set test environment
ENV NODE_ENV=test
ENV CUCUMBER_PUBLISH_ENABLED=false

# Default command for testing
CMD ["npm", "run", "test:bdd"]

# Production stage - minimal runtime
FROM node:24.13.0-alpine AS production

# Set working directory
WORKDIR /app

# Install only production system dependencies
RUN apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY --chown=nodejs:nodejs src/ ./src/

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 5253

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Default command for production
CMD ["node", "src/index.js"]
