import type { ComponentPropsWithoutRef, SVGProps } from "react";
import SearchIcon from "~icons/boxicons/search";
import DashboardIcon from "~icons/boxicons/dashboard-filled";
import ShopIcon from "~icons/solar/cart-4-bold";
import TimeIcon from "~icons/mingcute/time-fill";
import SettingsIcon from "~icons/solar/settings-bold";
import SettingsAltIcon from "~icons/icon-park-solid/setting";
import SidebarCollapseIcon from "~icons/cuida/sidebar-collapse-outline";
import SidebarExpandIcon from "~icons/cuida/sidebar-expand-outline";
import SunIcon from "~icons/solar/sun-bold";
import MoonIcon from "~icons/solar/moon-bold";
import ComputerIcon from "~icons/material-symbols/computer";
import ChevronDownIcon from "~icons/lucide/chevron-down";
import ChevronUpIcon from "~icons/griddy-icons/chevron-up-filled";
import ChevronLeftIcon from "~icons/mingcute/left-fill";
import ChevronRightIcon from "~icons/mingcute/right-fill";
import ArrowLeftIcon from "~icons/solar/arrow-left-linear";
import ArrowRightIcon from "~icons/solar/alt-arrow-right-linear";
import ArrowRightLinearIcon from "~icons/solar/arrow-right-linear";
import ArrowUpIcon from "~icons/solar/arrow-up-bold";
import HomeIcon from "~icons/solar/home-2-bold";
import CompassIcon from "~icons/solar/compass-bold";
import FileQuestionIcon from "~icons/solar/file-remove-bold";
import CheckIcon from "~icons/boxicons/check";
import CloseIcon from "~icons/lucide/x";
import CloseCircleIcon from "~icons/solar/close-circle-linear";
import PlusIcon from "~icons/tabler/plus-filled";
import PlusCircleIcon from "~icons/solar/add-circle-bold";
import EditIcon from "~icons/lets-icons/edit-fill";
import CopyIcon from "~icons/solar/copy-bold";
import TrashIcon from "~icons/solar/trash-bin-trash-bold";
import DeleteIcon from "~icons/mingcute/delete-fill";
import MoreHorizontalIcon from "~icons/mingcute/more-4-line";
import ColumnsIcon from "~icons/mingcute/column-fill";
import EyeIcon from "~icons/solar/eye-bold";
import EyeOffIcon from "~icons/solar/eye-closed-bold";
import HideIcon from "~icons/bxs/hide";
import MenuIcon from "~icons/ic/round-menu";
import CommandIcon from "~icons/solar/command-bold";
import ShieldIcon from "~icons/solar/shield-bold";
import DownloadIcon from "~icons/solar/download-bold";
import TabIcon from "~icons/material-symbols/tab-group-rounded";
import InboxIcon from "~icons/lucide/inbox";
import LogoutIcon from "~icons/solar/logout-linear";
import SuccessIcon from "~icons/ep/success-filled";
import ErrorIcon from "~icons/carbon/close-filled";
import WarningIcon from "~icons/bxs/error";
import AlertTriangleIcon from "~icons/lucide/triangle-alert";
import AlertCircleIcon from "~icons/lucide/circle-alert";
import InfoIcon from "~icons/lucide/info";
import InfoAltIcon from "~icons/mdi/error";
import ViewIcon from "~icons/lets-icons/view-fill";
import MaximizeIcon from "~icons/lucide/maximize-2";
import MinimizeIcon from "~icons/lucide/minimize-2";
import ProductIcon from "~icons/solar/box-bold";
import OrderIcon from "~icons/solar/clipboard-list-bold";
import { cn } from "../../utils";

export type IconComponent = React.ComponentType<
  ComponentPropsWithoutRef<"svg">
>;

