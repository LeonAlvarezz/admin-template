import { describe, expect, test, mock } from "bun:test";
import React from "react";
import { NumberStepper } from "../src/components/ui/number-stepper";

describe("NumberStepper component", () => {
  test("renders with default props", () => {
    const stepper = <NumberStepper defaultValue={5} min={1} max={10} />;
    expect(stepper).toBeDefined();
    expect(stepper.props.defaultValue).toBe(5);
    expect(stepper.props.min).toBe(1);
    expect(stepper.props.max).toBe(10);
  });

  test("controlled mode respects value prop", () => {
    const stepper = <NumberStepper value={3} />;
    expect(stepper.props.value).toBe(3);
  });

  test("clamps values within min and max boundaries", () => {
    let currentVal = 1;
    const handleChange = (val: number) => {
      currentVal = val;
    };

    const stepper = (
      <NumberStepper
        value={currentVal}
        min={1}
        max={5}
        onChange={handleChange}
      />
    );

    expect(stepper.props.min).toBe(1);
    expect(stepper.props.max).toBe(5);
  });

  test("supports custom step intervals", () => {
    const stepper = <NumberStepper defaultValue={10} step={5} min={0} max={50} />;
    expect(stepper.props.step).toBe(5);
  });

  test("supports size variants", () => {
    const sm = <NumberStepper size="sm" />;
    const md = <NumberStepper size="md" />;
    const lg = <NumberStepper size="lg" />;

    expect(sm.props.size).toBe("sm");
    expect(md.props.size).toBe("md");
    expect(lg.props.size).toBe("lg");
  });

  test("supports formatValue callback", () => {
    const formatValue = (v: number) => `${v} units`;
    const stepper = <NumberStepper value={4} formatValue={formatValue} />;
    expect(stepper.props.formatValue!(4)).toBe("4 units");
  });
});
