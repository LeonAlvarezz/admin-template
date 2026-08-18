import React, { useState } from "react";
import { AdminLayoutProps } from "../types";
import SideBar from "./sidebar";
import ThemeToggle from "./theme-toggle";

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title = "ZeroUI",
  navGroups,
  navItems,
  footerNavItems,
  currentPath = "/",
  onNavigate,
  renderLink,
  headerActions,
  children,
}) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SideBar
        title={title}
        navGroups={navGroups}
        navItems={navItems}
        footerNavItems={footerNavItems}
        currentPath={currentPath}
        onNavigate={onNavigate}
        renderLink={renderLink}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {headerActions && (
          <header className="h-14 border-b border-border bg-sidebar px-6 flex items-center justify-between shrink-0">
            {headerActions}
          </header>
        )}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
