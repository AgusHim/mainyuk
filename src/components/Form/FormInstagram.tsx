"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  createInstagramPost,
  getAdminInstagramPosts,
  updateInstagramPost,
} from "@/redux/slices/instagramSlice";
import { CreateInstagramPost, InstagramMediaType } from "@/types/instagram";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  toggleDialog: () => void;
};

const FIELD_CLASS =
  "h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark";

// Select Radix menolak value kosong, jadi "belum diisi" diberi nilai sentinel
// yang dipetakan kembali ke null sebelum dikirim.
const NONE = "__none__";

// datetime-local menghasilkan "YYYY-MM-DDTHH:mm" tanpa offset, sedangkan server
// menuntut RFC3339 beroffset. Nilai lokal diberi +07:00 supaya tanggalnya tidak
// bergeser mengikuti zona server.
const toJakartaRFC3339 = (localValue: string): string | null => {
  if (!localValue) {
    return null;
  }
  return `${localValue}:00+07:00`;
};

const toLocalInput = (value?: string | null): string => {
  if (!value) {
    return "";
  }
  return value.slice(0, 16);
};

// Angka kosong berarti "tidak diketahui" (null), bukan nol. Nol asli dari
// Instagram tetap dikirim sebagai 0 dan tetap tampil di kartu.
const toOptionalNumber = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

