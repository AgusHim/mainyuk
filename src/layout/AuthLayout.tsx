"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getSessionUser } from "@/redux/slices/authSlice";
import Loader from "@/components/Common/Loader";

interface LayoutProps {
  children: ReactNode;
  redirectTo?: string | null;
}

export const RequiredAuthLayout: React.FC<LayoutProps> = ({
  children,
  redirectTo,
}) => {
  const currentPath: string = window.location.pathname;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getSessionUser())
      .unwrap()
      .then((value) => {
        if (value == null) {
          router.replace(`/signin?redirectTo=${redirectTo ?? "/"}`);
        }
        console.log(value);
        console.log(value?.province == null);
        if (value?.province == null) {
          router.replace(`/profile/update`);
        }
        if(currentPath === "/scan"){
          if(value !== null && (value?.role != "ranger" && value?.role != "admin")){
          router.replace(`/signin`);
          }
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error get Session", error);
      });
  }, [dispatch]);

  if (user === null) {
    return <Loader></Loader>;
  }

  return <div>{children}</div>;
};
