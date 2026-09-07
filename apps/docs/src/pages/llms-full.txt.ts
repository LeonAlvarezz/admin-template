import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const content = `# Z3 Admin Full Documentation & Component Specification Reference

This document provides a comprehensive, AI-ingestible reference for the entire Z3 Admin monorepo, UI architecture, backend services, and component contracts.

---

## 1. Architecture Overview

- **Monorepo**: Bun workspaces + Turborepo.
- **Frontend App (\`apps/starter\`)**: React 19, Vite, TanStack Router (file-based routing under \`src/routes\`), TanStack Query, TanStack Form, and Tailwind CSS v4.
- **Backend API (\`apps/backend\`)**: Express 5, Drizzle ORM (PostgreSQL 16), Better Auth (Session auth, TOTP 2FA, Role permissions), and Scalar API Reference (\`/docs\`).
- **UI Core (\`packages/core\`)**: Exported as \`@z3/admin-core\`. Contains all UI components, OKLCH design tokens (\`main.css\`), and utilities.
- **Shared Types (\`packages/types\`)**: Exported as \`@z3/types\`. Contains end-to-end Valibot schemas and inferred TypeScript types.

---

## 2. Mock Mode vs Backend Mode

- **Mock Mode (\`VITE_ENABLE_MOCK=true\`)**:
  - \`apiClient\` dynamically routes all requests to \`apps/starter/src/mocks/handlers.ts\`.
  - Stateful in-memory CRUD for Auth, Users, Products, and Orders with 150ms simulated async latency.
  - Zero database or Docker required. Run: \`bun run dev:mock\`.
- **Backend Mode (\`VITE_ENABLE_MOCK=false\`)**:
  - \`apiClient\` sends requests to \`http://localhost:3333/api\`.
  - Connected to Express 5 + PostgreSQL 16 Alpine + Drizzle ORM. Run: \`bun run dev:full\`.

---

## 3. UI Components API Reference (@z3/admin-core)

### Button
\`\`\`tsx
import { Button } from "@z3/admin-core";

<Button variant="solid" size="md" loading={false}>Click Me</Button>
\`\`\`
- \`variant\`: "solid" | "secondary" | "outline" | "ghost" | "destructive"
- \`size\`: "sm" | "md" | "lg"
- \`loading\`: boolean (renders spinner and disables clicks)

### Select & Combobox
\`\`\`tsx
import { Select } from "@z3/admin-core";

<Select
  searchable
  clearable
  multiple={false}
  options={[{ value: "1", label: "Option 1" }]}
  value={value}
  onChange={(val) => setValue(val)}
/>
\`\`\`

### DataTable
\`\`\`tsx
import { DataTable } from "@z3/admin-core";

<DataTable
  columns={columns}
  data={data}
  loading={isLoading}
  toolbar={<DataTable.Toolbar table={table} onSearchChange={...} />}
  pagination={<DataTable.Pagination table={table} />}
/>
\`\`\`

### Modal & ConfirmModal
\`\`\`tsx
import { Modal, ModalHeader, ModalFooter, ConfirmModal } from "@z3/admin-core";

<Modal open={isOpen} onClose={() => setIsOpen(false)} size="lg">
  <ModalHeader title="Title" description="Subtitle" onClose={() => setIsOpen(false)} />
  <div className="p-6">Content</div>
  <ModalFooter primaryAction={{ label: "Save", onClick: handleSave }} />
</Modal>
\`\`\`

### Tag / Badge
\`\`\`tsx
import { Tag } from "@z3/admin-core";

<Tag color="emerald" showDot>Active</Tag>
\`\`\`

### Upload
\`\`\`tsx
import { Upload } from "@z3/admin-core";

<Upload
  accept="image"
  maxSizeMB={5}
  onUpload={(files) => console.log(files)}
/>
\`\`\`

---

## 4. Shared Hooks & Utilities

- \`useQueryFilters({ defaultValues: { search: "", role: "all" } })\`: Bidirectional URL search param synchronization with 300ms debouncing.
- \`formatCurrency(amount, { currency: "USD" })\`: Currency formatting.
- \`formatDate(date, { month: "short", day: "numeric" })\`: Localized date formatting.
- \`formatRelativeTime(date)\`: Relative human-readable string.
- \`copyToClipboard(text)\`: Asynchronous clipboard copy.

---

## 5. Seed Database Accounts

| Role | Email | Password | Role Key |
| :--- | :--- | :--- | :--- |
| Super Admin | superadmin@example.com | 12345678 | superAdmin |
| Admin | admin@example.com | 12345678 | admin |
| Standard User | user@example.com | 12345678 | user |
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
