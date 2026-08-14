import React, { useState } from "react";
import { AdminLayout, NavItem } from "@admin/core";

const navItems: NavItem[] = [
  { id: "1", label: "Dashboard", path: "/" },
  { id: "2", label: "Users", path: "/users" },
  { id: "3", label: "Settings", path: "/settings" },
];

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");

  return (
    <AdminLayout
      title="Admin Portal"
      navItems={navItems}
      currentPath={currentPath}
      onNavigate={(path) => setCurrentPath(path)}
      headerActions={
        <span style={{ fontSize: "14px", color: "#64748b" }}>User Profile</span>
      }
    >
      <div
        // style={{
        //   backgroundColor: "",
        //   padding: "24px",
        //   borderRadius: "8px",
        //   boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        // }}
        className="p-6 bg-white/980"
      >
        <h2 style={{ marginTop: 0 }}>Current View: {currentPath}</h2>
        <p>
          Turborepo app consuming <code>@admin/core</code> framework package!
        </p>
      </div>
    </AdminLayout>
  );
}
