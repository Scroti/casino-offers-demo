'use client';

import { Languages, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useI18n } from '@/context/i18n.context';
import { supportedLanguages } from '@/lib/i18n/i18n';

const LANGUAGE_LABEL: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ro: 'Română',
};

export function NavPreferences() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <LanguageMenuItem />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ThemeMenuItem />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function LanguageMenuItem() {
  const { language, setLanguage } = useI18n();
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip={LANGUAGE_LABEL[language]}>
          <Languages />
          <span>{LANGUAGE_LABEL[language] || language}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isMobile ? 'top' : 'right'} align="start" className="min-w-40">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={language === lang ? 'bg-accent font-medium' : ''}
          >
            <span className="mr-2 w-3 inline-block">{language === lang ? '✓' : ''}</span>
            {LANGUAGE_LABEL[lang] || lang}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeMenuItem() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const current = (resolvedTheme || theme) === 'dark' ? 'dark' : 'light';
  const toggle = () => setTheme(current === 'dark' ? 'light' : 'dark');
  const label = current === 'dark' ? 'Light mode' : 'Dark mode';

  return (
    <SidebarMenuButton onClick={toggle} tooltip={label}>
      {current === 'dark' ? <Sun /> : <Moon />}
      <span>{label}</span>
    </SidebarMenuButton>
  );
}
