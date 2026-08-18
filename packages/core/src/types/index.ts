import React from "react";

export interface NavItemConfig {
  id: string;
  label: React.ReactNode;
  path: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  active?: boolean;
}

export interface NavGroupConfig {
  id?: string;
  title?: string;
  items: NavItemConfig[];
}

export type RenderLinkProps = {
  path: string;
  className?: string;
  active?: boolean;
  children: React.ReactNode;
};

export type RenderLinkFn = (props: RenderLinkProps) => React.ReactNode;

export interface SideBarProps {
  title?: string;
  navGroups?: NavGroupConfig[];
  navItems?: NavItemConfig[];
  footerNavItems?: NavItemConfig[];
  currentPath?: string;
  onNavigate?: (path: string) => void;
  renderLink?: RenderLinkFn;
}

export interface AdminLayoutProps {
  title?: string;
  navGroups?: NavGroupConfig[];
  navItems?: NavItemConfig[];
  footerNavItems?: NavItemConfig[];
  currentPath?: string;
  onNavigate?: (path: string) => void;
  renderLink?: RenderLinkFn;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

