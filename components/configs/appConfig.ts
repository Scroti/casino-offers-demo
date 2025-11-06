import {
  BookOpen,
  GalleryVerticalEnd,
  Coins,
  DicesIcon,
  Gift,
  LifeBuoy,
  Gavel,
  Users2,
  Star,
  Newspaper,
  UserCheck,
  UserCog,
  SquareChartGantt,
  MessageSquare,
  Ticket,
  Building2,
  FileText,
} from "lucide-react";

export const appConfig = {
  branding: {
    AppName: "Playwise Guru",
  },
};

// Helper function to get translated menu config
// This will be called with useI18n hook in components
export function getUserAppConfig(t: (key: string) => string) {
  return {
    navMain: [
      {
        title: t('common.home'),
        url: "/",
        isActive: true,
        icon: GalleryVerticalEnd,
      },
      {
        title: t('casinos.title'),
        url: "/casinos",
        icon: Coins,
      },
      {
        title: t('bonuses.title'),
        url: "/bonuses",
        icon: Gift,
      },
      {
        title: t('games.title'),
        url: "/games",
        icon: DicesIcon,
        items: [
          {
            title: t('games.freeCasinoGames'),
            url: "/games",
          },
          {
            title: t('games.gameProviders'),
            url: "#",
          },
          {
            title: t('games.realMoneyPlay'),
            url: "#",
          },
        ],
      },
      {
        title: t('guides.title'),
        url: "/guides",
        icon: BookOpen,
      },
    ],
    projects: [
      {
        name: t('common.complaints'),
        url: "/complaints",
        icon: Gavel,
      },
      {
        name: t('common.reviews'),
        url: "/reviews",
        icon: Star,
      },
      {
        name: t('news.title'),
        url: "/news",
        icon: Newspaper,
      },
    ],
    navSecondary: [
      {
        title: t('common.support'),
        url: "/support",
        icon: LifeBuoy,
      },
      {
        title: t('common.forum'),
        url: "#",
        icon: Users2,
      },
    ],
  };
}

// Default config (fallback)
export const userAppConfig = getUserAppConfig((key: string) => {
  // Fallback to key if translation not found
  const translations: Record<string, string> = {
    'common.home': 'Home',
    'casinos.title': 'Online Casinos',
    'bonuses.title': 'Bonuses',
    'games.title': 'Games',
    'games.freeCasinoGames': 'Free casino games',
    'games.gameProviders': 'Game providers',
    'games.realMoneyPlay': 'Real money play',
    'guides.title': 'Guides',
    'common.complaints': 'Complaints',
    'common.reviews': 'Reviews',
    'news.title': 'News',
    'common.support': 'Support',
    'common.forum': 'Forum',
  };
  return translations[key] || key;
});

export function getAdminAppConfig(t: (key: string) => string) {
  return {
    navMain: [
      {
        title: t('common.home'),
        url: "/admin",
        isActive: true,
        icon: GalleryVerticalEnd,
      },
      {
        title: t('admin.newsletterSubscriptions'),
        url: "/admin/newsletter",
        icon: Newspaper,
      },
      {
        title: t('admin.userManagement'),
        url: "/admin/user-management",
        icon: UserCog,
      },
      {
        title: t('admin.campaignManagement'),
        url: "/admin/campaigns-management",
        icon: Gift,
      },
      {
        title: t('admin.bonusesManagement'),
        url: '/admin/bonuses-management',
        icon: SquareChartGantt,
      },
      {
        title: t('admin.casinosManagement'),
        url: '/admin/casinos-management',
        icon: Building2,
      },
      {
        title: t('admin.ticketManagement'),
        url: "/admin/contact-management",
        icon: Ticket,
      },
      {
        title: t('admin.guidesConfiguration'),
        url: "/admin/guides-management",
        icon: FileText,
      },
      {
        title: t('admin.gamesManagement'),
        url: "/admin/games-management",
        icon: DicesIcon,
      },
    ],
    
    navSecondary: [
      {
        title: t('admin.userLogs'),
        url: "/admin/user-logs",
        icon: UserCheck,
      },
      {
        title: t('common.forum'),
        url: "#",
        icon: Users2,
      },
    ],
  };
}

// Default admin config (fallback)
export const adminAppConfig = getAdminAppConfig((key: string) => {
  const translations: Record<string, string> = {
    'common.home': 'Home',
    'admin.newsletterSubscriptions': 'Newsletter Subscriptions',
    'admin.userManagement': 'User Management',
    'admin.campaignManagement': 'Campaign Management',
    'admin.bonusesManagement': 'Bonuses Management',
    'admin.casinosManagement': 'Casinos Management',
    'admin.ticketManagement': 'Ticket Management',
    'admin.guidesConfiguration': 'Guides Configuration',
    'admin.gamesManagement': 'Games Management',
    'admin.userLogs': 'User Logs',
    'common.forum': 'Forum',
  };
  return translations[key] || key;
});
