import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Button from "../button";
import { cn } from "../../../libs/cn";
import MoreIcon from "~icons/mingcute/more-4-line";
import type { ReactNode } from "react";

export interface DataTableRowActionItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface DataTableRowActionsProps {
  actions: DataTableRowActionItem[];
  className?: string;
}

export function DataTableRowActions({
  actions,
  className,
}: DataTableRowActionsProps) {
  if (actions.length === 0) return null;

  return (
    <Menu as="div" className={cn("relative flex justify-end", className)}>
      <MenuButton
        as={Button}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <MoreIcon />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="z-50 min-w-36 rounded-md border border-border bg-sidebar p-1 text-popover-foreground shadow-md transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        {actions.map((action, index) => {
          const isDestructive = action.variant === "destructive";

          return (
            <MenuItem key={`${action.label}-${index}`}>
              {({ focus }) => (
                <Button
                  variant="barebone"
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 text-xs text-left cursor-pointer transition-colors",
                    isDestructive
                      ? "text-destructive focus:text-destructive"
                      : "text-foreground",
                    focus &&
                      (isDestructive
                        ? "bg-destructive/10"
                        : "bg-accent text-accent-foreground"),
                  )}
                >
                  {action.icon && action.icon}
                  <span>{action.label}</span>
                </Button>
              )}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
