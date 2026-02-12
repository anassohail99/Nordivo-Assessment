# Movie Theater Seat Reservation System - Project Documentation

## Project Overview

A production-ready, full-stack movie theater seat reservation system built with modern web technologies. The application handles real-time seat availability, concurrent bookings, reservation confirmation, and reward points tracking.

## Live Application

- **Live Application**: https://nordivo-assessment.vercel.app
- **Backend API**: https://thoughtful-dona-anasproject-2cdd5428.koyeb.app
- **Source Code**: https://github.com/anassohail99/Nordivo-Assessment

## Key Features Implemented

### Core Functionality

- **User Authentication & Authorization**: Secure JWT-based authentication with session management
- **Movie Catalog Integration**: Real-time movie data from TMDB API with caching
- **Dynamic Seat Selection**: Interactive seat map with real-time availability updates
- **Seat Locking Mechanism**: 5-minute temporary locks using Redis to prevent double-booking
- **Add-ons Upselling**: Food, beverages, and accessories with dynamic pricing
- **Reservation Management**: Complete booking lifecycle with cancellation support
- **Reward Points System**: Earn points on bookings, tracked across user sessions
- **Concurrent User Handling**: Redis-based distributed locks and MongoDB transactions

### Technical Highlights

- **Real-time Updates**: Polling mechanism for seat availability (3-second intervals)
- **Data Consistency**: MongoDB transactions for atomic operations
- **Caching Strategy**: Redis caching for movie data and seat locks
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation on both frontend and backend
- **Production Ready**: Docker containerization and cloud deployment

## Architecture & Technology Stack

### Backend Architecture

- **Runtime**: Node.js 20 with Express.js
- **Language**: TypeScript for type safety
- **Database**: MongoDB Atlas (cloud-hosted)
- **Cache Layer**: Redis (Upstash) for distributed locks and caching
- **Authentication**: JWT with secure token-based authentication
- **External API**: TMDB API for movie data
- **Deployment**: Koyeb (Docker container)

### Frontend Architecture

- **Framework**: React 18 with Vite build tool
- **Language**: TypeScript
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: Zustand for global state
- **Routing**: React Router v6
- **API Client**: Axios with interceptors
- **Deployment**: Vercel (optimized for static sites)

### Infrastructure

- **Version Control**: Git with GitHub
- **CI/CD**: Automated deployments on push
- **Backend Hosting**: Koyeb (free tier with Docker)
- **Frontend Hosting**: Vercel (free tier with CDN)
- **Database**: MongoDB Atlas (free M0 cluster)
- **Cache**: Upstash Redis (free tier)

## Database Schema

### Collections

**Users**

- Authentication credentials (hashed passwords)
- Reward points tracking
- User profile information

**Movies**

- TMDB integration data
- Runtime, ratings, genres
- Poster and backdrop URLs

**Showtimes**

- Movie references
- Theater and timing information
- Pricing configuration
- Seat availability matrix

**Reservations**

- User and showtime references
- Selected seats and add-ons
- Payment and points information
- Status tracking (active/cancelled)

**Add-ons**

- Product catalog (food, beverages, accessories)
- Pricing and availability
- Category management

## Security Implementation

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Tokens**: Secure token generation with expiry
- **Token Storage**: Client-side token management with secure transmission
- **CORS Configuration**: Whitelisted origins only
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Request validation and sanitization
- **MongoDB Injection Prevention**: Parameterized queries

## Deployment Process

### Backend Deployment (Koyeb)

1. Multi-stage Docker build for optimization
2. Automated builds from GitHub commits
3. Environment variables configuration
4. Health checks on port 5000
5. Automatic scaling and zero-downtime deploys

### Frontend Deployment (Vercel)

1. Automatic builds from GitHub
2. Edge network CDN distribution
3. Environment variables for API URL
4. Instant rollback capability
5. Preview deployments for pull requests

## Development Approach

### Planning & Architecture

- Initial requirements analysis and feature breakdown
- Technology stack evaluation and selection
- Database schema design with relationship mapping
- API endpoint planning and documentation
- State management strategy definition

### Implementation Strategy

- Modular component architecture for maintainability
- Service layer pattern for business logic separation
- Reusable hooks for common functionality
- Comprehensive error boundary implementation
- Progressive enhancement approach

