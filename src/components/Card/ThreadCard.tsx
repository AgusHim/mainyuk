"use client";

import ThreadCommentList from "@/components/Thread/ThreadCommentList";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { applyReaction, applyUnreact, reactToThread, unreactToThread } from "@/redux/slices/threadSlice";
import { Thread, threadSourceLabel } from "@/types/thread";
import { formatStrToDateTime } from "@/utils/convert";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Props = { thread: Thread };

const ThreadCard = ({ thread }: Props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [showComments, setShowComments] = useState(false);
  const sourceLabel = threadSourceLabel(thread.source_type);

  const toggleReaction = async () => {
    if (!user) {
      toast.info("Masuk dulu untuk memberi reaksi");
      return;
    }
    const action = thread.reacted ? unreactToThread : reactToThread;
    dispatch(thread.reacted ? applyUnreact(thread.public_id) : applyReaction(thread.public_id));
    try { await dispatch(action(thread.public_id)).unwrap(); } catch { /* Interceptor menangani galat. */ }
  };

  return (
    <article className="bg-[var(--yn-surface)]">
      <Link href={`/community/${thread.public_id}`} className="group block px-5 pt-5 transition-colors hover:bg-[var(--yn-accent-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--yn-accent)]">
        <div className="flex items-center gap-3">
          {thread.author?.avatar_url ? <Image src={thread.author.avatar_url} alt={thread.author.alias} width={36} height={36} className="size-9 rounded-full object-cover" /> : <div className="flex size-9 items-center justify-center rounded-full bg-[var(--yn-surface-muted)] text-xs font-semibold text-[var(--yn-foreground)]">{thread.author?.alias?.charAt(0)?.toUpperCase() ?? "A"}</div>}
          <div className="min-w-0"><div className="flex min-w-0 items-center gap-2"><p className="truncate text-sm font-semibold text-[var(--yn-foreground)]">{thread.author?.alias ?? "Anonim"}</p>{thread.author?.level ? <span className="shrink-0 text-xs font-medium text-[var(--yn-accent-dark)]">Lv. {thread.author.level}</span> : null}</div><p className="text-xs text-[var(--yn-muted)]">{thread.author?.level_name ? `${thread.author.level_name} · ` : ""}{formatStrToDateTime(thread.created_at, "dd MMM yyyy · HH:mm")}</p></div>
          {sourceLabel ? <span className="ml-auto whitespace-nowrap text-xs font-medium text-[var(--yn-accent-dark)]">{sourceLabel}</span> : null}
        </div>
        {thread.source_type ? <h2 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-[var(--yn-foreground)]">{thread.title}</h2> : null}
        {thread.excerpt ? <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--yn-foreground)]">{thread.excerpt}</p> : null}
      </Link>

      <div className="flex items-center gap-5 px-5 py-4 text-sm">
        <button type="button" onClick={toggleReaction} className={`flex items-center gap-2 transition-colors ${thread.reacted ? "text-[var(--yn-accent-dark)]" : "text-[var(--yn-muted)] hover:text-[var(--yn-foreground)]"}`} aria-label={thread.reacted ? "Batalkan suka" : "Sukai kiriman"}><Heart className={`size-5 ${thread.reacted ? "fill-current" : ""}`} /><span>{thread.reaction_count}</span></button>
        <button type="button" onClick={() => setShowComments((open) => !open)} className={`flex items-center gap-2 transition-colors ${showComments ? "text-[var(--yn-accent-dark)]" : "text-[var(--yn-muted)] hover:text-[var(--yn-foreground)]"}`} aria-expanded={showComments} aria-controls={`comments-${thread.public_id}`}><MessageCircle className="size-5" /><span>{thread.comment_count}</span></button>
        {thread.is_mine ? <span className="ml-auto text-xs font-medium text-[var(--yn-accent-dark)]">Kiriman saya</span> : null}
      </div>

      {showComments ? <div id={`comments-${thread.public_id}`}><ThreadCommentList threadPublicId={thread.public_id} compact /></div> : null}
    </article>
  );
};

export default ThreadCard;
