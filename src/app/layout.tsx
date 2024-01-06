"use client";
import { Provider } from "react-redux";
import { makeStore } from "../redux/store";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";


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
            <ToastContainer position="top-center" theme="colored" />
            <main>{children}</main>
            </div>
          </body>
        </html>
    </Provider>
  );
}
