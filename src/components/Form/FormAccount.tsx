"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { editAccount } from "@/redux/slices/authSlice";
import { getDivisi } from "@/redux/slices/divisiSlice";
import {
  editRanger,
  getRangers,
  postRanger,
} from "@/redux/slices/rangerSlice";
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
import { Separator } from "@/components/ui/separator";

interface FormProps {
  toggleDialog: () => void;
}

const FormAccount: React.FC<FormProps> = ({ toggleDialog }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.loading);

  const [formData, setFormData] = useState({
    id: user?.id ?? "",
    name: user?.name ?? "",
    username: user?.username ?? "",
    gender: user?.gender ?? "",
    age: user?.age != null ? user?.age.toString() : "0",
    address: user?.address ?? "",
    phone: user?.phone ?? "",
    activity: user?.activity ?? "",
    email: user?.email ?? "",
    password: "",
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    var _user = formData as User;

    dispatch(editAccount(_user))
      .unwrap()
      .then((res) => {
        if (res != null) {
          dispatch(getRangers({}));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    toggleDialog();
  };

  return (
    <>
      <h3 className="text-2xl font-bold text-black dark:text-white">
        Setting Account
      </h3>
      <Separator className="my-2" />
      <form onSubmit={handleSubmit}>
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

        {/* Age */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="age" className="font-bold text-black dark:text-white">
            Usia <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["age"]}
            onChange={handleChange}
            type="number"
            name="age"
            placeholder="Masukan usia ranger"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Age */}

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
          />

          <p className="m-2 text-sm font-bold text-primary">
            <span>
              <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
            </span>{" "}
            Biarkan kosong jika tidak ingin mengganti password
          </p>
        </div>
        <div className="my-2 mt-10">
          {isLoading ? (
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <Button
              type="submit"
              className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              Simpan Perubahan
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormAccount;
