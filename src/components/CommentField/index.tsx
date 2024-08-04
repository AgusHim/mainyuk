"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { postComment } from "@/redux/slices/qnaSlice";
import { CreateComment } from "@/types/comment";
import { useState } from "react";
import { toast } from "react-toastify";

const CommentField = () => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.qna.loading);
  const [formData, setFormData] = useState({
    comment: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.comment.length == 0) {
      toast.info("Masukan pertanyaan anda");
      return;
    }
    let comment: CreateComment;
    comment = {
      event_id: event?.slug ?? "",
      user_id: user?.id ?? "",
      comment: formData["comment"],
    };
    dispatch(postComment(comment));
    setFormData({ ...formData, ["comment"]: "" });
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-end md:items-center md:justify-center">
      <textarea
        onChange={handleChange}
        name="comment"
        value={formData["comment"]}
        className="w-full max-h-14 focus:max-h-40 rounded-lg border-2 focus:border-4 border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-black dark:bg-boxdark dark:focus:border-primary resize-none"
        rows={5}
        cols={50}
        maxLength={300}
        placeholder="Tulis Pertanyaan ..."
      />
      {isLoading ? (
        <div className="ml-2 h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
      ) : (
        <button
          onClick={handleSubmit}
          className="mt-3 md:mt-0 max-h-12 ml-0 md:ml-4 w-30 lg:w-40 btn bg-primary text-white p-2 rounded-md border-2 border-black"
          style={{boxShadow: '5px 5px 0px 0px #000000'}}
        >
          Kirim
        </button>
      )}
    </div>
  );
};

export default CommentField;
