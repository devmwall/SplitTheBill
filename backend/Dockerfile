FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies with specific flags
RUN npm install --production=false --legacy-peer-deps

# Create uploads directory
RUN mkdir -p uploads

# Copy source code
COPY . .

# Debug: List contents after copy
RUN ls -la && \
    ls -la node_modules

# Set permissions
RUN chown -R node:node .

USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]