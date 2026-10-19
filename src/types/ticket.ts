export type Ticket = {
  id?: string | null;
  visibility: string;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  event_id: string;
  start_at: string;
  end_at: string;
  pax_multiplier: number | null;
  min_order_pax: number | null;
  max_order_pax: number | null;
  max_pax: number | null;
  sold_pax?: number;
  gender_allowed: string;
  access_mode?: "all" | "selected";
  episode_ids?: string[];
  isFull: boolean;
  created_at: string;
};

export type PresenceTicket = {
  slug: string;
  public_id: string;
};
