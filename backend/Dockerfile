FROM node:23-slim

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

EXPOSE 5000

CMD ["npm", "start"]