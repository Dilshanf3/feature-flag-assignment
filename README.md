# Feature Flag Service# Feature Flag Service



A full-stack feature flag management system built with Laravel and Next.js, enabling dynamic feature rollout control for car damage reporting applications.A car damage reporting system with feature flag management. Built with Laravel and Next.js.



## Tech StackThis is a demo application showing how to implement feature flags. Users can submit car damage reports, and admins can toggle features on/off without deploying new code.



**Backend:**## Quick Start

- Laravel 12 (PHP 8.3)

- PostgreSQL 16**Clone the repository:**

- Redis 7```bash

git clone

**Frontend:**cd feature-flag-service

- Next.js 15 (React 19)```

- TypeScript

- Tailwind CSS v4**One-click setup:**

```bash

## Quick Startchmod +x deploy-local.sh

./deploy-local.sh

### Prerequisites```



- Docker & Docker ComposeThat's it. Everything will be set up and running.

- Git

**Access:**

### Local Development Setup- Frontend: http://localhost:3000

- Backend API: http://localhost:8000/api

1. **Clone the repository**

```bash**Login:**

git clone https://github.com/ravinthedev/feature-flag-service.git- Admin: `admin@example.com` / `password`

cd feature-flag-service- User: `user@example.com` / `password`

```

## Manual Setup

2. **Run the deployment script**

```bashIf you prefer to set things up manually:

./deploy-local.sh

``````bash

# Copy env files

The script will:cp environments/local/backend.env backend/.env

- Start all Docker containers (PostgreSQL, Redis, Backend, Frontend)cp environments/local/frontend.env frontend/.env.local

- Run database migrations

- Seed initial data# Start containers

- Set up the applicationcd environments/local

docker compose --env-file docker.env up -d

3. **Access the application**

- **Frontend:** http://localhost:3000# Setup backend

- **Backend API:** http://localhost:8000docker exec feature-flag-backend php artisan key:generate

docker exec feature-flag-backend php artisan migrate

### Default Credentialsdocker exec feature-flag-backend php artisan db:seed

docker exec feature-flag-backend php artisan storage:link

**Admin User:**```

- Email: `admin@example.com`

- Password: `password`

## Architecture

**Regular User:**

- Email: `user@example.com`This project uses a standard Laravel MVC (Model-View-Controller) architecture for the backend. All business logic, data access, and HTTP handling follow Laravel's conventions for maintainability and clarity.

- Password: `password`

### Backend (Laravel)

## Features```

app/

### Feature Flag Management (Admin)├── Models/              # Eloquent models (FeatureFlag, CarReport, etc.)

- Create and manage feature flags├── Http/

- Multiple rollout strategies:│   ├── Controllers/     # API endpoints

  - Full Deployment (all users)│   ├── Requests/        # Validation

  - Progressive Rollout (percentage-based)│   ├── Resources/       # Response formatting

  - Scheduled Release (time-based)│   └── Middleware/      # Auth, CORS

  - Targeted Access (specific users)├── Providers/           # Service providers

- Real-time analytics and decision tracking├── Repositories/        # (If used) Eloquent-based repositories

```

### Car Damage Reports (User)

- Submit vehicle damage reports**Key components:**

- Multiple damage severity levels- **Models**: Eloquent ORM models for all entities

- Track report status- **Controllers**: Handle HTTP requests and responses

- View detailed analytics (when enabled)- **Requests**: Form request validation

- **Resources**: API response formatting

## Project Structure- **Middleware**: Authentication, CORS, etc.



```

feature-flag-service/

├── backend/              # Laravel API

│   ├── app/### Frontend (Next.js)

│   ├── database/The frontend is a modern, professional, and mobile-responsive application built with Next.js, React, and TypeScript. It uses Tailwind CSS for utility-first styling, a custom color palette suitable for car damage systems (reds, oranges, grays, etc.), and all CSS is managed in a single place for consistency. UI components are designed to be reusable and maintainable, and Storybook is integrated for component development and documentation. The codebase follows clean architecture principles for scalability and maintainability.

│   └── routes/

├── frontend/             # Next.js application**Structure:**

