import { describe, expect, it } from "bun:test";
import React from "react";
import { Button, buttonVariants } from "../src/components/ui/button";

describe("Button Component", () => {
  it("renders with default variants and children", () => {
    const element = <Button>Click me</Button>;
    expect(element).toBeDefined();
    expect(element.props.children).toBe("Click me");
  });

  it("renders loading spinner and children when loading is true", () => {
    const element = <Button loading={true}>Save changes</Button>;
    expect(element.props.loading).toBe(true);
    expect(element.props.children).toBe("Save changes");
  });

  it("generates correct cva variant class strings including gap-2", () => {
    const defaultClasses = buttonVariants({ variant: "default" });
    expect(defaultClasses).toContain("bg-primary");
    expect(defaultClasses).toContain("text-primary-foreground");
    expect(defaultClasses).toContain("gap-2");

    const destructiveClasses = buttonVariants({ variant: "destructive" });
    expect(destructiveClasses).toContain("bg-destructive");
    expect(destructiveClasses).toContain("text-destructive-foreground");

    const outlineClasses = buttonVariants({ variant: "outline" });
    expect(outlineClasses).toContain("border");

    const ghostClasses = buttonVariants({ variant: "ghost" });
    expect(ghostClasses).toContain("data-hover:bg-muted/30");

    const smClasses = buttonVariants({ size: "sm" });
    expect(smClasses).toContain("px-2.5");
    expect(smClasses).toContain("py-1");
    expect(smClasses).toContain("text-xs");

    const lgClasses = buttonVariants({ size: "lg" });
    expect(lgClasses).toContain("px-4");
    expect(lgClasses).toContain("py-2.5");
    expect(lgClasses).toContain("text-base");
  });
});
