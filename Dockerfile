# Use Node.js 20
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose port for Cloud Run
EXPOSE 8080

# Run the app
ENV PORT 8080
CMD ["npm", "run", "start"]
