# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a FreeCAD-based CNC/CAM/CAD production platform with Turkish UI/UX. Users can generate 3D models and CAM simulations through prompts or parameters, create G-code, and manage manufacturing jobs through a scalable queue system.

## Commands

### Development
```bash
# Start full development stack (API, Web, PostgreSQL, Redis, MinIO, workers)
make dev

# Start individual services
make api        # Start API only
make web        # Start web frontend only
make worker     # Start Celery workers
make beat       # Start Celery beat scheduler

# Development with hot reload
make dev-api    # API with code reload
make dev-web    # Next.js with hot reload
```

### Testing
```bash
# Run all tests
make test

# API tests
make test-api          # Run all API tests
pytest apps/api/tests  # Run specific test file/directory
pytest -k "test_name"  # Run tests matching pattern
pytest -v             # Verbose output

# Web tests
make test-web                    # Run all web tests
npm run test --prefix apps/web   # Run unit tests
npm run test:integration --prefix apps/web  # Run integration tests
npm run test:e2e --prefix apps/web         # Run E2E tests
```

### Code Quality
```bash
# Linting
make lint        # Run all linters
make lint-api    # Python linting (Ruff)
make lint-web    # TypeScript/React linting (ESLint)

# Formatting
make format      # Format all code
make format-api  # Format Python (Black)
make format-web  # Format TypeScript/React (Prettier)

# Type checking
make typecheck-web  # TypeScript type checking
```

### Database
```bash
# Migrations
make migrate     # Apply database migrations
make makemigrations  # Generate new migrations
make seed        # Seed database with sample data
make db-reset    # Reset database (drop and recreate)

# Direct Alembic commands
alembic upgrade head    # Apply all migrations
alembic downgrade -1    # Rollback one migration
alembic revision --autogenerate -m "description"  # Create migration
```

### Build & Deploy
```bash
# Build Docker images
make build       # Build all images
make build-api   # Build API image
make build-web   # Build web image

# Kubernetes deployment
make deploy      # Deploy to Kubernetes
make rollback    # Rollback deployment
```

## Architecture

### Monorepo Structure
```
apps/
├── api/           # FastAPI backend
│   ├── app/       # Application code
│   │   ├── routers/   # API endpoints
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── services/  # Business logic
│   │   ├── tasks/     # Celery tasks
│   │   └── core/      # Core utilities
│   └── tests/     # API tests
└── web/           # Next.js frontend
    ├── src/
    │   ├── app/       # Next.js App Router pages
    │   ├── components/  # React components
    │   ├── lib/       # API clients and utilities
    │   └── hooks/     # Custom React hooks
    └── tests/     # Frontend tests
```

### Technology Stack

**Backend (API)**
- FastAPI with async/await support
- SQLAlchemy ORM with Alembic migrations
- Celery for distributed task processing
- Redis for caching and task queue
- MinIO/S3 for file storage
- FreeCAD integration via subprocess

**Frontend (Web)**
- Next.js 14 with App Router
- TypeScript with strict mode
- Tailwind CSS for styling
- react-three-fiber for 3D visualization
- TanStack Query for data fetching
- Zustand for state management

**Infrastructure**
- PostgreSQL database
- Redis for caching/queues
- MinIO for object storage
- Docker Compose for local development
- Kubernetes with Helm for production
- OpenTelemetry for observability

### Key Patterns

1. **Queue-Based Processing**: All heavy operations (CAD generation, CAM simulation, G-code generation) are processed asynchronously through Celery queues

2. **File Storage**: All generated files (STL, STEP, G-code) are stored in MinIO/S3 with presigned URLs for secure access

3. **API Client Pattern**: Frontend uses dedicated API client modules (`lib/*.ts`) for each resource type

4. **Turkish Localization**: All UI text must be in Turkish. Use existing translations as reference

5. **Dev Auth Mode**: Local development can bypass authentication using `AUTH_MODE=dev`

## Development Workflows

