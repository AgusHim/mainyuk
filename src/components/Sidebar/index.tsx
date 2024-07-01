import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Image from "next/image";
import { useAppSelector } from "@/hooks/hooks";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname() ?? "/";

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const user = useAppSelector((state) => state.auth.user);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#F3F3F3] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/dashboard">
          <Image
            className="ml-4"
            width={80}
            height={80}
            src={"/images/logo/yn_logo.png"}
            alt="Logo"
          />
        </Link>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold">MENU</h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              {user?.role == "admin" ? (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/" || pathname.includes("dashboard")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <Link
                          href="/dashboard"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                              fill=""
                            />
                            <path
                              d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                              fill=""
                            />
                            <path
                              d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                              fill=""
                            />
                            <path
                              d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                              fill=""
                            />
                          </svg>
                          Dashboard
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && "rotate-180"
                            }`}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </Link>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <Link
                                href="/dashboard"
                                className={`group relative flex items-center gap-2.5 rounded-md my-2 py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4 ${
                                  pathname === "/dashboard" &&
                                  "border-2 border-black shadow-bottom rounded-xl bg-white dark:bg-meta-4"
                                } `}
                              >
                                Kajian Pekanan
                              </Link>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              ) : (
                <div></div>
              )}

              {/* <!-- Menu Item Dashboard --> */}
              {/* <!-- Menu Item Agenda --> */}
              {user?.role == "admin" || user?.role == "pj" ? (
                <li>
                  <Link
                    href="/dashboard/agenda"
                    className={`group relative flex items-center gap-2.5 rounded-sm my-2 py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4 ${
                      pathname.includes("/dashboard/agenda") &&
                      "border-2 border-black shadow-bottom rounded-xl bg-white dark:bg-meta-4"
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="chapter-add">
                        <g>
                          <path d="M5,24H3v-3H0v-2h3v-3h2v3h3v2H5V24z M19,21h-9v-2h7V6H5v8H3V4h4V0h16v17h-4V21z M19,15h2V2H9v2h10V15z" />
                        </g>
                      </g>
                    </svg>
                    Agenda
                  </Link>
                </li>
              ) : (
                <div></div>
              )}
              {/* <!-- Menu Item Agenda --> */}

              {/* <!-- Menu Item Ranger Card --> */}
              {user?.role == "ranger" || user?.role == "pj" ? (
                <li>
                  <Link
                    href="/dashboard/rangers/card"
                    className={`group relative flex items-center gap-2.5 rounded-sm my-2 py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4 ${
                      pathname.includes("/rangers/card") &&
                      "border-2 border-black shadow-bottom rounded-xl bg-white dark:bg-meta-4"
                    }`}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 -0.5 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.5 7V17C3.5 18.1046 4.39543 19 5.5 19H19.5C20.6046 19 21.5 18.1046 21.5 17V7C21.5 5.89543 20.6046 5 19.5 5H5.5C4.39543 5 3.5 5.89543 3.5 7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.5 10H18.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M15.5 13H18.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.5 10C11.5 11.1046 10.6046 12 9.5 12C8.39543 12 7.5 11.1046 7.5 10C7.5 8.89543 8.39543 8 9.5 8C10.0304 8 10.5391 8.21071 10.9142 8.58579C11.2893 8.96086 11.5 9.46957 11.5 10Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.5 16C8.283 12.863 11.552 13.849 13.5 16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Kartu Ranger
                  </Link>
                </li>
              ) : (
                <div></div>
              )}
              {/* <!-- Menu Item Ranger Card --> */}

              {/* <!-- Menu Item Contributions --> */}
              {user?.role == "ranger" || user?.role == "pj" ? (
                <li>
                  <Link
                    href="/dashboard/contributions"
                    className={`group relative flex items-center gap-2.5 rounded-sm my-2 py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4 ${
                      pathname.includes("/dashboard/contributions") &&
                      "border-2 border-black shadow-bottom rounded-xl bg-white dark:bg-meta-4"
                    }`}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 8V12L14.5 14.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.60423 5.60423L5.0739 5.0739V5.0739L5.60423 5.60423ZM4.33785 6.87061L3.58786 6.87438C3.58992 7.28564 3.92281 7.61853 4.33408 7.6206L4.33785 6.87061ZM6.87963 7.63339C7.29384 7.63547 7.63131 7.30138 7.63339 6.88717C7.63547 6.47296 7.30138 6.13549 6.88717 6.13341L6.87963 7.63339ZM5.07505 4.32129C5.07296 3.90708 4.7355 3.57298 4.32129 3.57506C3.90708 3.57715 3.57298 3.91462 3.57507 4.32882L5.07505 4.32129ZM3.75 12C3.75 11.5858 3.41421 11.25 3 11.25C2.58579 11.25 2.25 11.5858 2.25 12H3.75ZM16.8755 20.4452C17.2341 20.2378 17.3566 19.779 17.1492 19.4204C16.9418 19.0619 16.483 18.9393 16.1245 19.1468L16.8755 20.4452ZM19.1468 16.1245C18.9393 16.483 19.0619 16.9418 19.4204 17.1492C19.779 17.3566 20.2378 17.2341 20.4452 16.8755L19.1468 16.1245ZM5.14033 5.07126C4.84598 5.36269 4.84361 5.83756 5.13505 6.13191C5.42648 6.42626 5.90134 6.42862 6.19569 6.13719L5.14033 5.07126ZM18.8623 5.13786C15.0421 1.31766 8.86882 1.27898 5.0739 5.0739L6.13456 6.13456C9.33366 2.93545 14.5572 2.95404 17.8017 6.19852L18.8623 5.13786ZM5.0739 5.0739L3.80752 6.34028L4.86818 7.40094L6.13456 6.13456L5.0739 5.0739ZM4.33408 7.6206L6.87963 7.63339L6.88717 6.13341L4.34162 6.12062L4.33408 7.6206ZM5.08784 6.86684L5.07505 4.32129L3.57507 4.32882L3.58786 6.87438L5.08784 6.86684ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM16.1245 19.1468C14.9118 19.8483 13.5039 20.25 12 20.25V21.75C13.7747 21.75 15.4407 21.2752 16.8755 20.4452L16.1245 19.1468ZM20.25 12C20.25 13.5039 19.8483 14.9118 19.1468 16.1245L20.4452 16.8755C21.2752 15.4407 21.75 13.7747 21.75 12H20.25ZM6.19569 6.13719C7.68707 4.66059 9.73646 3.75 12 3.75V2.25C9.32542 2.25 6.90113 3.32791 5.14033 5.07126L6.19569 6.13719Z"
                        fill="currentColor"
                      />
                    </svg>
                    Riwayat Kontribusi
                  </Link>
                </li>
              ) : (
                <div></div>
              )}
              {/* <!-- Menu Item Contributions --> */}

              {/* <!-- Menu Item Rangers --> */}
              {user?.role == "admin" || user?.role == "pj" ? (
                <li>
                  <Link
                    href="/dashboard/rangers"
                    className={`group relative flex items-center gap-2.5 rounded-sm my-2 py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4 ${
                      pathname == "/dashboard/rangers" &&
                      "border-2 border-black shadow-bottom rounded-xl bg-white dark:bg-meta-4"
                    }`}
                  >
                    <svg
                      className="fill-current"
                      fill="none"
                      width="24"
                      height="24"
                      viewBox="0 -0.3 47.6 47.6"
                      id="Layer_2"
                      data-name="Layer 2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M45.55,8.31a3.32,3.32,0,1,1,4.22,3.2v8.55H48V11.51A3.36,3.36,0,0,1,45.55,8.31Z"
                        transform="translate(-4.57 -5)"
                      />
                      <path
                        d="M35.31,7.47v8.68C41,18.62,45,23.86,45,30c0,8.43-7.6,13.25-16.88,13.25S11.2,38.38,11.2,30c0-6.09,4-11.33,9.64-13.8V7.47c-7.77,3-12,11-12,20.31,0,12,8.62,18.8,19.28,18.8s19.29-6.81,19.29-18.8C47.36,18.44,43.08,10.48,35.31,7.47Z"
                        transform="translate(-4.57 -5)"
                      />
                      <path
                        d="M34.1,15.67V7.05a21.51,21.51,0,0,0-6-.91,19.52,19.52,0,0,0-6,.91v8.62a18.14,18.14,0,0,1,12.05,0Z"
                        transform="translate(-4.57 -5)"
                      />
                      <path
                        d="M24.4,17.83a14.36,14.36,0,0,0-8.92,6.93.6.6,0,0,0,.36.85l2.65.84a.66.66,0,0,0,.73-.3,9.9,9.9,0,0,1,6.2-4.94.66.66,0,0,0,.43-.72l-.67-2.23A.59.59,0,0,0,24.4,17.83Z"
                        transform="translate(-4.57 -5)"
                      />
                      <path
                        d="M4.57,30.31v1.2a3,3,0,0,0,3,3h1a19.61,19.61,0,0,1-.84-4.22Z"
                        transform="translate(-4.57 -5)"
                      />
                      <path
                        d="M7.59,27.78a28.48,28.48,0,0,1,.72-6.51H7.59a3,3,0,0,0-3,3V29.1h3Z"
                        transform="translate(-4.57 -5)"
                      />
                      <path
                        d="M47.6,34.53h1a3,3,0,0,0,3-3v-1.2H48.44A19.61,19.61,0,0,1,47.6,34.53Z"
                        transform="translate(-4.57 -5)"
                      />
                      <path
                        d="M48.56,21.27h-.72a28.48,28.48,0,0,1,.72,6.51,10.17,10.17,0,0,1-.06,1.32h3V24.28A2.89,2.89,0,0,0,48.56,21.27Z"
                        transform="translate(-4.57 -5)"
                      />
                      <path
                        d="M42.42,43.44a21.89,21.89,0,0,1-14.35,4.94,21.89,21.89,0,0,1-14.34-4.94l-.84.85a.57.57,0,0,0-.06.78c3.56,4.52,9,6.93,15.24,6.93s11.69-2.41,15.25-6.93a.56.56,0,0,0-.06-.78Z"
                        transform="translate(-4.57 -5)"
                      />
                    </svg>
                    Rangers
                  </Link>
                </li>
              ) : (
                <div></div>
              )}
              {/* <!-- Menu Item Rangers --> */}

              {/* <!-- Menu Item Event --> */}
              {user?.role == "admin" ? (
                <li>
                  <Link
                    href="/dashboard/events"
                    className={`group relative flex items-center gap-2.5 rounded-sm my-2 py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4 ${
                      pathname.includes("/dashboard/events") &&
                      "border-2 border-black shadow-bottom rounded-xl bg-white dark:bg-meta-4"
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_130_9756)">
                        <path
                          d="M5.5713 14.5L9.46583 18.4141M18.9996 3.60975C17.4044 3.59505 16.6658 4.33233 16.4236 5.07743C16.2103 5.73354 16.4052 7.07735 15.896 8.0727C15.4091 9.02443 14.1204 9.5617 12.6571 9.60697M20 7.6104L20.01 7.61049M19 15.96L19.01 15.9601M7.00001 3.94926L7.01001 3.94936M19 11.1094C17.5 11.1094 16.5 11.6094 15.5949 12.5447M10.2377 7.18796C11 6.10991 11.5 5.10991 11.0082 3.52734M3.53577 20.4645L7.0713 9.85791L14.1424 16.929L3.53577 20.4645Z"
                          fill=""
                          stroke="#64748B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_130_9756">
                          <rect
                            width="18"
                            height="18"
                            fill="white"
                            transform="translate(0 0.052124)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    Event
                  </Link>
                </li>
              ) : (
                <div></div>
              )}
              {/* <!-- Menu Item Event --> */}

              {/* <!-- Menu Item Divisi --> */}
              {user?.role == "admin" ? (
                <li>
                  <Link
                    href="/dashboard/divisi"
                    className={`group relative flex items-center gap-2.5 rounded-sm my-2 py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4 ${
                      pathname.includes("/dashboard/divisi") &&
                      "border-2 border-black shadow-bottom rounded-xl bg-white dark:bg-meta-4"
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="chapter-add">
                        <g>
                          <path d="M5,24H3v-3H0v-2h3v-3h2v3h3v2H5V24z M19,21h-9v-2h7V6H5v8H3V4h4V0h16v17h-4V21z M19,15h2V2H9v2h10V15z" />
                        </g>
                      </g>
                    </svg>
                    Divisi
                  </Link>
                </li>
              ) : (
                <div></div>
              )}
              {/* <!-- Menu Item Divisi --> */}

              {/* <!-- Menu Feedback--> */}
              {user?.role == "admin" ? (
                <li>
                  <Link
                    href="/dashboard/feedback"
                    className={`group relative flex items-center gap-2.5 rounded-sm my-2 py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4 ${
                      pathname.includes("/dashboard/feedback") &&
                      "border-2 border-black shadow-bottom rounded-xl bg-white dark:bg-meta-4"
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 1C17.6569 1 19 2.34315 19 4C19 4.55228 18.5523 5 18 5C17.4477 5 17 4.55228 17 4C17 3.44772 16.5523 3 16 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H16C16.5523 21 17 20.5523 17 20V19C17 18.4477 17.4477 18 18 18C18.5523 18 19 18.4477 19 19V20C19 21.6569 17.6569 23 16 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H16Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20.7991 8.20087C20.4993 7.90104 20.0132 7.90104 19.7133 8.20087L11.9166 15.9977C11.7692 16.145 11.6715 16.3348 11.6373 16.5404L11.4728 17.5272L12.4596 17.3627C12.6652 17.3285 12.855 17.2308 13.0023 17.0835L20.7991 9.28666C21.099 8.98682 21.099 8.5007 20.7991 8.20087ZM18.2991 6.78666C19.38 5.70578 21.1325 5.70577 22.2134 6.78665C23.2942 7.86754 23.2942 9.61999 22.2134 10.7009L14.4166 18.4977C13.9744 18.9398 13.4052 19.2327 12.7884 19.3355L11.8016 19.5C10.448 19.7256 9.2744 18.5521 9.50001 17.1984L9.66448 16.2116C9.76728 15.5948 10.0602 15.0256 10.5023 14.5834L18.2991 6.78666Z"
                        fill=""
                      />
                      <path
                        d="M5 7C5 6.44772 5.44772 6 6 6H14C14.5523 6 15 6.44772 15 7C15 7.55228 14.5523 8 14 8H6C5.44772 8 5 7.55228 5 7Z"
                        fill=""
                      />
                      <path
                        d="M5 11C5 10.4477 5.44772 10 6 10H10C10.5523 10 11 10.4477 11 11C11 11.5523 10.5523 12 10 12H6C5.44772 12 5 11.5523 5 11Z"
                        fill=""
                      />
                      <path
                        d="M5 15C5 14.4477 5.44772 14 6 14H7C7.55228 14 8 14.4477 8 15C8 15.5523 7.55228 16 7 16H6C5.44772 16 5 15.5523 5 15Z"
                        fill=""
                      />
                    </svg>
                    Feedback
                  </Link>
                </li>
              ) : (
                <div></div>
              )}

              {/* <!-- Menu Feedback --> */}

              {/* <!-- Menu Item Presence --> */}

              <li>
                <Link
                  href="/dashboard/presences"
                  className={`group relative flex items-center gap-2.5 rounded-sm my-2 py-2 px-4 font-medium duration-300 ease-in-out hover:rounded-lg hover:bg-white dark:hover:bg-meta-4 ${
                    pathname.includes("/dashboard/presences") &&
                    "border-2 border-black shadow-bottom rounded-xl bg-white dark:bg-meta-4"
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V12L14.5 14.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.60423 5.60423L5.0739 5.0739V5.0739L5.60423 5.60423ZM4.33785 6.87061L3.58786 6.87438C3.58992 7.28564 3.92281 7.61853 4.33408 7.6206L4.33785 6.87061ZM6.87963 7.63339C7.29384 7.63547 7.63131 7.30138 7.63339 6.88717C7.63547 6.47296 7.30138 6.13549 6.88717 6.13341L6.87963 7.63339ZM5.07505 4.32129C5.07296 3.90708 4.7355 3.57298 4.32129 3.57506C3.90708 3.57715 3.57298 3.91462 3.57507 4.32882L5.07505 4.32129ZM3.75 12C3.75 11.5858 3.41421 11.25 3 11.25C2.58579 11.25 2.25 11.5858 2.25 12H3.75ZM16.8755 20.4452C17.2341 20.2378 17.3566 19.779 17.1492 19.4204C16.9418 19.0619 16.483 18.9393 16.1245 19.1468L16.8755 20.4452ZM19.1468 16.1245C18.9393 16.483 19.0619 16.9418 19.4204 17.1492C19.779 17.3566 20.2378 17.2341 20.4452 16.8755L19.1468 16.1245ZM5.14033 5.07126C4.84598 5.36269 4.84361 5.83756 5.13505 6.13191C5.42648 6.42626 5.90134 6.42862 6.19569 6.13719L5.14033 5.07126ZM18.8623 5.13786C15.0421 1.31766 8.86882 1.27898 5.0739 5.0739L6.13456 6.13456C9.33366 2.93545 14.5572 2.95404 17.8017 6.19852L18.8623 5.13786ZM5.0739 5.0739L3.80752 6.34028L4.86818 7.40094L6.13456 6.13456L5.0739 5.0739ZM4.33408 7.6206L6.87963 7.63339L6.88717 6.13341L4.34162 6.12062L4.33408 7.6206ZM5.08784 6.86684L5.07505 4.32129L3.57507 4.32882L3.58786 6.87438L5.08784 6.86684ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM16.1245 19.1468C14.9118 19.8483 13.5039 20.25 12 20.25V21.75C13.7747 21.75 15.4407 21.2752 16.8755 20.4452L16.1245 19.1468ZM20.25 12C20.25 13.5039 19.8483 14.9118 19.1468 16.1245L20.4452 16.8755C21.2752 15.4407 21.75 13.7747 21.75 12H20.25ZM6.19569 6.13719C7.68707 4.66059 9.73646 3.75 12 3.75V2.25C9.32542 2.25 6.90113 3.32791 5.14033 5.07126L6.19569 6.13719Z"
                      fill="currentColor"
                    />
                  </svg>
                  Riwayat Kehadiran Event
                </Link>
              </li>
              {/* <!-- Menu Item Presence --> */}
            </ul>
          </div>

          {/* <!-- Q&A --> */}
          {/* <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold">
              APP
            </h3>
          </div> */}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
