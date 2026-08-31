import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const themeCss = readFileSync(
  new URL("../src/styles/main.css", import.meta.url),
  "utf8",
);

function themeBlock(selector: ":root" | ".dark") {
  const match = themeCss.match(
    new RegExp(`\\${selector}\\s*\\{([\\s\\S]*?)\\n\\}`),
  );

  if (!match?.[1]) {
    throw new Error(`Missing ${selector} theme block`);
  }

  return match[1];
}

function lightness(block: string, token: "card" | "popover" | "accent") {
  const match = block.match(
    new RegExp(`--${token}:\\s*oklch\\(([0-9.]+)`),
  );

  if (!match?.[1]) {
    throw new Error(`Missing --${token} OKLCH token`);
  }

  return Number(match[1]);
}

describe("theme surface colors", () => {
  test("light accent stays close to card while popover remains elevated", () => {
    const light = themeBlock(":root");
    const card = lightness(light, "card");
    const popover = lightness(light, "popover");
    const accent = lightness(light, "accent");

    expect(popover).toBeGreaterThanOrEqual(card);
    expect(card - accent).toBeGreaterThanOrEqual(0.02);
    expect(card - accent).toBeLessThanOrEqual(0.06);
  });

  test("dark popover and accent rise above the card instead of darkening it", () => {
    const dark = themeBlock(".dark");
    const card = lightness(dark, "card");
    const popover = lightness(dark, "popover");
    const accent = lightness(dark, "accent");

    expect(popover - card).toBeGreaterThanOrEqual(0.02);
    expect(popover - card).toBeLessThanOrEqual(0.05);
    expect(accent - card).toBeGreaterThanOrEqual(0.04);
    expect(accent - card).toBeLessThanOrEqual(0.08);
  });
});
