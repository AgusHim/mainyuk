import { Comment } from "./comment";
import { Like } from "./like";

export type WsMessage = {
  room_id: string;
  username: string;
  message: WsData;
};

type WsData = {
  type: string;
  data: Comment | Like | any | null;
};
