"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  deleteProduct,
  getAdminProducts,
  setProductStatus,
} from "@/redux/slices/shopAdminSlice";
import {
  ProductStatus,
  ProductVariant,
  ProductView,
  productStatusLabel,
  variantStatusLabel,
} from "@/types/shop";
import { formatRupiah } from "@/utils/currency";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog/Dialog";
import FormShopProduct from "../Form/FormShopProduct";
import FormShopVariant from "../Form/FormShopVariant";

// Perpindahan status yang sah, sama persis dengan CanTransitionProduct di
// server. Server tetap penentu akhir; daftar ini hanya supaya tombol yang
// ditawarkan tidak pernah menawarkan perpindahan yang pasti ditolak.
const statusTargets = (from: ProductStatus): ProductStatus[] => {
  switch (from) {
    case "draft":
      return ["published", "archived"];
    case "published":
      return ["draft", "archived"];
    case "archived":
      return ["draft"];
    default:
      return [];
  }
};

const targetLabel = (target: ProductStatus): string => {
  switch (target) {
    case "published":
      return "Terbitkan";
    case "draft":
      return "Jadikan draf";
    default:
      return "Arsipkan";
  }
};

type StatusPending = {
  product: ProductView;
  target: ProductStatus;
};

const TableShopProducts = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.shopAdmin.products);
  const isLoading = useAppSelector((state) => state.shopAdmin.loading);
  const error = useAppSelector((state) => state.shopAdmin.error);

  const [status, setStatus] = useState<ProductStatus | "">("");
  const [editing, setEditing] = useState<ProductView | null>(null);
  const [statusPending, setStatusPending] = useState<StatusPending | null>(null);
  const [deletePending, setDeletePending] = useState<ProductView | null>(null);
  const [variantProductId, setVariantProductId] = useState<string | null>(null);
  const [variantFormFor, setVariantFormFor] = useState<
    ProductVariant | null | "new"
  >(null);
  const [reason, setReason] = useState("");

  const productDialogRef = useRef<HTMLDialogElement>(null);
  const statusDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const variantDialogRef = useRef<HTMLDialogElement>(null);

  const list = products ?? [];
  // Produk varian diambil dari daftar, bukan disalin ke state: setelah daftar
  // dimuat ulang, dialog varian harus menampilkan isi yang baru — bukan
  // potret lama saat dialog dibuka.
  const variantProduct =
    list.find((product) => product.id === variantProductId) ?? null;

  // Memuat ulang dengan filter yang sedang aktif, supaya daftar dan pilihan
  // pada Select tidak pernah menunjuk hal yang berbeda.
  const reload = () => dispatch(getAdminProducts({ status, page: 1 }));

  const openProductDialog = (product: ProductView | null) => {
    setEditing(product);
    productDialogRef.current?.showModal();
  };

  const closeProductDialog = () => {
    setEditing(null);
    productDialogRef.current?.close();
  };

  const openStatusDialog = (product: ProductView, target: ProductStatus) => {
    setStatusPending({ product, target });
    setReason("");
    statusDialogRef.current?.showModal();
  };

  const closeStatusDialog = () => {
    setStatusPending(null);
    setReason("");
    statusDialogRef.current?.close();
  };

  const submitStatus = () => {
    if (!statusPending) {
      return;
    }
    dispatch(
      setProductStatus({
        id: statusPending.product.id,
        data: {
          status: statusPending.target,
          reason: reason.trim() === "" ? undefined : reason.trim(),
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Status produk tersimpan");
        // Perpindahan status dapat membuat produk keluar dari filter yang
        // sedang aktif, jadi daftarnya dimuat ulang alih-alih ditambal.
        reload();
        closeStatusDialog();
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal mengubah status");
      });
  };

  const openDeleteDialog = (product: ProductView) => {
    setDeletePending(product);
    deleteDialogRef.current?.showModal();
  };

  const closeDeleteDialog = () => {
    setDeletePending(null);
    deleteDialogRef.current?.close();
  };

  const submitDelete = () => {
    if (!deletePending) {
      return;
    }
    dispatch(deleteProduct(deletePending.id))
      .unwrap()
      .then(() => {
        toast.success("Produk dihapus");
        closeDeleteDialog();
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal menghapus produk");
      });
  };

  const openVariantDialog = (product: ProductView) => {
    setVariantProductId(product.id);
    setVariantFormFor(null);
    variantDialogRef.current?.showModal();
  };

  const closeVariantDialog = () => {
    setVariantProductId(null);
    setVariantFormFor(null);
    variantDialogRef.current?.close();
  };

  if (error != null) {
    return (
      <div
        role="alert"
        className="flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
      >
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Katalog merchandise
      </h2>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-60">
          <Select
            value={status === "" ? "all" : status}
            onValueChange={(value) => {
              const next = value === "all" ? "" : (value as ProductStatus);
              setStatus(next);
              dispatch(getAdminProducts({ status: next, page: 1 }));
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draf</SelectItem>
              <SelectItem value="published">Terbit</SelectItem>
              <SelectItem value="archived">Diarsipkan</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          onClick={() => openProductDialog(null)}
          className="h-11 border-2 border-black bg-meta-3 text-white hover:bg-opacity-90"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Tambah produk
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="mb-3 w-full table-auto">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Produk
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Harga
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Tersedia
              </th>
              <th className="min-w-[110px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  {isLoading ? "Memuat…" : "Belum ada produk pada filter ini."}
                </td>
              </tr>
            ) : (
              list.map((product) => (
                <tr key={product.id}>
                  <td className="border-b border-black py-4 px-4 xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-black dark:text-white">
                      /{product.slug} · {product.variants.length} varian
                    </p>
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {product.min_price === product.max_price
                      ? formatRupiah(product.min_price)
                      : `${formatRupiah(product.min_price)} – ${formatRupiah(
                          product.max_price
                        )}`}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {product.available}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {productStatusLabel(product.status)}
                  </td>
                  <td className="border-b border-black py-4 px-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={() => openVariantDialog(product)}
                        className="h-9 border-2 border-black bg-white text-black hover:bg-opacity-90"
                        style={{ boxShadow: "5px 5px 0px #000000" }}
                      >
                        Varian
                      </Button>
                      <Button
                        type="button"
                        onClick={() => openProductDialog(product)}
                        className="h-9 border-2 border-black bg-primary text-white hover:bg-opacity-90"
                        style={{ boxShadow: "5px 5px 0px #000000" }}
                      >
                        Ubah
                      </Button>
                      {statusTargets(product.status).map((target) => (
                        <Button
                          key={target}
                          type="button"
                          onClick={() => openStatusDialog(product, target)}
                          className="h-9 border-2 border-black bg-meta-3 text-white hover:bg-opacity-90"
                          style={{ boxShadow: "5px 5px 0px #000000" }}
                        >
                          {targetLabel(target)}
                        </Button>
                      ))}
                      <Button
                        type="button"
                        onClick={() => openDeleteDialog(product)}
                        className="h-9 border-2 border-black bg-danger text-white hover:bg-opacity-90"
                        style={{ boxShadow: "5px 5px 0px #000000" }}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Dialog
          toggleDialog={closeProductDialog}
          ref={productDialogRef}
          title="Formulir produk"
        >
          <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
            {editing ? "Ubah produk" : "Produk baru"}
          </h3>
          <FormShopProduct
            product={editing}
            onChanged={reload}
            onDone={closeProductDialog}
          />
        </Dialog>

        <Dialog
          toggleDialog={closeStatusDialog}
          ref={statusDialogRef}
          title="Ubah status produk"
        >
          <h3 className="text-lg font-bold text-black dark:text-white">
            {statusPending ? targetLabel(statusPending.target) : ""}
          </h3>
          <p className="py-2 text-sm text-black dark:text-white">
            Alasan opsional, tetapi tersimpan di jejak audit.
          </p>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Alasan perubahan status"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              disabled={isLoading}
              onClick={submitStatus}
              className="h-10 border-2 border-black bg-primary text-white hover:bg-opacity-90 disabled:opacity-50"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Simpan
            </Button>
            <Button
              type="button"
              onClick={closeStatusDialog}
              className="h-10 border-2 border-black bg-success text-white hover:bg-success/80"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Batal
            </Button>
          </div>
        </Dialog>

        <Dialog
          toggleDialog={closeDeleteDialog}
          ref={deleteDialogRef}
          title="Hapus produk"
        >
          <h3 className="text-lg font-bold text-black dark:text-white">
            Hapus produk
          </h3>
          <p className="py-2 text-sm text-black dark:text-white">
            {deletePending?.name} tidak akan tampil lagi di katalog. Produk
            dihapus lunak: pesanan lama yang menunjuk ke produk ini tetap utuh
            karena nama dan harganya sudah tersimpan di baris pesanan.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              disabled={isLoading}
              onClick={submitDelete}
              className="h-10 border-2 border-black bg-danger text-white hover:bg-opacity-90 disabled:opacity-50"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Hapus
            </Button>
            <Button
              type="button"
              onClick={closeDeleteDialog}
              className="h-10 border-2 border-black bg-success text-white hover:bg-success/80"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Batal
            </Button>
          </div>
        </Dialog>

        <Dialog
          toggleDialog={closeVariantDialog}
          ref={variantDialogRef}
          title="Varian produk"
          contentClassName="border-2 border-black bg-white p-6 shadow-[8px_8px_0_0_#000000] dark:border-strokedark dark:bg-boxdark-2 sm:max-w-2xl"
        >
          <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
            Varian · {variantProduct?.name}
          </h3>

          {variantFormFor === null ? (
            <>
              {variantProduct != null && variantProduct.variants.length === 0 ? (
                <p className="pb-3 text-sm text-black dark:text-white">
                  Produk tanpa varian belum bisa dijual. Tambahkan minimal satu.
                </p>
              ) : (
                <div className="grid gap-2 pb-3">
                  {variantProduct?.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between gap-3 rounded-lg border-2 border-black bg-gray-2 p-3 dark:bg-meta-4"
                    >
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {variant.label === "" ? "Standar" : variant.label}
                        </p>
                        <p className="text-xs text-black dark:text-white">
                          {formatRupiah(variant.price)} · stok {variant.stock} ·
                          tersedia {variant.available} ·{" "}
                          {variantStatusLabel(variant.status)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setVariantFormFor(variant)}
                        className="h-9 border-2 border-black bg-primary text-white hover:bg-opacity-90"
                        style={{ boxShadow: "5px 5px 0px #000000" }}
                      >
                        Ubah
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setVariantFormFor("new")}
                  className="h-10 border-2 border-black bg-meta-3 text-white hover:bg-opacity-90"
                  style={{ boxShadow: "5px 5px 0px #000000" }}
                >
                  Tambah varian
                </Button>
                <Button
                  type="button"
                  onClick={closeVariantDialog}
                  className="h-10 border-2 border-black bg-white text-black hover:bg-opacity-90"
                  style={{ boxShadow: "5px 5px 0px #000000" }}
                >
                  Tutup
                </Button>
              </div>
            </>
          ) : variantProduct != null ? (
            <FormShopVariant
              productId={variantProduct.id}
              variant={variantFormFor === "new" ? null : variantFormFor}
              onChanged={reload}
              onDone={() => setVariantFormFor(null)}
            />
          ) : null}
        </Dialog>
      </div>
    </div>
  );
};

export default TableShopProducts;