### Code Quality & Best Practices

- TypeScript for compile-time type checking
- ESLint and Prettier for code consistency
- Organized folder structure by feature
- Clear naming conventions
- Component composition over inheritance
- DRY (Don't Repeat Yourself) principles

### Testing Approach

- Manual testing of all user flows
- Edge case validation (concurrent bookings, expired locks)
- Cross-browser compatibility testing
- Responsive design verification
- API endpoint testing with various scenarios

## AI-Assisted Development

This project leveraged AI assistance in the following areas:

### Architectural Planning

- Brainstormed system architecture and technology choices
- Discussed database schema design and relationships
- Evaluated trade-offs between different implementation approaches
- Planned API structure and endpoint organization

### Development Assistance

- Code structure and pattern recommendations
- TypeScript type definitions and interfaces
- Error handling strategies and edge case identification
- Performance optimization suggestions
- Security best practices implementation

### Code Review & Refinement

- Code quality improvements and refactoring suggestions
- Best practices validation
- Accessibility considerations
- Performance optimization opportunities

The AI served as a collaborative partner in brainstorming, architecture design, and coding decisions while the core implementation, testing, and deployment were executed with hands-on development work.

## Performance Optimizations

- **Redis Caching**: Movie data cached for 1 hour to reduce TMDB API calls
- **Seat Lock Optimization**: Polling only on seat selection step, not add-ons step
- **Database Indexing**: Indexed frequently queried fields
- **Lazy Loading**: Component-level code splitting
- **Image Optimization**: TMDB optimized image URLs
- **Multi-stage Docker**: Reduced container size by 60%

## Business Logic Highlights

### Seat Locking Flow

1. User selects seats → Temporary lock acquired (5 minutes)
2. Other users see locked seats as unavailable
3. User proceeds through add-ons selection and payment
4. Lock expires after 5 minutes if payment not completed
5. Seats automatically released back to pool on expiry

### Reward Points System

- Earn 1 point per confirmed booking
- Points are tracked in user profile
- Points are deducted when cancelling a reservation
- Encourages user engagement and repeat bookings

### Concurrent Booking Prevention

- Redis distributed locks prevent race conditions
- MongoDB transactions ensure atomic updates
- Optimistic locking for seat availability
- Real-time polling for availability changes

## User Experience Features

- Clean, modern interface with intuitive navigation
- Real-time feedback on all user actions
- Loading states and skeleton screens
- Error messages with actionable guidance
- Mobile-responsive design
- Keyboard navigation support
- Fast page loads with optimized assets

## Local Development Setup

Detailed setup instructions are available in the README.md file, including:

- Environment variable configuration
- Database seeding scripts
- Development server commands
- Docker Compose setup for local development

## API Documentation

The backend exposes RESTful APIs for:

- User authentication (`/api/auth/*`)
- Movie catalog (`/api/movies/*`)
- Showtime management (`/api/showtimes/*`)
- Seat operations (`/api/seats/*`)
- Reservation handling (`/api/reservations/*`)
- Add-ons catalog (`/api/addons/*`)

All endpoints return consistent JSON responses with proper HTTP status codes and error messages.

## Key Learnings & Challenges

### Technical Challenges Solved

- Implementing distributed locks with Redis for concurrent access
- Handling MongoDB transactions for data consistency
- Managing real-time seat availability updates
- Optimizing polling intervals to balance UX and server load
- Docker multi-stage builds for production optimization

### Skills Demonstrated

- Full-stack development with modern JavaScript/TypeScript
- Cloud deployment and DevOps practices
- Real-time data synchronization
- Distributed systems concepts
- Database design and optimization
- Security best practices
- UI/UX implementation

## Future Enhancements

While the current implementation meets all core requirements, potential future improvements could include:

- WebSocket integration for true real-time updates
- Payment gateway integration (Stripe/PayPal)
- Email notifications for bookings
- Admin dashboard for theater management
- Analytics and reporting features
- Multi-language support
- Social login integration
- Seat recommendation engine

## Contact

**Developer**: Anas Sohail
**GitHub**: https://github.com/anassohail99
**Project Repository**: https://github.com/anassohail99/Nordivo-Assessment

---
