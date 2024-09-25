"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TablePaymentMethods from "@/components/Tables/TablePaymentMethods";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getPaymentMethod } from "@/redux/slices/PaymentMethodSlice";
import { useEffect, useState, useRef } from "react";


const DashboardPaymentMethodsPage = () => {
    const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.paymentMethod.loading);
  const error = useAppSelector((state) => state.paymentMethod.error);


  useEffect(() => {
    if (!isLoading) {
      dispatch(getPaymentMethod());
    }
  }, []);

  
  return (
    <>
      <Breadcrumb pageName="Metode Pembayaran" />
        <TablePaymentMethods />
    </>
  );
};

export default DashboardPaymentMethodsPage;
