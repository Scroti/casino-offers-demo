"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/context/auth.context";
import { adminAppConfig, userAppConfig } from "@/components/configs/appConfig";
import { useEffect, useState } from "react";

export default function RootNestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, accessToken } = useAuth();

  const sidebarConfig = user?.role === "admin" ? adminAppConfig : userAppConfig;

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <AppHeader />

        <div className="flex flex-1 w-full overflow-hidden">
          <AppSidebar config={sidebarConfig} />

          <main className="flex-1 overflow-y-auto ">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
