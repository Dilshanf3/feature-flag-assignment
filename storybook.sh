#!/bin/bash

# Navigate to the environments/local directory
cd "$(dirname "$0")/environments/local" || exit 1

echo "🎨 Starting Storybook with Docker..."
echo "📖 Storybook will be available at: http://localhost:6006"
echo ""

# Build and start only the Storybook service
docker-compose --env-file docker.env up --build storybook

echo ""
echo "🎨 Storybook stopped."