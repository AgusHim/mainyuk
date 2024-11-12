"use client"
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="bg-yellow-400">
        <div
          className="max-w-layout bottom-0 z-20 mx-auto grid min-h-screen w-full bg-yellow-300"
          style={{ gridTemplateRows: "max-content 1fr max-content" }}
        >
          {children}
        </div>
      </div>
    </>
  );
};
