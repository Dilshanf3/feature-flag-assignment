# Feature Flag Management System

A modern, full-stack application that demonstrates dynamic feature flag management for car damage reporting. This system allows administrators to control feature rollouts without code deployments, providing a flexible and scalable approach to feature management.

## Overview

This application showcases how feature flags can be implemented in a real-world scenario. Users can submit car damage reports while administrators have complete control over which features are available, when they're available, and to whom they're available.

**Key Features:**
- **Dynamic Feature Control** - Enable/disable features without redeployment
- **Multiple Rollout Strategies** - Full deployment, percentage-based, scheduled, and user-specific
- **Real-time Analytics** - Track feature usage and performance
- **Car Damage Reporting** - Complete workflow for damage assessment and reporting
- **Role-based Access** - Separate interfaces for administrators and regular users

## Quick Start

The easiest way to get started is with our one-command deployment:

```bash
git clone https://github.com/Dilshanf3/feature-flag-assignment.git
cd feature-flag-assignment
chmod +x deploy.sh
./deploy.sh
```

This will set up everything you need including:
- Docker containers for all services
- Database with sample data
- Both frontend and backend applications
- All necessary configurations

**Access the Application:**
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

**Default Login Credentials:**
- **Admin:** `admin@example.com` / `password`
- **User:** `user@example.com` / `password`

## Quick Reference

**Essential Commands:**
```bash
# Start full application
./deploy.sh

# Start Storybook only
./deploy.sh storybook

#  View logs
cd environments/local && docker-compose logs -f

#  Restart services
cd environments/local && docker-compose restart

#  Stop everything
cd environments/local && docker-compose down

#  Clean reset (removes all data)
cd environments/local && docker-compose down -v
```

