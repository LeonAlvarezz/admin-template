import React from "react";
import type { NavGroupConfig } from "@admin/core";
import { ProductIcon, OrderIcon } from "@admin/core";

import DashboardIcon from "~icons/boxicons/dashboard-filled";
import ShopIcon from "~icons/solar/cart-4-bold";
import TimeIcon from "~icons/mingcute/time-fill";
import GearIcon from "~icons/solar/settings-bold";

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
        icon: <ShopIcon />,
        items: [
          {
            id: "products",
            label: "Products",
            path: "/shop/products",
            icon: <ProductIcon />,
          },
          {
            id: "orders",
            label: "Orders",
            path: "/shop/orders",
            icon: <OrderIcon />,
          },
        ],
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
        icon: <GearIcon />,
        items: [
          {
            id: "profile",
            label: "Profile",
            path: "/settings/profile",
          },
          {
            id: "security",
            label: "Security",
            path: "/settings/security",
          },
        ],
      },
    ],
  },
];
