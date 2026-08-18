import { cn } from "../../libs/cn";
import { Button } from "@headlessui/react";
import { cva  } from "class-variance-authority";
import type {VariantProps} from "class-variance-authority";

export type ButtonVariant =
  "default" | "outline" | "ghost" | "secondary" | "barebone";
export type ButtonSize = "sm" | "base" | "md" | "lg" | "xl";

export type ButtonProps = React.ComponentPropsWithRef<typeof Button> &
  VariantProps<typeof buttonVariants>;

export const buttonVariants = cva(
  "rounded-md p-1 text-foreground cursor-pointer data-active:translate-y-px transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground data-hover:opacity-90",
        outline: "border data-hover:border-primary data-hover:text-primary",
        ghost: "data-hover:bg-muted",
        secondary:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        barebone: "bg-transparent text-inherit",
      },
      size: {
        sm: "",
        base: "",
        md: "",
        lg: "",
        xl: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "base",
    },
  },
);

function ComponentName({ variant, className, size, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
export default ComponentName;
