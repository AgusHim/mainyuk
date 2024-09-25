"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  children?: ReactNode;
  isShowBack?: boolean;
  isShowTrailing?: boolean;
}

export const CommonHeader: React.FC<HeaderProps> = ({
  title,
  children,
  isShowBack,
  isShowTrailing = true,
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };
  return (
    <>
      <div className="max-w-layout top-0 z-20 grid w-full gap-1 p-4 transition-colors sticky border-b border-black bg-yellow-300">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 text-black">
            {isShowBack ? (
              <button aria-hidden="true" onClick={handleBackClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-6 cursor-pointer"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            ) : (
              <></>
            )}

            <h1 className="truncate text-black text-lg font-semibold">
              {title}
            </h1>
          </div>
          {/* <div className="flex w-3/6 items-center gap-3">
            <h1 className="truncate text-base font-semibold text-black">
              {title}
            </h1>
          </div> */}
          {isShowTrailing ? (
            <div className="ml-auto flex items-center justify-center">
              <Link href="/profile">
              <button
                className="border border-black"
                style={{ boxShadow: "3px 3px 0px 0px #000000" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-6 text-black"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              </Link>
              
            </div>
          ) : (
            <></>
          )}

          {children}
          {/* <div className="flex w-full items-center justify-between gap-2">
            <div className="w-full">
              <label
                htmlFor="default-search"
                className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg
                    className="size-4 text-gray-500"
                    aria-hidden="true"
                    fill="none"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="search"
                  className="block h-10 w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-7 text-sm text-gray-900 ring-0"
                  placeholder="Ketik nama event"
                  value=""
                />
              </div>
            </div>
            <button
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-2 text-gray-900"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="size-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
              <span className="text-sm">Filter</span>
              <div className="flex size-3 items-center justify-center rounded-full bg-red-600 p-2 text-xs text-white">
                <span>1</span>
              </div>
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};
