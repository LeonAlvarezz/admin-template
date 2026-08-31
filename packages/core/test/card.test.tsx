import { describe, expect, it } from "bun:test";
import React from "react";
import {
  Card,
  CardContent,
  CardBody,
  cardVariants,
} from "../src/components/ui/card";

describe("Card Component", () => {
  it("renders with default variants", () => {
    const element = <Card>Content</Card>;
    expect(element).toBeDefined();
    expect(element.props.children).toBe("Content");
  });

  it("supports convenience props (title, description, action) on Card", () => {
    const actionNode = <button>Action</button>;
    const element = (
      <Card
        title="Revenue Overview"
        description="Monthly recurring revenue breakdown"
        action={actionNode}
      >
        <div>Body content</div>
      </Card>
    );

    expect(element.props.title).toBe("Revenue Overview");
    expect(element.props.description).toBe(
      "Monthly recurring revenue breakdown",
    );
    expect(element.props.action).toBe(actionNode);
  });

  it("supports convenience props on Card.Header", () => {
    const actionNode = <span>Filter</span>;
    const header = (
      <Card.Header
        title="User Settings"
        description="Manage your account preferences"
        action={actionNode}
      />
    );

    expect(header.props.title).toBe("User Settings");
    expect(header.props.description).toBe("Manage your account preferences");
    expect(header.props.action).toBe(actionNode);
  });

  it("supports compound composition with Card.Header, Card.Title, Card.Description, Card.Action, Card.Content, Card.Footer", () => {
    const element = (
      <Card variant="elevated" padding="md">
        <Card.Header>
          <div className="space-y-1">
            <Card.Title as="h2">Custom Title</Card.Title>
            <Card.Description>Custom Subtitle</Card.Description>
          </div>
          <Card.Action>
            <button>Export</button>
          </Card.Action>
        </Card.Header>
        <Card.Content>
          <p>Main content area</p>
        </Card.Content>
        <Card.Footer>
          <button>Save</button>
        </Card.Footer>
      </Card>
    );

    expect(element.props.variant).toBe("elevated");
    expect(element.props.padding).toBe("md");
  });

  it("aliases Card.Body to Card.Content", () => {
    expect(Card.Body).toBe(Card.Content);
    expect(CardBody).toBe(CardContent);
  });

  it("generates correct cva variant class strings", () => {
    const defaultClasses = cardVariants({ variant: "default" });
    expect(defaultClasses).toContain("bg-card");
    expect(defaultClasses).toContain("border-border");

    const outlineClasses = cardVariants({ variant: "outline" });
    expect(outlineClasses).toContain("bg-transparent");

    const elevatedClasses = cardVariants({ variant: "elevated" });
    expect(elevatedClasses).toContain("shadow-md");

    const paddingSm = cardVariants({ padding: "sm" });
    expect(paddingSm).toContain("p-4");
  });
});
