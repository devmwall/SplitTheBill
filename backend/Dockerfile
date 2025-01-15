FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies
RUN npm install

# Create uploads directory
RUN mkdir -p uploads

# Copy source code
COPY . .

# Set correct permissions for uploads directory
RUN chown -R node:node uploads

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Use nodemon in development
CMD ["npm", "run", "dev"]