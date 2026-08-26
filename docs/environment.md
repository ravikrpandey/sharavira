# Portable Environment Settings

The managed project environment owns its own protected configuration and does not store `.env` files in source control. For the portable Docker Compose stack, create a local `.env` file outside version control with the following development-only values.

```env
APP_ENV=development
POSTGRES_DB=ascend
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ascend?sslmode=disable
PORT=8080
CORS_ORIGIN=http://localhost:5173
VITE_CONTENT_API_BASE=http://localhost:8080/api/v1
```

Use a production secret manager or the host platform’s environment-variable mechanism to provide production credentials. Do not place production database passwords, signing secrets, access tokens, or external service credentials in browser code or committed files.