│   └── src/```

│       ├── app/src/

│       ├── components/├── app/                 # Pages (App Router)

│       └── lib/├── components/          # Reusable React components (buttons, cards, forms, modals, etc.)

└── environments/├── config/              # Tailwind/theme config, color palette

    └── local/           # Docker configuration├── hooks/               # Custom hooks (useFeatureFlag, etc.)

```├── lib/                 # API clients, utilities

├── types/               # TypeScript types

## Available Scripts```



### Stop Services**Key features:**

```bash- Tailwind CSS for all styling, with a global color palette

cd environments/local- Storybook for isolated component development and documentation

docker compose down- Mobile responsiveness using Tailwind's responsive utilities

```- Clean architecture: feature-based folders, separation of concerns

- All UI elements as reusable components

### View Logs- CSS and theme managed centrally for easy updates

```bash

cd environments/local## Features

docker compose logs -f

```**Feature Flag Management:**

- Boolean (on/off)

### Restart Services- Percentage rollout (gradual release)

```bash- User-specific (by email or role)

cd environments/local- Scheduled (time-based activation)

docker compose restart

```**Car Damage Reports:**

- Submit damage reports

### Reset Database- Upload photos (behind feature flag)

```bash- Filter by status

cd environments/local- Admin moderation

docker compose exec backend php artisan migrate:fresh --seed

```**Other:**

- Redis caching (60s TTL)

## License- Role-based access control

- Decision logging & analytics

This project is for assignment purposes.- Real-time flag evaluation


## How It Works

**Feature Flags:**
1. Admin creates/edits flags via admin panel
2. Flags are cached in Redis for 60 seconds
3. Frontend checks flag status before rendering
4. Every decision is logged for analytics

**Example:**
```javascript
const { enabled } = useFeatureFlag('upload_photos');

if (enabled) {
  // Show photo upload field
}
```

**Handling Disabled Features:**
When a user sees a feature and it gets disabled:
- Client validates flag status before actions
- Shows modal explaining feature is unavailable
- Prevents API calls to disabled features
- Graceful fallback to basic functionality

## Caching Strategy

**Redis caching with smart invalidation:**
- Feature flags cached for 60 seconds
- Cache keys include user context (role, email)
- Auto-invalidate when admin updates flags
- Reduces database load for high traffic

**Why 60 seconds?**
Balance between performance and real-time updates. For instant updates, reduce TTL or use WebSockets.

## API Endpoints

**Public (no auth):**
```
POST /api/feature-flags/{key}/check       # Check if flag is enabled
POST /api/feature-flags/{key}/evaluate    # Detailed evaluation
```

**Authenticated:**
```
POST /api/login                            # Get auth token
GET  /api/car-reports                      # List reports
POST /api/car-reports                      # Create report
```

**Admin only:**
```
GET    /api/admin/feature-flags            # List all flags
POST   /api/admin/feature-flags            # Create flag
PUT    /api/admin/feature-flags/{key}      # Update flag
DELETE /api/admin/feature-flags/{key}      # Delete flag
GET    /api/admin/feature-flags/{key}/analytics  # Usage stats
```

## Testing the System

**1. Login as admin:**
- Go to http://localhost:3000/login
- Use `admin@example.com` / `password`
- You'll see the admin dashboard

**2. Toggle a feature:**
- Go to Admin → Feature Flags
- Click Edit on "Photo Upload"
- Disable it and save
- Open a new report - photo upload is gone

**3. Try percentage rollout:**
- Edit "Advanced Search" flag
- Set rollout to 25%
- Refresh as different users - some see it, some don't

**4. Test user-specific flags:**
- Edit "Beta Dashboard" flag
- Add your email to allowed users
- Only you and other allowed users see it

## Requirements

- Docker & Docker Compose
- That's it!

## Stack

- **Backend:** Laravel 12 (PHP 8.3)
- **Frontend:** Next.js 15 (React 19)
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Auth:** Laravel Sanctum

## Stop Services

```bash
cd environments/local
docker compose down
```

To remove all data:
```bash
docker compose down -v
```

## Improvements

This was built in a day. Here's what could be added:

- Comprehensive test coverage (PHPUnit, Pest, Jest)
- WebSocket for real-time flag updates
- A/B testing metrics
- Flag dependency management
- Audit logs for compliance
- CI/CD pipeline
- Production deployment configs
- Rate limiting
- API documentation (OpenAPI)
- Monitoring & alerting

## License

MIT
