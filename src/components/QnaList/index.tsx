import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  decreaseLike,
  getComments,
  increaseLike,
} from "@/redux/slices/qnaSlice";
import {
  addLike,
  deleteLike,
  getLikes,
  postLike,
  removeLike,
} from "@/redux/slices/likeSlice";
import { Like } from "@/types/like";
import { Comment } from "@/types/comment";
import EventWebsocket from "../Websocket/EventWebsocket";
import { formatStrToDateTime } from "@/utils/convert";
import { toast } from "sonner";

type Props = {
  discussionMode?: boolean;
  onReply?: (comment: Comment) => void;
};

const QnaList = ({ discussionMode = false, onReply }: Props) => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const user = useAppSelector((state) => state.auth.user);
  const comments = useAppSelector((state) => state.qna.data);
  const likes = useAppSelector((state) => state.like.data);
  const isLoading = useAppSelector((state) => state.qna.loading);

  useEffect(() => {
    if (comments == null && !isLoading) {
      dispatch(getComments(event?.id ?? ""));
      dispatch(
        getLikes({
          user_id: user?.id,
          event_id: event?.id,
        })
      );
    }
  }, [comments, dispatch, event?.id, isLoading, user?.id]);

  var isLiked = (commentID: string) => {
    return likes?.some((item) => item.comment_id === commentID);
  };

  const handleLike = async (comment: Comment) => {
    if (!user) {
      toast.info("Masuk dulu untuk menyukai komentar");
      return;
    }
    console.log("Run Handle Like");
    let like: Like;
    like = {
      comment_id: comment.id,
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

  if (isLoading && comments == null) {
    return <p className="py-8 text-center text-sm text-[var(--yn-muted)]">Memuat percakapan…</p>;
  }

  if (comments == null || comments.length === 0) {
    return <p className="rounded-2xl border border-dashed border-[var(--yn-border)] px-5 py-8 text-center text-sm text-[var(--yn-muted)]">{discussionMode ? "Belum ada tanggapan. Kamu bisa memulai percakapan dengan hangat." : "Belum ada pertanyaan. Jadilah yang pertama bertanya."}</p>;
  }

  return (
    <div className="grid gap-3">
      <EventWebsocket></EventWebsocket>
      {comments.map((comment) => (
        <article key={comment.id} className="rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-4 transition-colors hover:border-[var(--yn-accent)] sm:p-5">
          <div className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-sm font-bold text-[var(--yn-accent)]" aria-hidden="true">
              {comment.user?.username?.charAt(0)?.toUpperCase() ?? "T"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="font-semibold text-[var(--yn-foreground)]">{comment.user?.username ?? "Teman YukNgaji"}</h3>
                <time className="text-xs text-[var(--yn-muted)]">
                {formatStrToDateTime(
                  comment.created_at!,
                  "dd MMM yyyy, HH:mm",
                  true
                )}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--yn-foreground)]">{comment.comment}</p>
              <div className="mt-4 flex items-center gap-4">
                {discussionMode && onReply ? <button type="button" onClick={() => onReply(comment)} className="text-xs font-semibold text-[var(--yn-accent)] hover:underline">Tanggapi</button> : null}
                <button type="button" onClick={() => handleLike(comment)} aria-pressed={Boolean(isLiked(comment.id))} className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${isLiked(comment.id) ? "text-red-600" : "text-[var(--yn-muted)] hover:text-[var(--yn-foreground)]"}`}>
                  <svg className="size-4" fill={isLiked(comment.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 11.1C19.8 16.1 12 20.5 12 20.5S4.2 16.1 3.2 11.1C2.2 6.1 5.1 3.5 8 3.5a4.4 4.4 0 0 1 4 2 4.4 4.4 0 0 1 4-2c2.9 0 5.8 2.6 4.8 7.6Z" /></svg>
                  {comment.like > 0 ? `${comment.like} suka` : "Suka"}
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default QnaList;
