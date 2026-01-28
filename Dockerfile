# Use Node.js 20 on Debian (slim) for better compatibility with fonts/native modules
FROM node:20-slim

# Install system dependencies required for Doppler and potentially fonts/canvas
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Doppler CLI
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Set common env vars
ENV PORT=7860
ENV NODE_ENV=production

# Don't run as root
USER node

# Start the application wrapped in Doppler
CMD ["doppler", "run", "--", "npm", "start"]
