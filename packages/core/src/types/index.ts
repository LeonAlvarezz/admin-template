import type { LinkProps, RegisteredRouter } from "@tanstack/react-router";
import type React from "react";

type RoutePath =
  RegisteredRouter["routeTree"]["types"]["fileRouteTypes"] extends {
    to: infer TPath extends string;
  }
    ? TPath | (string & {})
    : string;

export interface NavItemConfig {
  id: string;
  label: React.ReactNode;
  path?: RoutePath;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  items?: NavItemConfig[];
}

export interface NavGroupConfig {
  id?: string;
  title?: string;
  items: NavItemConfig[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface UserMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  href?: RoutePath;
  onClick?: () => void;
  variant?: "default" | "destructive";
}

export interface SideBarProps {
  title?: string;
  logo?: React.ReactNode;
  navGroups?: NavGroupConfig[];
  navItems?: NavItemConfig[];
  footerNavItems?: NavItemConfig[];
  user?: UserProfile;
  userMenuItems?: UserMenuItem[];
  onSignOut?: () => void;
  sidebarFooter?: React.ReactNode;
  children?: React.ReactNode;
}

export interface AdminLayoutProps {
  title?: string;
  logo?: React.ReactNode;
  navGroups?: NavGroupConfig[];
  navItems?: NavItemConfig[];
  footerNavItems?: NavItemConfig[];
  user?: UserProfile;
  userMenuItems?: UserMenuItem[];
  onSignOut?: () => void;
  headerActions?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}
