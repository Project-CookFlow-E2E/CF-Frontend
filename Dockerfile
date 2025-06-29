# cookflow-frontend/Dockerfile
FROM cypress/browsers:latest

WORKDIR /e2e

COPY package*.json ./

RUN npm ci # This installs JS package dependencies
RUN npx cypress install --force

COPY . .

EXPOSE 80
CMD ["npm", "run", "dev"] 