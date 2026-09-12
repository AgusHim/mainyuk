"use client";

import Image from "next/image";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dialog as ShadDialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

/**
 * Dialog QnA berbasis shadcn/ui (Radix) dengan API imperatif kompatibel
 * dengan `<dialog>` native (showModal / close / hasAttribute).
 */
const DialogShowQnA = forwardRef<HTMLDialogElement, Props>(
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
        <DialogContent className="w-11/12 max-w-5xl border-2 border-black bg-boxdark-2 p-10 sm:max-w-5xl">
          <DialogTitle className="sr-only">Tanya Jawab</DialogTitle>
          <div className="flex flex-col items-center">
            <div className="w-full">{children}</div>

            <div className="mt-15 flex flex-row items-center">
              <Image
                width={70}
                height={70}
                src={"/images/logo/yn_logo_w.png"}
                alt="Logo"
              />
              <h1 className="ml-3 text-white font-medium text-3xl">
                YukNgaji Solo
              </h1>
            </div>
          </div>
        </DialogContent>
      </ShadDialog>
    );
  }
);
export default DialogShowQnA;
