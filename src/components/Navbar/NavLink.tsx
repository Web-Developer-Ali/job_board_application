"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { cn } from "@/lib/utils";

export default function NavLink({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  const pathname = usePathname(); 

  useEffect(() => {
    const handleStart = () => nprogress.start();
    const handleComplete = () => nprogress.done();

    // Start progress bar when navigation starts
    handleStart();

    // Handle progress bar completion when pathname changes
    const handlePathnameChange = () => {
      handleComplete();
    };

    // Listen to pathname change
    handlePathnameChange();

  }, [pathname]); // Re-run effect on pathname change

  return (
    <Link
      href={href}
      className={cn(
        "text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition",
        mobile && "block px-4 py-2"
      )}
    >
      {children}
    </Link>
  );
}
