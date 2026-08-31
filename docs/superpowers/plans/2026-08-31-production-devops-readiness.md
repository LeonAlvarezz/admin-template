# Production and DevOps Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce pull-request quality gates, ship independently deployable frontend/backend containers, and secure credentialed backend requests with exact-origin CORS and Helmet headers.

**Architecture:** GitHub Actions runs the monorepo's Bun gates and validates both images. The frontend is compiled with its public API origin and served by Nginx; the backend runs as an unprivileged Bun process with environment-owned CORS and proxy trust. Pure configuration functions receive focused unit coverage before middleware wiring.

**Tech Stack:** Bun 1.3.9, Turborepo, GitHub Actions, Docker, Nginx Alpine, Express 5, Helmet, CORS, Zod, Bun test

**Spec:** `docs/superpowers/specs/2026-08-31-production-devops-readiness-design.md`

## Global Constraints

- Frontend and backend deploy on separate sibling HTTPS origins.
- Credentialed CORS accepts exact configured origins only; no origin reflection.
- Requests without `Origin` remain valid for health checks and server clients.
- `VITE_API_BASE_URL` is required at frontend image build time and is public configuration.
- Backend image runs as the unprivileged `bun` user.
- Database migrations remain an explicit deployment action.
- Do not publish images, deploy services, change DNS/TLS, create secrets, or mutate a database.
- Preserve unrelated work and use the root Bun workspace lockfile as the only dependency lock.

---

### Task 1: Make the Existing Quality Gates Runnable

**Files:**
- Create: `bunfig.toml`
- Create: `test/setup.ts`
- Modify: `package.json`
- Modify: `apps/starter/tsconfig.json`
- Modify: `apps/starter/src/config/auth.ts`
- Modify: `apps/starter/src/modules/settings/components/two-factor-section.tsx`
- Modify: `apps/starter/src/modules/user/components/change-role-modal.tsx`

**Interfaces:**
- Produces: root `bun run test` command and a Bun preload mocking all `~icons/*` imports declared by the shared icon barrel during tests.
- Produces: a starter TypeScript project that includes `vite.config.ts`, allowing typed ESLint to parse it.
- Preserves: existing auth, 2FA, and role behavior; lint edits remove only type-redundant fallbacks/assertions.

- [ ] **Step 1: Confirm the current red baselines**

Run:

```bash
bun test
bun run lint
```

Expected: tests report unresolved `~icons/boxicons/search`; lint reports five starter errors in `auth.ts`, `two-factor-section.tsx`, `change-role-modal.tsx`, and `vite.config.ts`.

- [ ] **Step 2: Register the virtual-icon test plugin**

Create `test/setup.ts`:

```ts
import { mock } from "bun:test";

function TestIcon() {
  return null;
}

const iconBarrel = await Bun.file(
  new URL("../packages/core/src/components/ui/icons.tsx", import.meta.url),
).text();

const iconModules = new Set(
  Array.from(iconBarrel.matchAll(/from "(~icons\/[^"]+)"/g), (match) =>
    match[1],
  ),
);

for (const iconModule of iconModules) {
  mock.module(iconModule, () => ({
    default: TestIcon,
  }));
}
```

Create `bunfig.toml`:

```toml
[test]
preload = ["./test/setup.ts"]
```

Add this root script to `package.json`:

```json
"test": "bun test"
```

- [ ] **Step 3: Correct the typed-lint blockers**

In `apps/starter/tsconfig.json`, replace the `include` array with:

```json
"include": ["src", "src/main.tsx", "vite.config.ts"]
```

In `apps/starter/vite.config.ts`, use the Node protocol import required by typed lint:

```ts
import path from "node:path";
```

In `apps/starter/src/config/auth.ts`, change both role mappings to the already-required enum value:

```ts
role: userResponse.role,
```

```ts
role: data.user.role,
```

In `two-factor-section.tsx`, use the response contract directly:

```ts
setBackupCodes(data.backupCodes);
```

In `change-role-modal.tsx`, remove the redundant assertion:

```ts
setRole(targetUser.role);
```

- [ ] **Step 4: Verify the complete existing gates now run**

Run:

```bash
bun run test
bun run lint
bun run check-types
```

Expected: every command exits `0`; all current tests pass, lint reports no errors, and TypeScript accepts `vite.config.ts`.

- [ ] **Step 5: Commit the quality-gate prerequisite**

