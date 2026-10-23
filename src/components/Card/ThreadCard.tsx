"use client";
import { Thread, threadSourceLabel } from "@/types/thread";
import { formatStrToDateTime } from "@/utils/convert";
import Image from "next/image";
import Link from "next/link";

type Props = {
  thread: Thread;
};

/**
 * Satu kiriman di daftar feed.
 *
 * Hanya `excerpt` yang ditampilkan, bukan `body`: daftar tidak perlu
 * mengangkut seluruh isi kiriman, dan server memang tidak mengirimkannya.
 * Penulis dirender apa adanya dari `thread.author` — bentuk itu sudah
 * dianonimkan server, jadi tidak ada nama akun yang bisa bocor dari sini.
 */
const ThreadCard = ({ thread }: Props) => {
  const sourceLabel = threadSourceLabel(thread.source_type);

  return (
    <Link
      href={`/community/${thread.public_id}`}
      className="group block bg-[var(--yn-surface)] p-5 transition-colors hover:bg-[var(--yn-accent-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yn-accent)]"
    >
      <div className="flex items-center gap-3">
        {thread.author?.avatar_url ? (
          <Image
            src={thread.author.avatar_url}
            alt={thread.author.alias}
            width={32}
            height={32}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--yn-surface-muted)] text-xs font-semibold text-[var(--yn-foreground)]">
            {thread.author?.alias?.charAt(0)?.toUpperCase() ?? "A"}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--yn-foreground)]">
            {thread.author?.alias ?? "Anonim"}
          </p>
          <p className="text-xs text-[var(--yn-muted)]">
            {formatStrToDateTime(thread.created_at, "dd MMM yyyy HH:mm")}
          </p>
        </div>
        {sourceLabel ? (
          <span className="ml-auto whitespace-nowrap text-xs font-medium text-[var(--yn-accent-dark)]">
            {sourceLabel}
          </span>
        ) : null}
      </div>

      {thread.source_type ? <h2 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-[var(--yn-foreground)]">{thread.title}</h2> : null}
      {thread.excerpt ? (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--yn-muted)]">{thread.excerpt}</p>
      ) : null}

      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-[var(--yn-muted)]">
        <span>{thread.reaction_count} reaksi</span>
        <span>{thread.comment_count} komentar</span>
        {thread.is_mine ? (
          <span className="text-[var(--yn-accent-dark)]">
            Kiriman saya
          </span>
        ) : null}
      </div>
    </Link>
  );
};

export default ThreadCard;
