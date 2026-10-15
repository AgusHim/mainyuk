import {
  CalendarDays,
  CircleUserRound,
  HandHeart,
  Home,
  Shirt,
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
  { name: "Orders", path: "/orders", icon: RotateCcwClock },
  { name: "Donasi", path: "/donations", icon: HandHeart },
  { name: "Shop", path: "/shop", icon: Shirt },
  { name: "Profile", path: "/profile", icon: CircleUserRound },
];
