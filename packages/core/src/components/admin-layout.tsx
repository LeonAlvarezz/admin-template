import React, { useState } from "react";
import { AdminLayoutProps } from "../types";
import SideBar from "./sidebar";
import ThemeToggle from "./theme-toggle";

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title = "Admin Portal",
  navItems = [],
  currentPath = "/",
  onNavigate,
  headerActions,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f8fafc",
        color: "#0f172a",
      }}
    >
      {/*<aside
        style={{
          width: sidebarOpen ? "240px" : "64px",
          transition: "width 0.2s",
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "24px",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {sidebarOpen ? title : title.charAt(0)}
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {navItems.map((item) => {
            const active = currentPath === item.path;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.path)}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: active ? "#334155" : "transparent",
                  color: active ? "#38bdf8" : "#94a3b8",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 400,
                  transition: "background-color 0.15s",
                }}
              >
                {sidebarOpen ? item.label : item.label.charAt(0)}
              </button>
            );
          })}
        </nav>
      </aside>*/}
      <SideBar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            height: "60px",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: "6px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
          {/*<ThemeToggle />*/}
        </header>
        <main style={{ padding: "24px", flex: 1 }}>{children}</main>
      </div>
    </div>
  );
};
