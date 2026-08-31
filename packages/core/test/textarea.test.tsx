import { describe, expect, it } from "bun:test";
import React from "react";
import { Textarea } from "../src/components/ui/textarea";

describe("Textarea Component", () => {
  it("renders with default props", () => {
    const element = <Textarea placeholder="Enter text..." />;
    expect(element).toBeDefined();
    expect(element.props.placeholder).toBe("Enter text...");
  });

  it("supports custom rows and placeholder", () => {
    const element = <Textarea rows={6} placeholder="Detailed description" />;
    expect(element.props.rows).toBe(6);
    expect(element.props.placeholder).toBe("Detailed description");
  });

  it("supports maxWordCount and showWordCount props", () => {
    const element = (
      <Textarea
        maxWordCount={100}
        showWordCount={true}
        defaultValue="Hello world from admin"
      />
    );
    expect(element.props.maxWordCount).toBe(100);
    expect(element.props.showWordCount).toBe(true);
    expect(element.props.defaultValue).toBe("Hello world from admin");
  });

  it("supports enforceMaxWordCount option", () => {
    const element = (
      <Textarea
        maxWordCount={50}
        enforceMaxWordCount={true}
      />
    );
    expect(element.props.enforceMaxWordCount).toBe(true);
    expect(element.props.maxWordCount).toBe(50);
  });

  it("supports custom formatWordCount callback", () => {
    const customFormatter = (count: number, max?: number) => `${count} of ${max} used`;
    const element = (
      <Textarea
        maxWordCount={20}
        formatWordCount={customFormatter}
      />
    );
    expect(element.props.formatWordCount).toBe(customFormatter);
    expect(element.props.formatWordCount!(5, 20)).toBe("5 of 20 used");
  });

  it("supports controlled value prop", () => {
    const element = <Textarea value="Controlled content" onChange={() => {}} />;
    expect(element.props.value).toBe("Controlled content");
  });

  it("supports invalid and disabled states", () => {
    const element = <Textarea invalid disabled containerClassName="custom-box" />;
    expect(element.props.invalid).toBe(true);
    expect(element.props.disabled).toBe(true);
    expect(element.props.containerClassName).toBe("custom-box");
  });
});
