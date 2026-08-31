# Production and DevOps Readiness Design

## Goal

Make pull requests enforce the repository's quality gates, provide independently deployable production containers for the frontend and backend, and remove the backend's permissive credentialed CORS behavior.

## Deployment Model

The frontend and backend deploy independently on sibling HTTPS origins, such as `https://admin.example.com` and `https://api.example.com`.

- The frontend Nginx container serves only the compiled React application.
- The frontend calls the API origin embedded at build time through `VITE_API_BASE_URL`.
- The backend accepts credentialed browser requests only from exact origins configured through `CORS_ORIGINS`.
- Requests without an `Origin` header remain allowed for health checks, command-line clients, and server-to-server calls.
- TLS terminates before each container. The application images do not manage certificates.

The two sibling origins are cross-origin but same-site. Existing `credentials: "include"` requests remain supported. Production cookie attributes and Better Auth trusted origins must still match the deployed HTTPS origins.

## Continuous Integration

Create `.github/workflows/ci.yml` for pull requests and pushes to `main`, the repository's current default branch. Pin Bun to the repository's declared `1.3.9` version and install from the root lockfile with `bun install --frozen-lockfile`.

The quality job runs these required root commands in order:

1. `bun run check-types`
2. `bun run lint`
3. `bun run test`
4. `bun run build`

A separate container job builds the frontend and backend production images. The frontend build supplies a non-secret example `VITE_API_BASE_URL`; the build proves the Dockerfile remains valid without publishing an image.

The repository currently cannot satisfy these gates. Implementation therefore includes only the prerequisite corrections:

- Add a root `test` script that runs the complete Bun test suite.
- Register a Bun test preload that resolves Vite's `~icons/*` virtual modules to a harmless React SVG test component.
- Correct the five existing starter lint errors without changing application behavior.

## Frontend Container

Create `apps/starter/Dockerfile` using the repository root as its build context.

- Builder stage: Bun `1.3.9`, frozen workspace install, required `VITE_API_BASE_URL` build argument, and the existing starter production build.
- Runtime stage: Nginx Alpine serving only `apps/starter/dist`.
- Nginx configuration: SPA fallback to `index.html`, long-lived immutable caching for fingerprinted assets, no caching for `index.html`, `server_tokens off`, a lightweight `/healthz`, and browser security headers.
- Frontend headers include clickjacking protection, MIME sniffing protection, a restrictive referrer policy, permissions policy, and a CSP compatible with the current self-hosted Vite application. HSTS is excluded because TLS ownership and preload policy belong to the deployment edge.

The API URL is public build-time configuration, not a secret. A production build fails if `VITE_API_BASE_URL` is empty, preventing an image that silently calls localhost.

## Backend Container

Replace the existing app-local Dockerfile with a workspace-aware multi-stage Bun `1.3.9` image built from the repository root.

- Dependency stage: install the root workspace from the frozen lockfile.
- Validation stage: run the backend TypeScript build.
- Runtime stage: copy only production dependencies plus backend and shared-types runtime sources.
- Run as the image's unprivileged `bun` user.
- Expose port `3333`, start with the existing backend start script, and health-check `/api/health-check`.

The existing `entrypoint.sh` becomes unnecessary and is removed. Database migrations remain an explicit deployment step rather than running automatically on every container start.

## Backend HTTP Security

Add `helmet` to the backend and install it before parsing, routing, or response middleware. Disable Express's `X-Powered-By` fingerprint.

Helmet's general headers stay enabled. Its CSP is disabled on the API process because the Scalar documentation page uses an HTML/script setup that requires separate policy tuning; the React frontend receives CSP from Nginx. This exception is explicit rather than silently omitting Helmet.

Replace reflected CORS with a pure exact-origin allowlist:

- `CORS_ORIGINS` is a comma-separated list of absolute `http:` or `https:` origins.
- Whitespace and trailing slashes are normalized when configuration loads.
- An origin matches only when its normalized origin is in the configured set.
- Unknown browser origins receive a CORS error and no credentialed access headers.
- `credentials: true` remains enabled for Better Auth cookies.

Replace `app.enable("trust proxy")` with `TRUST_PROXY_HOPS`, a non-negative integer whose default is `0`. Production behind one controlled reverse proxy sets it to `1`; direct deployments keep it disabled. This prevents arbitrary forwarded headers from being trusted by default.

## Tests and Verification

Add focused backend unit tests for CORS configuration:

- configured origins are accepted;
- unconfigured origins are rejected;
- missing `Origin` is accepted;
- comma-separated input is trimmed and normalized;
- invalid configured URLs fail environment validation.

Verification requires fresh successful runs of the four CI commands, both Docker image builds, `git diff --check`, and a container smoke check of the frontend `/healthz` and backend `/api/health-check` where local Docker permits it.

## Documentation

Update the root README and environment examples with:

- required production frontend build argument;
- backend `CORS_ORIGINS` and `TRUST_PROXY_HOPS` settings;
- root-context Docker build commands;
- separate-domain cookie/CORS expectations;
- explicit database migration step before backend rollout.

No registry publishing, cloud deployment, DNS, TLS, secrets creation, database mutation, or GitHub repository setting changes are in scope.
