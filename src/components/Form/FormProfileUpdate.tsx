"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { editAccount } from "@/redux/slices/authSlice";
import {
  getDistrict,
  getProvince,
  getSubDistrict,
} from "@/redux/slices/RegionSlice";
import { User } from "@/types/user";
import { ValidateField } from "@/utils/Validation/Validation";
import { format } from "date-fns/format";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const FormProfileUpdate: React.FC = () => {
  const router = useRouter();
  const query = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const province = useAppSelector((state) => state.region.province);
  const district = useAppSelector((state) => state.region.district);
  const sub_district = useAppSelector((state) => state.region.sub_district);
  const isLoading = useAppSelector((state) => state.auth.loading);

  const [formData, setFormData] = useState({
    id: user?.id ?? "",
    name: user?.name ?? "",
    username: user?.username ?? "",
    gender: user?.gender != null && user?.gender != "" ? user?.gender : "male",
    age: user?.age != null ? user?.age.toString() : "0",
    address: user?.address ?? "",
    phone: user?.phone ?? "",
    activity: user?.activity != null && user?.activity != "" ? user?.activity : "umm wa rabbatul bayt",
    email: user?.email ?? "",
    instagram: user?.instagram ?? "",
    birth_date: user?.birth_date ?? "",
    province_code: user?.province?.code ?? "",
    district_code: user?.district?.code ?? "",
    sub_district_code: user?.sub_district?.code ?? "",
  });

  const [formErrors, setFormErrors] = useState<{
    [key: string]: string | undefined;
  }>({});
  const hasErrors = Object.values(formErrors).some(
    (error) => error !== undefined && error !== ""
  );

  useEffect(() => {
    if (province.length == 0) {
      dispatch(getProvince());
    }
    if (user?.province?.code != null) {
      dispatch(getDistrict(user?.province?.code ?? ""));
    }
    if (user?.district?.code != null) {
      dispatch(getSubDistrict(user?.district?.code ?? ""));
    }
  }, []);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    // Validate the field dynamically
    const error = ValidateField(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    if (name == "province_code") {
      dispatch(getDistrict(value)).then(() => {
        setFormData({
          ...formData,
          ["province_code"]: value,
          ["district_code"]: "",
          ["sub_district_code"]: "",
        });
      });
      return;
    }
    if (name == "district_code") {
      dispatch(getSubDistrict(value)).then(() => {
        setFormData({
          ...formData,
          ["district_code"]: value,
          ["sub_district_code"]: "",
        });
      });
      return;
    }
  };

  const handleSubmit = async (e: any) => {
    if (hasErrors) {
      toast.info("Pastikan sudah isi data dengan benar");
      return;
    }
    e.preventDefault();
    var userData = {
      name: formData.name,
      username: formData.username,
      gender: formData.gender,
      age: formData.age,
      address: formData.address,
      phone: formData.phone,
      instagram: formData.instagram,
      activity: formData.activity,
      province_code: formData.province_code,
      district_code: formData.district_code,
      sub_district_code: formData.sub_district_code,
      birth_date: format(
        Date.parse(formData.birth_date!.replace("Z", "")),
        "yyyy-MM-dd HH:mm"
      ).replace(" ", "T"),
    } as User;

    dispatch(editAccount(userData))
      .unwrap()
      .then((_) => {
        toast.info("Berhasil update profile");
        if (query.get("isFromGoogle") === "true") {
          router.replace("/events");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  function isComplated() {
    if (
      user?.province_code != null &&
      user?.district_code != null &&
      user?.sub_district_code != null
    ) {
      return true;
    }
    return false;
  }
  return (
    <>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {isComplated() == false ? (
          <div role="alert" className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Mohon lengkapi data</span>
          </div>
        ) : (
          <></>
        )}

        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="name"
                className="text-lg font-semibold text-black"
              >
                Nama Lengkap<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <input
              id="name"
              placeholder="Masukkan nama lengkap"
              type="text"
              className="py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {formErrors.name && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.name}
              </p>
            )}
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="phone"
                className="text-lg font-semibold text-black"
              >
                No Handphone<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <input
              id="phone"
              placeholder="08xxxxxxxxxxx"
              type="text"
              className="py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {formErrors.phone && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.phone}
              </p>
            )}
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="email"
                className="text-lg font-semibold text-black"
              >
                Email<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <input
              id="email"
              placeholder="08xxxxxxxxxxx"
              type="text"
              className="py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly
            />
            {formErrors.email && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.email}
              </p>
            )}
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="instagram"
                className="text-lg font-semibold text-black"
              >
                Instagram<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <input
              id="instagram"
              placeholder="@username"
              type="text"
              className="py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="brith_date"
                className="text-lg font-semibold text-black"
              >
                Tanggal Lahir<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <input
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              type="date"
              className="select select-bordered py-3 px-4 pr-auto w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              required
            />
            {formErrors.birth_date && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.birth_date}
              </p>
            )}
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="username"
                className="text-lg font-semibold text-black"
              >
                Username
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <input
              id="username"
              placeholder="Masukkan nama lengkap"
              type="text"
              className="py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="gender"
                className="text-lg font-semibold text-black"
              >
                Gender<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <select
              value={formData["gender"]}
              onChange={handleChange}
              name="gender"
              className="select select-bordered py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              required
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="province_code"
                className="text-lg font-semibold text-black"
              >
                Provinsi<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <select
              value={formData["province_code"]}
              onChange={handleChange}
              name="province_code"
              className="select select-bordered py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              required
            >
              <option value="">Pilih Provinsi</option>
              {province.map((e) => (
                <option key={e.code} value={e.code}>
                  {e.name}
                </option>
              ))}
            </select>
            {formErrors.province_code && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.province_code}
              </p>
            )}
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="district_code"
                className="text-lg font-semibold text-black"
              >
                Kota / Kabupaten<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <select
              value={formData["district_code"]}
              onChange={handleChange}
              name="district_code"
              className="select select-bordered py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              required
            >
              <option value="">Pilih Kabupaten</option>
              {district.map((e) => (
                <option key={e.code} value={e.code}>
                  {e.name}
                </option>
              ))}
            </select>
            {formErrors.district_code && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.district_code}
              </p>
            )}
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="sub_district_code"
                className="text-lg font-semibold text-black"
              >
                Kecamatan<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <select
              value={formData["sub_district_code"]}
              onChange={handleChange}
              name="sub_district_code"
              className="select select-bordered py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              required
            >
              <option value="">Pilih Kecamatan</option>
              {sub_district.map((e) => (
                <option key={e.code} value={e.code}>
                  {e.name.toLocaleUpperCase()}
                </option>
              ))}
            </select>
            {formErrors.sub_district_code && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.sub_district_code}
              </p>
            )}
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="address"
                className="text-lg font-semibold text-black"
              >
                Alamat<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <input
              id="address"
              placeholder="Masukkan nama lengkap"
              type="text"
              className="py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            {formErrors.address && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.address}
              </p>
            )}
          </div>
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="activity"
                className="text-lg font-semibold text-black"
              >
                Aktifitas<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <select
              value={formData["activity"]}
              onChange={handleChange}
              name="activity"
              className="select select-bordered py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              required
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
          <div className="mt-2"></div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal"></div>
          <button
            type="submit"
            className="grid w-full place-items-center rounded-lg border-2 border-black p-3 text-base font-bold bg-primary text-white shadow-custom hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1"
          >
            Simpan
          </button>
          <div className="mt-2"></div>
        </div>
      </form>
    </>
  );
};

export default FormProfileUpdate;
