"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { loginUser } from "@/redux/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonLoginGoogle from "../common/Button/ButtonLoginGoogle";

const SignInPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);
  const loadingGoogle = useAppSelector((state) => state.auth.loadingGoogle);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirectTo");

  const handleLoginEvent = async (event: any) => {
    event.preventDefault();

    dispatch(loginUser(formData))
      .unwrap()
      .then((res) => {
        if (res != null) {
          if (redirectTo != null) {
            const route = redirectTo.replace("/register", "");
            router.replace(route);
            return;
          }
          if (res.role == "admin") {
            router.replace("/dashboard");
            return;
          }
          if (res.role == "pj" || res.role == "ranger") {
            router.replace("/dashboard/rangers/card");
            return;
          }
          if (res.role == "jamaah") {
            router.replace("/dashboard/presences");

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
      <div className="flex h-screen items-center justify-center mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="rounded-sm border-2 border-black bg-white shadow-default dark:bg-boxdark shadow-bottom">
          <div className="flex flex-wrap items-center">
            <div className="hidden w-full xl:block xl:w-1/2">
              <div className="py-17.5 px-26 text-center">
                <Link className="mb-5.5 inline-block" href="/">
                  <Image
                    className="hidden dark:block"
                    src={"/images/logo/yn_logo.png"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                  <Image
                    className="dark:hidden"
                    src={"/images/logo/yn_logo.png"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                </Link>
                <p className="text-2xl font-medium 2xl:px-10">
                  Taat bahagia maksiat sengsara
                </p>
              </div>
            </div>

            <div className="w-full border-black xl:w-1/2 xl:border-l-2">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                  Masuk
                </h2>

                <form onSubmit={handleLoginEvent}>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        value={formData["email"]}
                        onChange={handleChange}
                        name="email"
                        type="email"
                        placeholder="Masukan email"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                  <div className="mb-5">
                    {loading ? (
                      <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    ) : (
                      <input
                        type="submit"
                        value="Login"
                        className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2 space-x-2 text-black hover:bg-opacity-90 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1"
                      />
                    )}
                  </div>
                  {loadingGoogle ? (
                    <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                  ) : (
                    <ButtonLoginGoogle />
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;