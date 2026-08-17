import Button from "./ui/button";
import { useState } from "react";
import Input from "./ui/input";
import Keyboard from "./ui/keyboard";
import NavItem from "./ui/nav-item";
import ThemeSwitch from "./theme-switch";

import SearchIcon from "~icons/boxicons/search";
import DashboardIcon from "~icons/boxicons/dashboard-filled";
import ShopIcon from "~icons/solar/cart-4-bold";
import CuidaSideBarCollapse from "~icons/cuida/sidebar-collapse-outline";
import CuidaSideBarExpand from "~icons/cuida/sidebar-expand-outline";
import GearIcon from "~icons/icon-park-solid/setting";
import TimeIcon from "~icons/mingcute/time-fill";
import HelpIcon from "~icons/tabler/help-filled";
import MoonIcon from "~icons/solar/moon-bold";
import LogoutIcon from "~icons/solar/logout-linear";
import Avatar from "./ui/avatar";

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <aside
      data-collapsed={isCollapsed}
      className="border-r border-border z-10 text-foreground group min-h-svh flex flex-col w-80 data-[collapsed=true]:w-16 bg-sidebar data-[collapsed=true]:px-0 py-4  transition-all duration-200"
    >
      <div className="flex flex-col flex-1 gap-2">
        <header className="px-4 flex flex-col gap-2">
          <div className="flex justify-between group-data-[collapsed=true]:justify-center">
            <p className="text-foreground font-semibold text-lg whitespace-nowrap overflow-hidden transition-opacity duration-150 group-data-[collapsed=true]:w-0 group-data-[collapsed=true]:opacity-0 group-data-[collapsed=true]:pointer-events-none">
              ZeroUI
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <CuidaSideBarExpand /> : <CuidaSideBarCollapse />}
            </Button>
          </div>
          <div className="group-data-[collapsed=true]:hidden">
            <Input
              startIcon={<SearchIcon />}
              endIcon={<Keyboard keys={["command", "k"]} />}
            />
          </div>
        </header>

        {/*Nav Item*/}
        <nav className="mt-4">
          <ul className="flex flex-col gap-1 px-3 group-data-[collapsed=true]:px-2">
            <NavItem
              icon={<DashboardIcon />}
              label="Dashboard"
              active={activeItem === "dashboard"}
              onClick={() => setActiveItem("dashboard")}
            />
            <NavItem
              icon={<ShopIcon />}
              label="Shop"
              active={activeItem === "shop"}
              onClick={() => setActiveItem("shop")}
            />
            <NavItem
              icon={<TimeIcon />}
              label="Schedule"
              active={activeItem === "schedule"}
              onClick={() => setActiveItem("schedule")}
            />
            <NavItem
              icon={<GearIcon />}
              label="Settings"
              active={activeItem === "settings"}
              onClick={() => setActiveItem("settings")}
            />
          </ul>
        </nav>

        <footer className="mt-auto">
          <hr className="border-border/40 my-4 group-data-[collapsed=true]:mx-2" />
          <p className="px-4 text-muted text-xs tracking-wider font-semibold group-data-[collapsed=true]:hidden">
            Preferences
          </p>
          <ul className="flex flex-col gap-2 my-2 px-3 group-data-[collapsed=true]:px-2">
            <NavItem
              icon={<HelpIcon />}
              label="Help Center"
              active={activeItem === "helps"}
              onClick={() => setActiveItem("helps")}
            />
            <NavItem icon={<MoonIcon />} label="Dark Mode">
              <NavItem.Action>
                <ThemeSwitch />
              </NavItem.Action>
            </NavItem>
          </ul>

          <div className="px-3 group-data-[collapsed=true]:px-2">
            <NavItem
              icon={<LogoutIcon />}
              label="Logout"
              className="px-3 text-red-400 hover:text-red-500"
            />
          </div>
        </footer>
      </div>
    </aside>
  );
}

export default SideBar;
