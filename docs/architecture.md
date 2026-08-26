# Architecture

## System Overview

The project is structured as two independently runnable applications. The managed preview is a React and Vite experience running with the project’s JavaScript service layer. A portable Go service is included for local Docker Compose and compatible container environments, where it supplies a REST API backed by PostgreSQL. This separation preserves a realistic Go/PostgreSQL architecture without misrepresenting the managed preview runtime as a Go deployment.

| Layer | Technology | Responsibility |
|---|---|---|
| Public UI | React, Vite, React Router, CSS Modules | Routes, responsive composition, accessible menus, forms, SEO metadata, motion preferences. |
| Browser content model | Typed TypeScript configuration | Independently authored page data, navigation, routes, search index, calls to action, and related content. |
| REST API | Go standard library with PostgreSQL driver | Versioned JSON endpoints for content, search, contact submissions, and newsletter subscriptions. |
| Persistence | PostgreSQL | Normalized content entities, locations, contact submissions, newsletter subscriptions, and idempotency records. |
| Local runtime | Docker Compose | Separate frontend, Go API, and PostgreSQL services with configuration passed through environment variables. |

## Request Flow

```text
Browser → React Router → typed page content / REST adapter → Go handler → service → repository → PostgreSQL
```

The public page experience can render structured, bundled content immediately. When `VITE_CONTENT_API_BASE` is configured in a portable environment, the REST adapter may read from the Go API. The Go API remains authoritative for submissions and an implementation-ready source for dynamic content. This intentional progressive model protects the browser experience during initial load and enables server-backed content without coupling visual rendering to a single infrastructure environment.

## Design Principles

The interface combines editorial typography, structured grid lines, a restrained ink/red/ivory palette, and contrasting dark platform panels. Design tokens define color, typography, spacing, shadows, radius, z-index, and motion timings. Each route family has a dedicated composition pattern, while shared primitives keep interactions, focus treatment, forms, navigation, and content cards consistent.

## Security and Operational Controls

The Go API applies JSON response envelopes, request-size caps, CORS allow-listing, common security headers, input validation, and in-memory IP rate limiting for public submissions. Form endpoints accept an idempotency key to protect against duplicate submissions. Production secrets belong only in environment configuration; the browser never receives database credentials.

