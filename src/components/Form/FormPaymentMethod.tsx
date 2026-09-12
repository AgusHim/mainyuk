"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import {
  getPaymentMethod,
  postPaymentMethod,
  putPaymentMethod,
} from "@/redux/slices/PaymentMethodSlice";
import { PaymentMethod } from "@/types/PaymentMethod";
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

type Props = {
  toggleDialog: () => void;
};

const FormPaymentMethod: React.FC<Props> = ({ toggleDialog }) => {
  const dispatch = useAppDispatch();

  const paymentMethod = useAppSelector(
    (state) => state.paymentMethod.paymentMethod
  );
  const isLoading = useAppSelector((state) => state.paymentMethod.loading);

  const [formData, setFormData] = useState({
    id: paymentMethod?.id ?? "",
    name: paymentMethod?.name ?? "",
    type: paymentMethod?.type ?? "bank",
    code: paymentMethod?.code ?? "",
    account_name: paymentMethod?.account_name ?? "",
    account_number: paymentMethod?.account_number ?? "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    var bodyData = {
      id: formData.id,
      name: formData.name,
      type: formData.type,
      code: formData.code,
      account_name: formData.account_name,
      account_number: formData.account_number,
    };

    if (paymentMethod == null) {
      dispatch(postPaymentMethod(bodyData as PaymentMethod))
        .unwrap()
        .then((res) => {
          if (res != null) {
            toggleDialog();
            dispatch(getPaymentMethod());
          }
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error("Error fetching data:", error);
        });
    } else {
      dispatch(putPaymentMethod(bodyData as PaymentMethod))
        .unwrap()
        .then((res) => {
          if (res != null) {
            toggleDialog();
            dispatch(getPaymentMethod());
          }
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error("Error fetching data:", error);
        });
    }
  };

  return (
    <>
      <h3 className="text-2xl font-bold text-black dark:text-white">
        {paymentMethod != null
          ? "Edit Metode Pembayaran"
          : "Tambah Metode Pembayaran"}
      </h3>
      <Separator className="my-2" />
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="name" className="font-bold text-black dark:text-white">
            Nama <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["name"]}
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Masukan nama metode pembayaran"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Name */}

        {/* Type */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="type" className="font-bold text-black dark:text-white">
            Tipe <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Select
            name="type"
            required
            value={formData["type"]}
            onValueChange={(value) =>
              handleChange({ target: { name: "type", value } })
            }
          >
            <SelectTrigger
              id="type"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Pilih tipe pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Bank</SelectItem>
              <SelectItem value="e-wallet">E-Wallet</SelectItem>
              <SelectItem value="qris">QR Code</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* End of Type */}

        {/* Code */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="code" className="font-bold text-black dark:text-white">
            Code
          </Label>
          <Input
            value={formData["code"]}
            onChange={handleChange}
            type="text"
            name="code"
            placeholder="Masukan code pembayaran"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
        </div>
        {/* End of Code */}

        {/* Account Name */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="account_name"
            className="font-bold text-black dark:text-white"
          >
            Nama Akun<span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["account_name"]}
            onChange={handleChange}
            type="text"
            name="account_name"
            placeholder="Masukan nama akun"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Account Name */}

        {/* Account Number */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="account_number"
            className="font-bold text-black dark:text-white"
          >
            Nomor Akun<span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["account_number"]}
            onChange={handleChange}
            type="text"
            name="account_number"
            placeholder="Masukan nomor akun"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Account Number */}

        <div className="my-2 mt-10">
          {isLoading ? (
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <Button
              type="submit"
              className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              {paymentMethod == null
                ? "Tambah Metode Pembayaran"
                : "Simpan Perubahan"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormPaymentMethod;
