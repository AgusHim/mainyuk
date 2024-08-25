"use client";
import { Provider } from "react-redux";
import { makeStore } from "../redux/store";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={makeStore()}>
      <html lang="en">
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <body suppressHydrationWarning={true}>
          <div className="bg-white dark:bg-boxdark">
            <ToastContainer position="bottom-center" theme="dark" />
            <main>{children}</main>
          </div>
        </body>
      </html>
    </Provider>
  );
}
