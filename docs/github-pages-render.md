# GitHub Pages and Free Backend Deployment

The repository is organized as a stack-oriented monorepo. The React/Vite front end lives in `client/`, the portable Go REST service lives in `backend/`, normalized PostgreSQL migrations live in `database/`, and deployment configuration lives at the repository root. GitHub Pages publishes the static front end while Render hosts the API and managed PostgreSQL database.

## Publishing Status

The public repository is available at `https://github.com/ravikrpandey/sharavira`. The static front end is published at `https://ravikrpandey.github.io/sharavira/`; the GitHub Actions workflow automatically deploys every push to `main`. The Go API is live at `https://ascend-collective-api.onrender.com`, and its `/healthz` endpoint returned HTTP 200 after deployment.

## GitHub Pages

The `.github/workflows/deploy-pages.yml` workflow builds and deploys `dist/public` whenever `main` changes. It automatically uses hash-based client routing for static hosting, so all internal routes work without server rewrite rules.

GitHub Pages is configured to use **GitHub Actions** as its publishing source. The live site is available at `https://ravikrpandey.github.io/sharavira/`.

## Render API and PostgreSQL

The root `render.yaml` is a reproducible Render Blueprint for the deployed free Go API and PostgreSQL database. The initial resources were provisioned in the `singapore` region and the checked-in migration was applied during the API deployment. The service is configured for automatic deployment from the `main` branch.

The Pages workflow now defaults `VITE_API_BASE_URL` to `https://ascend-collective-api.onrender.com/api/v1`. A GitHub repository variable with the same name may override that value in a future environment. The deployed JavaScript bundle contains the live endpoint, and a CORS preflight from `https://ravikrpandey.github.io` to `/api/v1/contact` returned HTTP 204 with the expected allowed origin and methods. The published contact and newsletter forms therefore route directly to the Go API.

> Render’s free web services can spin down after idle time, so the first API request after inactivity can take about a minute. Free Render Postgres is appropriate for a preview or hobby deployment and expires after 30 days; review the current Render terms before relying on it for production data.

## Verification

The GitHub Actions workflow is the source of truth for the static deployment. The final workflow run completed successfully, the public Pages HTML referenced a bundle containing the live API URL, and the API health endpoint returned HTTP 200. These checks validate the static deployment, API reachability, and browser-origin routing without creating test submissions in the production contact database.

## References

[1]: https://vite.dev/guide/static-deploy "Vite: Deploying a Static Site"
[2]: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages "GitHub Docs: Using custom workflows with GitHub Pages"
[3]: https://render.com/docs/deploy-go-nethttp "Render: Deploy a Go Web Server"
[4]: https://render.com/docs/free "Render: Deploy for Free"
