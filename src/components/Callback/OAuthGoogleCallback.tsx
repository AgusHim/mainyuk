"use client"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAuthGoogleCallback } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../Common/Loader";

export const OAuthGoogleCallback: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.loading);
  const router = useRouter();
  
  useEffect(() => {
    const handleOAuthResponse = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("code") && urlParams.has("state")) {
        try {
          dispatch(getAuthGoogleCallback(urlParams))
        } catch (error) {
          console.error("Error handling OAuth response:", error);
        }
      }else{
        router.replace('/');
      }
    };
    handleOAuthResponse();
  }, [authUser,isLoading]);

  return <Loader></Loader>
};
