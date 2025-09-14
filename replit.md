# Pet Cheap E-commerce Store

## Overview

Pet Cheap is a full-stack e-commerce web application for pet supplies. Built with React on the frontend and Express.js on the backend, it provides a complete shopping experience with product browsing, cart management, checkout functionality using Stripe payments, and contact forms. The application features a modern UI built with shadcn/ui components and Tailwind CSS, providing users with an intuitive interface to browse and purchase pet products.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Single-page application using React 18 with TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds
- **Wouter Router**: Lightweight client-side routing for navigation between pages
- **shadcn/ui Components**: Pre-built, accessible UI component library with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling with custom design tokens
- **TanStack Query**: Server state management and data fetching with caching
- **Local Storage Cart**: Client-side shopping cart persistence using browser storage

### Backend Architecture
- **Express.js Server**: RESTful API server with middleware for JSON parsing and logging
- **In-Memory Storage**: Simple storage implementation using Maps for products, orders, and users
- **Route-based API**: Organized endpoints for products, orders, payments, and contact forms
- **Vite Integration**: Development server with HMR and static file serving in production

### Database Design
- **Drizzle ORM**: Type-safe database queries with PostgreSQL dialect
- **Schema Definition**: Shared type definitions for users, products, orders, and order items
- **Neon Database**: Serverless PostgreSQL database integration
- **Migration Support**: Database schema versioning with Drizzle Kit

### Payment Processing
- **Stripe Integration**: Complete payment flow with Stripe Elements for secure card processing
- **Payment Intents**: Server-side payment intent creation with amount validation
- **Client-side Elements**: React Stripe.js components for payment form handling
- **Order Management**: Payment status tracking and order fulfillment workflow

### State Management
- **React Hooks**: Custom hooks for cart management and mobile detection
- **Context Providers**: Application-wide state sharing for cart and toast notifications
- **Server State**: TanStack Query for API data caching and synchronization
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### UI/UX Design
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Component Library**: Consistent design system with reusable components
- **Accessibility**: ARIA compliant components with keyboard navigation support
- **Toast Notifications**: User feedback system for actions and errors
- **Loading States**: Skeleton loaders and spinners for better perceived performance

## External Dependencies

### Core Framework Dependencies
- **React & React DOM**: Frontend framework and rendering
- **Express.js**: Backend web framework
- **TypeScript**: Type safety across the application
- **Vite**: Build tool and development server

### Database & ORM
- **Drizzle ORM**: Type-safe database operations
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **Drizzle Kit**: Database migrations and schema management

### Payment Processing
- **Stripe**: Payment processing platform
- **@stripe/stripe-js**: Stripe JavaScript SDK
- **@stripe/react-stripe-js**: React components for Stripe Elements

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **@radix-ui/***: Accessible UI primitive components
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **class-variance-authority**: Utility for conditional CSS classes

### Data Fetching & Validation
- **@tanstack/react-query**: Server state management
- **Zod**: Runtime type validation
- **@hookform/resolvers**: Form validation integration

### Routing & Navigation
- **Wouter**: Lightweight client-side routing

### Development Tools
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Utilities
- **date-fns**: Date manipulation library
- **clsx & twMerge**: Conditional CSS class utilities
- **cmdk**: Command palette component