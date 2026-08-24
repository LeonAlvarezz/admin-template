import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { ColumnDef } from "@tanstack/react-table";
import type { DefaultDataTableFeatures } from "../src/components/ui/data-table/data-table";

import { DataTable } from "../src/components/ui/data-table/data-table";

type TestRow = {
  name: string;
  status: string;
};

const columns: ColumnDef<DefaultDataTableFeatures, TestRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 96,
  },
];

function renderTable(
  columnsToRender: ColumnDef<DefaultDataTableFeatures, TestRow>[] = columns,
) {
  return renderToStaticMarkup(
    <DataTable
      columns={columnsToRender}
      data={[
        { name: "A product name that must stay on one line", status: "Active" },
      ]}
      enablePagination={false}
      enableColumnViewToggle={false}
    />,
  );
}

describe("DataTable column sizing", () => {
  test("leaves unsized columns flexible while preserving explicit sizes", () => {
    const html = renderTable();

    expect(html).toContain("table-fixed");
    expect(html).toContain('<colgroup><col/><col style="width:96px"/>');
  });

  test("keeps header and body cells on one line", () => {
    const html = renderTable();

    expect(html.match(/whitespace-nowrap/g)).toHaveLength(4);
  });

  test("clips body content at the cell boundary", () => {
    const html = renderTable();

    expect(html.match(/<td[^>]*overflow-hidden/g)).toHaveLength(2);
  });

  test("truncates default accessor cells inside the cell content", () => {
    const html = renderTable();

    expect(html.match(/class="block min-w-0 truncate"/g)).toHaveLength(2);
    expect(html.match(/<td[^>]*class="[^"]*\btruncate\b/g)).toBeNull();
  });

  test("attaches overflow-only tooltips to truncated cells", () => {
    const html = renderTable();

    expect(html.match(/data-tooltip-overflow="true"/g)).toHaveLength(2);
  });

  test("does not truncate custom-rendered cells by default", () => {
    const html = renderTable([
      {
        id: "control",
        header: "Control",
        cell: () => <button type="button">Select row</button>,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
    ]);

    expect(html.match(/class="block min-w-0 truncate"/g)).toHaveLength(1);
    expect(html.match(/data-tooltip-overflow="true"/g)).toHaveLength(1);
    expect(html).not.toContain(
      'class="block min-w-0 truncate"><button type="button">',
    );
  });

  test("allows truncation to be overridden through column meta", () => {
    const html = renderTable([
      {
        accessorKey: "name",
        header: "Name",
        meta: { truncate: false },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <strong>{row.original.status}</strong>,
        meta: { truncate: true },
      },
    ]);

    expect(html).not.toContain(
      'class="block min-w-0 truncate">A product name that must stay on one line',
    );
    expect(html).toContain(
      'class="block min-w-0 truncate"><strong>Active</strong>',
    );
  });
});
