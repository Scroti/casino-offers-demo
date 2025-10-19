"use client";

import * as React from "react";
import { appConfig as data } from "@/components/configs/appConfig";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter, SidebarRail,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isMobile } = useSidebar();
  
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher appName={data.appName} />
      </SidebarHeader> */}
      <SidebarContent className="mt-2">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
       {!isMobile? <SidebarTrigger/> : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
