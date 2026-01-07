import { LayoutDashboard, Users, User, Settings } from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Users',
      url: '/users',
      icon: Users
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: User
    },
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: Settings
    },
  ],
  user: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: User
    },
  ],
  guest: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard
    },
  ]
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;