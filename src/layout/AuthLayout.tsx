"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/hooks";
import { getSessionUser } from "@/redux/slices/authSlice";

interface LayoutProps {
  children: ReactNode;
  redirectTo?:string|null;
}

export const RequiredAuthLayout: React.FC<LayoutProps> = ({ children, redirectTo }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getSessionUser())
      .unwrap()
      .then((value) => {
        if (value == null) {
          router.replace(`/signin?redirectTo=${redirectTo ?? "/"}`);
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error fetching data:", error);
      });
  }, [dispatch]);

  return (<div>{ children }</div>);
};
