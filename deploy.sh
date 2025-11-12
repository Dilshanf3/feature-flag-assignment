#!/bin/bash

# Feature Flag Management System - Deployment Script
# This script sets up and deploys the complete application stack

set -e  # Exit on any error

echo "🚀 Starting Feature Flag Management System Deployment"
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed and running
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        print_error "Visit: https://www.docker.com/products/docker-desktop/"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available."
        exit 1
    fi
    
    print_success "Docker is ready"
}

# Check if required directories exist
check_directories() {
    print_status "Checking project structure..."
    
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found"
        exit 1
    fi
    
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found"
        exit 1
    fi
    
    if [ ! -d "environments/local" ]; then
        print_error "Local environment configuration not found"
        exit 1
    fi
    
    print_success "Project structure is valid"
}

# Copy environment files
setup_environment() {
    print_status "Setting up environment configuration..."
    
    # Copy backend environment file
    if [ -f "environments/local/backend.env" ]; then
        cp "environments/local/backend.env" "backend/.env"
        print_success "Backend environment configured"
    else
        print_error "Backend environment file not found"
        exit 1
    fi
    
    # Copy frontend environment file
    if [ -f "environments/local/frontend.env" ]; then
        cp "environments/local/frontend.env" "frontend/.env.local"
        print_success "Frontend environment configured"
    else
        print_error "Frontend environment file not found"
        exit 1
    fi
}

# Stop existing containers
cleanup_existing() {
    print_status "Cleaning up existing containers..."
    
    cd environments/local
    
    # Stop and remove containers if they exist
    if docker-compose --env-file docker.env ps -q 2>/dev/null; then
        docker-compose --env-file docker.env down -v 2>/dev/null || true
        print_success "Existing containers stopped and removed"
    fi
    
    cd ../..
}

# Build and start containers
start_containers() {
    print_status "Building and starting containers..."
    print_warning "This may take a few minutes on first run..."
    
    cd environments/local
    
    # Build and start all services
    if docker compose --env-file docker.env up -d --build; then
        print_success "All containers started successfully"
    else
        print_error "Failed to start containers"
        exit 1
    fi
    
    cd ../..
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database to be ready
    print_status "Waiting for database..."
    sleep 10
    
    # Wait for backend to be ready
    print_status "Waiting for backend API..."
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:8000 > /dev/null 2>&1; then
            break
        fi
        sleep 2
        attempt=$((attempt + 1))
        echo -n "."
    done
    echo ""
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Backend API failed to start within expected time"
        exit 1
    fi
    
    print_success "Backend API is ready"
    
    # Wait for frontend to be ready
    print_status "Waiting for frontend..."
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            break
        fi
        sleep 2
        attempt=$((attempt + 1))
        echo -n "."
    done
    echo ""
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Frontend failed to start within expected time"
        exit 1
    fi
    
    print_success "Frontend is ready"
}

# Setup database and seed data
setup_database() {
    print_status "Setting up database..."
    
    # Run migrations and seed data
    if docker exec feature-flag-backend php artisan migrate:fresh --seed --force; then
        print_success "Database setup completed"
    else
        print_error "Database setup failed"
        exit 1
    fi
    
    # Create storage symlink
    docker exec feature-flag-backend php artisan storage:link || true
}

# Display final information
show_completion_info() {
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "=========================================="
    echo ""
    print_success "Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo ""
    print_success "Default Login Credentials:"
    echo "   Admin: admin@example.com / password"
    echo "   User: user@example.com / password"
    echo ""
    print_status "Useful Commands:"
    echo "   Stop services: cd environments/local && docker-compose down"
    echo "   View logs: cd environments/local && docker-compose logs -f"
    echo "   Restart: cd environments/local && docker-compose restart"
    echo ""
    print_warning "Note: Initial startup may take a few extra minutes for frontend compilation"
}

# Error handler
handle_error() {
    print_error "Deployment failed at step: $1"
    print_error "Check the logs above for more details"
    
    echo ""
    print_status "Troubleshooting:"
    echo "   1. Ensure Docker Desktop is running"
    echo "   2. Check if ports 3000 and 8000 are available"
    echo "   3. Try running: cd environments/local && docker-compose logs"
    echo "   4. For a fresh start: cd environments/local && docker-compose down -v"
    
    exit 1
}

# Main deployment flow
main() {
    echo ""
    
    # Set up error handling
    trap 'handle_error "Unknown"' ERR
    
    check_docker || handle_error "Docker check"
    check_directories || handle_error "Directory check"
    setup_environment || handle_error "Environment setup"
    cleanup_existing || handle_error "Cleanup"
    start_containers || handle_error "Container startup"
    wait_for_services || handle_error "Service readiness"
    setup_database || handle_error "Database setup"
    
    show_completion_info
}

# Run the deployment
main "$@"