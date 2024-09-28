import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DashboardPaymentMethodsPage from "@/components/Pages/DashboardPaymentMethodsPage";
import TablePaymentMethods from "@/components/Tables/TablePaymentMethods";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Metode Pembayaran - YukNgaji Solo",
  description: "Halaman daftar methode pembayaran tiket event YukNgaji Solo",
  // other metadata
};

const PaymentMethodsPage = () => {
  return (
    <DashboardPaymentMethodsPage />
  );
};

export default PaymentMethodsPage;
