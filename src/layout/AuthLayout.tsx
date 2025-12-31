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

export function RequiredAuthLayout(props: LayoutProps) {
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
          router.replace(`/signin?redirectTo=${props.redirectTo}`);
        }

        // Jika user.updated_at kurang dari hari 6 Agustus 2025 redirect ke profile update
        if (value != null && new Date(value.updated_at || "").getTime() < new Date("2025-08-06").getTime()) {
          if (currentPath != "/profile/update") {
            if (props.redirectTo != null && props.redirectTo != undefined) {
              router.replace(`/profile/update?redirectTo=${props.redirectTo}`);
            } else {
              router.replace(`/profile/update`);
            }
          }
        }

        // Jika user tidak memiliki sub_district, redirect ke profile update
        if (value != null && value?.source == null) {
          if (currentPath != "/profile/update") {
            if (query.get("isFromGoogle") == "true") {
              if (props.redirectTo != null && props.redirectTo != undefined) {
                router.replace(
                  `/profile/update?isFromGoogle="true"&redirectTo=${props.redirectTo}`
                );
              } else {
                router.replace(`/profile/update?isFromGoogle="true"`);
              }
            }
            if (props.redirectTo != null && props.redirectTo != undefined) {
              router.replace(`/profile/update?redirectTo=${props.redirectTo}`);
            } else {
              router.replace(`/profile/update`);
            }
          }
        }

        if (currentPath.includes("/scan/presence")) {
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

  return <div>{props.children}</div>;
};

export default RequiredAuthLayout;
