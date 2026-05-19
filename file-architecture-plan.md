# NewUHRIS File Architecture Documentation

## Monorepo Directory Structure

### Root Level
```text
NewUHRIS/
├── backend/                      # NestJS application and Database
│   ├── prisma/                   # Database ORM definition
│   │   ├── migrations/           # Auto-generated SQL migrations
│   │   ├── schema.prisma         # Main database schema file
│   │   └── seed.ts               # Database seeding scripts
│   │
│   └── src/                      # Backend source code
│       ├── common/               # Shared logic across the backend
│       │   ├── crud/             # Dynamic CRUD controller generation metadata
│       │   ├── decorators/       # Custom NestJS decorators
│       │   ├── filters/          # Exception filters
│       │   └── guards/           # Security/Auth guards (e.g., RBAC)
│       │
│       ├── config/               # Application configuration
│       │   └── env.config.ts     # Environment variables schema validation
│       │
│       ├── core/                 # Core framework setup (logging, interceptors)
│       │
│       ├── modules/              # Domain-specific modules
│       │   ├── approvals/        # Approval workflows logic
│       │   ├── rbac/             # Role-Based Access Control logic
│       │   └── [other modules]/  # Other business entities
│       │
│       ├── app.module.ts         # Root backend module
│       ├── app.bootstrap.ts      # Application bootstrap configuration
│       └── main.ts               # Main NestJS entry point
│
├── frontend/                     # React application (Vite + Tailwind)
│   ├── public/                   # Static assets (images, icons)
│   │
│   ├── src/                      # Frontend source code
│   │   ├── components/           # Shared UI components
│   │   │   ├── ui/               # Reusable atomic elements (Buttons, Inputs)
│   │   │   └── layout/           # Layout wrappers (Sidebar, Topbar)
│   │   │
│   │   ├── config/               # Global configuration files
│   │   │
│   │   ├── context/              # React Context Providers
│   │   │   └── AuthContext.tsx   # Global authentication state
│   │   │
│   │   ├── features/             # Feature-based architecture
│   │   │   ├── approvals/        # Approvals feature module
│   │   │   ├── dashboard/        # Dashboard feature module
│   │   │   ├── payroll/          # Payroll feature module
│   │   │   ├── personnel/        # Personnel feature module
│   │   │   └── settings/         # Settings (includes User Management, RBAC)
│   │   │
│   │   ├── hooks/                # Custom shared React hooks
│   │   │
│   │   ├── pages/                # Page-level components & routing setup
│   │   │
│   │   ├── types.ts              # Global TypeScript interfaces
│   │   ├── App.tsx               # Root component & Route definitions
│   │   └── index.tsx             # React DOM entry point
│   │
│   ├── index.html                # Main HTML template
│   ├── index.css                 # Global TailwindCSS styles
│   ├── tailwind.config.js        # TailwindCSS configuration
│   └── vite.config.ts            # Vite bundler configuration
│
└── docs/                         # Project documentation
    ├── file-architecture-plan.md # This architecture document
    ├── local-postgres-pgadmin-guide.md
    └── [other docs].md
```

## Architectural Patterns

### Backend (NestJS + Prisma)
- **Module-based:** Code is organized by domain in `src/modules`. Each module handles its own controllers, services, and DTOs.
- **Dynamic Controller Generation:** The system utilizes custom metadata (found in `src/common/crud`) to dynamically generate factory patterns for REST API controllers to reduce boilerplate.

### Frontend (React + Vite)
- **Feature-based structure:** Instead of grouping by file type across the app, features encapsulate their own components, views, and specific logic inside `frontend/features/`.
- **Global Context:** Foundational state like user session (RBAC) is managed globally via `context/` while UI state remains localized to features.