```bash
git add bunfig.toml test/setup.ts package.json apps/starter/tsconfig.json apps/starter/vite.config.ts apps/starter/src/config/auth.ts apps/starter/src/modules/settings/components/two-factor-section.tsx apps/starter/src/modules/user/components/change-role-modal.tsx docs/superpowers/plans/2026-08-31-production-devops-readiness.md
git commit -m "ci: make repository quality gates runnable"
```

---

### Task 2: Add Exact-Origin CORS and Helmet Hardening

**Files:**
- Create: `apps/backend/src/config/cors.ts`
- Create: `apps/backend/test/security-config.test.ts`
- Modify: `apps/backend/src/config/env.ts`
- Modify: `apps/backend/src/loaders/loader.ts`
- Modify: `apps/backend/.env.example`
- Modify: `apps/backend/package.json`
- Modify: `bun.lock`
- Delete: `apps/backend/bun.lock`

**Interfaces:**
- Produces: `httpOriginSchema: ZodType<string>` which validates and normalizes one origin.
- Produces: `corsOriginsSchema: ZodType<string[]>` which parses comma-separated origins.
- Produces: callable `createCorsOriginValidator(allowedOrigins: readonly string[]): CorsOriginValidator`.
- Extends: `env.CORS_ORIGINS: string[]` and `env.TRUST_PROXY_HOPS: number`.
- Consumes: Express `cors` origin callback and Helmet middleware.

- [ ] **Step 1: Write failing security configuration tests**

Create `apps/backend/test/security-config.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { createCorsOriginValidator } from "../src/config/cors";
import { corsOriginsSchema, httpOriginSchema } from "../src/config/env";

function validateOrigin(
  validator: ReturnType<typeof createCorsOriginValidator>,
  origin?: string,
) {
  return new Promise<boolean | string | undefined>((resolve, reject) => {
    validator(origin, (error, allowed) => {
      if (error) return reject(error);
      resolve(allowed);
    });
  });
}

describe("production HTTP security configuration", () => {
  test("normalizes a comma-separated exact-origin allowlist", () => {
    expect(
      corsOriginsSchema.parse(
        " https://admin.example.com/,http://localhost:5173 ",
      ),
    ).toEqual(["https://admin.example.com", "http://localhost:5173"]);
  });

  test("rejects URLs that are not HTTP origins", () => {
    expect(httpOriginSchema.safeParse("ftp://admin.example.com").success).toBe(
      false,
    );
    expect(
      httpOriginSchema.safeParse("https://admin.example.com/path").success,
    ).toBe(false);
  });

  test("accepts configured browser origins", async () => {
    const validate = createCorsOriginValidator([
      "https://admin.example.com",
    ]);
    expect(await validateOrigin(validate, "https://admin.example.com")).toBe(
      true,
    );
  });

  test("accepts requests without an Origin header", async () => {
    const validate = createCorsOriginValidator([
      "https://admin.example.com",
    ]);
    expect(await validateOrigin(validate)).toBe(true);
  });

  test("rejects unconfigured browser origins", async () => {
    const validate = createCorsOriginValidator([
      "https://admin.example.com",
    ]);
    await expect(
      validateOrigin(validate, "https://attacker.example"),
    ).rejects.toThrow("Origin not allowed by CORS");
  });
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
bun test apps/backend/test/security-config.test.ts
```

Expected: FAIL because `src/config/cors.ts`, `corsOriginsSchema`, and `httpOriginSchema` do not exist.

- [ ] **Step 3: Implement origin parsing and the callback**

Export these schemas above `envSchema` in `apps/backend/src/config/env.ts`:

```ts
export const httpOriginSchema = z
  .string()
  .trim()
  .url()
  .transform((value) => new URL(value))
  .refine(
    (url) => url.protocol === "http:" || url.protocol === "https:",
    "Origin must use HTTP or HTTPS",
  )
  .refine(
    (url) =>
      url.pathname === "/" &&
      !url.search &&
      !url.hash &&
      !url.username &&
      !url.password,
    "Origin must not contain credentials, a path, query, or hash",
  )
  .transform((url) => url.origin);

export const corsOriginsSchema = z
  .string()
  .transform((value) => value.split(","))
  .pipe(z.array(httpOriginSchema).min(1))
  .transform((origins) => [...new Set(origins)]);
```

Add these fields to `envSchema`:

```ts
CORS_ORIGINS: corsOriginsSchema.default("http://localhost:5173"),
TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(0),
```

Create `apps/backend/src/config/cors.ts`:

