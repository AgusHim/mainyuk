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
      className="block rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom"
    >
      <div className="flex items-center gap-2">
        {thread.author?.avatar_url ? (
          <Image
            src={thread.author.avatar_url}
            alt={thread.author.alias}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border-2 border-black object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white text-xs font-bold text-black">
            {thread.author?.alias?.charAt(0)?.toUpperCase() ?? "A"}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-black">
            {thread.author?.alias ?? "Anonim"}
          </p>
          <p className="text-xs text-black/70">
            {formatStrToDateTime(thread.created_at, "dd MMM yyyy HH:mm")}
          </p>
        </div>
        {sourceLabel ? (
          <span className="ml-auto whitespace-nowrap rounded-full border-2 border-black bg-white px-2 py-0.5 text-xs font-bold text-black">
            {sourceLabel}
          </span>
        ) : null}
      </div>

      <h2 className="mt-3 text-lg font-semibold text-black">{thread.title}</h2>
      {thread.excerpt ? (
        <p className="mt-1 line-clamp-3 text-sm text-black">{thread.excerpt}</p>
      ) : null}

      <div className="mt-3 flex items-center gap-4 text-xs font-bold text-black">
        <span>{thread.reaction_count} reaksi</span>
        <span>{thread.comment_count} komentar</span>
        {thread.is_mine ? (
          <span className="rounded-full border-2 border-black bg-primary px-2 py-0.5 text-white">
            Kiriman saya
          </span>
        ) : null}
      </div>
    </Link>
  );
};

export default ThreadCard;
