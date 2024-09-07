import { Comment } from "@/types/comment";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getComments } from "@/redux/slices/qnaSlice";
import { formatStrToDateTime } from "@/utils/convert";
import DialogShowQnA from "../Common/Dialog/DialogShowQnA";

const LiveQna = () => {
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close();
      setDialogContent(null);
    } else {
      dialogRef.current.showModal();
    }
  }

  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const comments = useAppSelector((state) => state.qna.data);
  const isLoading = useAppSelector((state) => state.qna.loading);

  useEffect(() => {
    if (comments == null && !isLoading) {
      dispatch(getComments(event?.id ?? ""));
    }
  }, []);

  const handleClick = (value: Comment) => {
    setDialogContent(
      <div className="flex flex-1 items-center justify-between">
        <div>
          <div className="flex flex-row items-center">
            <div
              className={`sm:flex items-center text-center justify-center w-18 h-18 rounded-full hidden ${
                value.user?.gender == "female" ? "bg-meta-7" : "bg-primary"
              }`}
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              <h1 className="text-white text-2xl">
                {value.user.username?.substring(0, 2)}
              </h1>
            </div>
            <h5 className="mx-3 font-bold text-white dark:text-white text-2xl">
              {value.user.username}
            </h5>
          </div>
          <p className="my-3">
            <span className={`text-white dark:text-white text-3xl font-normal`}>
              {value.comment}
            </span>
          </p>
          <p className="text-xl mt-2">
            {formatStrToDateTime(value.created_at!, "dd-MM-yyyy HH:mm", true)}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center ml-5">
          <svg
            className="fill-danger"
            fill="none"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill=""
              d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z"
            />
          </svg>
          <span className="mt-1 text-xl text-white">{value.like}</span>
        </div>
      </div>
    );
    toggleDialog();
  };

  if (isLoading) {
    <div>Loading...</div>;
  }
  if (comments == null) {
    <h1 className="text-4xl text-white text-center">Tanya Ustadz</h1>;
  }

  return (
    <div>
      {comments?.length == 0 ? (
        <div className="h-full flex text-4xl items-center justify-center py-40 text-white text-center">
          Emang boleh? ga ada yang tanya?
        </div>
      ) : (
        comments?.map((comment, key) => (
          <div
            onClick={() => handleClick(comment)}
            className={`flex items-center gap-5 py-3 px-3 md:py-3 md:px-7.5 border mb-4 rounded-md border-black`}
            style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            key={key}
          >
            <div className="flex flex-1 items-center justify-between">
              <div>
                <div className="flex flex-row items-center">
                  <div
                    className={`sm:flex items-center text-center justify-center w-10 h-10 md:h-14 md:w-14 rounded-full hidden ${
                      comment.user?.gender == "female"
                        ? "bg-meta-7"
                        : "bg-primary"
                    }`}
                    style={{ boxShadow: "0px 5px 0px 0px #000000" }}
                  >
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
                <p className="text-md mt-2">
                  {formatStrToDateTime(
                    comment.created_at!,
                    "dd-MM-yyyy HH:mm",
                    true
                  )}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="fill-danger"
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
                <span className="mt-1 text-md md:text-xl text-white">{comment.like}</span>
              </div>
            </div>
          </div>
        ))
      )}
      <DialogShowQnA toggleDialog={toggleDialog} ref={dialogRef}>
        {dialogContent}
      </DialogShowQnA>
    </div>
  );
};

export default LiveQna;
