"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  addComment,
  decreaseLike,
  increaseLike,
} from "@/redux/slices/qnaSlice";
import { Comment } from "@/types/comment";
import { Like } from "@/types/like";
import { WsMessage } from "@/types/wsMessage";
import { useEffect } from "react";
import { toast } from "react-toastify";

const EventWebsocket = () => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (event != null && user != null) {
      // Create a new WebSocket instance
      const socket = new WebSocket(
        `wss://${process.env.BASE_API}/ws/events/${event?.id}?user_id=${user?.id}&username=${user?.username}`
      );

      // WebSocket event listeners
      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (message) => {
        const res = JSON.parse(message.data) as WsMessage;

        if (res.message.type === "comment.add") {
          const comment = res.message.data as Comment;
          if (comment.user.id != user?.id) {
            dispatch(addComment(comment));
            if(comment.user != null){
              toast.info(`${comment.user?.username} memposting pertanyaan`);
            }
          }
        }
        if (res.message.type === "like.add") {
          const like = res.message.data as Like;
          if (like.user_id != user?.id) {
            dispatch(increaseLike(like.comment_id));
          }
        }
        if (res.message.type === "like.delete") {
          const like = res.message.data as Like;
          if (like.user_id != user?.id) {
            dispatch(decreaseLike(like.comment_id));
          }
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Handle any WebSocket errors
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
        // Handle WebSocket closing
      };
    }
  }, []);

  return <div></div>;
};

export default EventWebsocket;
