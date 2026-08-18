import React from "react";
import type { NavGroupConfig } from "@admin/core";

import DashboardIcon from "~icons/boxicons/dashboard-filled";
import ShopIcon from "~icons/solar/cart-4-bold";
import TimeIcon from "~icons/mingcute/time-fill";
import GearIcon from "~icons/icon-park-solid/setting";

export const navGroups: NavGroupConfig[] = [
  {
    id: "main",
    title: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/",
        icon: <DashboardIcon />,
      },
      {
        id: "shop",
        label: "Shop",
        path: "/shop",
        icon: <ShopIcon />,
      },
      {
        id: "schedule",
        label: "Schedule",
        path: "/schedule",
        icon: <TimeIcon />,
      },
    ],
  },
  {
    id: "system",
    title: "System",
    items: [
      {
        id: "settings",
        label: "Settings",
        path: "/settings",
        icon: <GearIcon />,
      },
    ],
  },
];
