import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  decreaseLike,
  getComments,
  increaseLike,
} from "@/redux/slices/qnaSlice";
import { format } from "date-fns";
import {
  addLike,
  deleteLike,
  getLikes,
  postLike,
  removeLike,
} from "@/redux/slices/likeSlice";
import { Like } from "@/types/like";
import { Comment } from "@/types/comment";

const QnaList = () => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const user = useAppSelector((state) => state.auth.user);
  const comments = useAppSelector((state) => state.qna.data);
  const likes = useAppSelector((state) => state.like.data);
  const isLoading = useAppSelector((state) => state.qna.loading);

  useEffect(() => {
    if (comments == null && !isLoading) {
      dispatch(getComments());
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
      {comments?.map((comment, key) => (
        <div
          className="flex items-center gap-5 py-3 px-3 md:py-3 md:px-7.5 dark:hover:bg-meta-4  border-[1.5px] border-stroke mb-2 rounded-md"
          key={key}
        >
          <div className="md:flex items-center text-center justify-center w-10 h-10 md:h-14 md:w-14 rounded-full bg-primary hidden">
            <h1 className="text-white text-lg md:text-xl">
              {comment.user.username?.substring(0, 2)}
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h5 className="font-medium text-black dark:text-white text-sm md:text-lg">
                {comment.user.username}
              </h5>
              <p>
                <span className="text-black dark:text-white text-xs md:text-sm">
                  {comment.comment}
                </span>
              </p>
              <p className="text-xs mt-2">
                {format(Date.parse(comment.created_at!), "dd-MM-yyyy hh:mm")}
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
            <span className="mt-1 text-xs md:text-md">{comment.like}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QnaList;
