@echo off
cd /d "%~dp0environments\local"

echo 🎨 Starting Storybook with Docker...
echo 📖 Storybook will be available at: http://localhost:6006
echo.

REM Build and start only the Storybook service
docker-compose --env-file docker.env up --build storybook

echo.
echo 🎨 Storybook stopped.