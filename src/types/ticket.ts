export type Ticket = {
  id?: string | null;
  visibility:string;
  name: string;
  description:string;
  price: number;
  event_id: string;
  start_at: string;
  end_at: string;
  pax_multiplier: number;
  min_order_pax: number|null;
  max_order_pax: number|null;
  created_at: string;
};
