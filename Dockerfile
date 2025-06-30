# # cookflow-frontend/Dockerfile
# FROM cypress/browsers:latest

# WORKDIR /e2e

# COPY package*.json ./

# RUN npm ci # This installs JS package dependencies
# RUN npx cypress install --force

# COPY . .

# EXPOSE 80
# CMD ["npm", "run", "dev"] 

# cookflow-frontend/Dockerfile
FROM cypress/browsers:latest
                               # Consider a lighter node image if Cypress isn't needed for frontend build
                               # e.g., FROM node:20-alpine

WORKDIR /app # Change WORKDIR to /app for frontend, consistent with other projects

COPY package*.json ./

RUN npm ci # This installs JS package dependencies
# RUN npx cypress install --force # This is not needed in frontend Dockerfile, only for cypress service

COPY . .

# Ensure the dev server runs on port 80 inside the container
# If 'npm run dev' does not start on 80, you might need to configure your frontend framework
# (e.g., vite.config.js for Vite) to serve on 0.0.0.0:80 in production/container environments.
EXPOSE 80
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"] # Explicitly bind to 0.0.0.0:80