# Use the official Node.js image as the base image
FROM node:16-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use the official nginx image as the base image for serving the application
FROM nginx:alpine

# Copy the built application from the builder stage to the nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
