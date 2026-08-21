import type { ReactTable } from "@tanstack/react-table";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Button from "../button";
import Checkbox from "../checkbox";
import { cn } from "../../../libs/cn";
import type { DefaultDataTableFeatures } from "./data-table";

interface DataTableViewOptionsProps<TData extends Record<string, any> = any> {
  table: ReactTable<DefaultDataTableFeatures, TData>;
}

export function DataTableViewOptions<TData extends Record<string, any> = any>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const toggleableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    );

  if (toggleableColumns.length === 0) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        as={Button}
        variant="outline"
        size="sm"
        className="h-9 flex items-center gap-2 px-3 text-xs"
      >
        <span className="i-lucide-sliders-horizontal size-4" />
        <span>View Columns</span>
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="z-50 min-w-44 rounded-md border border-border bg-popover p-1.5 text-popover-foreground shadow-md transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0"
      >
        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Toggle columns
        </div>
        <div className="my-1 h-px bg-border" />
        <div className="max-h-60 overflow-y-auto">
          {toggleableColumns.map((column) => {
            const isVisible = column.getIsVisible();
            const header = column.columnDef.header;
            const label =
              typeof header === "string"
                ? header
                : column.id;

            return (
              <MenuItem key={column.id}>
                {({ focus }) => (
                  <label
                    className={cn(
                      "flex items-center gap-2.5 rounded-sm px-2 py-1.5 text-xs capitalize cursor-pointer select-none",
                      focus && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Checkbox
                      checked={isVisible}
                      onChange={(checked) => column.toggleVisibility(checked)}
                    />
                    <span className="truncate">{label}</span>
                  </label>
                )}
              </MenuItem>
            );
          })}
        </div>
      </MenuItems>
    </Menu>
  );
}
