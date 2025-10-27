"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "./ui/sidebar";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Persistent open state helper ---
function usePersistentMenus(key = "sidebar_menus") {
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  // Load from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setOpenMenus(JSON.parse(saved));
    } catch {}
  }, [key]);

  // Save to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(openMenus));
    } catch {}
  }, [openMenus, key]);

  const toggleMenu = (title: string) =>
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));

  const isOpen = (title: string) => !!openMenus[title];

  return { isOpen, toggleMenu };
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: { title: string; url: string }[];
  }[];
}) {
  const pathname = usePathname();
  const { isOpen, toggleMenu } = usePersistentMenus();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gambling</SidebarGroupLabel>
      <SidebarMenu>
        <TooltipProvider delayDuration={0}>
          {items.map((item) => {
            const hasChildren = !!item.items?.length;
            const Icon = item.icon;
            const active =
              pathname === item.url ||
              (item.items && pathname.startsWith(item.url));

            const open = isOpen(item.title);

            const button = (
              <div
                className={cn(
                  "flex items-center justify-between rounded-md transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {/* Parent link */}
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="flex-1 cursor-pointer"
                >
                  <Link href={item.url} className="flex items-center gap-2">
                    {Icon && <Icon className="size-4" />}
                    <span
                      className={cn(
                        collapsed
                          ? "opacity-0 translate-x-[-8px]"
                          : "opacity-100 translate-x-0",
                        "transition-all duration-200"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>

                {/* Chevron toggle */}
                {hasChildren && !collapsed && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleMenu(item.title);
                    }}
                    className={cn(
                      "p-1 mr-1 rounded-md transition-transform duration-200 ease-in-out",
                      open && "rotate-180",
                      active
                        ? "text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ChevronDown className="size-4" />
                  </button>
                )}
              </div>
            );

            return (
              <SidebarMenuItem key={item.title}>
                {/* Tooltip only visible in collapsed mode */}
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : (
                  button
                )}

                {/* Animated dropdown */}
                {!collapsed && (
                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                      open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {hasChildren && (
                      <SidebarMenuSub>
                        {item.items!.map((sub) => {
                          const subActive = pathname === sub.url;
                          return (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subActive}
                                className={cn(
                                  subActive &&
                                    "bg-sidebar-accent text-sidebar-accent-foreground"
                                )}
                              >
                                <Link href={sub.url}>{sub.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </div>
                )}
              </SidebarMenuItem>
            );
          })}
        </TooltipProvider>
      </SidebarMenu>
    </SidebarGroup>
  );
}
