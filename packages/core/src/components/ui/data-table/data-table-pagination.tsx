import type { ReactTable } from "@tanstack/react-table";
import Button from "../button";
import type { DefaultDataTableFeatures } from "./data-table";

interface DataTablePaginationProps<TData extends Record<string, any> = any> {
  table: ReactTable<DefaultDataTableFeatures, TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData extends Record<string, any> = any>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const totalRowCount = table.getFilteredRowModel().rows.length;
  const pageIndex = table.state.pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 border-t border-border">
      {/* Selected count info */}
      <div className="text-xs text-muted-foreground order-2 sm:order-1">
        {selectedRowCount > 0 ? (
          <span>
            {selectedRowCount} of {totalRowCount} row(s) selected.
          </span>
        ) : (
          <span>Total {totalRowCount} row(s)</span>
        )}
      </div>

      {/* Pagination controls & Page size selector */}
      <div className="flex items-center gap-6 lg:gap-8 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
        {/* Rows per page selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page</span>
          <select
            value={table.state.pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="h-8 w-16 rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {pageSizeOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        {/* Page counter & Navigation buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground min-w-20 text-center">
            Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
          </span>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="i-lucide-chevrons-left size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="i-lucide-chevron-left size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="i-lucide-chevron-right size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="i-lucide-chevrons-right size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
