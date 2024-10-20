"use client";
import Image from "next/image";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { getEventDetail } from "@/redux/slices/eventSlice";
import QnaList from "../QnaList";
import { useRouter } from "next/navigation";
import Loader from "../common/Loader/Loader";
import { postPrecence } from "@/redux/slices/eventRegisterSlice";
import { CreatePresence } from "@/types/presence";
import { getSessionUser } from "@/redux/slices/authSlice";
import CommentField from "../CommentField";
import DropdownFilter from "../LiveQna/DropdownFilter";
import ReadMoreParagraph from "../ReadMoreParagraph/ReadMoreParagraph";
import FeedbackField from "../FeedbackField/FeedbackField";
import { formatStrToDateTime } from "@/utils/convert";
import Dialog from "../common/Dialog/Dialog";
import { Event } from "@/types/event";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsPraying } from "@fortawesome/free-solid-svg-icons";
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons/faArrowTrendUp";
import Header from "../Header/Header";
import { MainLayout } from "@/layout/MainLayout";
import { CommonHeader } from "../Header/CommonHeader";

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
  const errorPresence = useAppSelector((state) => state.presences.error);

  const [isInit, setIsInit] = useState(true);

  const getInitState = useCallback(() => {
    if (event == null || event?.slug != params.slug) {
      dispatch(getEventDetail(params.slug)).then((res) => {
        const event = res.payload as Event;
        dispatch(getSessionUser())
          .unwrap()
          .then((user) => {
            if (user == null) {
              router.replace(`/signin?redirectTo=/events/${params.slug}/qna`);
            }
            if (user != null && presence.event_id != params.slug) {
              const presence: CreatePresence = {
                event_id: params.slug,
                user_id: user.id,
              };
              dispatch(postPrecence(presence));
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

  if (isLoading || presence.loading) {
    return <Loader></Loader>;
  }
  if (error != null || errorPresence != null) {
    return <h1>{error ?? errorPresence}</h1>;
  }
  if (
    event == null ||
    (user == null && event?.close_at == null) ||
    presence.data == null
  ) {
    return <Loader></Loader>;
  }
  const now = new Date();
  const closeAt =
    event?.close_at == null
      ? new Date(event?.end_at!.replace("Z", ""))
      : new Date(event?.close_at!.replace("Z", ""));
  const startAt = new Date(event?.start_at!.replace("Z", ""));

  const phoneNumber = "+6281241000056";
  const message = `Konfirmasi Pendaftaran%0A%0A*${event?.title}*%0A%0ANama:${presence.data?.user?.name}%0AUsia:${presence.data?.user?.age}%0ADomisili:${presence.data?.user?.address}%0ANo HP:${presence.data?.user?.phone}%0APekerjaan:${presence.data?.user?.activity}%0A`;

  const getWhatsAppUrl = () => {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);

    if (isMobile) {
      // Use intent for Android
      return `intent://send/?phone=${phoneNumber}&text=${message}#Intent;scheme=whatsapp;package=com.whatsapp;end;`;
    } else {
      // Use wa.me for web and desktop
      return `https://wa.me/${phoneNumber}?text=${message}`;
    }
  };
  return (
    <MainLayout>
      <CommonHeader title="Tanya Jawab" isShowTrailing={true} />
      <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
        {presence.data != null && now < startAt ? (
          <div className="w-full mb-5 p-10 rounded-xl border-2 bg-white dark:bg-boxdark border-black shadow-bottom dark:border-black">
            <div className="flex flex-row justify-between items-center">
              <p className="text-black dark:text-white">
                Konfirmasi kehadiran bisa klik tombol berikut
              </p>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary ml-4 text-white"
                style={{ boxShadow: "5px 5px 0px 0px #000000" }}
              >
                Whatsapp
              </a>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="w-full mb-5 p-5 rounded-xl border-2 bg-yellow-300 border-black shadow-bottom">
          <div className="flex flex-row">
            <Image
              className="w-30 rounded-xl shadow-custom2 border-2 border-black mr-4"
              width={100}
              height={100}
              alt={`Image ${event.title}`}
              src={event.image_url ?? ""}
              unoptimized={true}
            />
            <div className="flex flex-col items-start">
              <h1 className="justify-center text-lg font-bold text-black">
                {event.title}
              </h1>
              <p className="justify-center text-md text-black">
                {event.speaker}
              </p>
              <h1 className="text-center text-sm text-black">
                {formatStrToDateTime(
                  event!.start_at!,
                  "dd MMM yyyy HH:mm",
                  true
                )}
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col mb-5 p-5 rounded-xl border-2 bg-yellow-300 shadow-bottom border-black">
          <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Live QnA
          </h1>
          <p className="mb-5 text-black">
            Masukan pertanyaan atau keresahan kamu
          </p>
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
      {presence.data != null ? <DialogSuccesRegistered event={event} /> : <></>}
    </MainLayout>
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
    const startAt = new Date(event!.start_at!.replace("Z", ""));
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
              Kamu bisa konfirmasi kehadiran dan juga bisa mengirimkan
              pertanyaan untuk dibacakan saat acara nanti
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
