import React from "react";
import type { ReactNode } from "react";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { cn } from "../../utils/cn";
import Button from "./button";
import CloseIcon from "~icons/lucide/x";

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

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
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
              {title && (
                <DialogTitle className="font-bold text-lg text-foreground">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <Description className="text-sm text-muted-foreground">
                  {description}
                </Description>
              )}
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

Modal.Title = DialogTitle;
Modal.Description = Description;
Modal.Panel = DialogPanel;

export default Modal;
