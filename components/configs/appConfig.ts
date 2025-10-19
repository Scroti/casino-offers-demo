import { BookOpen, GalleryVerticalEnd, Coins, DicesIcon, Gift, LifeBuoy, Gavel, Users2, Star, Newspaper } from "lucide-react";

export const appConfig = {
  user: {
    name: "Cristian Mihalache",
    email: "Scroti",
    avatar: "https://scontent.fotp3-2.fna.fbcdn.net/v/t39.30808-1/290760470_5028323290624050_1786948569604189641_n.jpg?stp=c0.256.1536.1536a_dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_ohc=TkPHTumrrHwQ7kNvwFp_cv8&_nc_oc=AdmGgvFDQf6hFUgf-DJr2QH-VJrpITwRQZr5rYT4TwDT34Dlbw8NTNGxON_rGGFq_BC708hmNhC75_iIVofptUyu&_nc_zt=24&_nc_ht=scontent.fotp3-2.fna&_nc_gid=iI8xzYNKeojJTfqqlkKLAw&oh=00_Afeu27MhK8s0ekjZYj8BAbNmDXv7V37wdi2mdRIBz-aLRw&oe=68FAB1C4",
  },
  appName: 
    {
      name: "Casino Offers",
      logo: GalleryVerticalEnd,
      
    },
  
  navMain: [
    {
      title: "Online Casinos",
      url: "#",
      icon: Coins,
      isActive: true,
      items: [
        {
          title: "Best online casinos",
          url: "#",
        },
        {
          title: "New online casinos",
          url: "#",
        },
        {
          title: "Safest online casinos",
          url: "#",
        },
      ],
    },
    {
      title: "Games",
      url: "#",
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
      title: "Bonuses",
      url: "#",
      icon: Gift,
      items: [
        {
          title: "No deposit bonuses",
          url: "bonuses",
        },
        {
          title: "Deposit bonuses",
          url: "#",
        },
        {
          title: "Cashback bonuses",
          url: "#",
        },
        {
          title: "All bonuses",
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
}