"use client";
import Image from "next/image";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
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
import Dialog from "../common/Dialog/Dialog";
import { set } from "date-fns";
import { Event } from "@/types/event";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsPraying } from "@fortawesome/free-solid-svg-icons";

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

  const getInitState = useCallback(() => {
    if (event == null || event?.slug != params.slug) {
      dispatch(getEventDetail(params.slug)).then((res) => {
        const event = res.payload as Event;
        dispatch(getSessionUser())
          .unwrap()
          .then((user) => {
            if (user == null) {
              router.replace(`/events/${params.slug}/register`);
            }
            if (user != null && presence.event_id != params.slug) {
              if (event != null && event!.close_at == null) {
                const presence: CreatePresence = {
                  event_id: params.slug,
                  user_id: user.id,
                };
                dispatch(postPrecence(presence));
              }
            }
          });
        setIsInit(false);
      });
    }
  }, [isInit]);

  useEffect(() => {
    if (isInit) {
      getInitState();
    }
  }, [isInit, dispatch]);

  if (isLoading) {
    return <Loader></Loader>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }
  if (event == null || (user == null && event?.close_at == null)) {
    return <Loader></Loader>;
  }
  if (event?.close_at != null) {
    const now = new Date();
    const closeAt = new Date(event?.close_at!);
    const startAt = new Date(event?.start_at!);
    if (closeAt < startAt && now < startAt) {
      return (
        <div className="min-w-screen min-h-screen flex flex-col md:flex-row items-center md:items-start">
          <div className="w-full md:w-1/4 h-1/2 mb-5 p-10 rounded-xl border-2 bg-white dark:bg-boxdark border-black shadow-bottom dark:border-black">
            <div className="flex flex-row items-center justify-center">
              <FontAwesomeIcon
                icon={faHandsPraying}
                className={"w-15 h-15 my-4 mr-4"}
                color="#7480FF"
              ></FontAwesomeIcon>
              <h1 className="text-black dark:text-white text-xl">
                Maaf, pendaftaran sudah ditutup{" "}
                <span className="font-bold text-black dark:text-white text-xl">
                  {formatStrToDateTime(
                    event?.close_at ?? "",
                    "dd MMMM yyyy HH:mm",
                    true
                  )}
                </span>
              </h1>
            </div>
          </div>
          <div className="w-full md:w-1/4 h-1/2 mb-5 p-10 rounded-xl border-2 bg-white dark:bg-boxdark border-black shadow-bottom dark:border-black">
            <Image
              className="w-full mb-5 rounded-xl shadow-bottom border-4 border-black"
              style={{ boxShadow: "10px 10px 0px 0px #000000" }}
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
            <ReadMoreParagraph text={event.desc ?? ""} maxLength={200} />
          </div>
        </div>
      );
    }
  }
  return (
    <>
      <div className="min-w-screen min-h-screen flex flex-col md:flex-row items-center md:items-start">
        <div className="w-full md:w-1/4 h-1/2 mb-5 p-10 rounded-xl border-2 bg-white dark:bg-boxdark border-black shadow-bottom dark:border-black">
          <Image
            className="w-full mb-5 rounded-xl shadow-bottom border-4 border-black"
            style={{ boxShadow: "10px 10px 0px 0px #000000" }}
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
          <ReadMoreParagraph text={event.desc ?? ""} maxLength={200} />
        </div>
        <div className="w-auto md:w-2/4 md:mx-4 flex flex-col mb-5 p-10 rounded-xl border-2 bg-white shadow-bottom dark:bg-boxdark border-black dark:border-black">
          <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Tanya Ustadz
          </h1>
          <p className="mb-5">Masukan pertanyaan atau keresahan kamu</p>
          <CommentField />
          <div className="mt-5">
            <div className="mb-5">
              <DropdownFilter isLivePage={false} />
            </div>
            <QnaList />
          </div>
        </div>
        <FeedbackField></FeedbackField>
      </div>
      <DialogSuccesRegistered event={event} />
    </>
  );
}

interface DialogProps {
  event: Event | null;
}

const DialogSuccesRegistered: React.FC<DialogProps> = ({ event }) => {
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

  function showRegisterSuccess() {
    const now = new Date();
    const startAt = new Date(event?.start_at!);
    if (now.getTime() < startAt.getTime()) {
      setDialogContent(
        <>
          <div className="flex flex-col justify-center items-center">
            <h3 className="mt-4 font-extrabold text-2xl text-black dark:text-white">
              Pendaftaran Berhasil
            </h3>
            <FontAwesomeIcon
              icon={faCircleCheck}
              className={"w-25 h-25 my-4"}
              color="green"
            ></FontAwesomeIcon>

            <p className="text-center text-black dark:text-white">
              Selamat pendaftaran kamu berhasil. Silahkan datang sesuai jadwal
              acara dimulai
            </p>
            <p className="my-2 text-center font-bold text-black dark:text-white">
              {formatStrToDateTime(
                event?.start_at ?? "",
                "EEEE, dd MMMM yyyy HH:mm",
                true
              )}
            </p>
            <p className="text-center text-black dark:text-white">
              Kamu juga bisa mengirimkan pertanyaan untuk dibacakan saat acara
              nanti
            </p>
            <div className="modal-action justify-center">
              <a
                onClick={toggleDialog}
                className="text-xl font-bold text-primary"
              >
                Tutup
              </a>
            </div>
          </div>
        </>
      );
      if (dialogRef.current != null) {
        dialogRef.current.showModal();
      }
    }
  }

  useEffect(() => {
    showRegisterSuccess();
  }, []);

  return (
    <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
      {dialogContent}
    </Dialog>
  );
};
