import { UserTicket } from "./user_ticket";

export type Order = {
  id: string;
  public_id: string;
  amount: number;
  donation: number;
  admin_fee: number;
  status: string;
  invoice_url: string | null;
  invoice_image_url: string | null;
  user_id: string;
  user_tickets: UserTicket[] | null;
  expired_at: string;
  created_at: string;
  updated_at: string;
};

export type CreateOrder = {
  user_tickets: number | null;
  donation: number;
};
