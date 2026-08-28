# Repository Guidelines & Coding Rules

## 1. Component Reusability & Pre-Coding Protocol (MANDATORY)

Before generating or refactoring any front-end UI code, agents **MUST** inspect `@admin/core` (`packages/core/src/components/ui` and `packages/core/src/components`) to verify whether a reusable UI component already exists.

### Rules of Engagement

1. **Pre-Coding Discovery Step**:
   - Check `packages/core/src/index.ts` and `packages/core/src/components/ui` before creating any UI elements.
   - Do **NOT** default to raw HTML elements (`<button>`, `<input>`, `<select>`, `<table...>`, raw dialog/modal divs, custom `<label>`, custom tooltips, etc.) when a component exists in `@admin/core`.

2. **Reuse Existing Components**:
   - **Buttons**: Use `<Button>` from `@admin/core` instead of `<button>`.
   - **Text Inputs**: Use `<Input>` or `<Input.Password>` / `<InputPassword>` from `@admin/core` instead of `<input type="text|password">`.
   - **Dropdown / Select**: Use `<NativeSelect>` from `@admin/core` instead of `<select>`.
   - **Checkboxes**: Use `<Checkbox>` from `@admin/core` instead of `<input type="checkbox">`.
   - **Forms & Fields**: Use `<Field>`, `<FieldSet>`, `<FieldGroup>`, `<FieldLabel>`, `<FieldError>` from `@admin/core` instead of raw `<label>` or standard field wrapper `div`s.
   - **Tables**: Use `<DataTable>` compound components (`DataTable`, `DataTable.Toolbar`, `DataTable.ColumnHeader`, `DataTable.Pagination`, `DataTable.ViewOptions`) from `@admin/core` instead of raw `<table>` or custom table structures.
   - **Dialogs & Sheets**: Use `<Drawer>` from `@admin/core` instead of raw fixed overlays or custom drawer divs.
   - **Tooltips**: Use `<Tooltip>` from `@admin/core` instead of custom inline hover titles or tooltips.
   - **Pagination**: Use `<Pagination>` from `@admin/core` instead of custom page number lists.
   - **Keyboard Shortcuts**: Use `<Keyboard>` from `@admin/core` instead of raw `<kbd>`.
   - **Avatars**: Use `<Avatar>` from `@admin/core` instead of custom image wrappers for user profiles.
   - **Notifications**: Use `toast` / `<Toaster>` from `@admin/core` instead of custom inline alerts or native `alert()`.
   - **Charts**: Use `<ChartContainer>`, `<ChartTooltip>`, `<ChartTooltipContent>` from `@admin/core`.

3. **Extending Components (No Fragmented Custom Code)**:
   - If an existing `@admin/core` component lacks a required prop, size, variant, or feature, **extend the component in `@admin/core`** first.
   - Do **NOT** bypass `@admin/core` by writing inline HTML primitives or duplicating component logic inside feature modules in `apps/starter`.

4. **Styling & Token Consistency**:
   - Always use theme tokens from `packages/core/src/styles/main.css` (`bg-accent`, `text-accent-foreground`, `bg-sidebar`, `bg-popover`, `border-border`, etc.).
   - Preserve hover/focus state conventions standardized across `@admin/core` (`bg-accent text-accent-foreground`).

---

## 2. Utility Functions & Helpers Protocol (MANDATORY)

To prevent fragmented, duplicated, and scattered utility functions across feature directories:

### Rules of Engagement

1. **Zero Scattered Utils**:
   - **NEVER** create ad-hoc helper files (e.g. `utils/`, `helpers.ts`, `format.ts`) inside feature folders in `apps/starter/src/modules/`.
   - **NEVER** write inline `new Intl.NumberFormat(...)`, `new Intl.DateTimeFormat(...)`, ad-hoc slugifiers, clipboard functions, or custom class joiners inside page components.

2. **Pre-Coding Utils Discovery**:
   - Always check `packages/core/src/utils/index.ts` and the **Utils Reference Map** below before creating any helper functions.
   - Import shared utilities directly from `@admin/core` (e.g. `import { cn, formatCurrency, formatDate, copyToClipboard } from "@admin/core"`).

3. **Centralized Utility Extension**:
   - If a new general utility or formatter is needed, add it to `packages/core/src/utils/` (`formatters.ts`, `string.ts`, `dom.ts`, etc.) and export it from `packages/core/src/utils/index.ts` and `packages/core/src/index.ts`.
   - Add the newly created utility to the **Utils Reference Map** in this file (`AGENTS.md`).

---

## Workspace Quick Reference Map

### UI Components (`@admin/core`)

