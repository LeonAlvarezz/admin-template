import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Pagination,
  generatePaginationItems,
} from "../src/components/ui/pagination";

describe("generatePaginationItems", () => {
  test("returns all page numbers when totalPages <= 7", () => {
    expect(generatePaginationItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(generatePaginationItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("returns right dots when on early pages with large totalPages", () => {
    expect(generatePaginationItems(1, 10)).toEqual([1, 2, 3, 4, 5, "...", 10]);
    expect(generatePaginationItems(2, 10)).toEqual([1, 2, 3, 4, 5, "...", 10]);
  });

  test("returns left and right dots when on middle page", () => {
    expect(generatePaginationItems(5, 10)).toEqual([
      1,
      "...",
      4,
      5,
      6,
      "...",
      10,
    ]);
  });

  test("returns left dots when on late pages", () => {
    expect(generatePaginationItems(9, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
    expect(generatePaginationItems(10, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
  });
});

describe("Pagination component", () => {
  test("renders navigation controls and page numbers correctly", () => {
    const html = renderToStaticMarkup(
      <Pagination page={1} totalPages={10} onPageChange={() => {}} />,
    );

    // Prev button should be disabled on page 1
    expect(html).toContain('aria-label="Go to previous page"');
    expect(html).toContain("disabled");

    // Page 1 should be active
    expect(html).toContain('aria-current="page"');
    expect(html).toContain(">1<");
    expect(html).toContain(">5<");
    expect(html).toContain("…"); // Ellipsis character
    expect(html).toContain(">10<");

    // Next button should be enabled
    expect(html).toContain('aria-label="Go to next page"');
  });

  test("does not render first (<<) or last (>>) buttons", () => {
    const html = renderToStaticMarkup(
      <Pagination page={2} totalPages={10} onPageChange={() => {}} />,
    );

    expect(html).not.toContain("chevrons-left");
    expect(html).not.toContain("chevrons-right");
  });
});
