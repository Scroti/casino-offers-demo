'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { NavUser } from './nav-user';
import { useAuth } from '@/context/auth.context';
import { useI18n } from '@/context/i18n.context';
import { Button } from './ui/button';
import { appConfig } from '@/components/configs/appConfig';

export function AppHeader() {
  const { isMobile } = useSidebar();
  const { hydrated, accessToken, user } = useAuth();
  const { t } = useI18n();
  const brand = appConfig.branding.AppName;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80">
      <div className="flex h-16 sm:h-20 items-center justify-between gap-2 px-3 sm:px-6">

        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 transition-opacity hover:opacity-80"
        >
          <Image
            src="/assets/images/logo.png"
            alt={brand}
            width={160}
            height={48}
            priority
            className="h-9 sm:h-11 w-auto"
          />
          <span className="text-base sm:text-lg font-bold tracking-tight text-sidebar-foreground">
            {brand}
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {hydrated && !accessToken && (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">{t('common.login')}</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">{t('common.signup')}</Button>
              </Link>
            </div>
          )}

          {hydrated && accessToken && <NavUser user={user} />}

          {isMobile && <SidebarTrigger className="ml-1" />}
        </div>
      </div>
    </header>
  );
}
