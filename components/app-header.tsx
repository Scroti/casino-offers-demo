"use client";

import Image from "next/image";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { NavUser } from "./nav-user";
import { ModeToggle } from "./ui/mode-toggle";
import { feAppConfig } from "@/public/configs/app.config";
import { appConfig as data } from "@/components/configs/appConfig";

export function AppHeader() {
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-2">
          {isMobile ? <SidebarTrigger /> : null}

          {/* 🔥 Add logo here */}
          <Image
            src="/assets/images/logo.png"
            alt="Casino Offers Logo"
            width={50}
            height={50}
            className="rounded-md"
          />

          <h1 className="text-lg font-semibold">{feAppConfig.branding.AppName}</h1>
        </div>

        {/* Center section */}
        {/* <div className="hidden md:flex flex-1 justify-center">
          <Input
            type="search"
            placeholder="Search..."
            className="w-[300px] max-w-sm"
          />
        </div> */}

        {/* Right section */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <NavUser user={data.user} />
        </div>
      </div>
    </header>
  );
}
