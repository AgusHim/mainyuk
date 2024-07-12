"use client";
import Image from "next/image";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useCallback, useEffect, useState } from "react";
import { getEventDetail } from "@/redux/slices/eventSlice";
import QnaList from "../QnaList";
import { useRouter } from "next/navigation";
import Loader from "../common/Loader";
import { postPrecence } from "@/redux/slices/eventRegisterSlice";
import { CreatePresence } from "@/types/presence";
import { getSessionUser } from "@/redux/slices/authSlice";
import CommentField from "../CommentField";
import DropdownFilter from "../LiveQna/DropdownFilter";
import ReadMoreParagraph from "../ReadMoreParagraph/ReadMoreParagraph";
import FeedbackField from "../FeedbackField/FeedbackField";
import { formatStrToDateTime } from "@/utils/convert";

export default function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const user = useAppSelector((state) => state.auth.user);
  const presence = useAppSelector((state) => state.eventRegister);

  const isLoading = useAppSelector((state) => state.event.loading);
  const error = useAppSelector((state) => state.event.error);

  const [isInit, setIsInit] = useState(true);

  const getEvent = useCallback(() => {
    if (event == null || event?.slug != params.slug) {
      dispatch(getEventDetail(params.slug));
    }
  }, [isInit]);

  const getSession = useCallback(() => {
    dispatch(getSessionUser())
      .unwrap()
      .then((user) => {
        if (user == null) {
          router.replace(`/events/${params.slug}/register`);
        }
        if (user != null && presence.event_id != params.slug) {
          const presence: CreatePresence = {
            event_id: params.slug,
            user_id: user.id,
          };
          dispatch(postPrecence(presence));
        }
      });
  }, [isInit]);

  useEffect(() => {
    if (isInit) {
      getEvent();
      getSession();
      setIsInit(false);
    }
  }, [isInit, dispatch]);

  if (isLoading) {
    return <Loader></Loader>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }
  if (event == null || user == null) {
    return <div></div>;
  }
  return (
    <>
      <div className="min-w-screen min-h-screen flex flex-col md:flex-row items-center md:items-start">
        <div className="w-full md:w-1/4 h-1/2 mb-5 p-10 rounded-xl border-2 bg-white dark:bg-boxdark border-black shadow-bottom dark:border-black">
          <Image
            className="w-full mb-5 rounded-xl shadow-bottom border-4 border-black"
            style={{boxShadow: '10px 10px 0px 0px #000000'}}
            width={400}
            height={400}
            alt={`Image ${event.title}`}
            src={event.image_url ?? ""}
            unoptimized={true}
          />
          <h1 className="flex w-full justify-center text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white text-center">
            {event.title}
          </h1>
          <p className="my-2 flex w-full justify-center text-md md:text-lg font-light text-center text-black dark:text-white">
            {event.speaker}
          </p>
          <h1 className="mb-3 text-center text-sm md:text-md font-bold  text-black dark:text-white">
            {formatStrToDateTime(event!.start_at!, "dd MMM yyyy")} -{" "}
            {formatStrToDateTime(event!.end_at!, "dd MMM yyyy")}
          </h1>
          <ReadMoreParagraph text={event.desc??''} maxLength={200} />
        </div>
        <div className="w-auto md:w-2/4 md:mx-4 flex flex-col mb-5 p-5 md:p-10 rounded-xl border-2 bg-white shadow-bottom dark:bg-boxdark border-black dark:border-black">
          <h1 className="mb-5 text-2xl font-bold text-black dark:text-white">
            Tanya Ustadz
          </h1>
          <CommentField />
          <div className="mt-5">
            <div className="mb-5"><DropdownFilter isLivePage={false}/></div>     
            <QnaList />
          </div>
        </div>
        <FeedbackField></FeedbackField>
      </div>
    </>
  );
}
