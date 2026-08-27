# Development and Deployment

## Managed Preview

The managed preview runs the React application and its included JavaScript service. It demonstrates all front-end routes, navigation, search, privacy controls, and client-side form state. The managed runtime does not run the separate Go binary or PostgreSQL container.

## Docker Compose

For the requested Go/PostgreSQL deployment model, use the root `docker-compose.yml`. It starts PostgreSQL, the Go API, and a Vite development server. Copy `.env.example` to `.env`, set the allowed origin, then run `docker compose up --build`.

## Production Guidance

Build static assets with `pnpm run build`. Build the portable API with `go build ./cmd/server`. Deploy the Go service and PostgreSQL only to compatible container infrastructure, applying `database/migrations/001_initial.sql` before opening public traffic. Serve the frontend behind TLS, configure `VITE_CONTENT_API_BASE` with the API origin, set a restrictive CORS origin, and provide secrets through the host’s environment-variable service.

For the Render backend, configure `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN` for the dedicated Google OAuth web client, along with `INQUIRY_EMAIL_FROM` and `INQUIRY_NOTIFICATION_TO`. The API uses Gmail API HTTPS endpoints rather than SMTP because Render Free blocks outbound SMTP connections. An accepted enquiry is persisted before notification delivery; a Gmail token or delivery failure is logged and does not erase or reject the enquiry.

