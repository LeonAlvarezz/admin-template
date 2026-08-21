import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

const tooltipModule = await import("../src/components/ui/tooltip").catch(
  () => null,
);

describe("Tooltip", () => {
  test("detects overflow only when content exceeds its visible width", () => {
    expect(tooltipModule).not.toBeNull();
    if (!tooltipModule) return;

    expect(
      tooltipModule.isElementOverflowing({
        clientWidth: 100,
        scrollWidth: 101,
      }),
    ).toBe(true);
    expect(
      tooltipModule.isElementOverflowing({
        clientWidth: 100,
        scrollWidth: 100,
      }),
    ).toBe(false);
  });

  test("renders an overflow-aware tooltip trigger", () => {
    expect(tooltipModule).not.toBeNull();
    if (!tooltipModule) return;

    const html = renderToStaticMarkup(
      <tooltipModule.Tooltip content="Complete product name" showWhenTruncated>
        Complete product name
      </tooltipModule.Tooltip>,
    );

    expect(html).toContain('data-slot="tooltip-trigger"');
    expect(html).toContain('data-tooltip-overflow="true"');
    expect(html).toContain("Complete product name");
  });
});
