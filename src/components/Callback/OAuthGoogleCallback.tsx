"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAuthGoogleCallback } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loader from "../common/Loader/Loader";

export const OAuthGoogleCallback: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    const handleOAuthResponse = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("code") && urlParams.has("state")) {
        dispatch(getAuthGoogleCallback(urlParams))
          .unwrap()
          .then((value) => {
            if (value != null && value.user?.province == null) {
              router.replace(
                `/profile/update?redirectTo=${value.redirectTo}`
              );
            } else if (
              value != null &&
              value.redirectTo != null &&
              value.redirectTo != ""
            ) {
              router.replace(value.redirectTo);
            } else {
              router.replace("/events");
            }
          })
          .catch((_) => {
            router.replace("/signin");
          });
      } else {
        router.replace("/events");
      }
    };
    handleOAuthResponse();
    hasFetched.current = true;
  }, []);

  return <Loader></Loader>;
};
