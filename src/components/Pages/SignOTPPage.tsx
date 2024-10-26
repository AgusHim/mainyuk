"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { useEffect, useRef, useState } from "react";
import {
  loginUser,
  postRequestOTP,
  postVerifyOTP,
  setEmail,
} from "@/redux/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { VerifyOTP } from "@/types/user";
import ButtonLoginGoogle from "../common/Button/ButtonLoginGoogle";
import { toast } from "react-toastify";

export default function SignOTPPage() {
  const router = useRouter();
  const query = useSearchParams();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);
  const loadingGoogle = useAppSelector((state) => state.auth.loadingGoogle);
  const loading = useAppSelector((state) => state.auth.loading);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  }); // Default to rear camera

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeEmail = async (event: any) => {
    event.preventDefault();
    dispatch(setEmail(null));
  };

  const handleRequestOTP = async (event: any) => {
    event.preventDefault();
    if (isValidEmail(formData.email) == false) {
      toast.info("Mohon masukan email yang valid");
      return;
    }
    var data = {
      email: formData.email,
    } as VerifyOTP;
    dispatch(postRequestOTP(data))
      .unwrap()
      .then((res: any) => {
        if (res != null) {
          if (res.success != null && res.success == true) {
            dispatch(setEmail(formData.email));
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleLoginOTP = async (event: any) => {
    event.preventDefault();
    var data = {
      email: formData.email,
      code: formData.otp,
    } as VerifyOTP;
    dispatch(postVerifyOTP(data))
      .unwrap()
      .then((res) => {
        if (res != null) {
          var redirectTo = query.get("redirectTo");
          if (redirectTo != null && redirectTo != undefined) {
            router.replace(redirectTo!);
            return;
          } else {
            router.replace("/events");
            return;
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <>
      <MainLayout>
        <CommonHeader
          title="YukNgaji Solo"
          isShowBack={false}
          isShowTrailing={false}
        />
        <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
          {email == null ? (
            <div>
              <h1 className="text-black text-2xl font-bold">Login Akun</h1>
              <div className="mb-2">
                <label className="mt-5 mb-2.5 block font-bold text-black text-lg">
                  Email
                </label>
                <div className="relative">
                  <input
                    value={formData["email"]}
                    onChange={handleChange}
                    name="email"
                    type="email"
                    placeholder="Masukan email kamu"
                    className="w-full rounded-lg border text-black border-black bg-yellow-200 py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary placeholder:text-black"
                    required
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
              {loading ? (
                <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              ) : (
                <button
                  onClick={handleRequestOTP}
                  className="w-full mt-5 btn bg-primary text-white hover:shadow-none hover:bg-primary transition-all hover:translate-x-1 hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-black shadow-custom"
                >
                  LANJUTKAN
                </button>
              )}

              {isWebView() ? (
                <></>
              ) : (
                <div>
                  <div className="divider divider-warning text-black my-5">
                    ATAU
                  </div>
                  {loadingGoogle ? (
                    <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                  ) : (
                    <ButtonLoginGoogle />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1 className="text-black text-2xl font-bold">Masukan OTP</h1>
              <p className="mt-2 text-black text-lg">
                Kode OTP yang sudah dikirim ke email kamu{" "}
                <span className="font-bold">{email}</span>
              </p>
              <div className="mb-4">
                <label className="mt-5 mb-2.5 block font-bold text-black text-lg">
                  OTP
                </label>
                <div className="relative">
                  <input
                    value={formData["otp"]}
                    onChange={handleChange}
                    name="otp"
                    type="text"
                    placeholder="Masukan kode OTP "
                    className="w-full rounded-lg border text-black border-black bg-yellow-200 py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary placeholder:text-black"
                    required
                  />
                </div>
              </div>
              {loading ? (
                <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              ) : (
                <button
                  onClick={handleLoginOTP}
                  className="w-full mt-5 btn bg-primary text-white hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-black shadow-custom"
                >
                  LOGIN
                </button>
              )}

              <div
                className="flex flex-row w-full justify-center items-center mt-4 text-black text-sm"
                onClick={handleChangeEmail}
              >
                <span className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-3 cursor-pointer"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                Ganti Email
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
}

const isWebView = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();

  // Detect common blocked user agents for Google OAuth
  // Webviews and certain browsers that Google blocks
  const blockedAgents = [
    /fbav/i,         // Facebook app
    /instagram/i,    // Instagram in-app browser
    /line/i,         // LINE app browser
    /snapchat/i,     // Snapchat in-app browser
    /telegram/i,     // Telegram in-app browser
    /whatsapp/i,     // WhatsApp in-app browser
  ];

  return blockedAgents.some(agent => agent.test(userAgent));
};
