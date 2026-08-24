import React from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { cn } from "../../utils/cn";
import { CloseIcon } from "./icons";
import Button from "./button";

export interface ModalProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  open?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export interface ModalHeaderProps extends ComponentPropsWithoutRef<"div"> {}
export interface ModalBodyProps extends ComponentPropsWithoutRef<"div"> {}
export interface ModalFooterProps extends ComponentPropsWithoutRef<"div"> {}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function ModalHeader({ className, ...props }: ModalHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left", className)}
      {...props}
    />
  );
}

export function ModalTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogTitle>) {
  return (
    <DialogTitle
      className={cn(
        "text-lg sm:text-xl font-bold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ModalDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Description>) {
  return (
    <Description
      className={cn("text-xs sm:text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function ModalBody({ className, ...props }: ModalBodyProps) {
  return <div className={cn("py-2", className)} {...props} />;
}

export function ModalFooter({ className, ...props }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4",
        className,
      )}
      {...props}
    />
  );
}

function ModalRoot({
  isOpen,
  setIsOpen,
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = "lg",
  showCloseButton = true,
}: ModalProps) {
  const isModalOpen = open ?? isOpen ?? false;

  const handleClose = () => {
    if (onClose) onClose();
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop with fade transition */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 ease-out data-closed:opacity-0"
      />

      {/* Centered modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <DialogPanel
          transition
          className={cn(
            "relative w-full space-y-4 border border-border bg-sidebar rounded-xl text-foreground p-6 sm:p-8 shadow-2xl transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0 focus:outline-none",
            sizeClasses[size],
            className,
          )}
        >
          {showCloseButton && (
            <Button
              variant="ghost"
              className="w-fit h-fit p-1 absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-md"
              onClick={handleClose}
            >
              <CloseIcon className="size-4" />
            </Button>
          )}

          {children ? (
            children
          ) : (
            <>
              {(title || description) && (
                <ModalHeader>
                  {title && <ModalTitle>{title}</ModalTitle>}
                  {description && (
                    <ModalDescription>{description}</ModalDescription>
                  )}
                </ModalHeader>
              )}
              <ModalBody>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to proceed with this action?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="default" onClick={handleClose}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
  Panel: DialogPanel,
});

export default Modal;
