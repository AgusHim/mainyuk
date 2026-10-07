"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  adjustVariantStock,
  createVariant,
  updateVariant,
} from "@/redux/slices/shopAdminSlice";
import { ProductVariant, VariantStatus } from "@/types/shop";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  productId: string;
  variant?: ProductVariant | null;
  /** Dipanggil setelah perubahan tersimpan, untuk memuat ulang daftar. */
  onChanged?: () => void;
  onDone?: () => void;
}

export default function FormShopVariant({
  productId,
  variant,
  onChanged,
  onDone,
}: Props) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.shopAdmin.loading);

  const [size, setSize] = useState(variant?.size ?? "");
  const [color, setColor] = useState(variant?.color ?? "");
  const [sku, setSku] = useState(variant?.sku ?? "");
  const [price, setPrice] = useState(
    variant != null ? `${variant.price}` : ""
  );
  const [stock, setStock] = useState("0");
  const [status, setStatus] = useState<VariantStatus>(
    variant?.status ?? "active"
  );

  // Penyesuaian stok terpisah dari penyuntingan varian: server sengaja
  // mengabaikan `stock` pada UpdateVariant supaya buku besar stok tetap dapat
  // dipercaya. Satu-satunya jalan mengubah stok adalah lewat alasan.
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const priceValue = Number(price);
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      toast.error("Harga tidak boleh negatif");
      return;
    }
    if (size.trim() === "" && color.trim() === "") {
      toast.error("Isi minimal salah satu dari ukuran atau warna");
      return;
    }

    const payload = {
      size: size.trim(),
      color: color.trim(),
      sku: sku.trim(),
      price: priceValue,
      status,
      stock: variant ? undefined : Number(stock) || 0,
    };

    const action = variant
      ? dispatch(updateVariant({ id: variant.id, data: payload }))
      : dispatch(createVariant({ productId, data: payload }));

    action
      .unwrap()
      .then(() => {
        toast.success(variant ? "Varian diperbarui" : "Varian dibuat");
        onChanged?.();
        onDone?.();
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal menyimpan varian");
      });
  };

  const handleAdjust = () => {
    if (!variant) {
      return;
    }
    const deltaValue = Number(delta);
    if (!Number.isFinite(deltaValue) || deltaValue === 0) {
      toast.error("Penyesuaian stok tidak boleh nol");
      return;
    }
    if (reason.trim() === "") {
      toast.error("Alasan penyesuaian wajib diisi");
      return;
    }

    dispatch(
      adjustVariantStock({
        id: variant.id,
        data: { delta: deltaValue, reason: reason.trim(), note: note.trim() },
      })
    )
      .unwrap()
      .then(() => {
        setDelta("");
        setReason("");
        setNote("");
        toast.success("Stok disesuaikan");
        // Formulir tetap terbuka supaya penyesuaian berikutnya tidak perlu
        // membuka ulang; daftar di belakangnya saja yang dimuat ulang.
        onChanged?.();
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal menyesuaikan stok");
      });
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="variant-size" className="text-black">
              Ukuran
            </Label>
            <Input
              id="variant-size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="L"
              className="border-2 border-black"
            />
          </div>
          <div>
            <Label htmlFor="variant-color" className="text-black">
              Warna
            </Label>
            <Input
              id="variant-color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Merah"
              className="border-2 border-black"
            />
          </div>
        </div>
        <p className="text-xs text-black">
          Isi minimal salah satu. Kombinasi ukuran dan warna harus berbeda dari
          varian lain di produk ini.
        </p>

        <div>
          <Label htmlFor="variant-sku" className="text-black">
            SKU (opsional)
          </Label>
          <Input
            id="variant-sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="border-2 border-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="variant-price" className="text-black">
              Harga (Rp)
            </Label>
            <Input
              id="variant-price"
              type="number"
              min={0}
              step={1000}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="border-2 border-black"
            />
          </div>
          <div>
            <Label htmlFor="variant-status" className="text-black">
              Status
            </Label>
            <select
              id="variant-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as VariantStatus)}
              className="w-full rounded-md border-2 border-black px-3 py-2 text-black"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        {variant == null ? (
          <div>
            <Label htmlFor="variant-initial-stock" className="text-black">
              Stok awal
            </Label>
            <Input
              id="variant-initial-stock"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border-2 border-black"
            />
          </div>
        ) : (
          <p className="rounded-lg border-2 border-black bg-gray-2 p-3 text-xs text-black dark:bg-meta-4 dark:text-white">
            Stok saat ini {variant.stock}. Stok tidak diubah dari formulir ini —
            gunakan penyesuaian stok di bawah supaya perubahannya tercatat.
          </p>
        )}

        <div className="mt-2 flex justify-end gap-2">
          {onDone ? (
            <Button
              type="button"
              onClick={onDone}
              className="border-2 border-black bg-white text-black"
            >
              Tutup
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={isLoading}
            className="border-2 border-black bg-meta-3 text-white"
            style={{ boxShadow: "5px 5px 0px 0px #000000" }}
          >
            {isLoading ? "Menyimpan…" : "Simpan varian"}
          </Button>
        </div>
      </form>

      {variant ? (
        <div className="border-t-2 border-black pt-4">
          <h3 className="text-base font-semibold text-black dark:text-white">
            Penyesuaian stok
          </h3>
          <p className="mt-1 text-xs text-black dark:text-white">
            Isi angka positif untuk menambah (mis. 10) atau negatif untuk
            mengurangi (mis. -2). Alasan wajib dan tersimpan di buku besar stok.
          </p>

          <div className="mt-3 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="variant-stock-delta" className="text-black">
                  Perubahan
                </Label>
                <Input
                  id="variant-stock-delta"
                  type="number"
                  value={delta}
                  onChange={(e) => setDelta(e.target.value)}
                  placeholder="10"
                  className="border-2 border-black"
                />
              </div>
              <div>
                <Label htmlFor="variant-stock-note" className="text-black">
                  Catatan (opsional)
                </Label>
                <Input
                  id="variant-stock-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border-2 border-black"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="variant-stock-reason" className="text-black">
                Alasan
              </Label>
              <Input
                id="variant-stock-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Restok dari pemasok"
                className="border-2 border-black"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              onClick={handleAdjust}
              disabled={isLoading || reason.trim() === ""}
              className="border-2 border-black bg-meta-1 text-white disabled:opacity-50"
              style={{ boxShadow: "5px 5px 0px 0px #000000" }}
            >
              {isLoading ? "Menyimpan…" : "Sesuaikan stok"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
