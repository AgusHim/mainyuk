import { Comment } from "@/types/comment";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getComments } from "@/redux/slices/qnaSlice";
import { format } from "date-fns";

const LiveQna = () => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.qna.data);
  const isLoading = useAppSelector((state) => state.qna.loading);

  useEffect(() => {
    if (comments == null && !isLoading) {
      dispatch(getComments());
    }
  }, []);

  const [selected, setSelected] = useState<Comment>();

  const handleClick = (value: Comment) => {
    setSelected(value);
  };

  if (isLoading) {
    <div>Loading...</div>;
  }
  if (comments == null || comments?.length == 0) {
    <h1 className="text-4xl text-white text-center">Tanya Ustadz</h1>;
  }

  return (
    <div>
      {comments?.map((comment, key) => (
        <div
          onClick={() => handleClick(comment)}
          className={`flex items-center gap-5 py-3 px-3 md:py-3 md:px-7.5 border mb-2 rounded-md ${
            comment === selected ? "border-primary border-4" : ""
          }`}
          key={key}
        >
          <div className="flex flex-1 items-center justify-between">
            <div>
              <div className="flex flex-row items-center">
                <div className="md:flex items-center text-center justify-center w-10 h-10 md:h-14 md:w-14 rounded-full bg-primary hidden">
                  <h1 className="text-white text-lg md:text-xl">
                    {comment.user.username?.substring(0, 2)}
                  </h1>
                </div>
                <h5 className="mx-3 font-bold text-white dark:text-white text-sm md:text-lg">
                  {comment.user.username}
                </h5>
              </div>
              <p className="my-3">
                <span
                  className={`text-white dark:text-white text-xl font-normal`}
                >
                  {comment.comment}
                </span>
              </p>
              <p className="text-md mt-2">{format(Date.parse(comment.created_at!), "dd-MM-yyyy hh:mm")}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
            <svg
              className="fill-current"
              fill="none"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill=""
                d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z"
              />
            </svg>
            <span className="mt-1 text-md md:text-xl">{comment.like}</span>
          </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveQna;
