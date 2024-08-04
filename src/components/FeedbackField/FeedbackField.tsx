"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { postFeedback } from "@/redux/slices/feedbackSlice";
import { CreateFeedback } from "@/types/feedback";
import { useState } from "react";
import { toast } from "react-toastify";

const FeedbackField = () => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.feedback.loading);
  const [formData, setFormData] = useState({
    message: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.message.length == 0) {
      toast.info("Masukan pesan anda");
      return;
    }
    let feedback: CreateFeedback;
    feedback = {
      event_id: event?.slug ?? "",
      user_id: user?.id ?? "",
      message: formData["message"],
    };
    dispatch(postFeedback(feedback)).then((_) => {
      setFormData({ ...formData, ["message"]: "" });
      toast.success("Berhasil mengirim pesan masukan");
    });
  };

  return (
    <div className="w-full md:w-1/4 h-1/2 p-10 rounded-xl border-2 border-black bg-white dark:bg-boxdark shadow-bottom dark:border-black">
      <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
        Kritik & Saran
      </h1>
      <p>Evaluasi kegiatan taklim agar lebih baik kedepan</p>
        <textarea
          onChange={handleChange}
          name="message"
          value={formData["message"]}
          className="w-full max-h-14 my-5 rounded-lg border-2 focus:border-4 border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-black dark:bg-boxdark dark:focus:border-primary resize-none"
          rows={5}
          cols={50}
          maxLength={300}
          placeholder="Tulis kritik dan saran"
        />
        {isLoading ? (
          <div className="ml-2 h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
        ) : (
          <button
            onClick={handleSubmit}
            className="max-h-12 w-20 btn bg-primary text-white p-2 rounded-md border-2 border-black"
            style={{ boxShadow: "5px 5px 0px 0px #000000" }}
          >
            Kirim
          </button>
        )}
      
    </div>
  );
};

export default FeedbackField;
