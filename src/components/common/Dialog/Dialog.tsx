"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dialog as ShadDialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
  toggleDialog: () => void;
  /** Judul untuk aksesibilitas (ditampilkan sr-only). */
  title?: string;
  /** Override style DialogContent (mis. warna/lebar khusus). */
  contentClassName?: string;
};

/**
 * Dialog berbasis shadcn/ui (Radix) dengan API imperatif yang kompatibel
 * dengan `<dialog>` native yang sebelumnya memakai kelas DaisyUI:
 *   dialogRef.current?.showModal()
 *   dialogRef.current?.close()
 *   dialogRef.current?.hasAttribute("open")
 */
const Dialog = forwardRef<HTMLDialogElement, Props>(
  ({ children, toggleDialog, title = "Dialog", contentClassName }, ref) => {
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
        <DialogContent
          className={
            contentClassName ??
            "border-2 border-black bg-white p-6 shadow-[8px_8px_0_0_#000000] dark:border-strokedark dark:bg-boxdark-2 sm:max-w-lg"
          }
          style={{ boxShadow: "8px 8px 0px #000000" }}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {children}
        </DialogContent>
      </ShadDialog>
    );
  }
);

export default Dialog;