```ts
type CorsOriginResult =
  | boolean
  | string
  | RegExp
  | Array<boolean | string | RegExp>;

export type CorsOriginValidator = (
  requestOrigin: string | undefined,
  callback: (error: Error | null, origin?: CorsOriginResult) => void,
) => void;

export function createCorsOriginValidator(
  allowedOrigins: readonly string[],
): CorsOriginValidator {
  const allowlist = new Set(allowedOrigins);

  return (origin, callback) => {
    if (!origin || allowlist.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  };
}
```

- [ ] **Step 4: Run the focused test and confirm it passes**

Run:

```bash
bun test apps/backend/test/security-config.test.ts
```

Expected: 5 tests pass.

- [ ] **Step 5: Install Helmet from the root workspace**

Delete the obsolete nested `apps/backend/bun.lock`, then run:

```bash
bun --filter express-template add helmet
```

Expected: `helmet` is in backend dependencies and the root `bun.lock` is updated; no app-local lockfile remains.

- [ ] **Step 6: Wire security middleware in the correct order**

Update `apps/backend/src/loaders/loader.ts` imports to include:

```ts
import helmet from "helmet";
import { createCorsOriginValidator } from "@/config/cors";
```

Remove the unused `toNodeHandler` and `auth` imports. Replace the current proxy and CORS block with:

```ts
app.set("trust proxy", env.TRUST_PROXY_HOPS);
app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(
  cors({
    origin: createCorsOriginValidator(env.CORS_ORIGINS),
    credentials: true,
  }),
);
```

Keep Helmet and CORS before method override, cookie parsing, JSON parsing, response wrapping, and routes.

Add to `apps/backend/.env.example`:

```dotenv
CORS_ORIGINS=http://localhost:5173
TRUST_PROXY_HOPS=0
```

- [ ] **Step 7: Verify backend security code**

Run:

```bash
bun test apps/backend/test/security-config.test.ts
bun --cwd apps/backend run check-types
bun run lint
git diff --check
```

Expected: all commands exit `0`.

- [ ] **Step 8: Commit backend hardening**

```bash
git add apps/backend/src/config/cors.ts apps/backend/test/security-config.test.ts apps/backend/src/config/env.ts apps/backend/src/loaders/loader.ts apps/backend/.env.example apps/backend/package.json apps/backend/bun.lock bun.lock
git commit -m "security: harden backend headers and CORS"
```

---

### Task 3: Build and Serve the Frontend Production Image

**Files:**
- Create: `.dockerignore`
- Create: `apps/starter/Dockerfile`
- Create: `apps/starter/nginx.conf`

**Interfaces:**
- Consumes: required Docker build argument `VITE_API_BASE_URL`.
- Produces: Nginx image listening on port `80` with `/healthz` and SPA routing.
- Produces: compiled Vite assets only; no source, secrets, or Bun runtime in the final image.

- [ ] **Step 1: Add a root Docker build context allowlist**

Create `.dockerignore`:

```dockerignore
.git
.github
.agent
node_modules
**/node_modules
**/dist
**/.turbo
**/.env
**/.env.*
!**/.env.example
docs
```

- [ ] **Step 2: Add the multi-stage frontend Dockerfile**

Create `apps/starter/Dockerfile`:

```dockerfile
FROM oven/bun:1.3.9-alpine AS dependencies
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/starter/package.json apps/starter/package.json
COPY packages/core/package.json packages/core/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
RUN bun install --frozen-lockfile

FROM dependencies AS build
ARG VITE_API_BASE_URL
RUN test -n "$VITE_API_BASE_URL"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY apps/starter apps/starter
COPY packages/core packages/core
COPY packages/types packages/types
COPY packages/typescript-config packages/typescript-config
RUN bun --cwd apps/starter run build

FROM nginx:alpine AS runtime
COPY apps/starter/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/starter/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://127.0.0.1/healthz >/dev/null || exit 1
```

- [ ] **Step 3: Configure Nginx for SPA routing, caching, and headers**

