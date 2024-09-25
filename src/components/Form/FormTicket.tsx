"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  putTicket,
  getTicketsByEventID,
  postTicket,
} from "@/redux/slices/ticketSlice";
import { Ticket } from "@/types/ticket";
type Props = {
  toggleDialog: () => void;
};

const FormTicket: React.FC<Props> = ({ toggleDialog }) => {
  const dispatch = useAppDispatch();

  const event = useAppSelector((state) => state.event.event);
  const ticket = useAppSelector((state) => state.ticket.ticket);
  const isLoadingTicket = useAppSelector((state) => state.ticket.loading);

  const [formData, setFormData] = useState({
    id: ticket?.id ?? "",
    name: ticket?.name ?? "",
    description: ticket?.description ?? "",
    visibility: ticket?.visibility ?? "public",
    price: ticket?.price ?? 0,
    min_order_pax: ticket?.min_order_pax ?? 1,
    max_order_pax: ticket?.max_order_pax ?? 1,
    max_pax: ticket?.max_pax ?? 1,
    pax_multiplier: ticket?.pax_multiplier ?? 1,
    start_at: ticket?.start_at!.replace("Z", ""),
    end_at: ticket?.end_at!.replace("Z", ""),
    gender_allowed: ticket?.gender_allowed ?? "both",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    var bodyData = {
      id: formData.id,
      event_id: event?.id ?? "",
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price.toString()),
      visibility: formData.visibility,
      gender_allowed: formData.gender_allowed,
      max_pax: parseInt(formData.max_pax.toString()),
      min_order_pax: parseInt(formData.min_order_pax.toString()),
      max_order_pax: parseInt(formData.max_order_pax.toString()),
      pax_multiplier: parseInt(formData.pax_multiplier.toString()),
      start_at: format(
        Date.parse(formData.start_at!.replace("Z", "")),
        "yyyy-MM-dd HH:mm"
      ).replace(" ", "T"),
      end_at: format(
        Date.parse(formData.end_at!.replace("Z", "")),
        "yyyy-MM-dd HH:mm"
      ).replace(" ", "T"),
    };

    if (ticket == null) {
      dispatch(postTicket(bodyData as Ticket))
        .unwrap()
        .then((res) => {
          if (res != null) {
            toggleDialog();
            dispatch(getTicketsByEventID(event?.id ?? ""));
          }
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error("Error fetching data:", error);
        });
    } else {
      dispatch(putTicket(bodyData as Ticket))
        .unwrap()
        .then((res) => {
          if (res != null) {
            toggleDialog();
            dispatch(getTicketsByEventID(event?.id ?? ""));
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
        {ticket != null ? "Edit Tiket" : "Tambah Tiket"}
      </h3>
      <div className="divider"></div>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="name">
            <span className="label-text text-black dark:text-white">
              Nama Tiket <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["name"]}
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Masukan nama lengkap ranger"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          />
        </div>
        {/* End of Name */}

        {/* Description */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="description">
            <span className="label-text text-black dark:text-white">
              Deskripsi Tiket <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["description"]}
            onChange={handleChange}
            type="text"
            name="description"
            placeholder="Masukan deskripsi tiket"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          />
        </div>
        {/* End of Description */}

        {/* GenderAllowed & Visibility */}
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-1/2 px-3 mb-6 md:mb-0">
            <label className="label font-bold" htmlFor="gender_allowed">
              <span className="label-text text-black dark:text-white">
                Gender Allowed <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <div className="relative">
              <select
                name="gender_allowed"
                value={formData["gender_allowed"]}
                onChange={handleChange}
                className="block appearance-none w-full select select-bordered bg-white dark:bg-boxdark focus:border-primary"
                id="grid-state"
              >
                <option value="both">Semua</option>
                <option value="male">Khusus Ikhwan</option>
                <option value="female">Khusus Akhwat</option>
              </select>
            </div>
          </div>
          <div className="w-1/2 px-3 mb-6 md:mb-0">
            <label className="label font-bold" htmlFor="visibility">
              <span className="label-text text-black dark:text-white">
                Visibility <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <div className="relative">
              <select
                name="visibility"
                value={formData["visibility"]}
                onChange={handleChange}
                className="block appearance-none w-full select select-bordered bg-white dark:bg-boxdark focus:border-primary"
                id="grid-state"
              >
                <option value="public">PUBLIC</option>
                <option value="draft">DRAFT</option>
                <option value="private">PRIVATE</option>
              </select>
            </div>
          </div>
        </div>
        {/* GenderAllowed & Visibility */}

        {/* Price */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="price">
            <span className="label-text text-black dark:text-white">
              Harga Tiket <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["price"]}
            onChange={handleChange}
            type="text"
            name="price"
            placeholder="Masukan harga tiket"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          />
        </div>
        {/* End of Price */}

        {/* Max Pax & Pax Multiplier */}
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-1/2 px-3 mb-6 md:mb-0">
            <label className="label font-bold" htmlFor="max_pax">
              <span className="label-text text-black dark:text-white">
                Maksimal Pax <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <input
              value={formData["max_pax"]}
              onChange={handleChange}
              type="text"
              name="max_pax"
              placeholder="Masukan maksimal pax"
              className="w-30 appearance-none block py-2 px-2 input input-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            />
          </div>
          <div className="w-1/2 px-3 mb-6 md:mb-0">
            <label className="label font-bold" htmlFor="pax_multiplier">
              <span className="label-text text-black dark:text-white">
                Pax Multiplier <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <input
              value={formData["pax_multiplier"]}
              onChange={handleChange}
              type="text"
              name="pax_multiplier"
              placeholder="Masukan maksimal pax perorder"
              className="w-30 appearance-none block input input-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            />
          </div>
        </div>
        {/* Max Pax & Pax Multiplier */}

        {/* Min & Max Order Pax */}
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-1/2 px-3 mb-6 md:mb-0">
            <label className="label font-bold" htmlFor="min_order_pax">
              <span className="label-text text-black dark:text-white">
                Min Order Pax <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <input
              value={formData["min_order_pax"]}
              onChange={handleChange}
              type="text"
              name="min_order_pax"
              placeholder="Masukan maksimal pax perorder"
              className="w-30 appearance-none block py-2 px-2 input input-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            />
          </div>
          <div className="w-1/2 px-3 mb-6 md:mb-0">
            <label className="label font-bold" htmlFor="max_order_pax">
              <span className="label-text text-black dark:text-white">
                Max Order Pax <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <input
              value={formData["max_order_pax"]}
              onChange={handleChange}
              type="text"
              name="max_order_pax"
              placeholder="Masukan maksimal pax perorder"
              className="w-30 appearance-none block py-2 px-2 input input-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            />
          </div>
        </div>
        {/* Min & Max Order Pax */}

        {/* Start At */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="start_at">
            <span className="label-text text-black dark:text-white">
              Jadwal Mulai <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["start_at"]}
            onChange={handleChange}
            type="datetime-local"
            name="start_at"
            placeholder="Jadwal mulai"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            min="2024-01-01T00:00"
            required
          />
        </div>
        {/* End of Start At */}

        {/* End At */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="end_at">
            <span className="label-text text-black dark:text-white">
              Jadwal Selesai <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["end_at"]}
            onChange={handleChange}
            type="datetime-local"
            name="end_at"
            placeholder="Jadwal selesai"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            min="2024-01-01T00:00"
            required
          />
        </div>
        {/* End of End At */}

        <div className="form-control my-2 mt-10">
          {isLoadingTicket ? (
            <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <button
              type="submit"
              className="btn btn-primary text-white border-2 border-black"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              {ticket == null ? "Tambah Tiket" : "Simpan Perubahan"}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormTicket;
