FROM node:22-slim AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm cache clean --force && npm ci

RUN ls -la /app/package.json /app/package-lock.json || echo "ERROR: package-lock.json or package.json not found in /app"
# Print the first few lines of package-lock.json to verify its content
RUN echo "--- Start of package-lock.json in container ---" && cat /app/package-lock.json | head -n 10 || echo "ERROR: Could not read package-lock.json"
RUN echo "--- End of package-lock.json in container ---"

# Original Vite/npm diagnostics (keep for now)
RUN if [ -f "./node_modules/.bin/vite" ]; then echo "Vite executable found at ./node_modules/.bin/vite!"; else echo "ERROR: Vite executable NOT found at ./node_modules/.bin/vite!"; fi
RUN which npm || echo "npm not in PATH"
RUN npm config get prefix
RUN ls -la /app/node_modules/rollup/dist || echo "rollup/dist not found"
RUN ls -la /app/node_modules/@rollup || echo "@rollup not found"
# --- END DIAGNOSTIC STEPS ---

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
