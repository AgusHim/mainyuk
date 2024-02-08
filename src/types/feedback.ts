import { Event } from "./event";
import { User } from "./user";

export type Feedback = {
  id: string;
  event: Event;
  user: User;
  message: string;
  like: number | 0;
  created_at: string;
};

export type CreateFeedback = {
  event_id: string;
  user_id: string;
  message: string;
};
