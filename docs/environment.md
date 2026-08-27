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

For production enquiry notifications, configure the following values only in the Render service environment-variable store. The Gmail OAuth client ID and secret belong to the dedicated web client in the Google Cloud `soundewave` project. The refresh token is the offline token authorized for the sender Gmail account and the `gmail.send` scope.

```env
GMAIL_CLIENT_ID=your-google-oauth-web-client-id
GMAIL_CLIENT_SECRET=your-google-oauth-web-client-secret
GMAIL_REFRESH_TOKEN=your-protected-gmail-refresh-token
INQUIRY_EMAIL_FROM=Sharavira Technology <your-sending-gmail-address@example.com>
INQUIRY_NOTIFICATION_TO=pandeyravikumar181@gmail.com
```

The API sends mail through `https://gmail.googleapis.com/gmail/v1/users/me/messages/send` after exchanging the refresh token at `https://oauth2.googleapis.com/token`. No SMTP port is used, which avoids the outbound SMTP restriction on Render’s free tier. The sender mailbox must be the Google account that authorized the OAuth client; when `INQUIRY_EMAIL_FROM` contains only a display name or is blank, the notifier falls back to the configured notification mailbox address.

The contact API persists an accepted enquiry before attempting the Gmail API notification. If token refresh or email delivery is temporarily unavailable, it logs the delivery error without rejecting or losing the enquiry. Provide all production credentials through Render’s secret environment-variable mechanism, never through browser code, local committed files, build artifacts, or repository history. Rotate the OAuth client secret and revoke the refresh token if either is ever exposed.

The old SMTP variables are no longer read by the Go API and should be removed from the Render service after the Gmail API variables are configured.
