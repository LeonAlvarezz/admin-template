import { Input as HeadlessInput } from "@headlessui/react";
import type { InputProps as HeadlessInputProps } from "@headlessui/react";
import type { ReactNode } from "react";
import { cn } from "../../libs/cn";

export interface InputProps extends HeadlessInputProps<"input"> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  containerClassName?: string;
}

function Input({
  className,
  containerClassName,
  startIcon,
  endIcon,
  placeholder = "Type here...",
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-foreground transition-all input-focus",
        containerClassName,
      )}
    >
      {startIcon && (
        <span className="flex items-center text-foreground/50 shrink-0">
          {startIcon}
        </span>
      )}
      <HeadlessInput
        className={cn(
          "w-full bg-transparent text-sm text-foreground placeholder:text-foreground/40 outline-none border-0 p-0 focus:outline-none focus:ring-0",
          className,
        )}
        placeholder={placeholder}
        {...props}
      />
      {endIcon && (
        <span className="flex items-center text-foreground/50 shrink-0">
          {endIcon}
        </span>
      )}
    </div>
  );
}

export default Input;
