'use client';

import * as React from 'react';
import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from './nav-secondary';
import { NavPreferences } from '@/components/nav-preferences';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { useI18n } from '@/context/i18n.context';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  config: {
    navMain: any[];
    projects?: any[];
    navSecondary?: any[];
  };
}

export function AppSidebar({ config, ...props }: AppSidebarProps) {
  const { isMobile } = useSidebar();
  const { hydrated, accessToken } = useAuth();
  const { t } = useI18n();
  const showAuthCta = isMobile && hydrated && !accessToken;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="mt-2">
        <NavMain items={config.navMain} />
        {config.projects && <NavProjects projects={config.projects} />}

        <SidebarSeparator className="mt-auto" />
        <NavPreferences />

        {config.navSecondary && <NavSecondary items={config.navSecondary} />}
      </SidebarContent>

      <SidebarFooter>
        {showAuthCta && (
          <MobileAuthButtons
            loginLabel={t('common.login')}
            signupLabel={t('common.signup')}
          />
        )}
        {!isMobile && <SidebarTrigger />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function MobileAuthButtons({
  loginLabel,
  signupLabel,
}: {
  loginLabel: string;
  signupLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-2 pb-1 group-data-[collapsible=icon]:hidden">
      <Button asChild size="sm" className="w-full gap-2">
        <Link href="/signup">
          <UserPlus className="w-4 h-4" />
          {signupLabel}
        </Link>
      </Button>
      <Button asChild size="sm" variant="outline" className="w-full gap-2">
        <Link href="/login">
          <LogIn className="w-4 h-4" />
          {loginLabel}
        </Link>
      </Button>
    </div>
  );
}
