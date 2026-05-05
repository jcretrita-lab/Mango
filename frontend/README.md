# Diwa HRIS Frontend Shell

This frontend is intentionally an API-first shell. The navigation, routing, breadcrumbing, and empty states are in place so backend integration can happen screen by screen without redesigning the app structure.

## Stack

- `Vite`
- `React`
- `React Router`
- `Tailwind CSS`
- `Framer Motion`
- `lucide-react`

## Current purpose

The current frontend is not meant to hold business data. Its job is to:

- expose the navigation structure
- keep routes stable
- show placeholder layouts
- stay empty until the backend APIs return real records

## Actual entry flow

Runtime entrypoints:

1. [frontend/index.html](</C:/Users/joshu/Documents/Diwa HRIS/frontend/index.html>)
2. [frontend/index.tsx](</C:/Users/joshu/Documents/Diwa HRIS/frontend/index.tsx>)
3. [frontend/App.tsx](</C:/Users/joshu/Documents/Diwa HRIS/frontend/App.tsx>)

From there:

- `App.tsx` defines the route map
- [frontend/components/Layout.tsx](</C:/Users/joshu/Documents/Diwa HRIS/frontend/components/Layout.tsx>) renders the shared shell
- [frontend/pages/RoutePlaceholder.tsx](</C:/Users/joshu/Documents/Diwa HRIS/frontend/pages/RoutePlaceholder.tsx>) renders the empty state for not-yet-connected pages

## Important files

- [frontend/config/appShellRoutes.ts](</C:/Users/joshu/Documents/Diwa HRIS/frontend/config/appShellRoutes.ts>)
  - central list of shell routes and placeholder descriptions
- [frontend/config/route.ts](</C:/Users/joshu/Documents/Diwa HRIS/frontend/config/route.ts>)
  - shared breadcrumb/search labels
- [frontend/context/AuthContext.tsx](</C:/Users/joshu/Documents/Diwa HRIS/frontend/context/AuthContext.tsx>)
  - local shell-only session state
- [frontend/context/BreadcrumbContext.tsx](</C:/Users/joshu/Documents/Diwa HRIS/frontend/context/BreadcrumbContext.tsx>)
  - lets detail pages override the last breadcrumb label
- [frontend/context/NotificationContext.tsx](</C:/Users/joshu/Documents/Diwa HRIS/frontend/context/NotificationContext.tsx>)
  - currently empty until real notification APIs exist

## What “build from scratch” means here

If you had to rebuild this frontend cleanly, the order should be:

1. create a Vite React TypeScript app
2. install router, tailwind, framer-motion, and icon dependencies
3. build one shared application layout
4. define routes in one config file
5. define shared breadcrumb labels in one config file
6. create page placeholders for every route
7. add an API client layer
8. replace placeholders route by route as backend APIs become available

## Recommended folder responsibilities

- `components/`
  - reusable shell UI
- `pages/`
  - route-level screens
- `context/`
  - app-wide state that is not tied to one page
- `config/`
  - route metadata and shared UI mappings
- `hooks/`
  - reusable UI hooks

## How data should be connected

The frontend should never talk directly to PostgreSQL or pgAdmin.

The correct flow is:

1. frontend calls the NestJS backend
2. backend calls Prisma
3. Prisma talks to PostgreSQL

That means your future frontend data layer should look like this:

1. create a small API client, for example `fetch('/api/personnel/employees')`
2. keep loading, empty, success, and error states in the page
3. replace `RoutePlaceholder` only when that route has a real endpoint

## Current auth behavior

The login screen is local-shell only for now. It exists so the route shell is usable before the identity APIs are ready.

Do not treat it as real authentication. Replace it once your real authentication flow is implemented.

## Run locally

```bash
cd frontend
bun install
bun run dev
```

## Build locally

```bash
cd frontend
bun run build
```

## Integration strategy

Best approach for Phase 1:

1. keep the shell stable
2. connect one module at a time
3. start with Phase 1 APIs only
4. remove placeholder cards only after the real route data is available

That keeps the frontend predictable while the backend schema and APIs are still moving.
