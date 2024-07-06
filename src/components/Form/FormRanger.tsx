"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getDivisi } from "@/redux/slices/divisiSlice";
import { editRanger, getRangers, postRanger } from "@/redux/slices/rangerSlice";
import { CreateRanger, Ranger } from "@/types/ranger";
import { User } from "@/types/user";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface FormProps {
  ranger: Ranger | null;
  toggleDialog: () => void;
}

const FormRanger: React.FC<FormProps> = ({ ranger, toggleDialog }) => {
  const dispatch = useAppDispatch();
  const listDivisi = useAppSelector((state) => state.divisi.data);
  const isLoadingDivisi = useAppSelector((state) => state.divisi.loading);
  const isLoadingRanger = useAppSelector((state) => state.ranger.loading);

  const [formData, setFormData] = useState({
    id: ranger?.id ?? "",
    name: ranger?.user?.name ?? "",
    username: ranger?.user?.username ?? "",
    gender: ranger?.user?.gender ?? "",
    age: ranger?.user?.age != null ? ranger?.user?.age.toString() : "0",
    address: ranger?.user?.address ?? "",
    phone: ranger?.user?.phone ?? "",
    activity: ranger?.user?.activity ?? "",
    email: ranger?.user?.email ?? "",
    password: "",
    divisi_id: ranger?.divisi?.id ?? "",
  });

  useEffect(() => {
   console.log(`Show FORM = ${ranger?.user?.name}`);
    if (listDivisi == null && !isLoadingDivisi) {
      dispatch(getDivisi());
    }
  }, []);

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

    var bodyData = {
      id: formData.id,
      divisi_id: formData.divisi_id,
      user: userData,
    } as Ranger;

    if (ranger == null) {
      dispatch(postRanger(bodyData))
        .unwrap()
        .then((res) => {
          if (res != null) {
            dispatch(getRangers());
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      dispatch(editRanger(bodyData))
        .unwrap()
        .then((res) => {
          if (res != null) {
            dispatch(getRangers());
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    toggleDialog();
  };

  return (
    <>
      <h3 className="font-bold text-2xl text-black dark:text-white">
        {ranger == null ? "Tambah Ranger" : "Edit Ranger"}
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
            <option disabled>Pilih divisi ranger</option>
            {listDivisi?.map((divisi, key) => (
              <option key={key} value={divisi.id}>
                {divisi.name}
              </option>
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
            <option disabled>Pilih gender ranger</option>
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
        {/* <div className="form-control my-2">
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
        </div> */}
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
            <option disabled>Pilih aktifitas keseharian</option>
            <option value="umm wa rabbatul bayt">Umm wa Rabbatul Bayt</option>
            <option value="kerja">Kerja</option>
            <option value="bisnis">Bisnis</option>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="pelajar">Pelajar</option>
            <option value="lainnya">Lainnya</option>
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
            required={ranger == null}
          />
          {ranger != null ? (
            <p className="m-2 text-sm text-primary font-bold">
              <span>
                <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
              </span>{" "}
              Biarkan kosong jika tidak ingin mengganti password
            </p>
          ) : (
            <div></div>
          )}
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
              {ranger == null ? "Tambah Ranger Baru" : "Simpan Perubahan"}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormRanger;