### Adding a New API Endpoint
1. Create router in `apps/api/app/routers/`
2. Define Pydantic schemas in `apps/api/app/schemas/`
3. Add SQLAlchemy models if needed in `apps/api/app/models/`
4. Write service logic in `apps/api/app/services/`
5. Add tests in `apps/api/tests/`
6. Register router in `apps/api/app/main.py`

### Adding a New Frontend Page
1. Create page component in `apps/web/src/app/[route]/page.tsx`
2. Add API client functions in `apps/web/src/lib/`
3. Create reusable components in `apps/web/src/components/`
4. Add tests in `apps/web/tests/`
5. Ensure Turkish translations for all text

### Working with FreeCAD
- FreeCAD operations run in headless mode via `FreeCADCmd`
- Scripts are executed through subprocess in `apps/api/app/services/freecad_service.py`
- Generated files are uploaded to MinIO immediately after creation
- All FreeCAD tasks run in dedicated `freecad` Celery queue

### Database Changes
1. Modify models in `apps/api/app/models/`
2. Generate migration: `make makemigrations`
3. Review migration in `apps/api/alembic/versions/`
4. Apply migration: `make migrate`
5. Update seed data if needed in `apps/api/app/db/seed.py`

## Testing Strategy

- **Unit Tests**: Test individual functions and classes in isolation
- **Integration Tests**: Test API endpoints with database
- **E2E Tests**: Test full user workflows with Playwright
- **FreeCAD Tests**: Smoke tests for FreeCAD operations in `apps/api/app/scripts/run_freecad_smoke.py`

## Environment Variables

Key environment variables to be aware of:
- `AUTH_MODE=dev` - Enable dev auth bypass
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `S3_ENDPOINT_URL` - MinIO/S3 endpoint
- `FREECAD_PATH` - Path to FreeCAD installation
- `CELERY_BROKER_URL` - Celery broker URL
- `NEXT_PUBLIC_API_URL` - API URL for frontend

## Troubleshooting

### Common Issues
1. **FreeCAD not found**: Ensure FreeCAD is installed and `FREECAD_PATH` is set
2. **Database connection failed**: Check PostgreSQL is running with `docker ps`
3. **MinIO access denied**: Verify MinIO credentials in `.env`
4. **Celery tasks not processing**: Check workers are running with `make worker`
5. **Frontend API calls failing**: Verify `NEXT_PUBLIC_API_URL` is correct

### Debugging Commands
```bash
# Check service health
docker ps
docker logs <container_name>

# Access database
docker exec -it projem-postgres-1 psql -U postgres -d projem

# Monitor Celery tasks
celery -A apps.api.app.tasks.celery_app inspect active
celery -A apps.api.app.tasks.celery_app events

# Check Redis
docker exec -it projem-redis-1 redis-cli
```

## Claude Code Agents Usage

### Recommended Agent Structure by Domain

**1. Backend API Agent** (general-purpose)
- FastAPI router development and optimization
- Pydantic schema design and validation
- Service layer business logic
- API endpoint testing and debugging
- Python async/await patterns

**2. Database Agent** (general-purpose)
- SQLAlchemy model design and relationships
- Alembic migration creation and management
- Complex query optimization and performance
- Database schema evolution
- Seed data management and fixtures

**3. Queue & Worker Agent** (general-purpose)
- Celery task definition and orchestration
- Background job queue management
- FreeCAD subprocess integration patterns
- Error handling and retry strategies
- Worker scaling and monitoring

**4. Frontend Agent** (general-purpose)
- Next.js component architecture and patterns
- TypeScript type definitions and validation
- React state management with Zustand
- 3D visualization with react-three-fiber
- Turkish localization and UI/UX patterns

**5. DevOps & Infrastructure Agent** (general-purpose)
- Docker Compose service orchestration
- Kubernetes deployment and scaling
- MinIO/S3 storage integration
- OpenTelemetry observability setup
- Environment configuration management

**6. Test Agent** (general-purpose)
- Pytest test suite design and optimization
- API integration test patterns
- Frontend unit/integration tests with Vitest
- E2E test scenarios with Playwright
- FreeCAD smoke test development
- Mock strategies for external services

