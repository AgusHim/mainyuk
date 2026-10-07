"use client";
import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getMyShopOrders } from "@/redux/slices/shopSlice";
import {
  fulfillmentMethodLabel,
  fulfillmentStatusLabel,
  paymentStatusLabel,
} from "@/types/shop";
import { formatRupiah } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

const ShopOrdersPage = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.shop.orders);
  const hasMore = useAppSelector((state) => state.shop.ordersHasMore);
  const isLoading = useAppSelector((state) => state.shop.loading);
  const error = useAppSelector((state) => state.shop.error);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getMyShopOrders({ page: 1 }));
  }, [dispatch]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    dispatch(getMyShopOrders({ page: next }));
  };

  return (
    <RequiredAuthLayout redirectTo={"/shop/orders"}>
      <MainLayout>
        <CommonHeader
          title="Pesanan Merchandise"
          isShowBack={true}
          isShowTrailing={false}
        />
        <div className="yn-container bg-yellow-400 p-4">
          <div className="mb-4 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
            <p className="text-sm text-black">
              Halaman ini khusus pesanan merchandise. Tiket event ada di{" "}
              <Link href="/orders" className="font-bold underline">
                Transaksi
              </Link>
              .
            </p>
          </div>

          {error != null ? (
            <div className="mb-4 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger">
              {error}
            </div>
          ) : null}

          {orders == null && isLoading ? (
            <p className="text-black">Memuat pesanan…</p>
          ) : orders != null && orders.length === 0 ? (
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <p className="text-black">
                Belum ada pesanan merchandise.
              </p>
              <Link
                href="/shop"
                className="mt-3 inline-block font-bold text-black underline"
              >
                Belanja dulu
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {orders?.map((order) => (
                <Link
                  key={order.id}
                  href={`/shop/orders/${order.public_id}`}
                  className="block rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-black">
                        {order.public_id}
                      </p>
                      <p className="text-xs text-black">
                        {formatStrToDateTime(
                          order.created_at,
                          "dd MMM yyyy HH:mm"
                        )}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-black">
                      {formatRupiah(order.total)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border-2 border-black bg-white px-3 py-0.5 text-xs font-bold text-black">
                      {paymentStatusLabel(order.payment_status)}
                    </span>
                    <span className="rounded-full border-2 border-black bg-white px-3 py-0.5 text-xs font-bold text-black">
                      {fulfillmentStatusLabel(order.fulfillment_status)}
                    </span>
                    <span className="rounded-full border-2 border-black bg-yellow-200 px-3 py-0.5 text-xs text-black">
                      {fulfillmentMethodLabel(order.fulfillment_method)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {hasMore ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoading}
              className="mt-3 w-full rounded-lg border-2 border-black bg-white py-2 text-sm font-bold text-black disabled:opacity-50"
            >
              {isLoading ? "Memuat…" : "Muat pesanan lain"}
            </button>
          ) : null}
        </div>
        <BottomNavBar />
      </MainLayout>
    </RequiredAuthLayout>
  );
};

export default ShopOrdersPage;
