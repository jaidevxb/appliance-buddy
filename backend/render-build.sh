#!/bin/bash
# Render build script for backend

echo "Starting Render build process..."

# Install dependencies
npm install

# Build the application
npm run build

echo "Render build process completed successfully!"