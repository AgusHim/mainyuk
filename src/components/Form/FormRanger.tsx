"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getDivisi } from "@/redux/slices/divisiSlice";
import {
  editRanger,
  getRangers,
  postRanger,
} from "@/redux/slices/rangerSlice";
import { CreateRanger, Ranger } from "@/types/ranger";
import { User } from "@/types/user";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
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
    gender: ranger?.user?.gender ?? "male",
    age: ranger?.user?.age != null ? ranger?.user?.age.toString() : "0",
    address: ranger?.user?.address ?? "",
    phone: ranger?.user?.phone ?? "",
    activity: ranger?.user?.activity ?? "kerja",
    email: ranger?.user?.email ?? "",
    password: "",
    divisi_id: ranger?.divisi?.id ?? "1",
  });

  useEffect(() => {
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
            dispatch(getRangers({}));
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
            dispatch(getRangers({}));
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
      <h3 className="text-2xl font-bold text-black dark:text-white">
        {ranger == null ? "Tambah Ranger" : "Edit Ranger"}
      </h3>
      <div className="my-2 h-px w-full bg-stroke dark:bg-strokedark" />
      <form onSubmit={handleSubmit}>
        {/* Divisi */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="divisi_id"
            className="font-bold text-black dark:text-white"
          >
            Divisi <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Select
            name="divisi_id"
            value={formData["divisi_id"]}
            onValueChange={(value) =>
              handleChange({ target: { name: "divisi_id", value } })
            }
          >
            <SelectTrigger
              id="divisi_id"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Pilih divisi ranger" />
            </SelectTrigger>
            <SelectContent>
              {listDivisi?.map((divisi, key) => (
                <SelectItem key={key} value={divisi.id!}>
                  {divisi.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* End of Divisi */}

        <div className="my-2 mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-strokedark" />
          <span className="text-sm font-semibold text-black dark:text-white">
            Profile Ranger
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-strokedark" />
        </div>

        {/* Name */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="name" className="font-bold text-black dark:text-white">
            Nama Lengkap <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["name"]}
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Masukan nama lengkap ranger"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Name */}

        {/* Gender */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="gender"
            className="font-bold text-black dark:text-white"
          >
            Gender <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Select
            name="gender"
            required
            value={formData["gender"]}
            onValueChange={(value) =>
              handleChange({ target: { name: "gender", value } })
            }
          >
            <SelectTrigger
              id="gender"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Pilih gender ranger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Ikhwan</SelectItem>
              <SelectItem value="female">Akhwat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* End of Gender */}

        {/* Username */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="username"
            className="font-bold text-black dark:text-white"
          >
            Username
          </Label>
          <Input
            value={formData["username"]}
            onChange={handleChange}
            type="text"
            name="username"
            placeholder="Masukan username tampil di Q&A"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
        </div>
        {/* End of Username */}

        {/* Age (dimatikan sementara) */}

        {/* Phone */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="phone" className="font-bold text-black dark:text-white">
            No WhatsApp <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["phone"]}
            onChange={handleChange}
            type="tel"
            name="phone"
            placeholder="Masukan nomor WhatsApp ranger"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Phone */}

        {/* Address */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="address"
            className="font-bold text-black dark:text-white"
          >
            Alamat Lengkap <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["address"]}
            onChange={handleChange}
            type="text"
            name="address"
            placeholder="Masukan alamat lengkap ranger"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Address */}

        {/* Activity */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="activity"
            className="font-bold text-black dark:text-white"
          >
            Aktifitas <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Select
            name="activity"
            value={formData["activity"]}
            onValueChange={(value) =>
              handleChange({ target: { name: "activity", value } })
            }
          >
            <SelectTrigger
              id="activity"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Pilih aktifitas keseharian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="umm wa rabbatul bayt">
                Umm wa Rabbatul Bayt
              </SelectItem>
              <SelectItem value="kerja">Kerja</SelectItem>
              <SelectItem value="bisnis">Bisnis</SelectItem>
              <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
              <SelectItem value="pelajar">Pelajar</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* End of Activity */}

        <div className="my-2 mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-strokedark" />
          <span className="text-sm font-semibold text-black dark:text-white">
            Akun Login Ranger
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-strokedark" />
        </div>

        {/* Email */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="email" className="font-bold text-black dark:text-white">
            Email <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["email"]}
            onChange={handleChange}
            name="email"
            type="email"
            id="email"
            placeholder="Masukan email untuk login"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Email */}

        {/* Password */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="password"
            className="font-bold text-black dark:text-white"
          >
            Password <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["password"]}
            onChange={handleChange}
            name="password"
            type="password"
            id="password"
            placeholder="Masukan password untuk login"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required={ranger == null}
          />
          {ranger != null ? (
            <p className="m-2 text-sm font-bold text-primary">
              <span>
                <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
              </span>{" "}
              Biarkan kosong jika tidak ingin mengganti password
            </p>
          ) : (
            <div></div>
          )}
        </div>
        <div className="my-2 mt-10">
          {isLoadingRanger ? (
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <Button
              type="submit"
              className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              {ranger == null ? "Tambah Ranger Baru" : "Simpan Perubahan"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormRanger;
