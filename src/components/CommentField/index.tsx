"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { postComment } from "@/redux/slices/qnaSlice";
import { CreateComment } from "@/types/comment";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ReplyTarget = {
  id: string;
  username: string;
};

type CommentFieldProps = {
  discussionMode?: boolean;
  replyTo?: ReplyTarget | null;
  onCancelReply?: () => void;
};

const CommentField = ({
  discussionMode = false,
  replyTo = null,
  onCancelReply,
}: CommentFieldProps) => {
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
    if (!user) {
      toast.info("Masuk dulu untuk berkomentar");
      return;
    }
    const body = formData.comment.trim();
    if (body.length === 0) {
      toast.info(discussionMode ? "Tanggapan belum diisi" : "Pertanyaan belum diisi");
      return;
    }
    let comment: CreateComment;
    comment = {
      event_id: event?.slug ?? "",
      // API komentar event belum memiliki parent_comment_id. Menyebut penanya
      // pada isi komentar menjaga konteks jawaban tanpa mengirim field yang
      // belum didukung server.
      comment: replyTo ? `↳ Menjawab @${replyTo.username}\n${body}` : body,
    };
    try {
      await dispatch(postComment(comment)).unwrap();
      setFormData({ comment: "" });
      onCancelReply?.();
    } catch {
      // Pesan galat dari interceptor API tetap ditampilkan ke pengguna.
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-surface-muted)] p-3 sm:p-4">
      {replyTo ? (
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <p className="text-[var(--yn-muted)]">
            Menanggapi <span className="font-semibold text-[var(--yn-foreground)]">@{replyTo.username}</span>
          </p>
          <button type="button" onClick={onCancelReply} className="shrink-0 text-xs font-semibold text-[var(--yn-accent)] hover:underline">
            Batal
          </button>
        </div>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <textarea
          onChange={handleChange}
          name="comment"
          value={formData.comment}
          className="min-h-24 w-full resize-y rounded-xl border border-[var(--yn-border)] bg-[var(--yn-surface)] px-4 py-3 text-sm text-[var(--yn-foreground)] outline-none transition placeholder:text-[var(--yn-muted)] focus:border-[var(--yn-accent)] focus:ring-2 focus:ring-[var(--yn-accent-soft)]"
          rows={3}
          maxLength={500}
          placeholder={discussionMode ? "Bagikan jawaban atau sudut pandangmu…" : "Tulis pertanyaanmu…"}
          aria-label={discussionMode ? "Tulis tanggapan" : "Tulis pertanyaan"}
        />
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-11 shrink-0 rounded-full bg-[var(--yn-accent)] px-5 text-white hover:bg-[var(--yn-accent-dark)] disabled:cursor-wait"
        >
          {isLoading ? "Mengirim…" : discussionMode ? "Kirim tanggapan" : "Kirim pertanyaan"}
        </Button>
      </div>
      <p className="mt-2 text-right text-xs text-[var(--yn-muted)]">{formData.comment.length}/500</p>
    </div>
  );
};

export default CommentField;
