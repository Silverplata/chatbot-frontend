# Stage 1: Build the Angular application
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Angular app
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build /app/dist/chatbot-frontend/browser /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 4200

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]