"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getDivisi } from "@/redux/slices/divisiSlice";
import { getRangers, postRanger } from "@/redux/slices/rangerSlice";
import { CreateRanger } from "@/types/ranger";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

interface FormProps {
  formRef: React.RefObject<HTMLDialogElement>;
}

const FormRanger: React.FC<FormProps> = ({ formRef }) => {
  const dispatch = useAppDispatch();
  const listDivisi = useAppSelector((state) => state.divisi.data);
  const isLoadingDivisi = useAppSelector((state) => state.divisi.loading);
  const isLoadingRanger = useAppSelector((state) => state.ranger.loading);

  useEffect(() => {
    if (listDivisi == null && !isLoadingDivisi) {
      dispatch(getDivisi());
    }
  }, []);
  const closeModal = () => {
    if (formRef.current) {
      formRef.current.close();
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "male",
    age: "",
    address: "",
    phone: "",
    activity: "Pelajar",
    email: "",
    password: "",
    divisi_id: "1",
  });

  const [errorValidation, setErrorValidation] = useState({
    name: "",
    phone: "",
    age: "",
  });

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

  //   function validate(): boolean {
  //     setErrorValidation((prevErrors) => ({
  //       ...prevErrors,
  //       name: formData["name"] === "" ? "Mohon isi Nama anda" : "",
  //       phone:
  //         formData["phone"].length < 9 ? "Mohon isi Nomor Whatsapp anda" : "",
  //       age: parseInt(formData["age"]) <= 0 ? "Mohon isi Umur anda" : "",
  //     }));
  //     console.log("Errors = ", errorValidation);
  //     if (errorValidation["name"] !== "" || errorValidation["age"] !== "") {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    var userData = {
      name: formData.name,
      username: formData.username,
      gender: formData.gender,
      age: formData.age,
      address: formData.address,
      phone: formData.phone,
      activity: formData.activity,
      email: formData.email,
      password: formData.password,
    } as User;

    var ranger = {
      divisi_id: formData.divisi_id,
      user: userData,
    } as CreateRanger;

    dispatch(postRanger(ranger))
      .unwrap()
      .then((res) => {
        closeModal();
        if (res != null) {
          dispatch(getRangers());
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        closeModal();
        console.error("Error fetching data:", error);
      });
  };

  return (
    <dialog ref={formRef} className="modal">
      <div
        className="modal-box bg-white dark:bg-boxdark-2 border-2 border-black"
        style={{ boxShadow: "8px 8px 0px #000000" }}
      >
        <div className="w-full flex justify-end">
          <button
            className="text-black dark:text-white font-extrabold"
            onClick={closeModal}
          >
            X
          </button>
        </div>
        <h3 className="font-bold text-2xl text-black dark:text-white">
          Tambah Ranger
        </h3>
        <div className="divider"></div>
        <form onSubmit={handleSubmit}>
          {/* Divisi */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="divisi_id">
              <span className="label-text text-black dark:text-white">
                Divisi <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <select
              value={formData["divisi_id"]}
              onChange={handleChange}
              name="divisi_id"
              className="select select-bordered bg-white dark:bg-boxdark focus:border-primary"
            >
              <option disabled selected>
                Pilih divisi ranger
              </option>
              {listDivisi?.map((divisi, key) => (
                <option value={divisi.id}>{divisi.name}</option>
              ))}
            </select>
          </div>
          {/* End of Divisi */}
          <div className="mt-8 divider">Profile Ranger</div>
          {/* Name */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="name">
              <span className="label-text text-black dark:text-white">
                Nama Lengkap <span className="text-meta-1 text-lg">*</span>
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

          {/* Gender */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="gender">
              <span className="label-text text-black dark:text-white">
                Gender <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <select
              value={formData["gender"]}
              onChange={handleChange}
              name="gender"
              className="select select-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            >
              <option disabled selected>
                Pilih gender ranger
              </option>
              <option value="male">Ikhwan</option>
              <option value="female">Akhwat</option>
            </select>
          </div>
          {/* End of Gender */}

          {/* Username */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="username">
              <span className="label-text text-black dark:text-white">
                Username
              </span>
            </label>
            <input
              value={formData["username"]}
              onChange={handleChange}
              type="text"
              name="username"
              placeholder="Masukan username tampil di Q&A"
              className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            />
          </div>
          {/* End of Username */}

          {/* Age */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="age">
              <span className="label-text text-black dark:text-white">
                Usia <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <input
              value={formData["age"]}
              onChange={handleChange}
              type="number"
              name="age"
              placeholder="Masukan usia ranger"
              className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            />
          </div>
          {/* End of Age */}

          {/* Phone */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="phone">
              <span className="label-text text-black dark:text-white">
                No WhatsApp <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <input
              value={formData["phone"]}
              onChange={handleChange}
              type="tel"
              name="phone"
              placeholder="Masukan nomor WhatsApp ranger"
              className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            />
          </div>
          {/* End of Phone */}

          {/* Address */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="address">
              <span className="label-text text-black dark:text-white">
                Alamat Lengkap <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <input
              value={formData["address"]}
              onChange={handleChange}
              type="text"
              name="address"
              placeholder="Masukan alamat lengkap ranger"
              className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            />
          </div>
          {/* End of Address */}

          {/* Activity */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="activity">
              <span className="label-text text-black dark:text-white">
                Aktifitas <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <select
              value={formData["activity"]}
              onChange={handleChange}
              name="activity"
              className="select select-bordered bg-white dark:bg-boxdark focus:border-primary"
            >
              <option disabled selected>
                Pilih aktifitas keseharian
              </option>
              <option value="Umm wa Rabbatul Bayt">Umm wa Rabbatul Bayt</option>
              <option value="Kerja">Kerja</option>
              <option value="Bisnis">Bisnis</option>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="Pelajar">Pelajar</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          {/* End of Activity */}

          <div className="mt-8 divider">Akun Login Ranger</div>

          {/* Email */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="email">
              <span className="label-text text-black dark:text-white">
                Email <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <input
              value={formData["email"]}
              onChange={handleChange}
              name="email"
              type="email"
              id="email"
              placeholder="Masukan email untuk login"
              className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            />
          </div>
          {/* End of Email */}

          {/* Password */}
          <div className="form-control my-2">
            <label className="label font-bold" htmlFor="password">
              <span className="label-text text-black dark:text-white">
                Password <span className="text-meta-1 text-lg">*</span>
              </span>
            </label>
            <input
              value={formData["password"]}
              onChange={handleChange}
              name="password"
              type="password"
              id="password"
              placeholder="Masukan password untuk login"
              className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
              required
            />
          </div>
          <div className="form-control my-2 mt-10">
            {isLoadingRanger ? (
              <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            ) : (
              <button
                type="submit"
                className="btn btn-primary text-white border-2 border-black"
                style={{ boxShadow: "0px 5px 0px 0px #000000" }}
              >
                Tambah Ranger Baru
              </button>
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default FormRanger;
