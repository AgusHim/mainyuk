import {
  CalendarDays,
  CircleUserRound,
  Home,
  MessageCircle,
  RotateCcwClock,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "Events", path: "/events", icon: CalendarDays },
  { name: "Community", path: "/community", icon: MessageCircle },
  { name: "Orders", path: "/orders", icon: RotateCcwClock },
  { name: "Profile", path: "/profile", icon: CircleUserRound },
];
