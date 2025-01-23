import Link from "next/link";
import React from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";
import { get } from "http";

async function NavBar() {
  const user = await currentUser();
  if (user) {
    await syncUser();
  }
  const getUserProfileUrl = ({ user }: { user: any }) => {
    if (!user) return "/profile";

    const username =
      user.username ||
      (user.emailAddresses[0]?.emailAddress?.split("@")[0] ?? "default");

    return `/profile/${username}`;
  };
  const profileUrl = getUserProfileUrl({ user });

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider"
            >
              Social
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar profileUrl={profileUrl} />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
