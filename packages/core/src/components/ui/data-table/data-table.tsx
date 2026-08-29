import * as React from "react";
import {
  useTable,
  flexRender,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  metaHelper,
  createCoreRowModel,
  createSortedRowModel,
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
import { InboxIcon } from "../icons";
import { Tooltip } from "../tooltip";
import { Skeleton } from "../skeleton";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export interface DataTableColumnMeta {
  className?: string;
  truncate?: boolean;
}

export const defaultFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnMeta: metaHelper<DataTableColumnMeta>(),
  coreRowModel: createCoreRowModel(),
  sortedRowModel: createSortedRowModel(),
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
  enablePagination?: boolean;
  enableColumnViewToggle?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  toolbarActions?: React.ReactNode;
  toolbar?: React.ReactNode | ((table: any) => React.ReactNode);
  emptyState?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  className?: string;
}

function DataTableRoot<
  TData extends Record<string, any> = any,
  TValue = unknown,
>({
  columns,
  data,
  loading = false,
  enablePagination = true,
  enableColumnViewToggle = true,
  pageSizeOptions = [10, 20, 30, 40, 50],
  initialPageSize = 10,
  toolbarActions,
  toolbar,
  emptyState,
  onRowClick,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
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
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Toolbar Slot */}
      {toolbar ? (
        typeof toolbar === "function" ? (
          toolbar(table as any)
        ) : (
          toolbar
        )
      ) : enableColumnViewToggle || toolbarActions ? (
        <DataTableToolbar
          table={table as any}
          enableColumnViewToggle={enableColumnViewToggle}
          actions={toolbarActions}
        />
      ) : null}

      {/* Main Table Shell */}
      <div className="@container rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto table-scrollbar">
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
                  <tr key={`skeleton-${index}`}>
                    {table.getVisibleLeafColumns().map((column) => (
                      <td
                        key={`skeleton-${column.id}`}
                        className="px-4 py-3.5 whitespace-nowrap"
                      >
                        <Skeleton className="h-4 w-3/4" />
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
                    colSpan={
                      table.getVisibleLeafColumns().length || columns.length
                    }
                    className="h-36 p-0 text-center"
                  >
                    <div className="sticky left-0 w-[100cqw] flex flex-col items-center justify-center gap-2 text-muted-foreground py-8">
                      {emptyState ?? (
                        <>
                          <InboxIcon className="size-8 opacity-40" />
                          <p className="text-sm font-medium">No results found.</p>
                        </>
                      )}
                    </div>
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
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export const DataTable = Object.assign(DataTableRoot, {
  Toolbar: DataTableToolbar,
  ViewOptions: DataTableViewOptions,
  Pagination: DataTablePagination,
  ColumnHeader: DataTableColumnHeader,
  RowActions: DataTableRowActions,
});
