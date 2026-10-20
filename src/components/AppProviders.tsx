"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { makeStore } from "@/redux/store";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID ?? ""}>
      <Provider store={makeStore()}>
        {children}
        <Toaster />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      </Provider>
    </GoogleOAuthProvider>
  );
}