**Application URLs:**
-  **Frontend:** [localhost:3000](http://localhost:3000)
-  **Backend API:** [localhost:8000](http://localhost:8000)
-  **Storybook:** [localhost:6006](http://localhost:6006) *(when running)*

## Component Documentation (Storybook)

The project includes comprehensive component documentation with **Storybook**. View and interact with all UI components in isolation:

**Run Storybook:**
```bash
# Option 1: Using Docker (Recommended - Isolated Environment)
./deploy.sh storybook
# or
./storybook.sh  # Linux/Mac
./storybook.bat # Windows

# Option 2: Using Docker Compose directly
cd environments/local
docker-compose --env-file docker.env up --build storybook

# Option 3: Directly with npm (requires Node.js 18+ and dependencies installed)
cd frontend
npm install
npm run storybook
```

**Step-by-step Storybook Setup:**

1. **Prerequisites Check:**
   ```bash
   # Ensure Docker is running (for Docker methods)
   docker --version
   docker-compose --version
   
   # OR ensure Node.js is installed (for npm method)
   node --version  # Should be 18+
   npm --version
   ```

2. **Quick Start with Docker:**
   ```bash
   # From project root directory
   chmod +x deploy.sh storybook.sh  # Linux/Mac only
   ./deploy.sh storybook
   ```

3. **Alternative: Local Development:**
   ```bash
   cd frontend
   npm install        # Install dependencies
   npm run storybook  # Start Storybook server
   ```

4. **Verify Installation:**
   - Open browser to [http://localhost:6006](http://localhost:6006)
   - You should see the Welcome page with component navigation
   - Browse through "UI Components" in the sidebar

**Troubleshooting Storybook:**
```bash
# If port 6006 is in use
lsof -i :6006  # Find process using port (Linux/Mac)
netstat -ano | findstr :6006  # Windows

# Clean restart
cd frontend
rm -rf node_modules package-lock.json  # Clean dependencies
npm install
npm run storybook

# Docker clean restart
docker-compose down
docker-compose --env-file docker.env up --build storybook
```

**Access Storybook:**
- **Component Library:** [http://localhost:6006](http://localhost:6006)

**Available Component Stories:**
- **Button** - All variants, sizes, and states
- **Input** - Form inputs with various types
- **Card** - Content containers and layouts
- **Modal** - Dialog and overlay components
- **Badge** - Status and category indicators

Storybook provides:
- Interactive component playground
- Accessibility testing
- Responsive design testing


## Technology Stack

**Backend (API Layer):**
- Laravel 12 with PHP 8.3
- PostgreSQL 16 for data persistence
- Redis 7 for caching and sessions
- Laravel Sanctum for authentication

**Frontend (User Interface):**
- Next.js 15 with React 19
- TypeScript for type safety
- Tailwind CSS v4 for styling
- Custom component library with Storybook

**Infrastructure:**
- Docker & Docker Compose for containerization
- Multi-environment configuration support

## Core Features

### Feature Flag Management
Administrators have comprehensive control over feature availability:

- **Boolean Flags** - Simple on/off toggles for any feature
- **Percentage Rollouts** - Gradually release features to a percentage of users
- **User-Specific Flags** - Target specific users by email or role
- **Scheduled Releases** - Automatically activate features at specific times
- **Real-time Updates** - Changes take effect immediately (cached for 60 seconds)

### Car Damage Reporting System
A complete workflow for handling vehicle damage reports:

- **Report Submission** - Users can submit detailed damage reports
- **Photo Upload** - Conditional photo upload based on feature flags
- **Status Tracking** - Monitor report progress through different states
- **Admin Moderation** - Administrative oversight and approval workflows
- **Analytics Dashboard** - Usage statistics and reporting metrics

### Technical Features
- **Intelligent Caching** - Redis-based caching with smart invalidation
- **Decision Logging** - Complete audit trail of all feature flag decisions
- **Role-based Security** - Separate permissions for admins and regular users
- **RESTful API** - Clean API design with comprehensive endpoints
- **Responsive Design** - Mobile-first interface that works on all devices

## How Feature Flags Work

The feature flag system operates on a simple yet powerful principle:

1. **Flag Creation** - Administrators create flags through the admin interface
2. **Caching Layer** - Flags are cached in Redis for optimal performance
3. **Client Evaluation** - Frontend applications check flag status before rendering features
4. **Decision Tracking** - Every flag evaluation is logged for analytics
5. **Graceful Degradation** - Disabled features fall back to basic functionality

**Example Implementation:**
```javascript
const { enabled } = useFeatureFlag('upload_photos');

if (enabled) {
  return <PhotoUploadComponent />;
} else {
  return <BasicReportForm />;
}
```

## System Architecture

### Backend Architecture
The Laravel backend follows a clean, maintainable structure:

- **Models** - Eloquent ORM models for data management
- **Controllers** - HTTP request handling and response formatting
- **Repositories** - Data access abstraction layer
- **Services** - Business logic and feature flag evaluation
- **Middleware** - Authentication, CORS, and request validation

### Frontend Architecture
The Next.js frontend is built with modern React patterns:

- **App Router** - File-based routing with Next.js 15
- **Component Library** - Reusable UI components with Storybook documentation
- **Custom Hooks** - React hooks for feature flag integration
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Utility-first styling with custom design system

### Data Flow
```
User Request → Frontend → Feature Flag Check → API Call → Database → Response
              ↓
         Redis Cache ← Flag Evaluation ← Business Logic
```

## API Reference

### Public Endpoints
```
POST /api/feature-flags/{key}/check       # Check if flag is enabled
POST /api/feature-flags/{key}/evaluate    # Get detailed flag evaluation
```

### Authenticated Endpoints
```
POST /api/login                           # User authentication
GET  /api/car-reports                     # List user's reports
POST /api/car-reports                     # Create new report
PUT  /api/car-reports/{id}                # Update existing report
```

### Admin-Only Endpoints
```
GET    /api/admin/feature-flags           # List all feature flags
POST   /api/admin/feature-flags           # Create new flag
PUT    /api/admin/feature-flags/{key}     # Update existing flag
DELETE /api/admin/feature-flags/{key}     # Delete flag
GET    /api/admin/feature-flags/{key}/analytics # Flag usage statistics
```

## Getting Started Guide

### Testing the Feature Flag System

1. **Access Admin Dashboard**
   - Navigate to [http://localhost:3000/login](http://localhost:3000/login)
   - Login with: `admin@example.com` / `password`
   - You'll see the administrative interface

2. **Toggle Features in Real-time**
   - Go to Admin → Feature Flags
   - Find the "Photo Upload" feature and click Edit
   - Disable the feature and save changes
   - Open a new damage report - the photo upload option disappears instantly

3. **Test Percentage Rollouts**
   - Edit the "Advanced Search" feature flag
   - Set the rollout percentage to 25%
   - Refresh the page multiple times or test with different user accounts
   - Notice that only 25% of users will see this feature

4. **User-Specific Feature Access**
   - Edit the "Beta Dashboard" feature flag
   - Add specific email addresses to the allowed users list
   - Only users with those email addresses will see this feature

### Manual Setup (Alternative)

If you prefer to set up the application manually:

```bash
# Copy environment configuration files
cp environments/local/backend.env backend/.env
cp environments/local/frontend.env frontend/.env.local

# Navigate to the Docker environment
cd environments/local

# Start all services
docker compose --env-file docker.env up -d

# Setup the Laravel backend
docker exec feature-flag-backend php artisan key:generate
docker exec feature-flag-backend php artisan migrate
docker exec feature-flag-backend php artisan db:seed
docker exec feature-flag-backend php artisan storage:link
```

### Development Commands

**View Application Logs:**
```bash
cd environments/local
docker compose logs -f
```

**Restart All Services:**
```bash
cd environments/local
docker compose restart
```

**Stop All Services:**
```bash
cd environments/local
docker compose down
```

**Reset Database with Fresh Data:**
```bash
cd environments/local
docker compose exec backend php artisan migrate:fresh --seed
```

**Stop and Remove All Data:**
```bash
cd environments/local
docker compose down -v
```

## Troubleshooting

### Common Issues and Solutions

**Docker Issues:**
```bash
# Docker not running
# Solution: Start Docker Desktop and ensure it's running

# Port conflicts (3000, 8000, 6006 already in use)
# Solution: Stop conflicting services
docker ps                    # Check running containers
docker stop <container_id>   # Stop conflicting container
lsof -i :3000               # Find process on port (Linux/Mac)
netstat -ano | findstr :3000 # Find process on port (Windows)

# Permission denied on deploy.sh
chmod +x deploy.sh storybook.sh  # Make scripts executable (Linux/Mac)
```

**📖 Storybook Specific Issues:**
```bash
# "Failed to fetch dynamically imported module" error
cd frontend
rm -rf node_modules package-lock.json .storybook-static
npm install
npm run storybook

# Components not rendering properly
# Ensure Tailwind CSS is loaded in preview.ts
# Check: frontend/.storybook/preview.ts should import globals.css

# Stories not appearing in sidebar
# Check: frontend/.storybook/main.ts stories path configuration
# Verify: .stories.tsx files are in src/components/ directory
```

**🔄 Service Restart Issues:**
```bash
# Clean restart all services
cd environments/local
docker-compose down -v
docker-compose --env-file docker.env up --build

# Reset database only
docker exec feature-flag-backend php artisan migrate:fresh --seed

# Clear frontend build cache
cd frontend
rm -rf .next node_modules
npm install
```

**Network and Access Issues:**
```bash
# Frontend not accessible
# Check: http://localhost:3000
# Verify: docker-compose logs frontend

# Backend API not responding
# Check: http://localhost:8000/api/health
# Verify: docker-compose logs backend

# Storybook not loading
# Check: http://localhost:6006
# Verify: Storybook service is running
```

**Environment Variables:**
```bash
# Missing or incorrect environment configuration
# Verify: environments/local/docker.env exists
# Check: All required variables are set
# Ensure: File paths in docker-compose.yml are correct
```

### Getting Help

If you encounter issues not covered here:

1. **Check service logs:**
   ```bash
   cd environments/local
   docker-compose logs [service-name]
   ```

2. **Verify all services are running:**
   ```bash
   docker ps
   ```

3. **Clean slate restart:**
   ```bash
   ./deploy.sh  # Full deployment restart
   ```

## Project Structure

```
feature-flag-assignment/
├── README.md                    # This documentation
├── deploy.sh                    # One-command deployment script
├── storybook.sh                 # Storybook launcher script (Linux/Mac)
├── storybook.bat                # Storybook launcher script (Windows)
├── backend/                     # Laravel API application
│   ├── app/
│   │   ├── Http/Controllers/    # API endpoint handlers
│   │   ├── Models/             # Eloquent ORM models
│   │   ├── Repositories/       # Data access layer
│   │   └── Services/           # Business logic
│   ├── database/
│   │   ├── migrations/         # Database schema
│   │   └── seeders/            # Sample data
│   └── routes/api.php          # API route definitions
├── frontend/                    # Next.js React application
│   ├── .storybook/             # Storybook configuration
│   │   ├── main.ts             # Storybook main configuration
│   │   ├── preview.ts          # Global Storybook settings
│   │   └── vitest.setup.ts     # Testing configuration
│   └── src/
│       ├── app/                # Pages and layouts
│       ├── components/         # Reusable UI components
│       │   └── ui/             # UI component library
│       │       ├── Button.stories.tsx      # Button component stories
│       │       ├── Input.stories.tsx       # Input component stories
│       │       ├── Card.stories.tsx        # Card component stories
│       │       ├── Modal.stories.tsx       # Modal component stories
│       │       └── Badge.stories.tsx       # Badge component stories
│       ├── hooks/              # Custom React hooks
│       ├── lib/                # Utilities and API clients
│       └── Welcome.stories.tsx # Storybook welcome page story
└── environments/
    ├── local/                   # Local development configuration
    │   ├── docker-compose.yml  # Container orchestration (includes Storybook service)
    │   ├── docker.env          # Docker environment variables
    │   ├── backend.env         # Laravel configuration
    │   └── frontend.env        # Next.js configuration
    └── production/             # Production environment (if needed)
```

## Performance and Caching

The application implements intelligent caching strategies to ensure optimal performance:

**Redis Caching Strategy:**
- Feature flags are cached for 60 seconds to balance performance with real-time updates
- Cache keys include user context (role, email) for personalized experiences
- Automatic cache invalidation when administrators update feature flags
- Significantly reduces database load for high-traffic scenarios

**Why 60 Seconds?**
This TTL provides an excellent balance between performance and responsiveness. For applications requiring instant updates, you can reduce the TTL or implement WebSocket connections for real-time communication.

## Security Considerations

- **Authentication** - Laravel Sanctum provides secure API token authentication
- **Authorization** - Role-based access control separates admin and user permissions
- **Data Validation** - All inputs are validated using Laravel Form Requests
- **SQL Injection Protection** - Eloquent ORM provides built-in protection
- **CORS Configuration** - Properly configured cross-origin resource sharing

## Future Enhancements

This application was designed as a demonstration and learning tool. Potential improvements include:

**Testing and Quality:**
- Comprehensive test coverage (PHPUnit, Pest, Jest)
- End-to-end testing with Cypress or Playwright
- Code quality tools (ESLint, Prettier, PHP CS Fixer)

**Performance and Scalability:**
- WebSocket integration for real-time feature flag updates
- Database query optimization and indexing
- CDN integration for static assets
- Load balancing for high availability

**Feature Enhancements:**
- A/B testing capabilities with statistical analysis
- Feature flag dependencies and conflict detection
- Comprehensive audit logging for compliance
- Advanced analytics and reporting dashboards
- Flag scheduling with more complex time-based rules

**Development and Operations:**
- CI/CD pipeline with automated testing and deployment
- Production deployment configurations
- Monitoring, alerting, and health checks
- API documentation with OpenAPI/Swagger
- Rate limiting and API throttling

## Requirements

- **Docker** and **Docker Compose** - For containerization and orchestration
- **Git** - For version control and repository management

That's it! All other dependencies are handled through Docker containers.

