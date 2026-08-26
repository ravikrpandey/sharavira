# Ascend Collective Public Site Recreation

This repository contains an independently authored, enterprise-style public website recreation inspired by the information architecture and interaction vocabulary of a modern AI consultancy website. It does not copy the reference website’s source code, proprietary client logos, visual assets, third-party awards, long-form copy, or embedded services.

## Architecture

The interactive application uses React, Vite, React Router and CSS Modules. The current managed preview demonstrates the complete front-end route experience and accessible form states. A portable Go REST API with PostgreSQL is included in `backend/` for the requested full-stack deployment model. See [`docs/architecture.md`](docs/architecture.md), [`docs/api.md`](docs/api.md), [`docs/database.md`](docs/database.md), [`docs/frontend.md`](docs/frontend.md), and [`docs/deployment.md`](docs/deployment.md) for implementation details.

## Published Front End

The stack-organized source repository is available at [ravikrpandey/publicis-sapient-recreation](https://github.com/ravikrpandey/publicis-sapient-recreation). The static React application is live on [GitHub Pages](https://ravikrpandey.github.io/publicis-sapient-recreation/). The Go/PostgreSQL service is ready for the repository’s included Render Blueprint, but its deployment requires a signed-in Render account; see [`docs/github-pages-render.md`](docs/github-pages-render.md) for the exact deployment and API-variable steps.

## Local development

Install JavaScript dependencies and start the front-end development server with:

```bash
pnpm install
pnpm dev
```

To run the portable Go and PostgreSQL stack, create a local `.env` file using the development-only values in [`docs/environment.md`](docs/environment.md), then run:

```bash
docker compose up --build
```

The compose stack serves the React development app on `http://localhost:5173`, the Go API on `http://localhost:8080`, and PostgreSQL on `localhost:5432`. The initial database migration runs when the PostgreSQL volume is first created.

## Verification

Run the front-end TypeScript check and unit tests with `pnpm check` and `pnpm test`. Run Go tests from the portable service directory with `cd backend && go test ./...`. Build the React production bundle with `pnpm build`, and build the API with `cd backend && go build ./cmd/server`.

## Implementation Boundaries

The Go/PostgreSQL stack is a portable local or compatible-container deployment target. The managed preview environment demonstrates the front-end and its built-in project service rather than deploying a standalone Go binary or a PostgreSQL container. Review [`docs/implementation_boundaries.md`](docs/implementation_boundaries.md) before choosing a hosting model.