**7. Debug & Performance Agent** (general-purpose)
- Production error analysis and resolution
- Performance bottleneck identification
- Memory leak detection in FreeCAD processes
- Database query optimization debugging
- Distributed tracing analysis
- Log aggregation and error pattern recognition

**8. Security Agent** (general-purpose)
- Authentication and authorization implementation
- API security hardening (rate limiting, input validation)
- File upload security and sanitization
- Secret management and environment variable security
- Container security scanning and hardening
- Database access control and SQL injection prevention
- FreeCAD script injection prevention
- OWASP compliance and vulnerability assessment

**9. Research & Technology Scout Agent** (general-purpose)
- Latest technology trends and best practices research
- Framework version updates and migration strategies
- Performance optimization techniques discovery
- Security vulnerability research and mitigation
- Open source library evaluation and recommendation
- Industry standard compliance research
- Competitive analysis and feature benchmarking
- Documentation and tutorial discovery

### Specialized Monitoring Agents

**statusline-setup**
- Monitor all Docker services health
- Track Celery queue lengths and worker status  
- Display database connection status
- Show MinIO storage availability

**output-mode-setup**
- Format structured logs for each service
- Create colored output for test results
- Parse and display FreeCAD processing status
- Format API response debugging

### Domain-Specific Usage Examples

```bash
# Backend API development
/task general-purpose "Analyze FastAPI dependency injection patterns in routers/"

# Database optimization
/task general-purpose "Review SQLAlchemy query performance in models/ and suggest optimizations"

# Queue system debugging  
/task general-purpose "Find and fix Celery task retry patterns in tasks/"

# Frontend component work
/task general-purpose "Analyze React component patterns for 3D viewer integration"

# Infrastructure monitoring
/task general-purpose "Review Docker Compose health checks and suggest improvements"

# Test development and maintenance
/task general-purpose "Create comprehensive pytest fixtures for FreeCAD testing scenarios"
/task general-purpose "Design E2E test suite for CAM processing workflow using Playwright"
/task general-purpose "Add integration tests for MinIO file upload/download patterns"

# Debug and performance analysis
/task general-purpose "Analyze memory usage patterns in FreeCAD subprocess execution"
/task general-purpose "Debug Celery task failures and implement proper error recovery"
/task general-purpose "Profile database queries causing slow API responses"
/task general-purpose "Investigate OpenTelemetry traces for bottleneck identification"

# Security hardening and compliance
/task general-purpose "Audit FastAPI endpoints for proper authentication and authorization"
/task general-purpose "Review file upload endpoints for security vulnerabilities and sanitization"
/task general-purpose "Scan container images for security vulnerabilities and apply hardening"
/task general-purpose "Validate FreeCAD script inputs to prevent code injection attacks"
/task general-purpose "Implement rate limiting and DDoS protection for API endpoints"
/task general-purpose "Review database queries for SQL injection vulnerabilities"

# Research and technology discovery
/task general-purpose "Research latest FastAPI performance optimization techniques and patterns"
/task general-purpose "Investigate new React 18+ features for 3D visualization improvements"
/task general-purpose "Analyze current FreeCAD Python API updates and new capabilities"
/task general-purpose "Research modern CAM processing algorithms and implementation approaches"
/task general-purpose "Discover latest Docker and Kubernetes security best practices"
/task general-purpose "Investigate new TypeScript features for better type safety"

# Development workflow setup
/task statusline-setup "Create status line showing all service health indicators"
/task output-mode-setup "Format Celery task logs with priority and status colors"
/task output-mode-setup "Create colored test output for pytest and Vitest results"
```

## Important Notes

1. **Turkish UI Requirement**: All user-facing text must be in Turkish
2. **File Handling**: Always use MinIO/S3 for file storage, never local filesystem
3. **Async Operations**: Use Celery for any operation taking >1 second
4. **Error Handling**: Always return proper HTTP status codes and error messages
5. **Security**: Never commit secrets, use environment variables
6. **Cross-platform**: Makefile supports both Windows cmd.exe and Unix shells