import {
  CalendarDays,
  CircleUserRound,
  HandHeart,
  Home,
  MessageCircle,
  Shirt,
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
  { name: "About", path: "/#temanbahagia", icon: MessageCircle },
  { name: "Donasi", path: "/donations", icon: HandHeart },
  { name: "Merch", path: "/shop", icon: Shirt },
  { name: "Profile", path: "/profile", icon: CircleUserRound },
];
