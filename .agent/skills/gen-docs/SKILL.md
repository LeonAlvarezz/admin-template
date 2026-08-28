---
name: gen-docs
description: >-
  Generate, update, and verify OpenAPI 3.0 JSDoc specifications and Scalar API Reference documentation
  for backend Express routes in apps/backend. Use whenever the user invokes /gen-docs, asks to document
  an API route, generate OpenAPI/Swagger docs, create Scalar reference, or add API schemas to openapi.config.ts.
---

# gen-docs — OpenAPI & Scalar Documentation Generator

This skill guides the standard procedure for documenting backend API endpoints in `apps/backend`. The backend uses `swagger-jsdoc` scanning `@openapi` JSDoc annotations and serves interactive documentation via `@scalar/express-api-reference` at `/docs` (raw JSON at `/docs/json`).

---

## Workflow Overview

When a user requests OpenAPI/Scalar docs for a route:

1. **Discover Route & Schema**:
   - Inspect the route definition: `apps/backend/src/modules/<module>/<module>.route.ts`.
   - Inspect the request/response payloads in `packages/types/<module>.ts` (Valibot schemas).
   - Check if the route is protected (`protectedRoute` middleware) or requires authentication.

2. **Register Reusable Schemas (`apps/backend/src/config/openapi.config.ts`)**:
   - If the request body or response model introduces new entities, add them to `components.schemas` in `openapi.config.ts`.
   - Use standard OpenAPI 3.0 types (`type: "object"`, `properties`, `required`, `example`, `nullable`).

3. **Annotate Route with `@openapi` JSDoc**:
   - Place the `@openapi` comment block directly above the Express router method (`router.get`, `router.post`, `router.put`, `router.delete`) in the `<module>.route.ts` file.
   - Specify:
     - `summary`: Short action summary (e.g. "Create new product")
     - `description`: Detailed behavior explanation
     - `tags`: Grouping category (e.g. `Authentication`, `Products`, `Orders`)
     - `security`: Include `cookieAuth: []` and `bearerAuth: []` if the route requires authentication
     - `parameters`: Define any path parameters (e.g. `id`, `slug`) or query parameters (e.g. `page`, `limit`)
     - `requestBody`: Reference payload schema from `#/components/schemas/<SchemaName>`
     - `responses`: Standard status codes (`200`, `201`, `400`, `401`, `403`, `404`) with `#/components/schemas/ApiResponse` wrapper

4. **Verify Documentation Generation**:
   - Run the verification script:
     ```bash
     bun --env-file apps/backend/.env .agent/skills/gen-docs/scripts/verify-docs.ts
     ```
   - Confirm the new endpoint appears in the list of registered paths with its HTTP methods and summary.

---

## Standard JSDoc Templates

### 1. GET with Path Parameter & Authentication

```typescript
/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieves detailed product record by unique numeric ID.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric product ID
 *     responses:
 *       200:
 *         description: Product details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized. Session required.
 *       404:
 *         description: Product not found.
 */
router.get("/:id", protectedRoute(controller.findById));
```

### 2. POST with Request Body

```typescript
/**
 * @openapi
 * /auth/update-user:
 *   post:
 *     summary: Update current user profile
 *     description: Updates the authenticated user's profile information via Better Auth.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserPayload'
 *     responses:
 *       200:
 *         description: User profile successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized. Valid session required.
 */
router.post("/update-user", controller.updateUserInfo);
```

### 3. PUT / PATCH Endpoint

```typescript
/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update existing product
 *     description: Updates an existing product entity by ID.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductPayload'
 *     responses:
 *       200:
 *         description: Product successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 */
router.put("/:id", protectedRoute(controller.update));
```

### 4. DELETE Endpoint

```typescript
/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Permanently removes a product by ID.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 */
router.delete("/:id", protectedRoute(controller.delete));
```

---

## Registering Schemas in `openapi.config.ts`

Schemas live in `components.schemas` in [`openapi.config.ts`](file:///Users/leonhong/Personal%20Project/admin-template/apps/backend/src/config/openapi.config.ts). Follow this pattern:

```typescript
UpdateUserPayload: {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "Leon Alvarez",
    },
    image: {
      type: "string",
      nullable: true,
      example: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    },
  },
},
```

---

## Verification Runbook

Always verify newly added documentation:

1. Execute the verification script:
   ```bash
   bun --env-file apps/backend/.env .agent/skills/gen-docs/scripts/verify-docs.ts
   ```
2. Confirm the total endpoint count increased and the endpoint is listed under its path.
3. Access Scalar interactive UI in browser at:
   `http://localhost:3000/docs` (or configured backend `PORT`).
