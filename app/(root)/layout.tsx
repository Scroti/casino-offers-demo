"use client";

// Force dynamic rendering for this layout
export const dynamic = 'force-dynamic';

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/context/auth.context";
import { getAdminAppConfig, getUserAppConfig } from "@/components/configs/appConfig";
import { useEmailCampaign } from "@/hooks/use-email-campaign";
import { useMemo, Suspense } from "react";
import { useI18n } from "@/context/i18n.context";

function LayoutContentWithCampaign({ children }: { children: React.ReactNode }) {
  const { user, accessToken, hydrated } = useAuth();
  const { isFromCampaign } = useEmailCampaign();
  const { t } = useI18n();

  const sidebarConfig = useMemo(() => {
    if (user?.role === "admin") {
      return getAdminAppConfig(t);
    }

    // Filter out Bonuses from menu if user is not logged in
    // BUT show it if they came from a valid campaign
    const isLoggedIn = hydrated && (accessToken || user);
    const config = getUserAppConfig(t);
    
    if (!isLoggedIn && !isFromCampaign) {
      return {
        ...config,
        navMain: config.navMain.filter(
          (item) => item.title !== t('bonuses.title')
        ),
      };
    }

    return config;
  }, [user?.role, user, accessToken, hydrated, isFromCampaign, t]);

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

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LayoutContentWithCampaign>{children}</LayoutContentWithCampaign>
    </Suspense>
  );
}

export default function RootNestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutContent>{children}</LayoutContent>;
}
