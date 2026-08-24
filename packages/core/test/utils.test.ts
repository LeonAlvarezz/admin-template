import { describe, expect, it } from "bun:test";
import {
  cn,
  formatCurrency,
  formatNumber,
  formatDate,
  formatRelativeTime,
  formatFileSize,
  slugify,
  capitalize,
  truncate,
} from "../src/utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("merges class names and handles tailwind conflicts", () => {
      expect(cn("px-2 py-1", "bg-red-500", { "text-white": true, "opacity-50": false })).toBe(
        "px-2 py-1 bg-red-500 text-white",
      );
      expect(cn("px-2", "px-4")).toBe("px-4");
    });
  });

  describe("formatCurrency", () => {
    it("formats currency correctly", () => {
      const formatted = formatCurrency(129.99, { currency: "USD", locale: "en-US" });
      expect(formatted).toBe("$129.99");
    });
  });

  describe("formatNumber", () => {
    it("formats standard numbers with commas", () => {
      expect(formatNumber(12500, { locale: "en-US" })).toBe("12,500");
    });

    it("formats compact numbers", () => {
      const formatted = formatNumber(1500, { notation: "compact", locale: "en-US" });
      expect(formatted).toBe("1.5K");
    });
  });

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2026-08-24T10:00:00Z");
      const formatted = formatDate(date, { year: "numeric", month: "short", day: "numeric" }, "en-US");
      expect(formatted).toContain("2026");
      expect(formatted).toContain("Aug");
    });

    it("handles invalid date gracefully", () => {
      expect(formatDate("not-a-date")).toBe("Invalid Date");
    });
  });

  describe("formatRelativeTime", () => {
    it("formats relative past time correctly", () => {
      const base = new Date("2026-08-24T12:00:00Z");
      const past = new Date("2026-08-24T11:55:00Z");
      const formatted = formatRelativeTime(past, base, "en-US");
      expect(formatted).toBe("5 minutes ago");
    });

    it("formats relative future time correctly", () => {
      const base = new Date("2026-08-24T12:00:00Z");
      const future = new Date("2026-08-26T12:00:00Z");
      const formatted = formatRelativeTime(future, base, "en-US");
      expect(formatted).toBe("in 2 days");
    });
  });

  describe("formatFileSize", () => {
    it("formats file sizes correctly", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1048576)).toBe("1 MB");
      expect(formatFileSize(1572864, 1)).toBe("1.5 MB");
    });
  });

  describe("string helpers", () => {
    it("slugifies text", () => {
      expect(slugify("Hello World & Peace")).toBe("hello-world-and-peace");
      expect(slugify("  Multiple   Spaces  -- and dashes  ")).toBe("multiple-spaces-and-dashes");
    });

    it("capitalizes text", () => {
      expect(capitalize("active")).toBe("Active");
      expect(capitalize("")).toBe("");
    });

    it("truncates text", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
      expect(truncate("Short", 10)).toBe("Short");
    });
  });
});
