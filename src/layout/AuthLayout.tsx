"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getSessionUser } from "@/redux/slices/authSlice";
import Loader from "../components/common/Loader/Loader";

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
  const query = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getSessionUser())
      .unwrap()
      .then((value) => {
        if (value == null) {
          router.replace(`/signin?redirectTo=${redirectTo}`);
        }

        if (value != null && value?.sub_district == null) {
          if (currentPath != "/profile/update") {
            if (query.get("isFromGoogle") == "true") {
              if (redirectTo != null && redirectTo != undefined) {
                router.replace(
                  `/profile/update?isFromGoogle="true"&redirectTo=${redirectTo}`
                );
              } else {
                router.replace(`/profile/update?isFromGoogle="true"`);
              }
            }
            if (redirectTo != null && redirectTo != undefined) {
              router.replace(`/profile/update?redirectTo=${redirectTo}`);
            } else {
              router.replace(`/profile/update`);
            }
          }
        }
        
        if (currentPath === "/scan") {
          if (
            value !== null &&
            value?.role != "ranger" &&
            value?.role != "admin"
          ) {
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
