# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is AnglerFish, a modern Human Resource Information System (HRIS) web client built with Next.js 15, React 19, TypeScript, and Tailwind CSS. The application provides both employee self-service features and administrative functionality for HR management.

## Development Commands

### Package Management
- **Install dependencies**: `pnpm install` (preferred) or `npm install`
- **Lock file**: Uses `pnpm-lock.yaml` - pnpm is the recommended package manager

### Development & Build
- **Start development server**: `pnpm dev` or `npm run dev`
  - Uses Next.js 15 with Turbopack for fast development
  - Runs on http://localhost:3000 by default
- **Production build**: `pnpm build` or `npm run build`
  - Uses Turbopack for optimized builds
- **Start production server**: `pnpm start` or `npm start`
- **Linting**: `pnpm lint` or `npm run lint`
  - Uses ESLint with Next.js configuration

### Port Configuration
If port 3000 is in use, set alternate port:
```powershell
$env:PORT=3001; pnpm dev
```

## Architecture Overview

### Application Structure

**Dual-Role System**: The application supports both Employee and Admin roles with separate dashboard layouts and navigation structures.

**Authentication Flow**: 
- Root page (`/`) redirects to `/login`
- Login page (`/login`) provides role-based authentication (Admin/Employee tabs)
- After login, users are routed to role-specific dashboards

### Key Directories

**`app/` - Next.js App Router Structure**
- Uses App Router with nested layouts
- **`dashboard/`**: Contains separate admin and user dashboard implementations
  - `dashboard-admin/`: Admin-specific dashboard, layout, and components
  - `dashboard-user/`: Employee-specific dashboard, layout, and components  
- **`api/`**: API routes for employees and processes data
- **Feature pages**: `attendance/`, `leave/`, `people/` (with admin sub-modules), `login/`

**`components/` - UI Component Library**
- **`app-sidebar-admin/`** & **`app-sidebar-user/`**: Role-specific navigation sidebars
- **`ui/`**: Radix UI component wrappers (buttons, cards, dialogs, etc.)
- **Domain components**: 
  - `documents/`: Document management (table, upload, view)
  - `employees/`: Employee management (form, table, view)
  - `onboarding/`: Process management (start, table, view)
  - `app-dialog/`: Specialized dialogs (attendance, confirmation, request)

**`types/` - TypeScript Definitions**
- **`employee.ts`**: Employee data structure and status types
- **`document.ts`**: Document management with categories and expiration tracking
- **`onboarding.ts`**: Process management with task status and progress calculation

### Technical Stack Details

**Frontend Framework**: Next.js 15 with App Router and Turbopack
**UI Framework**: Radix UI primitives with custom component wrappers
**Styling**: Tailwind CSS 4 with custom CSS variables and design tokens
**Icons**: Lucide React for consistent iconography
**Date Handling**: date-fns and react-day-picker for calendar functionality
**Charts**: Recharts for data visualization
**Fonts**: Geist Sans and Geist Mono for typography

### Data Management Patterns

**Type Safety**: Comprehensive TypeScript definitions with strict configuration
**State Management**: React state with hooks, no external state management library
**API Integration**: Next.js API routes with mock data structures
**Process Management**: Onboarding/offboarding workflows with task tracking and progress calculation

### Navigation Architecture

**Collapsible Sidebar**: Both admin and user sidebars support icon-only collapsed state
**Role-Based Menus**: Different navigation structures based on user role
**Breadcrumb System**: Consistent navigation context throughout the application
**Mobile Responsive**: Adaptive layout for different screen sizes

### Component Architecture

**Compound Components**: Extensive use of Radix UI's compound component pattern
**Dialog System**: Centralized dialog management for forms and confirmations
**Table Components**: Reusable data table components with sorting and filtering
**Form Patterns**: Consistent form layouts with validation and submission handling

### Development Notes

**Path Aliases**: Uses `@/*` for clean import paths pointing to project root
**ESLint Config**: Extends Next.js core web vitals and TypeScript configurations
**No Testing Framework**: Currently no test runner configured
**Environment**: Designed for Windows PowerShell development environment
**Build Optimization**: Leverages Turbopack for both development and production builds

### Key Business Domains

**Employee Management**: Complete employee lifecycle with profile management
**Attendance Tracking**: Clock in/out functionality with status monitoring
**Leave Management**: Request workflows and balance tracking
**Document Management**: File upload, categorization, and expiration tracking
**Onboarding/Offboarding**: Multi-department task workflows with progress tracking
**Payroll Integration**: UI placeholders for payroll slip access and reimbursements