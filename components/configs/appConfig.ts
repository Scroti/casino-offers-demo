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

export const userAppConfig = {
  navMain: [
    {
      title: "Home",
      url: "/",
      isActive: true,
      icon: GalleryVerticalEnd,
    },
    {
      title: "Online Casinos",
      url: "/casinos",
      icon: Coins,
    },
    {
      title: "Bonuses",
      url: "/bonuses",
      icon: Gift,
    },
    {
      title: "Games",
      url: "/games",
      icon: DicesIcon,
      items: [
        {
          title: "Free casino games",
          url: "/games",
        },
        {
          title: "Game providers",
          url: "#",
        },
        {
          title: "Real money play",
          url: "#",
        },
      ],
    },
    {
      title: "Guides",
      url: "/guides",
      icon: BookOpen,
    },
  ],
  projects: [
    {
      name: "Complaints",
      url: "/complaints",
      icon: Gavel,
    },
    {
      name: "Reviews",
      url: "/reviews",
      icon: Star,
    },
    {
      name: "News",
      url: "/news",
      icon: Newspaper,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Forum",
      url: "#",
      icon: Users2,
    },
  ],
};

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
