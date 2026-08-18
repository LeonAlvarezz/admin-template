import React from "react";
import type { AdminLayoutProps } from "../types";
import SideBar from "./sidebar";

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title = "ZeroUI",
  logo,
  navGroups,
  navItems,
  footerNavItems,
  user,
  userMenuItems,
  onSignOut,
  headerActions,
  sidebarFooter,
  sidebar,
  children,
}) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {sidebar ? (
        sidebar
      ) : (
        <SideBar
          title={title}
          logo={logo}
          navGroups={navGroups}
          navItems={navItems}
          footerNavItems={footerNavItems}
          user={user}
          userMenuItems={userMenuItems}
          onSignOut={onSignOut}
          sidebarFooter={sidebarFooter}
        />
      )}

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
