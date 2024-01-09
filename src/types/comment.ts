import { User } from "./user";

export type Comment = {
  id: string;
  event_id: string;
  user: User;
  comment: string;
  like: number | 0;
  created_at: string;
};

export type CreateComment = {
  event_id: string;
  user_id: string;
  comment: string;
};
