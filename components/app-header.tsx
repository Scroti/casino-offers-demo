'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { NavUser } from './nav-user';
import { ModeToggle } from './ui/mode-toggle';
import { appConfig } from '@/components/configs/appConfig';
import { useAuth } from '@/context/auth.context';
import { Button } from './ui/button';

export function AppHeader() {
  const { isMobile } = useSidebar();
  const { hydrated, accessToken, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {isMobile ? <SidebarTrigger /> : null}
          <Image
            src="/assets/images/logo.png"
            alt="Casino Offers Logo"
            width={50}
            height={50}
            className="rounded-md"
          />
          <h1 className="text-lg font-semibold">{appConfig.branding.AppName}</h1>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          {!hydrated ? null : accessToken ? (
            <NavUser user={user} />
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup" className="btn btn-primary">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
