"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventByCode } from "@/redux/slices/eventSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function IndexPage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.event.loading);
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: "20240102",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    dispatch(getEventByCode(formData.code))
      .unwrap()
      .then((res) => {
        if (res != null) {
          router.push(`/events/${res.slug}`);
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error fetching data:", error);
      });
  };
  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center">
        <Image
          className="mb-2"
          src={"/images/logo/yn_logo.png"}
          alt="Logo"
          width={176}
          height={32}
        />
        <p className="text-xl font-light 2xl:px-10">
          Taat bahagia maksiat sengsara
        </p>
        <form onSubmit={handleSubmit} className="flex flex-row items-center justify-center my-5 mt-10">
          <input
            onChange={handleChange}
            value={formData["code"]}
            className="p-2 mr-3"
            type="text"
            placeholder="Masukan Kode"
          />
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
          ) : (
            <button className="btn bg-primary text-white p-2 rounded-md ">
              Masuk
            </button>
          )}
        </form>
      </div>
    </>
  );
}
