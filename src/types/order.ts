import { PaymentMethod } from "./PaymentMethod";
import { User } from "./user";
import { UserTicket } from "./user_ticket";
import { Event } from "./event";

export type Order = {
  id?: string;
  public_id: string;
  amount?: number;
  donation?: number;
  admin_fee?: number;
  status?: string;
  invoice_url?: string | null;
  invoice_image_url?: string | null;
  user_id?: string;
  user?: User | null;
  user_tickets?: UserTicket[] | null;
  payment_method?: PaymentMethod | null;
  event?: Event | null;
  expired_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateOrder = {
  event_id: string;
  user_tickets: UserTicket[];
  donation: number;
  admin_fee: number;
};
