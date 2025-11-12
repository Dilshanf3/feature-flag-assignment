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

## Project Structure

```
feature-flag-assignment/
├── README.md                    # This documentation
├── deploy.sh                    # One-command deployment script
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
│   └── src/
│       ├── app/                # Pages and layouts
│       ├── components/         # Reusable UI components
│       ├── hooks/              # Custom React hooks
│       └── lib/                # Utilities and API clients
└── environments/
    ├── local/                   # Local development configuration
    │   ├── docker-compose.yml  # Container orchestration
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

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is created for educational and demonstration purposes. Feel free to use it as a learning resource or starting point for your own feature flag implementation.

---

**Need Help?** Check the troubleshooting section above or review the Docker logs using `docker compose logs -f` to diagnose any issues.
