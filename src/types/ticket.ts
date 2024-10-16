export type Ticket = {
  id?: string | null;
  visibility: string;
  name: string;
  description: string;
  price: number;
  event_id: string;
  start_at: string;
  end_at: string;
  pax_multiplier: number | null;
  min_order_pax: number | null;
  max_order_pax: number | null;
  max_pax: number | null;
  gender_allowed: string;
  isFull: boolean;
  created_at: string;
};

export type PresenceTicket = {
  slug: string;
  public_id: string;
};
