import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const content = `# Z3 Admin Template & Core UI Library

> Modern high-performance monorepo admin template built with React 19, TypeScript, Tailwind CSS v4, TanStack Router, Headless UI v2, Express 5, Better Auth, and Drizzle ORM.

## Quick Reference
- Repository: https://github.com/LeonAlvarezz/admin-template
- Package Manager: Bun (\`bun install\`, \`bun run dev\`)
- Scaffold CLI: \`bun create z3-admin my-app\` or \`npx create-z3-admin my-app\`

## Core UI Components (@z3/admin-core)
- Button: \`import { Button } from "@z3/admin-core"\` - Variants: solid, secondary, outline, ghost, destructive. Supports \`loading\` prop.
- Input & Password: \`import { Input, InputPassword } from "@z3/admin-core"\` - Accessible text inputs with start/end icons and password reveal toggle.
- Select & Combobox: \`import { Select } from "@z3/admin-core"\` - Searchable (\`searchable\`), multi-select tag chips (\`multiple\`), clearable, and async (\`loadOptions\`).
- DataTable: \`import { DataTable } from "@z3/admin-core"\` - TanStack Table v8 wrapper with search toolbar, column visibility, pagination, and skeleton loading (\`loading\`).
- Modal & ConfirmModal: \`import { Modal, ModalHeader, ModalFooter, ConfirmModal } from "@z3/admin-core"\` - Accessible dialogs with smooth transitions.
- Drawer / Sheet: \`import { Drawer } from "@z3/admin-core"\` - Slide-out sheet panel.
- WorkspaceTabs: \`import { WorkspaceTabs } from "@z3/admin-core"\` - Multi-tab manager with state persistence and context menu.
- CommandSearch: \`import { CommandSearch, useRegisterCommands } from "@z3/admin-core"\` - Cmd+K command palette.
- Tag / Badge: \`import { Tag } from "@z3/admin-core"\` - Semantic badges with Tailwind color variants and optional dot indicators.
- NumberStepper: \`import { NumberStepper } from "@z3/admin-core"\` - Quantity steppers with boundaries and step intervals.
- Switch: \`import { Switch } from "@z3/admin-core"\` - Accessible toggle switches.
- Card: \`import { Card } from "@z3/admin-core"\` - Compound card container (\`Card.Header\`, \`Card.Content\`, \`Card.Footer\`).
- Tooltip: \`import { Tooltip } from "@z3/admin-core"\` - Floating tooltips with automatic overflow truncation detection.
- Pagination: \`import { Pagination } from "@z3/admin-core"\` - Accessible pagination controls.
- Avatar: \`import { Avatar } from "@z3/admin-core"\` - Profile avatar with fallback initials.
- Toaster & Toast: \`import { Toaster, toast } from "@z3/admin-core"\` - Glass pillar notifications (toast.success, toast.error, toast.promise).
- Upload: \`import { Upload } from "@z3/admin-core"\` - Drag & drop uploader with clipboard paste (Ctrl+V) and direct URL input.

## Shared Utilities & Hooks (@z3/admin-core)
- \`useQueryFilters(opts)\`: Synchronizes table search and filter state to URL query parameters with 300ms debounce.
- \`useDebounce(val, delay)\`: Debounces fast-changing values.
- \`formatCurrency(val, opts)\`: Localized currency formatting.
- \`formatNumber(val, opts)\`: Localized compact and standard numbers.
- \`formatDate(val, opts)\`: Localized date formatting.
- \`formatRelativeTime(date)\`: Human-readable relative time ("5 mins ago").
- \`copyToClipboard(text)\`: Async clipboard copy utility.
- \`slugify(text)\`, \`capitalize(text)\`, \`truncate(text, max)\`: String helpers.

## AI Developer Rules & Guidelines
1. MANDATORY: Check \`@z3/admin-core\` before creating raw HTML primitives (\`<button>\`, \`<input>\`, \`<select>\`, \`<table>\`, etc.).
2. Zero Scattered Utils: Always import helpers from \`@z3/admin-core\` instead of writing inline formatters.
3. Use Theme Tokens: Always use OKLCH semantic tokens (\`bg-accent\`, \`text-accent-foreground\`, \`bg-card\`, \`border-border\`).
4. Full docs: See /llms-full.txt for comprehensive guide markdown.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
