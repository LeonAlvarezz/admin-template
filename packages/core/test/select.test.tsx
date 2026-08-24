import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Select } from "../src/components/ui/select";
import type { SelectOption } from "../src/components/ui/select";

describe("Select component", () => {
  const options: SelectOption<string>[] = [
    { value: "apple", label: "Apple", description: "Fresh fruit" },
    { value: "banana", label: "Banana", description: "Tropical fruit" },
    { value: "cherry", label: "Cherry", disabled: true },
  ];

  test("renders with placeholder when no value is selected", () => {
    const html = renderToStaticMarkup(
      <Select options={options} placeholder="Choose fruit..." />,
    );

    expect(html).toContain("Choose fruit...");
    expect(html).toContain("border-border");
  });

  test("renders selected single value label correctly", () => {
    const html = renderToStaticMarkup(
      <Select options={options} value="banana" />,
    );

    expect(html).toContain("Banana");
    expect(html).not.toContain("Choose fruit...");
  });

  test("renders searchable combobox input when searchable={true}", () => {
    const html = renderToStaticMarkup(
      <Select
        options={options}
        value="apple"
        searchable
        placeholder="Search fruits..."
      />,
    );

    // In searchable mode, ComboboxInput is rendered
    expect(html).toContain("<input");
    expect(html).toContain('placeholder="Search fruits..."');
  });

  test("renders leading startIcon when provided", () => {
    const html = renderToStaticMarkup(
      <Select
        options={options}
        startIcon={<span data-testid="custom-icon">🍎</span>}
      />,
    );

    expect(html).toContain("🍎");
  });

  test("renders clear button when clearable and value exists", () => {
    const html = renderToStaticMarkup(
      <Select options={options} value="apple" clearable />,
    );

    expect(html).toContain('aria-label="Clear selection"');
  });

  test("does not render clear button when clearable but no value exists", () => {
    const html = renderToStaticMarkup(
      <Select options={options} value={null} clearable />,
    );

    expect(html).not.toContain('aria-label="Clear selection"');
  });

  test("renders multi-select tags when multiple={true}", () => {
    const html = renderToStaticMarkup(
      <Select options={options} value={["apple", "banana"]} multiple />,
    );

    expect(html).toContain("Apple");
    expect(html).toContain("Banana");
    expect(html).toContain("bg-accent");
  });

  test("applies invalid error styles when invalid={true}", () => {
    const html = renderToStaticMarkup(<Select options={options} invalid />);

    expect(html).toContain("border-destructive");
  });

  test("applies size variant classes correctly", () => {
    const htmlSm = renderToStaticMarkup(
      <Select options={options} sizeVariant="sm" />,
    );
    const htmlLg = renderToStaticMarkup(
      <Select options={options} sizeVariant="lg" />,
    );

    expect(htmlSm).toContain("min-h-8");
    expect(htmlSm).toContain("text-xs");

    expect(htmlLg).toContain("min-h-10");
    expect(htmlLg).toContain("text-base");
  });

  test("renders custom renderValue when supplied", () => {
    const html = renderToStaticMarkup(
      <Select
        options={options}
        value="apple"
        renderValue={(_, selected) => (
          <span className="font-bold text-primary">
            Fruit: {(selected as SelectOption)?.label}
          </span>
        )}
      />,
    );

    expect(html).toContain("Fruit: Apple");
  });

  test("supports primitive string array options", () => {
    const stringOptions = ["Red", "Green", "Blue"];
    const html = renderToStaticMarkup(
      <Select options={stringOptions} value="Green" />,
    );

    expect(html).toContain("Green");
  });

  test("applies disabled state styling", () => {
    const html = renderToStaticMarkup(
      <Select options={options} disabled placeholder="Disabled select" />,
    );

    expect(html).toContain("opacity-50");
    expect(html).toContain("cursor-not-allowed");
  });

  test("supports compound subcomponents Select.Option, Select.Group, Select.Label", () => {
    const html = renderToStaticMarkup(
      <Select placeholder="Compound select">
        <Select.Group>
          <Select.Label>Fruit Category</Select.Label>
          <Select.Option value="apple">Apple Item</Select.Option>
          <Select.Option value="banana">Banana Item</Select.Option>
        </Select.Group>
        <Select.Separator />
      </Select>,
    );

    expect(html).toContain("Compound select");
    expect(html).toContain("headlessui-combobox-button");
  });

  test("renders grouped option values when selected", () => {
    const groupedOptions = [
      {
        group: "Citrus",
        options: [
          { value: "lemon", label: "Lemon" },
          { value: "lime", label: "Lime" },
        ],
      },
      {
        group: "Berries",
        options: [
          { value: "strawberry", label: "Strawberry" },
          { value: "blueberry", label: "Blueberry" },
        ],
      },
    ];

    const html = renderToStaticMarkup(
      <Select options={groupedOptions} value="lime" />,
    );

    expect(html).toContain("Lime");
  });
});
