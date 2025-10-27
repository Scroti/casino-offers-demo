"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  config: {
    navMain: any[];
    projects?: any[];
    navSecondary?: any[];
  };
}

export function AppSidebar({ config, ...props }: AppSidebarProps) {
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="mt-2">
        <NavMain items={config.navMain} />
        {config.projects && <NavProjects projects={config.projects} />}
        {config.navSecondary && (
          <NavSecondary items={config.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>{!isMobile ? <SidebarTrigger /> : null}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
