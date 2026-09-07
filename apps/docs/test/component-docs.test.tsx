import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ComponentPreview } from "../src/components/ComponentPreview";

describe("Button documentation", () => {
  test("uses the shared Button for preview controls", () => {
    const html = renderToStaticMarkup(
      <ComponentPreview code="example">Demo</ComponentPreview>,
    );

    expect(html).toContain('data-headlessui-state="">Preview</button>');
    expect(html).toContain('data-headlessui-state="">Code</button>');
    expect(html).toContain('aria-label="Copy code"');
  });

  test("composes the preview controls and live demo in one React island", async () => {
    const demos = await import("../src/components/demos");

    expect(demos.ButtonPreview).toBeFunction();

    const html = renderToStaticMarkup(
      <demos.ButtonPreview code="example" title="Button demo" />,
    );

    expect(html).toContain(">Preview</button>");
    expect(html).toContain(">Click to Load</button>");
  });
});
