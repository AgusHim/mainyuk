"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Toaster shadcn/ui (berbasis sonner).
 * Menggantikan <ToastContainer> dari react-toastify.
 * Pemakaian imperatif (di luar komponen React, mis. interceptor Axios):
 *   import { toast } from "sonner";
 *   toast.error("message");
 */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      richColors
      closeButton
      style={
        {
          "--normal-bg": "var(--popover, #ffffff)",
          "--normal-text": "var(--popover-foreground, #171717)",
          "--normal-border": "var(--border, #e2e8f0)",
          "--border-radius": "var(--radius-md, 12px)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
