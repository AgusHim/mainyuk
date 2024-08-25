"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventByCode } from "@/redux/slices/eventSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Header from "../Header/Header";
import { Carousel } from "flowbite-react";
import { HomeCarousel } from "../Carousel/HomeCarousel";
import { HomeFooter } from "../Footer/HomeFooter";
import HomeLinktree from "../Linktree/HomeLinktree";
import GridEvents from "../Grid/GridEvents";

export default function IndexPage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.event.loading);
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (formData.code.length < 3) {
      toast.error("Kode tidak valid", {
        className: "toast",
      });
      return;
    }
    dispatch(getEventByCode(formData.code))
      .unwrap()
      .then((res) => {
        if (res != null) {
          router.push(`/events/${res.slug}`);
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        toast.error("Maaf kode tidak aktif", {
          className: "toast",
        });
        console.error("Error fetching data:", error);
      });
  };
  return (
    <>
      <div className="bg-yellow-300">
        <div className="p-5 md:p-10 md:px-50">
          <HomeLinktree />
          <HomeCarousel />
          <GridEvents />
        </div>
        <HomeFooter />
      </div>
    </>
  );
}
