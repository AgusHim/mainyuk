"use client";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { FormEventHandler, useEffect, useState } from "react";
import { getEventDetail } from "@/redux/slices/eventSlice";
import { postPrecence } from "@/redux/slices/eventRegisterSlice";
import { User } from "@/types/user";
import { CreatePresence } from "@/types/presence";
import { useRouter } from "next/navigation";
import { setAuthUser } from "@/redux/slices/authSlice";
import DashboardLoader from "../common/Loader/DashboardLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsPraying } from "@fortawesome/free-solid-svg-icons";
import { formatStrToDateTime } from "@/utils/convert";
import ReadMoreParagraph from "../ReadMoreParagraph/ReadMoreParagraph";
import Loader from "../common/Loader";


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
    activity: "Pelajar",
  });

  const [errorValidation, setErrorValidation] = useState({
    name: "",
    phone: "",
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
      phone:
        formData["phone"].length < 9 ? "Mohon isi Nomor Whatsapp anda" : "",
      age: parseInt(formData["age"]) <= 0 ? "Mohon isi Umur anda" : "",
    }));
  };

  function validate(): boolean {
    setErrorValidation((prevErrors) => ({
      ...prevErrors,
      name: formData["name"] === "" ? "Mohon isi Nama anda" : "",
      phone:
        formData["phone"].length < 9 ? "Mohon isi Nomor Whatsapp anda" : "",
      age: parseInt(formData["age"]) <= 0 ? "Mohon isi Umur anda" : "",
    }));
    console.log("Errors = ", errorValidation);
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
    if (formData.name == "" || formData.age == "0") {
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
          dispatch(setAuthUser(res.presence.user as User));
          router.replace(`/events/${params.slug}`);
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error fetching data:", error);
      });
  };

  if (eventDetail == null || isLoading) {
    return <Loader></Loader>;
  }

  if (eventDetail?.close_at != null) {
    const closeAt = new Date(eventDetail?.close_at!);
    const startAt = new Date(eventDetail?.start_at!);
    if (closeAt < startAt) {
      return (
        <div className="min-w-screen min-h-screen flex flex-col md:flex-row items-center md:items-start">
          <div className="w-full md:w-1/4 h-1/2 mb-5 p-10 rounded-xl border-2 bg-white dark:bg-boxdark border-black shadow-bottom dark:border-black">
            <div className="flex flex-row items-center justify-center">
              <FontAwesomeIcon
                icon={faHandsPraying}
                className={"w-15 h-15 my-4 mr-4"}
                color="#7480FF"
              ></FontAwesomeIcon>
              <h1 className="text-black dark:text-white text-xl">
                Maaf, pendaftaran sudah ditutup{" "}
                <span className="font-bold text-black dark:text-white text-xl">
                  {formatStrToDateTime(
                    eventDetail?.close_at ?? "",
                    "dd MMMM yyyy HH:mm",
                    true
                  )}
                </span>
              </h1>
            </div>
          </div>
          <div className="w-full md:w-1/4 h-1/2 mb-5 p-10 rounded-xl border-2 bg-white dark:bg-boxdark border-black shadow-bottom dark:border-black">
            <Image
              className="w-full mb-5 rounded-xl shadow-bottom border-4 border-black"
              style={{ boxShadow: "10px 10px 0px 0px #000000" }}
              width={400}
              height={400}
              alt={`Image ${eventDetail?.title??''}`}
              src={eventDetail?.image_url ?? ""}
              unoptimized={true}
            />
            <h1 className="flex w-full justify-center text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white text-center">
              {eventDetail?.title}
            </h1>
            <p className="my-2 flex w-full justify-center text-md md:text-lg font-light text-center text-black dark:text-white">
              {eventDetail?.speaker}
            </p>
            <h1 className="mb-3 text-center text-sm md:text-md font-bold  text-black dark:text-white">
              {formatStrToDateTime(eventDetail?.start_at!, "dd MMM yyyy")} -{" "}
              {formatStrToDateTime(eventDetail.end_at!, "dd MMM yyyy")}
            </h1>
            <ReadMoreParagraph text={eventDetail.desc ?? ""} maxLength={200} />
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <div className="my-10 md:my-5 min-w-screen flex flex-col items-center justify-center">
        <div className="sm:w-2/3 rounded-xl border-2 border-black bg-white shadow-default dark:bg-boxdark shadow-bottom">
          <div className="border-b-2 border-black py-4 px-6.5">
            <h3 className="font-medium text-black dark:text-white">
              Form Daftar Hadir
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <Image
                className="mx-auto mb-5 rounded-xl border-4 border-black"
                style={{ boxShadow: "10px 10px 0px 0px #000000" }}
                width={300}
                height={300}
                alt="Gambar event"
                src={eventDetail?.image_url ?? ""}
                unoptimized={true}
              ></Image>
              <h1 className="flex w-full mt-3 justify-center text-2xl font-bold text-black dark:text-white">
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
                  className="w-full rounded border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                  required
                />
                {errorValidation["name"] != "" ? (
                  <p className="text-danger">{errorValidation["name"]}</p>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nomor Whatsapp <span className="text-meta-1">*</span>
                </label>
                <input
                  value={formData["phone"]}
                  onChange={handleChange}
                  name="phone"
                  type="text"
                  placeholder="Masukan nomor Whatsapp kamu"
                  className="w-full rounded border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                  required
                />
                {errorValidation["phone"] != "" ? (
                  <p className="text-danger">{errorValidation["phone"]}</p>
                ) : (
                  <div></div>
                )}
                <p className="mt-1">
                  Untuk memberikan update informasi event selanjutnya
                </p>
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
                  className="w-full rounded border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                />
                <p className="mt-1">
                  Optional bila kosong akan muncul "Anonim"
                </p>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Gender <span className="text-meta-1">*</span>
                </label>
                <div className="relative z-20 bg-transparent">
                  <select
                    value={formData["gender"]}
                    onChange={handleChange}
                    name="gender"
                    className="relative z-20 w-full appearance-none rounded border border-black bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
                    required
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
                  className="w-full rounded border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                  required
                />
                {errorValidation["age"] != "" ? (
                  <p className="text-danger">{errorValidation["age"]}</p>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Domisili
                </label>
                <input
                  value={formData["address"]}
                  onChange={handleChange}
                  name="address"
                  type="text"
                  placeholder="Masukan domisili kamu"
                  className="w-full rounded border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Aktifitas <span className="text-meta-1">*</span>
                </label>
                <div className="relative z-20 bg-transparent">
                  <select
                    value={formData["activity"]}
                    onChange={handleChange}
                    name="activity"
                    className="relative z-20 w-full appearance-none rounded border border-black bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
                    required
                  >
                    <option value="Pelajar">Pelajar</option>
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Bekerja">Bekerja</option>
                    <option value="Wirausaha">Wirausaha</option>
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
              {isPresenceLoading ? (
                <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              ) : (
                <button
                  className="flex w-full justify-center rounded-3xl bg-primary p-3 mt-10 font-medium text-gray border-2 border-black"
                  style={{ boxShadow: "5px 5px 0px 0px #000000" }}
                >
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