| UI Primitives & Core Components | Export Path (`@admin/core`) | Source File |
| :--- | :--- | :--- |
| `<Button>` | `import { Button } from "@admin/core"` | `packages/core/src/components/ui/button.tsx` |
| `<Input>`, `<InputPassword>` | `import { Input, InputPassword } from "@admin/core"` | `packages/core/src/components/ui/input.tsx` |
| `<Checkbox>` | `import { Checkbox } from "@admin/core"` | `packages/core/src/components/ui/checkbox.tsx` |
| `<NativeSelect>` | `import { NativeSelect } from "@admin/core"` | `packages/core/src/components/ui/native-select.tsx` |
| `<Select>`, `<Select.Option>` | `import { Select } from "@admin/core"` | `packages/core/src/components/ui/select.tsx` |
| `<Field>`, `<FieldSet>`, `<FieldLabel>` | `import { Field, FieldSet, FieldLabel } from "@admin/core"` | `packages/core/src/components/ui/field.tsx` |
| `<Tooltip>` | `import { Tooltip } from "@admin/core"` | `packages/core/src/components/ui/tooltip.tsx` |
| `<DataTable>` | `import { DataTable } from "@admin/core"` | `packages/core/src/components/ui/data-table/` |
| `<Drawer>` | `import { Drawer } from "@admin/core"` | `packages/core/src/components/ui/drawer.tsx` |
| `<Pagination>` | `import { Pagination } from "@admin/core"` | `packages/core/src/components/ui/pagination.tsx` |
| `<Keyboard>` | `import { Keyboard } from "@admin/core"` | `packages/core/src/components/ui/keyboard.tsx` |
| `<Avatar>` | `import { Avatar } from "@admin/core"` | `packages/core/src/components/ui/avatar.tsx` |
| `<Toaster>`, `toast` | `import { Toaster, toast } from "@admin/core"` | `packages/core/src/components/ui/toaster.tsx` |
| `<ChartContainer>`, `<ChartTooltip>` | `import { ChartContainer, ChartTooltip } from "@admin/core"` | `packages/core/src/components/ui/chart.tsx` |
| `<CommandSearch>` | `import { CommandSearch } from "@admin/core"` | `packages/core/src/components/ui/command-search.tsx` |
| `<ContextMenu>` | `import { ContextMenu } from "@admin/core"` | `packages/core/src/components/ui/context-menu.tsx` |
| `<WorkspaceTabs>` | `import { WorkspaceTabs } from "@admin/core"` | `packages/core/src/components/workspace-tabs.tsx` |
| `<Modal>`, `<Modal.Header>`, `<Modal.Footer>` | `import { Modal, ModalHeader, ModalFooter } from "@admin/core"` | `packages/core/src/components/ui/modal.tsx` |
| `<ConfirmModal>` | `import { ConfirmModal } from "@admin/core"` | `packages/core/src/components/ui/confirm-modal.tsx` |
| `<Tag>` | `import { Tag } from "@admin/core"` | `packages/core/src/components/ui/tag.tsx` |
| `<NumberStepper>`, `<Stepper>` | `import { NumberStepper, Stepper } from "@admin/core"` | `packages/core/src/components/ui/number-stepper.tsx` |
| `<NotFound>` | `import { NotFound } from "@admin/core"` | `packages/core/src/components/ui/not-found.tsx` |
| `<Switch>` | `import { Switch } from "@admin/core"` | `packages/core/src/components/ui/switch.tsx` |
| `<SideBar>`, `<NavItem>` | `import { SideBar, NavItem } from "@admin/core"` | `packages/core/src/components/sidebar.tsx` |


### Shared Utilities & Helpers (`@admin/core`)

| Utility Function | Description | Example Usage | Source File |
| :--- | :--- | :--- | :--- |
| `cn(...classes)` | Tailwind CSS class merge + conditional joiner | `cn("p-4", isDark && "bg-black")` | `packages/core/src/utils/cn.ts` |
| `formatCurrency(val, opts?)` | Localized currency formatting (USD, EUR, etc.) | `formatCurrency(129.99, { currency: "USD" })` | `packages/core/src/utils/formatters.ts` |
| `formatNumber(val, opts?)` | Localized number formatting with notation (e.g. 1.2K) | `formatNumber(12500, { notation: "compact" })` | `packages/core/src/utils/formatters.ts` |
| `formatDate(date, opts?, locale?)` | Localized date formatting | `formatDate(new Date(), { month: "short", day: "numeric" })` | `packages/core/src/utils/formatters.ts` |
| `formatRelativeTime(date, base?)` | Relative human-readable time ("5 mins ago") | `formatRelativeTime("2026-08-24T10:00:00Z")` | `packages/core/src/utils/formatters.ts` |
| `formatFileSize(bytes, dec?)` | Human-readable file sizes ("1.5 MB") | `formatFileSize(1548576)` | `packages/core/src/utils/formatters.ts` |
| `slugify(text)` | Converts text to URL-friendly slug | `slugify("Wireless Noise Canceling")` | `packages/core/src/utils/string.ts` |
| `capitalize(text)` | Capitalizes first letter of string | `capitalize("active")` | `packages/core/src/utils/string.ts` |
| `truncate(text, max, suffix?)` | Truncates string with trailing ellipsis | `truncate(productName, 30)` | `packages/core/src/utils/string.ts` |
| `copyToClipboard(text)` | Asynchronous clipboard copy with fallback | `await copyToClipboard("SKU-12345")` | `packages/core/src/utils/dom.ts` |
