import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  decreaseLike,
  getComments,
  increaseLike,
} from "@/redux/slices/qnaSlice";
import {
  addLike,
  deleteLike,
  getLikes,
  postLike,
  removeLike,
} from "@/redux/slices/likeSlice";
import { Like } from "@/types/like";
import { Comment } from "@/types/comment";
import EventWebsocket from "../Websocket/EventWebsocket";
import { formatStrToDateTime } from "@/utils/convert";

const QnaList = () => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const user = useAppSelector((state) => state.auth.user);
  const comments = useAppSelector((state) => state.qna.data);
  const likes = useAppSelector((state) => state.like.data);
  const isLoading = useAppSelector((state) => state.qna.loading);

  useEffect(() => {
    if (comments == null && !isLoading) {
      dispatch(getComments(event?.id ?? ""));
      dispatch(
        getLikes({
          user_id: user?.id,
          event_id: event?.id,
        })
      );
    }
  }, []);

  var isLiked = (commentID: string) => {
    return likes?.some((item) => item.comment_id === commentID);
  };

  const handleLike = async (comment: Comment) => {
    console.log("Run Handle Like");
    let like: Like;
    like = {
      comment_id: comment.id,
      user_id: user?.id ?? "",
    };
    if (isLiked(comment.id)) {
      var data = likes?.find((e) => e.comment_id == comment.id);
      dispatch(removeLike(like));
      dispatch(decreaseLike(comment.id));
      dispatch(deleteLike(data!.id!));
    } else {
      dispatch(addLike(like));
      dispatch(increaseLike(comment.id));
      dispatch(postLike(like));
    }
  };

  if (isLoading) {
    <div>Loading...</div>;
  }
  if (comments == null) {
    <div></div>;
  }
  return (
    <div>
      <EventWebsocket></EventWebsocket>
      {comments?.map((comment, key) => (
        <div
          className="flex items-center gap-5 py-3 px-3 md:py-3 md:px-7.5 border-2 border-black mb-4 rounded-md"
          style={{ boxShadow: "0px 5px 0px 0px #000000" }}
          key={key}
        >
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h5 className="font-bold text-black dark:text-white text-md">
                {comment.user.username}
              </h5>
              <p>
                <span className="text-black text-sm">{comment.comment}</span>
              </p>
              <p className="text-xs text-black mt-2">
                {formatStrToDateTime(
                  comment.created_at!,
                  "dd-MM-yyyy HH:mm",
                  true
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <svg
              onClick={() => {
                handleLike(comment);
              }}
              className={isLiked(comment.id) ? "fill-danger" : `fill-current`}
              fill="none"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill=""
                d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z"
              />
            </svg>
            <span className=" text-black text-sm">{comment.like}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QnaList;
