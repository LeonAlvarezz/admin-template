import * as React from "react";
import {
  useTable,
  flexRender,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  metaHelper,
  createCoreRowModel,
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  ColumnVisibilityState,
} from "@tanstack/react-table";
import { cn } from "../../../libs/cn";
import { Tooltip } from "../tooltip";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

export interface DataTableColumnMeta {
  className?: string;
  truncate?: boolean;
}

export const defaultFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnMeta: metaHelper<DataTableColumnMeta>(),
  coreRowModel: createCoreRowModel(),
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

export type DefaultDataTableFeatures = typeof defaultFeatures;

function getColumnDefinitionInfo<TData extends Record<string, any>>(
  columns: readonly ColumnDef<DefaultDataTableFeatures, TData, any>[],
) {
  const sizedColumnIds = new Set<string>();
  const customCellColumnIds = new Set<string>();

  const visitColumns = (
    columnDefs: readonly ColumnDef<DefaultDataTableFeatures, TData, any>[],
  ) => {
    for (const columnDef of columnDefs) {
      if ("columns" in columnDef && columnDef.columns) {
        visitColumns(columnDef.columns);
        continue;
      }

      const accessorKey =
        "accessorKey" in columnDef && typeof columnDef.accessorKey === "string"
          ? columnDef.accessorKey
          : undefined;
      const columnId =
        columnDef.id ??
        accessorKey?.replaceAll(".", "_") ??
        (typeof columnDef.header === "string" ? columnDef.header : undefined);

      if (!columnId) continue;

      if (columnDef.size != null) sizedColumnIds.add(columnId);
      if (columnDef.cell != null) customCellColumnIds.add(columnId);
    }
  };

  visitColumns(columns);
  return {
    explicitlySizedColumnIds: sizedColumnIds,
    customCellColumnIds,
  };
}

export interface DataTableProps<
  TData extends Record<string, any> = any,
  TValue = unknown,
> {
  columns: ColumnDef<DefaultDataTableFeatures, TData, TValue>[];
  data: TData[];
  loading?: boolean;
  searchPlaceholder?: string;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableColumnViewToggle?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  toolbarActions?: React.ReactNode;
  emptyState?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  className?: string;
}

export function DataTable<
  TData extends Record<string, any> = any,
  TValue = unknown,
>({
  columns,
  data,
  loading = false,
  searchPlaceholder = "Search all columns...",
  enableGlobalFilter = true,
  enablePagination = true,
  enableColumnViewToggle = true,
  pageSizeOptions = [10, 20, 30, 40, 50],
  initialPageSize = 10,
  toolbarActions,
  emptyState,
  onRowClick,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const { explicitlySizedColumnIds, customCellColumnIds } =
    getColumnDefinitionInfo(columns);

  const table = useTable({
    features: defaultFeatures,
    data,
    columns: columns as any,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Toolbar (Search, Filter Reset, Custom Actions, Column Toggle) */}
      {(enableGlobalFilter || enableColumnViewToggle || toolbarActions) && (
        <DataTableToolbar
          table={table as any}
          globalFilter={globalFilter}
          onGlobalFilterChange={
            enableGlobalFilter ? setGlobalFilter : undefined
          }
          searchPlaceholder={searchPlaceholder}
          enableColumnViewToggle={enableColumnViewToggle}
          actions={toolbarActions}
        />
      )}

      {/* Main Table Shell */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table
            className="w-full table-fixed text-left text-sm text-foreground"
            style={{ minWidth: table.getTotalSize() }}
          >
            <colgroup>
              {table.getVisibleLeafColumns().map((column) => (
                <col
                  key={column.id}
                  style={
                    explicitlySizedColumnIds.has(column.id)
                      ? { width: column.getSize() }
                      : undefined
                  }
                />
              ))}
            </colgroup>
            <thead className="bg-muted/20 border-border text-xs uppercase tracking-wider text-muted-foreground select-none">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-4 py-3 font-semibold whitespace-nowrap transition-colors"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    {columns.map((_column, colIndex) => (
                      <td
                        key={`skeleton-col-${colIndex}`}
                        className="px-4 py-3.5 whitespace-nowrap"
                      >
                        <div className="h-4 bg-muted rounded-md w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                // Data Rows
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      "transition-color hover:bg-accent data-[state=selected]:bg-primary/5",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const content = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      );
                      const shouldTruncate =
                        cell.column.columnDef.meta?.truncate ??
                        !customCellColumnIds.has(cell.column.id);

                      return (
                        <td
                          key={cell.id}
                          className="px-4 py-3 align-middle whitespace-nowrap overflow-hidden"
                        >
                          {shouldTruncate ? (
                            <Tooltip
                              content={content}
                              showWhenTruncated
                              className="block min-w-0 truncate"
                            >
                              {content}
                            </Tooltip>
                          ) : (
                            content
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                // Empty State
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-36 text-center py-8"
                  >
                    {emptyState ?? (
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <span className="i-lucide-inbox size-8 opacity-40" />
                        <p className="text-sm font-medium">No results found.</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {enablePagination && (
          <DataTablePagination
            table={table as any}
            pageSizeOptions={pageSizeOptions}
          />
        )}
      </div>
    </div>
  );
}
