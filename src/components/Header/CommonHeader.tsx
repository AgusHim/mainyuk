"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  children?: ReactNode;
  isShowBack?: boolean;
  isShowTrailing?: boolean;
  brandLogo?: boolean;
}

export const CommonHeader: React.FC<HeaderProps> = ({
  title,
  children,
  isShowBack,
  isShowTrailing = true,
  brandLogo = false,
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };
  return (
    <header className="sticky top-0 z-20 w-full border-b border-[var(--yn-border)] bg-[var(--yn-background)]/90 backdrop-blur-md">
      <div className="yn-container flex h-16 items-center gap-3 md:h-20">
        <div className="flex items-center gap-3 text-[var(--yn-foreground)]">
          {isShowBack ? (
            <button
              aria-label="Kembali"
              onClick={handleBackClick}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--yn-muted)] transition-colors hover:text-[var(--yn-foreground)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="size-5"
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

          {brandLogo ? (
            <Link href="/" aria-label="YukNgaji Solo" className="flex items-center">
              <Image
                src="/images/logo/yn_logo.png"
                alt=""
                width={40}
                height={40}
                className="size-10 object-contain"
              />
            </Link>
          ) : (
            <h1 className="truncate text-lg font-semibold tracking-tight md:text-xl">
              {title}
            </h1>
          )}
        </div>

        {isShowTrailing ? (
          <div className="ml-auto flex items-center justify-center">
            <Link
              href="/profile"
              aria-label="Profil"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] text-[var(--yn-foreground)] transition-colors hover:bg-[var(--yn-surface-muted)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </div>
        ) : (
          <></>
        )}

        {children}
      </div>
    </header>
  );
};
