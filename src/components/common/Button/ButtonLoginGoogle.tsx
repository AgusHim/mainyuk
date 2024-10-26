"use client";

import React from "react";
import { loginGoogle } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { toast } from "react-toastify";

const ButtonLoginGoogle: React.FC = () => {
  const dispatch = useAppDispatch();

  const login = async (event: any) => {
    if (isWebView()) {
      toast.info("Maaf, hanya bisa dibrowser external");
      return;
    }
    event.preventDefault();
    const searchParams = new URLSearchParams(window.location.search);
    const redirectTo = searchParams.get("redirectTo");
    dispatch(loginGoogle(redirectTo ?? "/events"))
      .unwrap()
      .then((res) => {
        if (res != null) {
          window.location.href = res;
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <button
      className="mb-5 flex items-center justify-center w-full px-4 py-3 space-x-2 text-black rounded-lg bg-white hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-black shadow-custom"
      onClick={login}
    >
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.05 0 5.58 1.05 7.63 2.83l5.64-5.63C33.94 3.25 29.38 1 24 1 14.86 1 7.22 6.86 4.1 14.95l6.89 5.35C12.96 13.66 18.06 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.5 24.5c0-1.67-.15-3.29-.43-4.84H24v9.16h12.75c-.55 2.78-2.1 5.12-4.25 6.7l6.87 5.33c3.95-3.64 6.23-9 6.23-16.35z"
        />
        <path
          fill="#FBBC05"
          d="M10.98 28.74l-6.88 5.35C6.23 39.74 10.63 44 16.5 46.5l5.33-6.87C17.83 38.98 14.5 36.2 13.07 32.6l-2.09-3.86z"
        />
        <path
          fill="#4285F4"
          d="M24 46.5c5.5 0 10.1-1.83 13.47-4.93l-6.87-5.33C28.42 38.32 26.35 39 24 39c-4.91 0-9.07-3.29-10.55-7.92L7.1 36.5c3.12 8.09 10.77 14.04 16.9 14.04z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
      <span>Login dengan Google</span>
    </button>
  );
};

export default ButtonLoginGoogle;

const isWebView = () => {
  const userAgent = window.navigator.userAgent || "";

  // Detect iOS WebView
  const isIOSWebView = /iPhone|iPod|iPad.*AppleWebKit(?!.*Safari)/i.test(
    userAgent
  );

  // Detect Android WebView
  const isAndroidWebView =
    /Android.*Version\/[\d.]+.*(wv|SamsungBrowser)/i.test(userAgent);

  return isAndroidWebView;
};
