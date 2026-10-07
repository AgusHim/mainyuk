"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TablePaymentMethods from "@/components/Tables/TablePaymentMethods";
import DashboardLoader from "@/components/common/Loader/DashboardLoader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getPaymentMethod } from "@/redux/slices/PaymentMethodSlice";
import { useEffect } from "react";


const DashboardPaymentMethodsPage = () => {
    const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.paymentMethod.loading);
  const error = useAppSelector((state) => state.paymentMethod.error);


  useEffect(() => {
    if (!isLoading) {
      dispatch(getPaymentMethod());
    }
  }, []);

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <>
      <Breadcrumb pageName="Metode Pembayaran" />

      {error ? (
        <div
          role="alert"
          className="mb-5 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
        >
          <span>{error}</span>
        </div>
      ) : null}

        <TablePaymentMethods />
    </>
  );
};

export default DashboardPaymentMethodsPage;
