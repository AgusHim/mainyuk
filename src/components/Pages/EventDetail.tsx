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
import RequiredAuthLayout from "@/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types/comment";

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
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);

  const getInitState = useCallback(() => {
    dispatch(getSessionUser())
      .unwrap()
      .then((user) => {
        if (user == null) {
          router.replace(`/signin?redirectTo=/events/${params.slug}/qna`);
        }
        if (user != null) {
          const presence: CreatePresence = {
            event_id: params.slug,
            user_id: user.id,
          };
          // Endpoint presence idempoten per hari WIB. Kirim setiap kali link
          // QnA dibuka agar scan pada hari berikutnya mencatat attendance baru,
          // termasuk bila pengguna masih berada dalam sesi SPA yang sama.
          dispatch(postPrecence(presence));
        }
      });
    if (event == null || event?.slug != params.slug) {
      dispatch(getEventDetail(params.slug)).then((res) => {
        const event = res.payload as Event;
      });
    }
    setIsInit(false);
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
  const endAt = new Date(event?.end_at!.replace("Z", ""));
  const isDiscussionOpen = now >= endAt;

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
    <RequiredAuthLayout redirectTo={`/events/${params.slug}/qna`}>
      <MainLayout>
        <CommonHeader title="Tanya Jawab" isShowTrailing={true} />
        <div className="yn-container max-w-2xl py-8">
          {presence.data != null && now < startAt ? (
            <div className="w-full mb-5 rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[var(--yn-foreground)]">
                  Konfirmasi kehadiran bisa klik tombol berikut
                </p>
                <Button
                  asChild
                  className="h-10 rounded-full bg-[var(--yn-accent)] px-5 text-white hover:bg-[var(--yn-accent-dark)]"
                >
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Whatsapp
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="w-full mb-5 rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5">
            <div className="flex flex-row">
              <Image
                className="mr-4 rounded-2xl border border-[var(--yn-border)]"
                width={100}
                height={100}
                alt={`Poster event ${event.title ?? "YukNgaji Solo"}`}
                src={event.image_url ?? ""}
                unoptimized={true}
              />
              <div className="flex flex-col items-start">
                <h2 className="justify-center text-lg font-bold text-[var(--yn-foreground)]">
                  {event.title}
                </h2>
                <p className="justify-center text-md text-[var(--yn-muted)]">
                  {event.speaker}
                </p>
                <p className="text-center text-sm text-[var(--yn-muted)]">
                  {formatStrToDateTime(
                    event!.start_at!,
                    "dd MMM yyyy HH:mm",
                    true
                  )}
                </p>
              </div>
            </div>
          </div>
          <section className="mb-5 overflow-hidden rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)]">
            <div className="border-b border-[var(--yn-border)] bg-[var(--yn-surface-muted)] px-5 py-7 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent)]">{isDiscussionOpen ? "Ruang lanjutan" : "Tanya jawab"}</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)] sm:text-3xl">
                {isDiscussionOpen ? "Lanjutkan percakapannya." : "Apa yang ingin kamu tanyakan?"}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--yn-muted)]">
                {isDiscussionOpen ? "Ada pertanyaan yang belum sempat dijawab saat acara? Bagikan jawaban, pengalaman, atau sudut pandangmu dengan tetap saling menghargai." : "Tulis pertanyaan atau keresahanmu. Pertanyaan dengan dukungan terbanyak lebih mudah terlihat saat acara berlangsung."}
              </p>
            </div>
            <div className="p-5 sm:p-8">
            <CommentField discussionMode={isDiscussionOpen} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
            <div className="mt-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-[var(--yn-foreground)]">{isDiscussionOpen ? "Percakapan komunitas" : "Pertanyaan dari peserta"}</h2>
                <DropdownFilter isLivePage={false} />
              </div>
              <QnaList discussionMode={isDiscussionOpen} onReply={(comment: Comment) => {
                setReplyTo({ id: comment.id, username: comment.user?.username ?? "teman" });
                requestAnimationFrame(() => document.querySelector<HTMLTextAreaElement>("textarea[name='comment']")?.focus());
              }} />
            </div>
            </div>
          </section>
          <FeedbackField></FeedbackField>
        </div>
        {presence.data != null ? <DialogSuccesRegistered event={event} /> : <></>}
      </MainLayout>
    </RequiredAuthLayout>
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
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                onClick={toggleDialog}
                className="text-xl font-bold text-primary"
              >
                Tutup
              </Button>
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
