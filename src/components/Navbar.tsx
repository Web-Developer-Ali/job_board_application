"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NavLink from "./Navbar/NavLink";
import ProfileDropdown from "./Navbar/ProfileDropdown";
import MobileNav from "./Navbar/MobileNav";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status, update } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'profileImageUpdate') {
        update();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [update]);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-600 shadow-md dark:shadow-gray-700 z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 dark:text-gray-200 ml-4 md:ml-20"
        >
          Job<span className="text-red-500 dark:text-red-400">Portal</span>
        </Link>

        <div className="flex items-center md:hidden">
          <ProfileDropdown session={session} status={status} />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-4"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="ml-2"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        <div className="hidden md:flex items-center space-x-6 mr-4 md:mr-14">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/browse_jobs">Browse</NavLink>
          <ProfileDropdown session={session} status={status} />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-2"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {isOpen && <MobileNav />}
    </nav>
  );
}