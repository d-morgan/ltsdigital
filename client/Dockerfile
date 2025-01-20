# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Command for development server
CMD [ "npm", "run", "dev", "--", "--host" ]