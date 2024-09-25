"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import {
  getPaymentMethod,
  postPaymentMethod,
  putPaymentMethod,
} from "@/redux/slices/PaymentMethodSlice";
import { PaymentMethod } from "@/types/PaymentMethod";
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
      <h3 className="font-bold text-2xl text-black dark:text-white">
        {paymentMethod != null
          ? "Edit Metode Pembayaran"
          : "Tambah Metode Pembayaran"}
      </h3>
      <div className="divider"></div>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="name">
            <span className="label-text text-black dark:text-white">
              Nama <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["name"]}
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Masukan nama metode pembayaran"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          />
        </div>
        {/* End of Name */}

        {/* Type */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="type">
            <span className="label-text text-black dark:text-white">
              Tipe <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <select
            value={formData["type"]}
            onChange={handleChange}
            name="type"
            className="select select-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          >
            <option disabled>Pilih tipe pembayaran</option>
            <option value="bank">Bank</option>
            <option value="e-wallet">E-Wallet</option>
            <option value="qris">QR Code</option>
          </select>
        </div>
        {/* End of Type */}

        {/* Location */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="code">
            <span className="label-text text-black dark:text-white">Code</span>
          </label>
          <input
            value={formData["code"]}
            onChange={handleChange}
            type="text"
            name="code"
            placeholder="Masukan code pembayaran"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
          />
        </div>
        {/* End of Location */}

        {/* Account Name */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="account_name">
            <span className="label-text text-black dark:text-white">
              Nama Akun<span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["account_name"]}
            onChange={handleChange}
            type="text"
            name="account_name"
            placeholder="Masukan nama akun"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          />
        </div>
        {/* End of Account Number */}

        {/* Account Number */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="account_number">
            <span className="label-text text-black dark:text-white">
              Nomor Akun<span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["account_number"]}
            onChange={handleChange}
            type="text"
            name="account_number"
            placeholder="Masukan nomor akun"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          />
        </div>
        {/* End of Account Name */}

        <div className="form-control my-2 mt-10">
          {isLoading ? (
            <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <button
              type="submit"
              className="btn btn-primary text-white border-2 border-black"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              {paymentMethod == null
                ? "Tambah Metode Pembayaran"
                : "Simpan Perubahan"}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormPaymentMethod;
