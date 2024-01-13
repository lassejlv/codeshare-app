# Use the official Bun base image
FROM oven/bun:latest AS base
WORKDIR /app

# Install Node.js
ENV NODE_VERSION=18.17.1
RUN apt update && apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

# Copy your application files
COPY . .

# Install your application's dependencies
RUN bun install --frozen-lockfile

# Generate Prisma client etc.
RUN npx prisma generate

# Other Docker steps...
CMD ["bun", "run", "src/index.ts"]
