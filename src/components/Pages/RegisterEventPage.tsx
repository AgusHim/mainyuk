"use client";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { FormEventHandler, useEffect, useState } from "react";
import { getEventDetail } from "@/redux/slices/eventSlice";
import Loader from "../common/Loader";
import { postPrecence } from "@/redux/slices/eventRegisterSlice";
import { User } from "@/types/user";
import { CreatePresence } from "@/types/presence";
import { useRouter } from "next/navigation";
import { setAuthUser } from "@/redux/slices/authSlice";

const RegisterEventPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const eventDetail = useAppSelector((state) => state.event.event);
  const isLoading = useAppSelector((state) => state.event.loading);
  const isPresenceLoading = useAppSelector(
    (state) => state.eventRegister.loading
  );

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "male",
    age: "0",
    address: "",
    phone: "",
  });

  const [errorValidation, setErrorValidation] = useState({
    name: "",
    age: "",
  });

  useEffect(() => {
    if (eventDetail == null && !isLoading) {
      dispatch(getEventDetail(params.slug));
    }
  }, [formData, errorValidation]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrorValidation((prevErrors) => ({
      ...prevErrors,
      name: formData["name"] === "" ? "Mohon isi Nama anda" : "",
      age: parseInt(formData["age"]) <= 0 ? "Mohon isi Umur anda" : "",
    }));
  };

  function validate(): boolean {
    setErrorValidation((prevErrors) => ({
      ...prevErrors,
      name: formData["name"] === "" ? "Mohon isi Nama anda" : "",
      age: parseInt(formData["age"]) <= 0 ? "Mohon isi Umur anda" : "",
    }));
    console.log("Errors = ",errorValidation);
    if (errorValidation["name"] !== "" || errorValidation["age"] !== "") {
      return false;
    } else {
      return true;
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const isValid = validate();
    if (!isValid) {
      return;
    }
    if(formData.name == "" || formData.age =="0"){
      return;
    }
    let createPresence: CreatePresence;
    createPresence = {
      event_id: eventDetail?.slug ?? "",
      user: formData as User,
    };

    dispatch(postPrecence(createPresence))
      .unwrap()
      .then((res) => {
        if (res != null) {
          dispatch(setAuthUser(res.user as User));
          router.replace(`/events/${params.slug}`);
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error fetching data:", error);
      });
  };

  if (isLoading) {
    return <Loader></Loader>;
  }

  if (event == null) {
    return <div></div>;
  }

  return (
    <>
      <div className="my-10 min-w-screen flex flex-col items-center justify-center">
        <div className="sm:w-2/3 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Form Daftar Hadir
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <Image
                className="mx-auto mb-5"
                width={300}
                height={300}
                alt="Gambar event"
                src={eventDetail?.image_url ?? ""}
                unoptimized={true}
              ></Image>
              <h1 className="flex w-full justify-center text-2xl font-bold text-black dark:text-white">
                {eventDetail?.title}
              </h1>
              <p className="flex w-full justify-center text-lg font-light text-black dark:text-white">
                {eventDetail?.speaker}
              </p>
              <div className="mt-4 mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nama <span className="text-meta-1">*</span>
                </label>
                <input
                  value={formData["name"]}
                  onChange={handleChange}
                  name="name"
                  type="text"
                  placeholder="Masukan nama kamu"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                {errorValidation["name"] != "" ? (
                  <p className="text-danger">{errorValidation["name"]}</p>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="mt-4 mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Username Q&A
                </label>
                <input
                  value={formData["username"]}
                  onChange={handleChange}
                  name="username"
                  type="text"
                  placeholder="Masukan nama untuk Q&A"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <p className="mt-1">
                  Optional bila kosong akan muncul "Anonim"
                </p>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Gender <span className="text-meta-1">*</span>
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    value={formData["gender"]}
                    onChange={handleChange}
                    name="gender"
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="male">Ikhwan</option>
                    <option value="female">Akhwat</option>
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Umur <span className="text-meta-1">*</span>
                </label>
                <input
                  value={formData["age"]}
                  onChange={handleChange}
                  name="age"
                  type="number"
                  placeholder="Masukan umur kamu"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                {errorValidation["age"] != "" ? (
                  <p className="text-danger">{errorValidation["age"]}</p>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Alamat
                </label>
                <input
                  value={formData["address"]}
                  onChange={handleChange}
                  name="address"
                  type="text"
                  placeholder="Masukan alamat kamu"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nomor Whatsapp
                </label>
                <input
                  value={formData["phone"]}
                  onChange={handleChange}
                  name="phone"
                  type="text"
                  placeholder="Masukan nomor Whatsapp kamu"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <p className="mt-1">
                  Optional untuk memberikan update info event selanjutnya
                </p>
              </div>
              {isPresenceLoading ? (
                <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              ) : (
                <button className="flex w-full justify-center rounded-3xl bg-primary p-3 mt-10 font-medium text-gray">
                  Simpan
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterEventPage;
