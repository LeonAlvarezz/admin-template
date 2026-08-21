import type { ReactTable } from "@tanstack/react-table";
import Input from "../input";
import Button from "../button";
import { DataTableViewOptions } from "./data-table-view-options";
import type { DefaultDataTableFeatures } from "./data-table";

interface DataTableToolbarProps<TData extends Record<string, any> = any> {
  table: ReactTable<DefaultDataTableFeatures, TData>;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  searchPlaceholder?: string;
  enableColumnViewToggle?: boolean;
  actions?: React.ReactNode;
}

export function DataTableToolbar<TData extends Record<string, any> = any>({
  table,
  globalFilter,
  onGlobalFilterChange,
  searchPlaceholder = "Search all columns...",
  enableColumnViewToggle = true,
  actions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = (globalFilter && globalFilter.length > 0) || table.state.columnFilters.length > 0;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4">
      {/* Search Input & Reset Button */}
      <div className="flex flex-1 items-center gap-2">
        {onGlobalFilterChange && (
          <div className="w-full sm:max-w-xs">
            <Input
              value={globalFilter ?? ""}
              onChange={(e) => onGlobalFilterChange(e.target.value)}
              placeholder={searchPlaceholder}
              startIcon={<span className="i-lucide-search size-4 text-muted-foreground" />}
              endIcon={
                globalFilter ? (
                  <button
                    type="button"
                    onClick={() => onGlobalFilterChange("")}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <span className="i-lucide-circle-x size-4" />
                  </button>
                ) : null
              }
              className="h-9 text-xs"
            />
          </div>
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              table.resetColumnFilters();
              if (onGlobalFilterChange) onGlobalFilterChange("");
            }}
            className="h-9 px-2 text-xs flex items-center gap-1.5"
          >
            <span>Reset</span>
            <span className="i-lucide-x size-3.5" />
          </Button>
        )}
      </div>

      {/* Right side actions & Column View options */}
      <div className="flex items-center gap-2 justify-end">
        {actions}
        {enableColumnViewToggle && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
