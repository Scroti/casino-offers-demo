import { url } from "inspector";
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
  Users,
  UserCheck,
  UserCog,
  SquareChartGantt,
  ChartCandlestick,
} from "lucide-react";
import { title } from "process";

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
          url: "ganes",
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
      url: "#",
      icon: BookOpen,
    },
  ],
  projects: [
    {
      name: "Complaints",
      url: "#",
      icon: Gavel,
    },
    {
      name: "Reviews",
      url: "#",
      icon: Star,
    },
    {
      name: "News",
      url: "#",
      icon: Newspaper,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
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
      title: "Content Management",
      url:'#',
      icon: SquareChartGantt,
      items: [
        {
          title: "Bonuses Management",
          url: "/admin/bonuses-management",
        },
        {
          title: "Casinos Management",
          url: "/admin/casinos-management",
        },
        {
          title: "TBD",
          url: "#",
        },
      ],
    },
    {
      title: "Analitics and Reports",
      url: "#",
      icon: ChartCandlestick,
    },
  ],
  projects: [
    {
      name: "Complaints",
      url: "#",
      icon: Gavel,
    },
    {
      name: "Reviews",
      url: "#",
      icon: Star,
    },
    {
      name: "News",
      url: "#",
      icon: Newspaper,
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