const FormInstagram: React.FC<Props> = ({ toggleDialog }) => {
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.instagram.adminPost);
  const isLoading = useAppSelector((state) => state.instagram.loading);

  const [formData, setFormData] = useState({
    username: post?.username ?? "",
    media_url: post?.media_url ?? "",
    thumbnail_url: post?.thumbnail_url ?? "",
    permalink: post?.permalink ?? "",
    caption: post?.caption ?? "",
    media_type: (post?.media_type ?? NONE) as InstagramMediaType | typeof NONE,
    like_count: post?.like_count != null ? String(post.like_count) : "",
    comments_count:
      post?.comments_count != null ? String(post.comments_count) : "",
    posted_at: toLocalInput(post?.posted_at),
    is_published: post?.is_published ?? false,
    sort_order: post?.sort_order ?? 0,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload: CreateInstagramPost = {
      username: formData.username,
      media_url: formData.media_url,
      thumbnail_url: formData.thumbnail_url === "" ? null : formData.thumbnail_url,
      permalink: formData.permalink === "" ? null : formData.permalink,
      caption: formData.caption === "" ? null : formData.caption,
      media_type: formData.media_type === NONE ? null : formData.media_type,
      like_count: toOptionalNumber(formData.like_count),
      comments_count: toOptionalNumber(formData.comments_count),
      posted_at: toJakartaRFC3339(formData.posted_at),
      is_published: formData.is_published,
      sort_order: Number(formData.sort_order),
    };

    const action =
      post == null
        ? dispatch(createInstagramPost(payload))
        : dispatch(updateInstagramPost({ id: post.id, data: payload }));

    action
      .unwrap()
      .then(() => {
        toast.success(post == null ? "Postingan ditambahkan" : "Postingan diperbarui");
        toggleDialog();
        dispatch(getAdminInstagramPosts());
      })
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  return (
    <>
      <h3 className="text-2xl font-bold text-black dark:text-white">
        {post != null ? "Edit Postingan" : "Tambah Postingan"}
      </h3>
      <Separator className="my-2" />
      <form onSubmit={handleSubmit}>
        <div className="my-2 space-y-1.5">
          <Label htmlFor="username" className="font-bold text-black dark:text-white">
            Nama pengguna <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData.username}
            onChange={handleChange}
            type="text"
            name="username"
            placeholder="mis. yukngajisolo (tanpa @)"
            className={FIELD_CLASS}
            required
          />
        </div>

        <div className="my-2 space-y-1.5">
          <Label htmlFor="media_url" className="font-bold text-black dark:text-white">
            URL gambar <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData.media_url}
            onChange={handleChange}
            type="text"
            name="media_url"
            placeholder="https://… atau /images/…"
            className={FIELD_CLASS}
            required
          />
        </div>

        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="thumbnail_url"
            className="font-bold text-black dark:text-white"
          >
            URL thumbnail
          </Label>
          <Input
            value={formData.thumbnail_url}
            onChange={handleChange}
            type="text"
            name="thumbnail_url"
            placeholder="Hanya untuk video; kalau kosong dipakai URL gambar"
            className={FIELD_CLASS}
          />
        </div>

        <div className="my-2 space-y-1.5">
          <Label htmlFor="media_type" className="font-bold text-black dark:text-white">
            Jenis media
          </Label>
          <Select
            value={formData.media_type}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                media_type: value as InstagramMediaType | typeof NONE,
              })
            }
          >
            <SelectTrigger
              id="media_type"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Pilih jenis media" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Belum diisi</SelectItem>
              <SelectItem value="IMAGE">Foto</SelectItem>
              <SelectItem value="VIDEO">Video</SelectItem>
              <SelectItem value="CAROUSEL_ALBUM">Album</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="my-2 space-y-1.5">
          <Label htmlFor="caption" className="font-bold text-black dark:text-white">
            Keterangan
          </Label>
          {/* Belum ada primitif Textarea di components/ui, jadi textarea biasa
              dengan gaya yang sama seperti Input. */}
          <textarea
            value={formData.caption}
            onChange={handleChange}
            name="caption"
            rows={4}
            placeholder="Teks postingan; di kartu dipotong empat baris"
            className="w-full rounded-lg border-2 border-black bg-white px-4 py-3 text-sm font-medium outline-none placeholder:text-bodydark dark:border-strokedark dark:bg-boxdark dark:text-white"
          />
        </div>

        <div className="my-2 space-y-1.5">
          <Label htmlFor="permalink" className="font-bold text-black dark:text-white">
            Tautan postingan
          </Label>
          <Input
            value={formData.permalink}
            onChange={handleChange}
            type="text"
            name="permalink"
            placeholder="https://www.instagram.com/p/…"
            className={FIELD_CLASS}
          />
        </div>

        <div className="my-2 grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="like_count" className="font-bold text-black dark:text-white">
              Jumlah suka
            </Label>
            <Input
              value={formData.like_count}
              onChange={handleChange}
              type="number"
              min={0}
              name="like_count"
              placeholder="Kosong = tidak diketahui"
              className={FIELD_CLASS}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="comments_count"
              className="font-bold text-black dark:text-white"
            >
              Jumlah komentar
            </Label>
            <Input
              value={formData.comments_count}
              onChange={handleChange}
              type="number"
              min={0}
              name="comments_count"
              placeholder="Kosong = tidak diketahui"
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <p className="mt-1 text-xs text-bodydark">
          Dibiarkan kosong berarti angkanya tidak diketahui; kartu di landing
          page menyembunyikan barisnya. Isi 0 hanya kalau angkanya benar-benar nol.
        </p>

        <div className="my-2 grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="posted_at" className="font-bold text-black dark:text-white">
              Waktu unggah (WIB)
            </Label>
            <Input
              value={formData.posted_at}
              onChange={handleChange}
              type="datetime-local"
              name="posted_at"
              className={FIELD_CLASS}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sort_order" className="font-bold text-black dark:text-white">
              Urutan tampil
            </Label>
            <Input
              value={formData.sort_order}
              onChange={handleChange}
              type="number"
              name="sort_order"
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <label className="my-3 flex items-center gap-3 text-black dark:text-white">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="h-5 w-5 accent-black"
          />
          Terbitkan di landing page
        </label>

        <div className="my-2 mt-10">
          {isLoading ? (
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <Button
              type="submit"
              className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              {post == null ? "Tambah Postingan" : "Simpan Perubahan"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormInstagram;
