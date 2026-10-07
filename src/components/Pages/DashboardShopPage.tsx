"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getAdminProducts,
  getAdminShopOrders,
  getShopAuditLogs,
} from "@/redux/slices/shopAdminSlice";
import { formatStrToDateTime } from "@/utils/convert";
import { useEffect } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import TableShopOrders from "../Tables/TableShopOrders";
import TableShopProducts from "../Tables/TableShopProducts";
import DashboardLoader from "../common/Loader/DashboardLoader";

// Aksi audit yang tidak dikenal ditampilkan apa adanya, supaya penambahan aksi
// baru di server tidak membuat barisnya hilang dari riwayat.
const actionLabel = (action: string): string => {
  switch (action) {
    case "product.create":
      return "Membuat produk";
    case "product.update":
      return "Mengubah produk";
    case "product.status":
      return "Mengubah status produk";
    case "product.delete":
      return "Menghapus produk";
    case "variant.create":
      return "Menambah varian";
    case "variant.update":
      return "Mengubah varian";
    case "variant.delete":
      return "Menghapus varian";
    case "stock.adjust":
      return "Menyesuaikan stok";
    case "shop_order.confirm":
      return "Mengonfirmasi pembayaran";
    case "shop_order.reject":
      return "Menolak pembayaran";
    case "shop_order.refund":
      return "Mengembalikan dana";
    case "shop_order.cancel":
      return "Membatalkan pesanan";
    case "shop_order.fulfill":
      return "Memproses pemenuhan";
    case "shop_order.shipping":
      return "Mengatur ongkir dan resi";
    default:
      return action;
  }
};

/**
 * Halaman pengelolaan toko.
 *
 * Peran diperiksa di sisi klien hanya untuk kenyamanan; server tetap penentu
 * akhir — setiap endpoint toko pengurus memeriksa izin `product:manage`.
 */
export default function DashboardShopPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const products = useAppSelector((state) => state.shopAdmin.products);
  const orders = useAppSelector((state) => state.shopAdmin.orders);
  const auditLogs = useAppSelector((state) => state.shopAdmin.auditLogs);
  const isLoading = useAppSelector((state) => state.shopAdmin.loading);
  const error = useAppSelector((state) => state.shopAdmin.error);

  const allowed = user?.role == "admin" || user?.role == "pj";

  useEffect(() => {
    if (!allowed) {
      return;
    }
    dispatch(getAdminProducts({ page: 1 }));
    dispatch(getAdminShopOrders({ page: 1 }));
    dispatch(getShopAuditLogs({ page: 1 }));
  }, [dispatch, allowed]);

  if (!allowed) {
    return (
      <>
        <Breadcrumb pageName="Toko" />
        <div className="rounded-sm border-2 border-black bg-white p-6 shadow-bottom dark:bg-boxdark">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            Tidak berizin
          </h1>
          <p className="mt-1 text-sm text-black dark:text-white">
            Halaman ini hanya untuk pengurus dengan izin pengelolaan produk.
          </p>
        </div>
      </>
    );
  }

  if (
    (products == null || products.length === 0) &&
    (orders == null || orders.length === 0) &&
    isLoading
  ) {
    return <DashboardLoader />;
  }

  return (
    <>
      <Breadcrumb pageName="Toko" />

      {error ? (
        <div
          role="alert"
          className="mb-5 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
        >
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-10">
        <TableShopProducts />
        <TableShopOrders />

        <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Riwayat tindakan toko
          </h2>
          {auditLogs.length === 0 ? (
            <p className="pb-4 text-sm text-black dark:text-white">
              {isLoading ? "Memuat…" : "Belum ada tindakan toko."}
            </p>
          ) : (
            <ul className="grid gap-2 pb-4">
              {auditLogs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-lg border-2 border-black bg-gray-2 p-3 dark:bg-meta-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-black dark:text-white">
                      {actionLabel(log.action)}
                    </p>
                    <p className="text-xs text-black dark:text-white">
                      {formatStrToDateTime(log.created_at, "dd MMM yyyy HH:mm")}
                    </p>
                  </div>
                  {log.reason ? (
                    <p className="mt-1 text-sm text-black dark:text-white">
                      Alasan: {log.reason}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
