# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build
RUN ls dist

# Expose port
EXPOSE 3001

# Command
CMD [ "npm", "start" ]