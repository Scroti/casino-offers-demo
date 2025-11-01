"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/context/auth.context";
import { adminAppConfig, userAppConfig } from "@/components/configs/appConfig";
import { useMemo } from "react";

export default function RootNestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const sidebarConfig = useMemo(
    () => user?.role === "admin" ? adminAppConfig : userAppConfig,
    [user?.role]
  );

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
