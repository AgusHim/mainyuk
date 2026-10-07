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
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  confirmShopOrder,
  fulfillShopOrder,
  getAdminShopOrders,
  refundShopOrder,
  rejectShopOrder,
  setShopOrderShipping,
} from "@/redux/slices/shopAdminSlice";
import {
  FulfillmentStatus,
  PaymentStatus,
  ShopOrder,
  fulfillmentMethodLabel,
  fulfillmentStatusLabel,
  fulfillmentTargets,
  paymentStatusLabel,
} from "@/types/shop";
import { formatRupiah } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog/Dialog";

type Pending =
  | { kind: "confirm"; order: ShopOrder }
  | { kind: "reject"; order: ShopOrder }
  | { kind: "refund"; order: ShopOrder }
  | { kind: "shipping"; order: ShopOrder }
  | { kind: "fulfill"; order: ShopOrder; target: FulfillmentStatus };

const dialogTitle = (pending: Pending | null): string => {
  if (!pending) {
    return "";
  }
  switch (pending.kind) {
    case "confirm":
      return "Konfirmasi pembayaran";
    case "reject":
      return "Tolak pembayaran";
    case "refund":
      return "Kembalikan dana";
    case "shipping":
      return "Atur ongkir dan resi";
    default:
      return `Ubah pemenuhan menjadi ${fulfillmentStatusLabel(pending.target)}`;
  }
};

/**
 * Antrean pesanan merchandise.
 *
 * Dua status ditampilkan sebagai dua kolom terpisah: uang dan barang bergerak
 * dengan kecepatan berbeda. Tombol yang ditawarkan mengikuti status saat ini,
 * tetapi server tetap penentu akhir lewat tabel transisinya sendiri.
 */
const TableShopOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.shopAdmin.orders);
  const hasMore = useAppSelector((state) => state.shopAdmin.ordersHasMore);
  const isLoading = useAppSelector((state) => state.shopAdmin.loading);
  const error = useAppSelector((state) => state.shopAdmin.error);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState<
    FulfillmentStatus | ""
  >("");
  const [pending, setPending] = useState<Pending | null>(null);
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [tracking, setTracking] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const list = orders ?? [];

  const reload = () =>
    dispatch(
      getAdminShopOrders({
        payment_status: paymentStatus,
        fulfillment_status: fulfillmentStatus,
        page: 1,
      })
    );

  const openDialog = (next: Pending) => {
    setPending(next);
    setReason("");
    setReference("");
    setProofUrl("");
    setTracking("");
    setPaidAmount(`${next.order.total}`);
    setShippingCost(`${next.order.shipping_cost}`);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    setPending(null);
    dialogRef.current?.close();
  };

  // Alasan wajib untuk keputusan yang menolak atau membatalkan; selebihnya
  // opsional, tetapi selalu tersimpan di jejak audit.
  const reasonRequired =
    pending?.kind === "reject" ||
    pending?.kind === "refund" ||
    (pending?.kind === "fulfill" && pending.target === "cancelled");

  const submit = () => {
    if (!pending) {
      return;
    }
    if (reasonRequired && reason.trim() === "") {
      toast.error("Alasan wajib diisi");
      return;
    }

    const done = (message: string) => () => {
      toast.success(message);
      closeDialog();
      reload();
    };
    const failed = (err: unknown) => {
      toast.error(typeof err === "string" ? err : "Gagal menyimpan tindakan");
    };

    switch (pending.kind) {
      case "confirm": {
        if (reference.trim() === "") {
          toast.error("Referensi transfer wajib diisi");
          return;
        }
        const amount = Number(paidAmount);
        dispatch(
          confirmShopOrder({
            id: pending.order.id,
            data: {
              paid_amount: Number.isFinite(amount) ? amount : undefined,
              payment_reference: reference.trim(),
              proof_url: proofUrl.trim() === "" ? undefined : proofUrl.trim(),
              reason: reason.trim() === "" ? undefined : reason.trim(),
            },
          })
        )
          .unwrap()
          .then(done("Pembayaran dikonfirmasi"))
          .catch(failed);
        return;
      }
      case "reject":
        dispatch(
          rejectShopOrder({ id: pending.order.id, data: { reason: reason.trim() } })
        )
          .unwrap()
          .then(done("Pembayaran ditolak"))
          .catch(failed);
        return;
      case "refund":
        dispatch(
          refundShopOrder({ id: pending.order.id, data: { reason: reason.trim() } })
        )
          .unwrap()
          .then(done("Dana dikembalikan"))
          .catch(failed);
        return;
      case "shipping": {
        const cost = Number(shippingCost);
        if (!Number.isFinite(cost) || cost < 0) {
          toast.error("Ongkos kirim tidak boleh negatif");
          return;
        }
        dispatch(
          setShopOrderShipping({
            id: pending.order.id,
            data: {
              shipping_cost: cost,
              tracking_number: tracking.trim() === "" ? undefined : tracking.trim(),
            },
          })
        )
          .unwrap()
          .then(done("Ongkir dan resi tersimpan"))
          .catch(failed);
        return;
      }
      case "fulfill":
        dispatch(
          fulfillShopOrder({
            id: pending.order.id,
            data: {
              status: pending.target,
              reason: reason.trim() === "" ? undefined : reason.trim(),
            },
          })
        )
          .unwrap()
          .then(done("Status pemenuhan tersimpan"))
          .catch(failed);
        return;
    }
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
        Pesanan merchandise
      </h2>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-56">
          <Select
            value={paymentStatus === "" ? "all" : paymentStatus}
            onValueChange={(value) => {
              const next = value === "all" ? "" : (value as PaymentStatus);
              setPaymentStatus(next);
              dispatch(
                getAdminShopOrders({
                  payment_status: next,
                  fulfillment_status: fulfillmentStatus,
                  page: 1,
                })
              );
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark">
              <SelectValue placeholder="Status pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Menunggu pembayaran</SelectItem>
              <SelectItem value="paid">Dibayar</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="refunded">Dana dikembalikan</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-56">
          <Select
            value={fulfillmentStatus === "" ? "all" : fulfillmentStatus}
            onValueChange={(value) => {
              const next =
                value === "all" ? "" : (value as FulfillmentStatus);
              setFulfillmentStatus(next);
              dispatch(
                getAdminShopOrders({
                  payment_status: paymentStatus,
                  fulfillment_status: next,
                  page: 1,
                })
              );
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark">
              <SelectValue placeholder="Status pemenuhan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unfulfilled">Belum diproses</SelectItem>
              <SelectItem value="ready_for_pickup">Siap diambil</SelectItem>
              <SelectItem value="shipped">Dikirim</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={reload}
          className="h-11 border-2 border-black bg-meta-3 text-white hover:bg-opacity-90"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Muat ulang
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="mb-3 w-full table-auto">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[190px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Pesanan
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Pembayaran
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Pemenuhan
              </th>
              <th className="min-w-[110px] py-4 px-4 font-medium text-black dark:text-white">
                Total
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
                  {isLoading ? "Memuat…" : "Belum ada pesanan pada filter ini."}
                </td>
              </tr>
            ) : (
              list.map((order) => (
                <tr key={order.id}>
                  <td className="border-b border-black py-4 px-4 xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {order.public_id}
                    </p>
                    <p className="mt-1 text-xs text-black dark:text-white">
                      {order.recipient_name || "tanpa nama"} ·{" "}
                      {formatStrToDateTime(order.created_at, "dd MMM yyyy HH:mm")}
                    </p>
                    <p className="mt-1 text-xs text-black dark:text-white">
                      {fulfillmentMethodLabel(order.fulfillment_method)}
                      {order.tracking_number
                        ? ` · resi ${order.tracking_number}`
                        : ""}
                    </p>
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {paymentStatusLabel(order.payment_status)}
                    {order.paid_amount != null ? (
                      <span className="mt-1 block text-xs">
                        dibayar {formatRupiah(order.paid_amount)}
                      </span>
                    ) : null}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {fulfillmentStatusLabel(order.fulfillment_status)}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {formatRupiah(order.total)}
                    {order.shipping_cost > 0 ? (
                      <span className="mt-1 block text-xs">
                        ongkir {formatRupiah(order.shipping_cost)}
                      </span>
                    ) : null}
                  </td>
                  <td className="border-b border-black py-4 px-4">
                    <div className="flex flex-wrap gap-2">
                      {order.payment_status === "pending" &&
                      order.fulfillment_status !== "cancelled" ? (
                        <>
                          <Button
                            type="button"
                            onClick={() => openDialog({ kind: "confirm", order })}
                            className="h-9 border-2 border-black bg-success text-white hover:bg-opacity-90"
                            style={{ boxShadow: "5px 5px 0px #000000" }}
                          >
                            Konfirmasi
                          </Button>
                          <Button
                            type="button"
                            onClick={() => openDialog({ kind: "reject", order })}
                            className="h-9 border-2 border-black bg-danger text-white hover:bg-opacity-90"
                            style={{ boxShadow: "5px 5px 0px #000000" }}
                          >
                            Tolak
                          </Button>
                        </>
                      ) : null}

                      {order.payment_status === "paid" &&
                      order.fulfillment_status !== "cancelled" &&
                      order.fulfillment_status !== "completed" ? (
                        <Button
                          type="button"
                          onClick={() => openDialog({ kind: "refund", order })}
                          className="h-9 border-2 border-black bg-meta-1 text-white hover:bg-opacity-90"
                          style={{ boxShadow: "5px 5px 0px #000000" }}
                        >
                          Refund
                        </Button>
                      ) : null}

                      {order.fulfillment_method === "shipping" &&
                      order.fulfillment_status !== "cancelled" &&
                      order.fulfillment_status !== "completed" ? (
                        <Button
                          type="button"
                          onClick={() => openDialog({ kind: "shipping", order })}
                          className="h-9 border-2 border-black bg-white text-black hover:bg-opacity-90"
                          style={{ boxShadow: "5px 5px 0px #000000" }}
                        >
                          Ongkir
                        </Button>
                      ) : null}

                      {order.payment_status === "paid"
                        ? fulfillmentTargets(
                            order.fulfillment_method,
                            order.fulfillment_status
                          ).map((target) => (
                            <Button
                              key={target}
                              type="button"
                              onClick={() =>
                                openDialog({ kind: "fulfill", order, target })
                              }
                              className="h-9 border-2 border-black bg-primary text-white hover:bg-opacity-90"
                              style={{ boxShadow: "5px 5px 0px #000000" }}
                            >
                              {fulfillmentStatusLabel(target)}
                            </Button>
                          ))
                        : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {hasMore ? (
          <p className="pb-4 text-center text-sm text-black dark:text-white">
            Masih ada pesanan lain. Persempit filter untuk melihatnya.
          </p>
        ) : null}

        <Dialog
          toggleDialog={closeDialog}
          ref={dialogRef}
          title="Tindakan pesanan"
        >
          <h3 className="text-lg font-bold text-black dark:text-white">
            {dialogTitle(pending)}
          </h3>

          {pending?.kind === "confirm" ? (
            <div className="grid gap-3 py-3">
              <div>
                <Label className="text-black">Nominal diterima (Rp)</Label>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="h-11 border-2 border-black"
                />
                <p className="mt-1 text-xs text-black">
                  Harus sama dengan total {formatRupiah(pending.order.total)}.
                  Nominal berbeda ditolak server.
                </p>
              </div>
              <div>
                <Label className="text-black">Referensi transfer</Label>
                <Input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Nomor referensi / nama pengirim"
                  className="h-11 border-2 border-black"
                />
              </div>
              <div>
                <Label className="text-black">URL bukti (opsional)</Label>
                <Input
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://…"
                  className="h-11 border-2 border-black"
                />
              </div>
              <div>
                <Label className="text-black">Catatan (opsional)</Label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-11 border-2 border-black"
                />
              </div>
            </div>
          ) : null}

          {pending?.kind === "shipping" ? (
            <div className="grid gap-3 py-3">
              <div>
                <Label className="text-black">Ongkos kirim (Rp)</Label>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="h-11 border-2 border-black"
                />
                <p className="mt-1 text-xs text-black">
                  Hanya bisa diubah selama pembayaran belum dikonfirmasi.
                </p>
              </div>
              <div>
                <Label className="text-black">Nomor resi (opsional)</Label>
                <Input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  className="h-11 border-2 border-black"
                />
              </div>
            </div>
          ) : null}

          {pending != null &&
          pending.kind !== "confirm" &&
          pending.kind !== "shipping" ? (
            <div className="py-3">
              <Label className="text-black">
                Alasan {reasonRequired ? "(wajib)" : "(opsional)"}
              </Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Alasan tindakan"
                className="h-11 border-2 border-black"
              />
              {pending.kind === "refund" ? (
                <p className="mt-1 text-xs text-black">
                  Stok dikembalikan dan XP yang pernah diberikan dibatalkan.
                </p>
              ) : null}
              {pending.kind === "fulfill" && pending.target === "cancelled" ? (
                <p className="mt-1 text-xs text-black">
                  Membatalkan pesanan yang sudah dibayar mengembalikan stok dan
                  membatalkan XP-nya.
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              disabled={isLoading}
              onClick={submit}
              className="h-10 border-2 border-black bg-primary text-white hover:bg-opacity-90 disabled:opacity-50"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Simpan
            </Button>
            <Button
              type="button"
              onClick={closeDialog}
              className="h-10 border-2 border-black bg-success text-white hover:bg-success/80"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Batal
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default TableShopOrders;
