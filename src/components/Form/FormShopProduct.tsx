"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  createProduct,
  updateProduct,
} from "@/redux/slices/shopAdminSlice";
import { ProductView } from "@/types/shop";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  product?: ProductView | null;
  /** Dipanggil setelah perubahan tersimpan, untuk memuat ulang daftar. */
  onChanged?: () => void;
  onDone?: () => void;
}

// Foto diketik sebagai daftar URL, satu per baris. Aplikasi ini tidak punya
// kemampuan unggah berkas di mana pun, jadi gambar selalu berupa tautan —
// sama seperti bukti transfer donasi.
const parseUrls = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

export default function FormShopProduct({
  product,
  onChanged,
  onDone,
}: Props) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.shopAdmin.loading);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    product?.cover_image_url ?? ""
  );
  const [imageUrls, setImageUrls] = useState(
    (product?.images ?? []).map((image) => image.image_url).join("\n")
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (name.trim().length < 3) {
      toast.error("Nama produk minimal 3 huruf");
      return;
    }

    const payload = {
      name: name.trim(),
      // Slug dikosongkan berarti server menurunkannya dari nama.
      slug: slug.trim(),
      description: description.trim(),
      cover_image_url: coverImageUrl.trim(),
      image_urls: parseUrls(imageUrls),
    };

    const action = product
      ? dispatch(updateProduct({ id: product.id, data: payload }))
      : dispatch(createProduct(payload));

    action
      .unwrap()
      .then(() => {
        toast.success(product ? "Produk diperbarui" : "Produk dibuat");
        // Pemanggil yang memuat ulang daftarnya, supaya filter status yang
        // sedang aktif di tabel tidak ikut terbuang.
        onChanged?.();
        onDone?.();
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal menyimpan produk");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div>
        <Label htmlFor="product-name" className="text-black">
          Nama produk
        </Label>
        <Input
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-2 border-black"
        />
      </div>

      <div>
        <Label htmlFor="product-slug" className="text-black">
          Slug (opsional)
        </Label>
        <Input
          id="product-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="kaos-ynsolo"
          className="border-2 border-black"
        />
        <p className="mt-1 text-xs text-black">
          Hanya huruf kecil, angka, dan tanda hubung. Dikosongkan berarti
          diturunkan dari nama.
        </p>
      </div>

      <div>
        <Label htmlFor="product-description" className="text-black">
          Deskripsi
        </Label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border-2 border-black px-3 py-2 text-black"
        />
      </div>

      <div>
        <Label htmlFor="product-cover-image" className="text-black">
          URL foto utama
        </Label>
        <Input
          id="product-cover-image"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://…"
          className="border-2 border-black"
        />
      </div>

      <div>
        <Label className="text-black">URL foto tambahan</Label>
        <textarea
          value={imageUrls}
          onChange={(e) => setImageUrls(e.target.value)}
          rows={3}
          placeholder={"https://…\nhttps://…"}
          className="w-full rounded-md border-2 border-black px-3 py-2 text-black"
        />
        <p className="mt-1 text-xs text-black">
          Satu URL per baris. Daftar ini menggantikan seluruh galeri saat
          disimpan.
        </p>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        {onDone ? (
          <Button
            type="button"
            onClick={onDone}
            className="border-2 border-black bg-white text-black"
          >
            Batal
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={isLoading}
          className="border-2 border-black bg-meta-3 text-white"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          {isLoading ? "Menyimpan…" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
