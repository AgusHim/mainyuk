import { User } from "./user";
import { Event } from "./event";
import { UserTicket } from "./user_ticket";

export type Presence = {
  user: User;
  event: Event;
  user_ticket: UserTicket | null;
  created_at: string;
};

export type CreatePresence = {
  event_id: string;
  user_id?: string | null;
  user?: User | null;
};

export type ResScanTicket = {
  user_ticket: UserTicket;
  presences: string[] | null;
};
