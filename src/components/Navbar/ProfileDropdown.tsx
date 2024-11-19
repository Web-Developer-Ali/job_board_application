"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";

interface User {
  name: string;
  email: string;
  image?: string | null;
}

interface Session {
  user: User;
}

const defaultProfileImage = "/blank-profile-picture-973460_640.webp";

export default function ProfileDropdown({
  session,
  status,
}: {
  session: Session | null;
  status: string;
}) {
  const [imageError, setImageError] = useState(false);

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  const handleViewProfile = useCallback(() => {
    window.location.href = "/user_profile";
  }, []);

  if (status === "loading") return <Loader2 className="h-5 w-5 animate-spin" />;

  if (!session) {
    return (
      <a
        href="/sign-in"
        className="text-gray-600 dark:text-gray-300 hover:text-red-500"
      >
        Login
      </a>
    );
  }

  const profileImageSrc = imageError ? defaultProfileImage : session.user.image || defaultProfileImage;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative h-8 w-8 rounded-full">
          <Image
            src={profileImageSrc}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full object-cover h-full w-full"
            onError={() => setImageError(true)}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={handleViewProfile}>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewProfile}>
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