Create `apps/starter/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    server_tokens off;

    root /usr/share/nginx/html;
    index index.html;

    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self' https:" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    location = /healthz {
        access_log off;
        default_type text/plain;
        return 200 "ok\n";
    }

    location = /index.html {
        expires -1;
        try_files $uri =404;
    }

    location ~* ^/assets/.*\.(?:css|js|gif|jpe?g|png|svg|webp|woff2?)$ {
        expires 1y;
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

- [ ] **Step 4: Build and smoke-test the frontend image**

Run:

```bash
docker build -f apps/starter/Dockerfile --build-arg VITE_API_BASE_URL=https://api.example.com -t admin-template-frontend:test .
docker run --rm -d --name admin-template-frontend-smoke -p 18080:80 admin-template-frontend:test
curl --fail --silent --show-error http://127.0.0.1:18080/healthz
curl --fail --silent --show-error http://127.0.0.1:18080/settings
docker stop admin-template-frontend-smoke
```

Expected: image build exits `0`, health returns `ok`, and `/settings` returns the SPA HTML.

- [ ] **Step 5: Commit the frontend image**

```bash
git add .dockerignore apps/starter/Dockerfile apps/starter/nginx.conf
git commit -m "build: add production frontend image"
```

---

### Task 4: Replace the Backend Image with a Workspace-Aware Production Image

**Files:**
- Modify: `apps/backend/Dockerfile`
- Delete: `apps/backend/entrypoint.sh`

**Interfaces:**
- Consumes: runtime environment variables defined by `apps/backend/src/config/env.ts`.
- Produces: non-root Bun API image listening on `PORT=3333` and checking `/api/health-check`.
- Consumes: root workspace dependency graph and `packages/types` runtime source.

- [ ] **Step 1: Replace the backend Dockerfile**

Use this complete `apps/backend/Dockerfile`:

```dockerfile
FROM oven/bun:1.3.9-alpine AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/starter/package.json apps/starter/package.json
COPY packages/core/package.json packages/core/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
RUN bun install --frozen-lockfile

FROM dependencies AS build
COPY apps/backend apps/backend
COPY packages/types packages/types
RUN bun --cwd apps/backend run build

FROM base AS production-dependencies
COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/starter/package.json apps/starter/package.json
COPY packages/core/package.json packages/core/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
RUN bun install --frozen-lockfile --production

FROM oven/bun:1.3.9-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3333

COPY --from=production-dependencies --chown=bun:bun /app/node_modules ./node_modules
COPY --from=build --chown=bun:bun /app/apps/backend ./apps/backend
COPY --from=build --chown=bun:bun /app/packages/types ./packages/types

WORKDIR /app/apps/backend
USER bun
EXPOSE 3333
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["bun", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || '3333') + '/api/health-check').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"]
CMD ["bun", "run", "start"]
```

Delete `apps/backend/entrypoint.sh`; `CMD` now starts the service directly.

- [ ] **Step 2: Build the backend image**

Run:

```bash
docker build -f apps/backend/Dockerfile -t admin-template-backend:test .
```

Expected: dependency, TypeScript validation, production dependency, and runtime stages all complete.

- [ ] **Step 3: Smoke-test health, Helmet, and CORS**

Run the image with non-secret smoke values:

```bash
docker run --rm -d --name admin-template-backend-smoke -p 13333:3333 -e API_PREFIX=/api -e API_BASE_URL=http://127.0.0.1:13333 -e API_KEY=smoke-test-only -e PASSWORD_SALT=10 -e DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/express_template -e BETTER_AUTH_SECRET=smoke-test-only-secret-32-characters -e BETTER_AUTH_URL=http://127.0.0.1:13333 -e CORS_ORIGINS=https://admin.example.com -e TRUST_PROXY_HOPS=1 admin-template-backend:test
curl --fail --silent --show-error -D /tmp/admin-backend-headers.txt -H "Origin: https://admin.example.com" http://127.0.0.1:13333/api/health-check
rg -i "access-control-allow-origin: https://admin.example.com|x-content-type-options: nosniff" /tmp/admin-backend-headers.txt
docker stop admin-template-backend-smoke
```

Expected: health returns `200`; allowed CORS origin and Helmet's `nosniff` header are present; `X-Powered-By` is absent.

- [ ] **Step 4: Commit the backend image**

```bash
git add apps/backend/Dockerfile apps/backend/entrypoint.sh
git commit -m "build: add production backend image"
```

---

### Task 5: Add Pull-Request CI and Container Validation

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: root `check-types`, `lint`, `test`, and `build` scripts.
- Consumes: both root-context Dockerfiles.
- Produces: read-only PR/push checks; no artifacts are published.

- [ ] **Step 1: Add the GitHub Actions workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read

concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: Typecheck, lint, test, build
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.9

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Check types
        run: bun run check-types

      - name: Lint
        run: bun run lint

      - name: Test
        run: bun run test

      - name: Build
        run: bun run build

  containers:
    name: Build production containers
    runs-on: ubuntu-latest
    needs: quality
    timeout-minutes: 20
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Build frontend image
        run: >-
          docker build
          -f apps/starter/Dockerfile
          --build-arg VITE_API_BASE_URL=https://api.example.com
          -t admin-template-frontend:ci
          .

      - name: Build backend image
        run: >-
          docker build
          -f apps/backend/Dockerfile
          -t admin-template-backend:ci
          .
```

