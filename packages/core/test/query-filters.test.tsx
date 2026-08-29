import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { sanitizeParams, useQueryFilters, useTableFilters } from "../src/hooks/use-query-filters";
import { useDebounce } from "../src/hooks/use-debounce";
import { ErrorState } from "../src/components/ui/error-state";
import { safeValidateSearch, ListUsersQuerySchema, USER_ROLE } from "@admin/types";

describe("sanitizeParams", () => {
  it("removes undefined, null, and empty string values", () => {
    const input = {
      search: "",
      role: "admin",
      status: undefined,
      page: null,
      count: 10,
    };
    const cleaned = sanitizeParams(input);
    expect(cleaned).toEqual({
      role: "admin",
      count: 10,
    });
  });

  it("removes values matching defaultValues to keep URL clean", () => {
    const input = {
      search: "alex",
      role: "all",
      page: 1,
    };
    const defaults = {
      role: "all",
      page: 1,
      search: "",
    };
    const cleaned = sanitizeParams(input, defaults);
    expect(cleaned).toEqual({
      search: "alex",
    });
  });

  it("returns empty object when all values are defaults or empty", () => {
    const input = {
      search: "",
      role: "all",
    };
    const defaults = {
      search: "",
      role: "all",
    };
    const cleaned = sanitizeParams(input, defaults);
    expect(cleaned).toEqual({});
  });
});

describe("useQueryFilters & useTableFilters Hooks", () => {
  it("exports useTableFilters as alias of useQueryFilters", () => {
    expect(useTableFilters).toBe(useQueryFilters);
  });

  it("renders with default values and isFiltered false", () => {
    let captured: any;

    function TestComponent() {
      captured = useQueryFilters({
        defaultValues: { search: "", role: "all" },
      });
      return <div>{captured.searchValue}</div>;
    }

    renderToStaticMarkup(<TestComponent />);

    expect(captured).toBeDefined();
    expect(captured.filters).toEqual({ search: "", role: "all" });
    expect(captured.searchValue).toBe("");
    expect(captured.isFiltered).toBe(false);
    expect(typeof captured.setSearchValue).toBe("function");
    expect(typeof captured.setFilter).toBe("function");
    expect(typeof captured.setFilters).toBe("function");
    expect(typeof captured.resetFilters).toBe("function");
    expect(typeof captured.clearSearch).toBe("function");
  });

  it("renders with active filter values when provided", () => {
    let captured: any;

    function TestComponent() {
      captured = useQueryFilters({
        defaultValues: { search: "test", role: "admin" },
      });
      return <div>{captured.searchValue}</div>;
    }

    renderToStaticMarkup(<TestComponent />);

    expect(captured).toBeDefined();
    expect(captured.filters).toEqual({ search: "test", role: "admin" });
    expect(captured.searchValue).toBe("test");
  });
});

describe("useDebounce Hook", () => {
  it("renders initial value in component", () => {
    let debounced: any;

    function TestComponent() {
      debounced = useDebounce("initial value", 100);
      return <div>{debounced}</div>;
    }

    renderToStaticMarkup(<TestComponent />);
    expect(debounced).toBe("initial value");
  });
});

describe("safeValidateSearch", () => {
  const validator = safeValidateSearch(ListUsersQuerySchema);

  it("safely handles invalid search params (e.g. order=dessc) without crashing", () => {
    const raw = { limit: "20", order: "dessc" };
    const parsed = validator(raw);
    expect(parsed.order).toBe("desc");
    expect(parsed.limit).toBe(20);
  });

  it("preserves valid fields while discarding invalid ones", () => {
    const raw = { search: "john", role: "invalid_role", order: "dessc" };
    const parsed = validator(raw);
    expect(parsed.search).toBe("john");
    expect(parsed.role).toBeUndefined();
    expect(parsed.order).toBe("desc");
  });

  it("explicitly sets invalid keys to undefined in output so router search overwrites raw values", () => {
    const raw = { limit: "20", order: "desc", role: "superadmin" };
    const parsed = validator(raw) as Record<string, unknown>;
    expect("role" in parsed).toBe(true);
    expect(parsed.role).toBeUndefined();
    expect(parsed.limit).toBe(20);
    expect(parsed.order).toBe("desc");
  });

  it("preserves valid role and custom limits", () => {
    const raw = { search: "admin_user", role: USER_ROLE.ADMIN, limit: "50", order: "asc" };
    const parsed = validator(raw);
    expect(parsed.search).toBe("admin_user");
    expect(parsed.role).toBe(USER_ROLE.ADMIN);
    expect(parsed.limit).toBe(50);
    expect(parsed.order).toBe("asc");
  });
});

describe("ErrorState Component", () => {
  it("renders with default error message and buttons", () => {
    const html = renderToStaticMarkup(
      <ErrorState
        title="Custom Error"
        description="Something went wrong while testing."
        showHomeButton={true}
        showRetryButton={true}
        onRetry={() => {}}
      />,
    );
    expect(html).toContain("Custom Error");
    expect(html).toContain("Something went wrong while testing.");
    expect(html).toContain("Try Again");
    expect(html).toContain("Back to Dashboard");
  });
});

