# ModaShop E-commerce Platform

## Overview

ModaShop is a modern e-commerce platform built with a React frontend and Express.js backend. The application follows a clean, Shopify-inspired design and provides a comprehensive online shopping experience including product browsing, cart management, user authentication, and checkout functionality. The platform is designed to be responsive and user-friendly, targeting the Brazilian market with Portuguese language support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for authentication and cart state, combined with TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom styling via Tailwind CSS and shadcn/ui component library
- **Styling**: Tailwind CSS with CSS custom properties for theming support (light/dark modes)
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API endpoints following conventional patterns
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Development**: Hot reload support with Vite integration for seamless development experience

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Database**: PostgreSQL with Neon serverless database provider
- **Schema Management**: Centralized schema definitions in TypeScript with Zod validation
- **Migration System**: Drizzle Kit for database migrations and schema synchronization

### Authentication System
- **Strategy**: Session-based authentication with local storage persistence
- **User Management**: Full user registration, login, and profile management
- **Session Handling**: Browser session storage for user state persistence
- **Guest Support**: Anonymous cart functionality using session IDs for non-authenticated users

### Data Models
- **Users**: Complete user profiles with contact information
- **Products**: Rich product data with variants (sizes, colors), multiple images, and pricing
- **Categories**: Hierarchical product categorization with SEO-friendly slugs
- **Cart**: Persistent cart functionality supporting both authenticated and guest users
- **Orders**: Complete order management with customer and shipping information
- **Testimonials**: Customer feedback system for social proof

### State Management Strategy
- **Client State**: React Context for user authentication and cart management
- **Server State**: TanStack Query for API data fetching, caching, and synchronization
- **Form State**: React Hook Form with Zod validation for type-safe form handling
- **UI State**: Local component state for ephemeral UI interactions

### Styling and Design System
- **Design Framework**: Tailwind CSS with custom configuration
- **Component Library**: shadcn/ui built on Radix UI primitives
- **Typography**: Inter font family for clean, modern appearance
- **Color System**: Neutral palette with customizable accent colors via CSS variables
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form for form management
- **TypeScript**: Full TypeScript support across frontend and backend
- **Vite**: Build tool and development server with HMR support

### Backend Services
- **Database**: Neon PostgreSQL serverless database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### UI and Styling Libraries
- **Radix UI**: Complete set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with PostCSS integration
- **Lucide React**: Modern icon library with consistent design
- **class-variance-authority**: Type-safe CSS variant management

### Data Fetching and Validation
- **TanStack Query**: Server state management with caching and synchronization
- **Zod**: Runtime type validation for forms and API data
- **date-fns**: Date manipulation and formatting utilities

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for development server
- **Replit Integration**: Development environment optimizations for Replit platform

### Additional Features
- **Embla Carousel**: Touch-friendly carousel component for image galleries
- **Vaul**: Drawer component for mobile-optimized interactions
- **cmdk**: Command menu component for enhanced user interactions