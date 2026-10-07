"use client";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[var(--yn-background)] text-[var(--yn-foreground)]">
      {children}
    </div>
  );
};