- [ ] **Step 2: Validate the workflow syntax and commands locally**

Run:

```bash
bun run check-types
bun run lint
bun run test
bun run build
docker build -f apps/starter/Dockerfile --build-arg VITE_API_BASE_URL=https://api.example.com -t admin-template-frontend:ci .
docker build -f apps/backend/Dockerfile -t admin-template-backend:ci .
```

Expected: all six commands exit `0`.

- [ ] **Step 3: Commit CI**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: enforce pull request quality gates"
```

---

### Task 6: Document Deployment and Run the Final Gate

**Files:**
- Modify: `README.md`
- Modify: `apps/starter/.env.example`
- Modify: `.agent/CONTINUITY.md`

**Interfaces:**
- Documents: image build/run contract, separate-domain configuration, cookie expectations, health checks, and explicit migrations.
- Records: final outcome and verified command evidence in continuity.

- [ ] **Step 1: Update the frontend environment example**

Set `apps/starter/.env.example` to:

```dotenv
VITE_API_BASE_URL=http://localhost:3333
```

- [ ] **Step 2: Add the production deployment guide**

Append this section to `README.md`:

````markdown
## Production containers

Build both images from the repository root. The frontend API URL is public build-time configuration:

```bash
docker build \
  -f apps/starter/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  -t admin-template-frontend .

docker build \
  -f apps/backend/Dockerfile \
  -t admin-template-backend .
```

Deploy the frontend and backend on HTTPS origins such as `https://admin.example.com` and `https://api.example.com`. Configure the backend with:

```dotenv
NODE_ENV=production
PORT=3333
CORS_ORIGINS=https://admin.example.com
TRUST_PROXY_HOPS=1
```

`CORS_ORIGINS` accepts a comma-separated list of exact origins. Do not use `*` with credentialed requests. `TRUST_PROXY_HOPS=1` assumes one controlled reverse proxy that overwrites forwarded headers; use `0` when the API is directly exposed.

The frontend sends requests with credentials. Keep Better Auth's trusted origins and production cookie attributes aligned with the deployed HTTPS domains. Sibling subdomains are cross-origin but same-site; unrelated top-level domains require an explicit `SameSite=None; Secure` and CSRF review.

Run migrations as a separate release step before starting the new backend image:

```bash
bun run db:migrate
```

Health endpoints:

- Frontend: `GET /healthz`
- Backend: `GET /api/health-check`

TLS certificates, HSTS policy, DNS, secrets, image publishing, and rollout orchestration belong to the deployment platform and are intentionally outside these images.
````

- [ ] **Step 3: Run the full fresh verification gate**

Run:

```bash
bun install --frozen-lockfile
bun run check-types
bun run lint
bun run test
bun run build
docker build -f apps/starter/Dockerfile --build-arg VITE_API_BASE_URL=https://api.example.com -t admin-template-frontend:final .
docker build -f apps/backend/Dockerfile -t admin-template-backend:final .
git diff --check
git status --short
```

Expected:

- install does not modify `bun.lock`;
- typecheck, lint, every test, and monorepo build exit `0`;
- both production images build;
- diff check reports no whitespace errors;
- status lists only intended production-readiness changes.

- [ ] **Step 4: Update continuity with facts and evidence**

Add one timestamped `[OUTCOMES]` entry to `.agent/CONTINUITY.md` listing:

- CI workflow and exact commands;
- frontend/backend image contracts;
- CORS, Helmet, and proxy trust behavior;
- passing test count and verification command results;
- any environment-specific smoke-test limitation marked `UNCONFIRMED`.

- [ ] **Step 5: Commit documentation and continuity**

```bash
git add README.md apps/starter/.env.example .agent/CONTINUITY.md
git commit -m "docs: document production deployment"
```

- [ ] **Step 6: Review the final branch diff**

Run:

```bash
git diff HEAD~6 --stat
git log -6 --oneline
```

Expected: six focused implementation commits after the design/plan documentation, with no unrelated files.
