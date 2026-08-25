import { describe, expect, it } from "bun:test";
import { TAILWIND_COLORS, colorVariants } from "../src/components/ui/tag";

describe("Tag component & Color variants", () => {
  it("contains all standard Tailwind colors in TAILWIND_COLORS", () => {
    expect(TAILWIND_COLORS).toContain("violet");
    expect(TAILWIND_COLORS).toContain("emerald");
    expect(TAILWIND_COLORS).toContain("rose");
    expect(TAILWIND_COLORS).toContain("amber");
    expect(TAILWIND_COLORS).toContain("blue");
    expect(TAILWIND_COLORS).toContain("slate");
    expect(TAILWIND_COLORS.length).toBe(22);
  });

  it("provides valid badge and dot classes for every color", () => {
    for (const color of TAILWIND_COLORS) {
      const variant = colorVariants[color];
      expect(variant).toBeDefined();
      expect(variant.badge).toContain(`bg-${color}-500`);
      expect(variant.dot).toBe(`bg-${color}-500`);
    }
  });
});
