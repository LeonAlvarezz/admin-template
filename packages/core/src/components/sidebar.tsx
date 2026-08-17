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
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import ChevronUpIcon from "~icons/griddy-icons/chevron-up-filled";

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <aside
      data-collapsed={isCollapsed}
      className="border-r border-border z-10 text-foreground group min-h-svh flex flex-col w-80 data-[collapsed=true]:w-16 bg-sidebar data-[collapsed=true]:px-0 py-4  transition-all duration-200"
    >
      <div className="flex flex-col flex-1 gap-2">
        <header className="px-4 flex flex-col gap-4">
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
          <Menu as="div" className="px-3">
            <MenuButton className="w-full flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent cursor-pointer transition-colors group-data-[collapsed=true]:justify-center focus:outline-none">
              <div className="flex gap-2.5 items-center min-w-0">
                <Avatar className="group-data-[collapsed=true]:size-6" />
                <div className="flex flex-col text-left group-data-[collapsed=true]:hidden min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">
                    Leon
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    leon@zeroui.com
                  </span>
                </div>
              </div>
              <ChevronUpIcon className="size-4 text-muted-foreground group-data-[collapsed=true]:hidden shrink-0" />
            </MenuButton>
            <MenuItems
              transition
              anchor={{ to: "top start", gap: 12 }}
              className="w-(--button-width) min-w-48 z-50 rounded-lg border border-border/40 bg-sidebar p-2 text-popover-foreground shadow-lg focus:outline-none transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0 origin-bottom"
            >
              <MenuItem>
                <a
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent data-focus:bg-accent whitespace-nowrap"
                  href="/settings"
                >
                  <GearIcon className="size-4 shrink-0" />
                  <span>Settings</span>
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent data-focus:bg-accent whitespace-nowrap"
                  href="/support"
                >
                  <HelpIcon className="size-4 shrink-0" />
                  <span>Support</span>
                </a>
              </MenuItem>
              <hr className="my-1 border-border/40" />
              <MenuItem>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-accent data-focus:bg-accent cursor-pointer whitespace-nowrap"
                >
                  <LogoutIcon className="size-4 shrink-0" />
                  <span>Sign out</span>
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </footer>
      </div>
    </aside>
  );
}

export default SideBar;