export function SpinnerIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn("animate-spin", className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Aliases for convenience
const XIcon = CloseIcon;
const WarningTriangleIcon = AlertTriangleIcon;
const GearIcon = SettingsIcon;
const CartIcon = ShopIcon;
const ClockIcon = TimeIcon;
const MonitorIcon = ComputerIcon;
const BoxIcon = ProductIcon;
const ClipboardListIcon = OrderIcon;

export {
  SearchIcon,
  DashboardIcon,
  ShopIcon,
  CartIcon,
  TimeIcon,
  ClockIcon,
  SettingsIcon,
  SettingsAltIcon,
  GearIcon,
  SidebarCollapseIcon,
  SidebarExpandIcon,
  SunIcon,
  MoonIcon,
  ComputerIcon,
  MonitorIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightLinearIcon,
  ArrowUpIcon,
  HomeIcon,
  CompassIcon,
  FileQuestionIcon,
  CheckIcon,
  CloseIcon,
  XIcon,
  CloseCircleIcon,
  PlusIcon,
  PlusCircleIcon,
  EditIcon,
  CopyIcon,
  TrashIcon,
  DeleteIcon,
  MoreHorizontalIcon,
  ColumnsIcon,
  EyeIcon,
  EyeOffIcon,
  HideIcon,
  MenuIcon,
  CommandIcon,
  ShieldIcon,
  DownloadIcon,
  TabIcon,
  InboxIcon,
  LogoutIcon,
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  AlertTriangleIcon,
  WarningTriangleIcon,
  AlertCircleIcon,
  InfoIcon,
  InfoAltIcon,
  ViewIcon,
  MaximizeIcon,
  MinimizeIcon,
  ProductIcon,
  BoxIcon,
  OrderIcon,
  ClipboardListIcon,
};

export const Icons = {
  Search: SearchIcon,
  Dashboard: DashboardIcon,
  Shop: ShopIcon,
  Cart: ShopIcon,
  Time: TimeIcon,
  Clock: TimeIcon,
  Settings: SettingsIcon,
  SettingsAlt: SettingsAltIcon,
  Gear: SettingsIcon,
  SidebarCollapse: SidebarCollapseIcon,
  SidebarExpand: SidebarExpandIcon,
  Sun: SunIcon,
  Moon: MoonIcon,
  Computer: ComputerIcon,
  Monitor: ComputerIcon,
  ChevronDown: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  ArrowRightLinear: ArrowRightLinearIcon,
  ArrowUp: ArrowUpIcon,
  Home: HomeIcon,
  Compass: CompassIcon,
  FileQuestion: FileQuestionIcon,
  Check: CheckIcon,
  Close: CloseIcon,
  X: CloseIcon,
  CloseCircle: CloseCircleIcon,
  Plus: PlusIcon,
  PlusCircle: PlusCircleIcon,
  Edit: EditIcon,
  Copy: CopyIcon,
  Trash: TrashIcon,
  Delete: DeleteIcon,
  MoreHorizontal: MoreHorizontalIcon,
  Columns: ColumnsIcon,
  Eye: EyeIcon,
  EyeOff: EyeOffIcon,
  Hide: HideIcon,
  Menu: MenuIcon,
  Command: CommandIcon,
  Shield: ShieldIcon,
  Download: DownloadIcon,
  Tab: TabIcon,
  Inbox: InboxIcon,
  Logout: LogoutIcon,
  Success: SuccessIcon,
  Error: ErrorIcon,
  Warning: WarningIcon,
  AlertTriangle: AlertTriangleIcon,
  WarningTriangle: AlertTriangleIcon,
  AlertCircle: AlertCircleIcon,
  Info: InfoIcon,
  InfoAlt: InfoAltIcon,
  Spinner: SpinnerIcon,
  View: ViewIcon,
  Maximize: MaximizeIcon,
  Minimize: MinimizeIcon,
  Product: ProductIcon,
  Box: ProductIcon,
  Order: OrderIcon,
  ClipboardList: OrderIcon,
};
