import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface AdminLayoutProps {
  title?: string;
  navItems?: NavItem[];
  currentPath?: string;
  onNavigate?: (path: string) => void;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}
