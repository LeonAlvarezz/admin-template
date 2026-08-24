import { describe, expect, test, beforeEach } from "bun:test";
import { useWorkspaceTabsStore } from "../src/store/workspace-tabs";

describe("useWorkspaceTabsStore", () => {
  beforeEach(() => {
    useWorkspaceTabsStore.setState({ tabPaths: [] });
  });

  test("opens new tab paths and ignores duplicates and /login", () => {
    const { openTab } = useWorkspaceTabsStore.getState();

    openTab("/");
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual(["/"]);

    openTab("/shop/products");
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual([
      "/",
      "/shop/products",
    ]);

    // Duplicate path should not be added again
    openTab("/shop/products");
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual([
      "/",
      "/shop/products",
    ]);

    // Login path should be ignored
    openTab("/login");
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual([
      "/",
      "/shop/products",
    ]);
  });

  test("closes specific tab path", () => {
    useWorkspaceTabsStore.setState({
      tabPaths: ["/", "/shop/products", "/profile", "/settings"],
    });
    const { closeTab } = useWorkspaceTabsStore.getState();

    closeTab("/shop/products");
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual([
      "/",
      "/profile",
      "/settings",
    ]);

    // Does not close if only 1 tab remaining
    useWorkspaceTabsStore.setState({ tabPaths: ["/"] });
    closeTab("/");
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual(["/"]);
  });

  test("closeOthers keeps only the target tab", () => {
    useWorkspaceTabsStore.setState({
      tabPaths: ["/", "/shop/products", "/profile", "/settings"],
    });
    const { closeOthers } = useWorkspaceTabsStore.getState();

    closeOthers("/profile");
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual(["/profile"]);
  });

  test("closeToRight removes tabs after target index", () => {
    useWorkspaceTabsStore.setState({
      tabPaths: ["/", "/shop/products", "/profile", "/settings"],
    });
    const { closeToRight } = useWorkspaceTabsStore.getState();

    closeToRight("/shop/products");
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual([
      "/",
      "/shop/products",
    ]);
  });

  test("closeAll resets to single tab", () => {
    useWorkspaceTabsStore.setState({
      tabPaths: ["/", "/shop/products", "/profile"],
    });
    const { closeAll } = useWorkspaceTabsStore.getState();

    closeAll();
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual(["/"]);

    useWorkspaceTabsStore.setState({
      tabPaths: ["/a", "/b", "/c"],
    });
    closeAll("/fallback");
    expect(useWorkspaceTabsStore.getState().tabPaths).toEqual(["/fallback"]);
  });
});
