"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dialog as ShadDialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "radix-ui";

type Props = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

/**
 * Dialog tiket QR berbasis shadcn/ui (Radix) dengan API imperatif kompatibel
 * dengan `<dialog>` native (showModal / close / hasAttribute).
 */
const DialogTicketQR = forwardRef<HTMLDialogElement, Props>(
  ({ children, toggleDialog }, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(
      ref,
      () =>
        ({
          showModal: () => setOpen(true),
          close: () => setOpen(false),
          hasAttribute: (attr: string) => (attr === "open" ? open : false),
        }) as unknown as HTMLDialogElement,
    );

    return (
      <ShadDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next && open) toggleDialog();
        }}
      >
        <DialogPortal>
          <DialogOverlay className="bg-yellow-400/80" />
          <DialogPrimitive.Content
            data-slot="dialog-content"
            className="fixed left-1/2 top-1/2 z-50 w-11/12 max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-black bg-yellow-300 p-5 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            <DialogTitle className="sr-only">Tiket</DialogTitle>
            <DialogPrimitive.Close
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/10"
              aria-label="Tutup"
            >
              ✕
            </DialogPrimitive.Close>
            {children}
          </DialogPrimitive.Content>
        </DialogPortal>
      </ShadDialog>
    );
  }
);
export default DialogTicketQR;
