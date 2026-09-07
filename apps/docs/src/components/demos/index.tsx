import { useState } from "react";
import {
  Button,
  Input,
  InputPassword,
  Select,
  Tag,
  NumberStepper,
  Switch,
  Card,
  Modal,
  ModalTitle,
  ModalDescription,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ConfirmModal,
  Drawer,
  Tooltip,
  Avatar,
  toast,
} from "@z3/admin-core";
import { ComponentPreview } from "../ComponentPreview";
import type { ComponentPreviewProps } from "../ComponentPreview";

// 1. Button Demo
export function ButtonDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="default"
        onClick={() => toast.success("Solid button clicked!")}
      >
        Primary Button
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button
        variant="default"
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1500);
        }}
      >
        {loading ? "Saving..." : "Click to Load"}
      </Button>
    </div>
  );
}

export function ButtonPreview(props: Omit<ComponentPreviewProps, "children">) {
  return (
    <ComponentPreview {...props}>
      <ButtonDemo />
    </ComponentPreview>
  );
}

// 2. Input Demo
export function InputDemo() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input
        placeholder="Enter your email address..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <InputPassword
        placeholder="Enter secret password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        placeholder="Disabled input state..."
        disabled
        value="read-only-system-value"
      />
    </div>
  );
}

// 3. Select Demo
export function SelectDemo() {
  const [selectedFruit, setSelectedFruit] = useState("apple");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "react",
    "typescript",
  ]);

  const fruits = [
    {
      value: "apple",
      label: "🍎 Honeycrisp Apple",
      description: "Fresh fruit",
    },
    { value: "banana", label: "🍌 Cavendish Banana", description: "Organic" },
    { value: "cherry", label: "🍒 Bing Cherry", description: "Sweet" },
    { value: "grape", label: "🍇 Red Globe Grape", disabled: true },
  ];

  const tags = [
    { value: "react", label: "React 19" },
    { value: "typescript", label: "TypeScript" },
    { value: "tailwind", label: "Tailwind CSS v4" },
    { value: "tanstack", label: "TanStack Router" },
  ];

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs font-semibold text-muted-foreground">
          Searchable Combobox
        </label>
        <Select
          searchable
          clearable
          options={fruits}
          value={selectedFruit}
          onChange={(val) => setSelectedFruit(val)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-muted-foreground">
          Multi-Select Tag Chips
        </label>
        <Select
          multiple
          searchable
          options={tags}
          value={selectedTags}
          onChange={(val) => setSelectedTags(val)}
        />
      </div>
    </div>
  );
}

// 4. Modal & ConfirmModal Demo
export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="default" onClick={() => setIsOpen(true)}>
        Open Standard Modal
      </Button>

      <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
        Open Delete Confirm
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Account Preferences</ModalTitle>
          <ModalDescription>
            Manage your notification and workspace settings.
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="space-y-4 text-sm text-foreground">
          <p>
            Adjust your profile information and configure two-factor
            authentication below.
          </p>
          <Input placeholder="Workspace Name" defaultValue="Z3 Engineering" />
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              toast.success("Preferences updated!");
              setIsOpen(false);
            }}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Delete Customer Account"
        description="Are you sure you want to permanently delete this user? This action cannot be undone."
        variant="destructive"
        confirmText="Yes, Delete Account"
        onConfirm={() => {
          toast.info("Account deleted successfully.");
          setIsConfirmOpen(false);
        }}
      />
    </div>
  );
}

// 5. Drawer Demo
export function DrawerDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Open Side Drawer
      </Button>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Quick Product Inspector"
      >
        <div className="p-6 space-y-4 text-sm">
          <div className="rounded-lg border border-border bg-accent/20 p-4">
            <h4 className="font-semibold text-foreground">
              Pro Studio Display
            </h4>
            <p className="text-xs text-muted-foreground">SKU: DISP-2026-X</p>
            <p className="mt-2 text-lg font-bold text-primary">$1,299.00</p>
          </div>
          <Button
            variant="default"
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            Close Inspector
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

// 6. Tag / Badge Demo
export function TagDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tag color="blue" dot>
        Active
      </Tag>
      <Tag color="emerald" dot>
        Published
      </Tag>
      <Tag color="amber" dot>
        Pending
      </Tag>
      <Tag color="rose" dot>
        Archived
      </Tag>
      <Tag color="violet">Pro Tier</Tag>
      <Tag color="zinc">Draft</Tag>
    </div>
  );
}

// 7. NumberStepper Demo
export function NumberStepperDemo() {
  const [qty, setQty] = useState(3);

  return (
    <div className="flex flex-col items-center gap-2">
      <NumberStepper
        value={qty}
        min={1}
        max={20}
        onChange={(val) => setQty(val)}
        size="md"
      />
      <span className="text-xs text-muted-foreground">
        Selected: {qty} items
      </span>
    </div>
  );
}

// 8. Switch Demo
export function SwitchDemo() {
  const [enabled, setEnabled] = useState(true);
  const [darkToggle, setDarkToggle] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <Switch checked={enabled} onChange={setEnabled} size="md" />
        <span>Enable Two-Factor Authentication</span>
      </label>
      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <Switch checked={darkToggle} onChange={setDarkToggle} size="sm" />
        <span>Dark Mode Override</span>
      </label>
    </div>
  );
}

// 9. Card Demo
export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <Card.Header
        title="Monthly Revenue"
        description="Compared to previous 30 days"
        action={<Tag color="emerald">+18.4%</Tag>}
      />
      <Card.Content>
        <div className="text-3xl font-extrabold text-foreground">
          $48,250.00
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          1,420 total orders processed
        </p>
      </Card.Content>
      <Card.Footer className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button variant="default" size="sm">
          View Report
        </Button>
      </Card.Footer>
    </Card>
  );
}

// 10. Tooltip Demo
export function TooltipDemo() {
  return (
    <div className="flex items-center gap-4">
      <Tooltip content="This is an accessible floating tooltip">
        <Button variant="outline">Hover over me</Button>
      </Tooltip>
      <Tooltip content="Copied to clipboard on click!">
        <Button variant="secondary">Action Tooltip</Button>
      </Tooltip>
    </div>
  );
}

// 11. Toaster Demo
export function ToasterDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="default"
        onClick={() => toast.success("Customer record updated successfully!")}
      >
        Success Toast
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast.error("Failed to delete record: Permission denied.")
        }
      >
        Error Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.promise(new Promise((r) => setTimeout(r, 2000)), {
            loading: "Syncing inventory...",
            success: "Inventory synchronized!",
            error: "Sync failed",
          })
        }
      >
        Promise Toast
      </Button>
    </div>
  );
}

// 12. Avatar Demo
export function AvatarDemo() {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
        className="size-10"
      />
      <Avatar className="size-8" />
      <Avatar className="size-6" />
    </div>
  );
}
