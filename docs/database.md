# Database Design

PostgreSQL is modeled around reusable content rather than page-specific blobs. Content records use `content_type`, `slug`, metadata fields, and JSONB `body` for flexible page modules. Purpose-built tables handle locations, form submissions, newsletter status, and idempotency keys.

| Table | Purpose | Key constraints |
|---|---|---|
| `content_items` | Structured pages, solutions, industries, platforms, customers, resources, and capabilities. | Unique `slug`; checked content type; published index. |
| `locations` | Region, city, address, and public location metadata. | Unique city/region/label combination. |
| `contact_submissions` | Persisted inquiries. | Required identity and company data; unique idempotency key. |
| `newsletter_subscriptions` | Marketing subscription requests. | Case-insensitive unique email. |
| `request_idempotency` | Hash and response state for POST request replay protection. | Primary key on idempotency key; expiry index. |

The initial migration is located at `database/migrations/001_initial.sql`. The schema includes UUID generation, timestamps, data-validation checks, and targeted indexes for public content lookup and search.

