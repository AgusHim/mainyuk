"use client";
import { Provider } from "react-redux";
import { makeStore } from "../redux/store";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={makeStore()}>
        <html lang="en">
          <body suppressHydrationWarning={true}>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
            <main>{children}</main>
            </div>
          </body>
        </html>
    </Provider>
  );
}
