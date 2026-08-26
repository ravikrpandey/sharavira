# GitHub Pages and Free Backend Deployment

The repository is organized as a stack-oriented monorepo. The React/Vite front end lives in `client/`, the portable Go REST service lives in `backend/`, normalized PostgreSQL migrations live in `database/`, and deployment configuration lives at the repository root. GitHub Pages publishes the static front end while Render hosts the API and managed PostgreSQL database.

## Publishing Status

The public repository is available at `https://github.com/ravikrpandey/publicis-sapient-recreation`. The static front end is live at `https://ravikrpandey.github.io/publicis-sapient-recreation/`; GitHub Actions workflow run 2 completed successfully from commit `20d59e9` on 27 August 2026. The free backend path remains a Render Blueprint import because the available browser session is not signed in to Render.

## GitHub Pages

The `.github/workflows/deploy-pages.yml` workflow builds and deploys `dist/public` whenever `main` changes. It automatically uses hash-based client routing for static hosting, so all internal routes work without server rewrite rules.

GitHub Pages is configured to use **GitHub Actions** as its publishing source. The live site is available at `https://ravikrpandey.github.io/publicis-sapient-recreation/`.

## Render API and PostgreSQL

The root `render.yaml` is a Render Blueprint. After signing in to [Render](https://dashboard.render.com/blueprints), import the repository, choose the free instance type, and create the blueprint. It provisions the Go API, a free Postgres database, and applies the checked-in schema migration before each API deploy.

When Render provides the API URL, for example `https://ascend-collective-api.onrender.com`, add a GitHub repository variable named `VITE_API_BASE_URL` with the value `https://ascend-collective-api.onrender.com/api/v1`, then rerun the **Deploy GitHub Pages** workflow. The published contact and newsletter forms will submit directly to the Go API using this value.

> Render’s free web services can spin down after idle time, so the first API request after inactivity can take about a minute. Free Render Postgres is appropriate for a preview or hobby deployment and expires after 30 days; review the current Render terms before relying on it for production data.

## Verification

The GitHub Actions workflow is the source of truth for the static deployment. The backend health endpoint is available at `/healthz` after Render finishes its deploy. The service must return `{"ok":true}` before setting `VITE_API_BASE_URL` in GitHub.

## References

[1]: https://vite.dev/guide/static-deploy "Vite: Deploying a Static Site"
[2]: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages "GitHub Docs: Using custom workflows with GitHub Pages"
[3]: https://render.com/docs/deploy-go-nethttp "Render: Deploy a Go Web Server"
[4]: https://render.com/docs/free "Render: Deploy for Free"
