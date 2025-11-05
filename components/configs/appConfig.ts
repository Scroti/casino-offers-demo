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
  ChartCandlestick,
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

export const adminAppConfig = {
  // appName: {
  //   name: "Casino Offers",
  //   logo: GalleryVerticalEnd,
  // },

  navMain: [
    {
      title: "Home",
      url: "/admin",
      isActive: true,
      icon: GalleryVerticalEnd,
    },
    {
      title: "Newsletter Subscriptions",
      url: "/admin/newsletter",
      icon: Newspaper,
    },
    {
      title: "User Management",
      url: "/admin/user-management",
      icon: UserCog,
      // No nested bonus-type links; types are filtered within Bonuses page
    },
    {
      title: "Campaign Management",
      url: "/admin/campaigns-management",
      icon: Gift,
    },
    {
      title: "Bonuses Management",
      url: '/admin/bonuses-management',
      icon: SquareChartGantt,
    },
    {
      title: "Casinos Management",
      url: '/admin/casinos-management',
      icon: Building2,
    },
    {
      title: "Ticket Management",
      url: "/admin/contact-management",
      icon: Ticket,
    },
    {
      title: "Guides Configuration",
      url: "/admin/guides-management",
      icon: FileText,
    },
  ],
  
  navSecondary: [
    {
      title: "User Logs",
      url: "/admin/user-logs",
      icon: UserCheck,
    },
    {
      title: "Forum",
      url: "#",
      icon: Users2,
    },
  ],
};
