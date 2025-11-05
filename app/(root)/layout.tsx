"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/context/auth.context";
import { adminAppConfig, userAppConfig } from "@/components/configs/appConfig";
import { useEmailCampaign } from "@/hooks/use-email-campaign";
import { useMemo, Suspense } from "react";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, accessToken, hydrated } = useAuth();
  const { isFromCampaign } = useEmailCampaign();

  const sidebarConfig = useMemo(() => {
    if (user?.role === "admin") {
      return adminAppConfig;
    }

    // Filter out Bonuses from menu if user is not logged in
    // BUT show it if they came from a valid campaign
    const isLoggedIn = hydrated && (accessToken || user);
    
    if (!isLoggedIn && !isFromCampaign) {
      return {
        ...userAppConfig,
        navMain: userAppConfig.navMain.filter(
          (item) => item.title !== "Bonuses"
        ),
      };
    }

    return userAppConfig;
  }, [user?.role, user, accessToken, hydrated, isFromCampaign]);

  return (
    <SidebarProvider defaultOpen={false}>
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

export default function RootNestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
