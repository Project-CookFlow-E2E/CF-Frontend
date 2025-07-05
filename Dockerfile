# CF-frontend/Dockerfile
# Use Node.js for frontend application
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 80

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]