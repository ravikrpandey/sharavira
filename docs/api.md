# REST API Contract

All portable API endpoints are rooted at `/api/v1` and return JSON. Successful responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "message": "...", "error": { "code": "..." } }`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/pages` | Retrieve public pages. |
| GET | `/pages/{slug}` | Retrieve a page by slug. |
| GET | `/solutions` | Retrieve solution records. |
| GET | `/solutions/{slug}` | Retrieve one solution. |
| GET | `/industries` | Retrieve industry records. |
| GET | `/industries/{slug}` | Retrieve one industry. |
| GET | `/platforms` | Retrieve platform records. |
| GET | `/platforms/{slug}` | Retrieve one platform. |
| GET | `/customers` | Retrieve customer-story records. |
| GET | `/customers/{slug}` | Retrieve one customer story. |
| GET | `/resources` | Retrieve editorial resources. |
| GET | `/resources/{slug}` | Retrieve one resource. |
| GET | `/capabilities` | Retrieve capability records. |
| GET | `/capabilities/{slug}` | Retrieve one capability. |
| GET | `/search?q={query}` | Search public content. |
| POST | `/contact` | Validate and persist a contact submission. |
| POST | `/newsletter` | Validate and persist a newsletter subscription. |

The two submission endpoints support an `Idempotency-Key` request header. Reusing a recent key returns the initial success response without creating a duplicate record.

