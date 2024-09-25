import { Divisi } from "./divisi";

export type Event = {
  id?: string;
  slug?: string;
  code?: string;
  title?: string;
  desc?: string;
  image_url?: string;
  speaker?: string;
  participant?: number;
  divisi?: Divisi |null;
  start_at?: string;
  end_at?: string;
  allowed_gender?: string | "BOTH";
  location_types?: string[] | null;
  location_desc?: string[] | null;
  close_at?: string | null;
  isPublished?: boolean;
  isWhitelistOnly?:boolean;
  isAllowedToOrder?:boolean;
};
