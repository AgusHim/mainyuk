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

  const [districtQuery, setDistrictQuery] = useState(user?.district?.name ?? "");
  const [filteredDistricts, setFilteredDistricts] = useState(district);

  const [subDistrictQuery, setSubDistrictQuery] = useState(user?.sub_district?.name ?? "");
  const [filteredSubDistricts, setFilteredSubDistricts] = useState(sub_district);

  useEffect(() => {
    setFilteredDistricts(
      district.filter((d) =>
        d.name.toLowerCase().includes(districtQuery.toLowerCase())
      )
    );
  }, [district, districtQuery]);

  useEffect(() => {
    setFilteredSubDistricts(
      sub_district.filter((sd) =>
        sd.name.toLowerCase().includes(subDistrictQuery.toLowerCase())
      )
    );
  }, [sub_district, subDistrictQuery]);



  const [formData, setFormData] = useState<User>({
    ...user,
    username: user?.username ?? "anonim",
    gender: user?.gender ?? "male",
    age: user?.age ?? '16',
    activity: user?.activity ?? "",
    source: user?.source ?? "",
    birth_date:
      user?.birth_date != null ? format(
        Date.parse(user?.birth_date?.replace("Z", "")),
        "yyyy-MM-dd"
      ).replace(" ", "T") : "",
    province_code: user?.province?.code ?? "",
    district_code: user?.district?.code ?? "",
    sub_district_code: user?.sub_district?.code ?? "",
  });

  const [formErrors, setFormErrors] = useState<{
    [key: string]: string | undefined;
  }>({});



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
        setDistrictQuery("");
        setSubDistrictQuery("");
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

  const validateForm = (data: User) => {
    const fieldsToValidate = [
      'name',
      'phone',
      'gender',
      'age',
      'province_code',
      'district_code',
      'sub_district_code',
      'activity',
      'source'
    ];
    const newErrors: { [key: string]: string | undefined } = {};
    let firstErrorMessage = '';

    fieldsToValidate.forEach((key) => {
      const value = data[key as keyof User];
      const error = ValidateField(key, value as string ?? '');
      if (error) {
        newErrors[key] = error;
        if (!firstErrorMessage) firstErrorMessage = error;
      }
    });

    setFormErrors(newErrors);
    return { isValid: !firstErrorMessage, firstErrorMessage };
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { isValid, firstErrorMessage } = validateForm(formData);

    if (!isValid) {
      if (firstErrorMessage) {
        toast.info(firstErrorMessage);
      }
      return;
    }
    var userData = {
      ...formData,
      age: formData.age?.toString(),
      birth_date: format(
        Date.parse(formData.birth_date!.replace("Z", "")),
        "yyyy-MM-dd HH:mm"
      ).replace(" ", "T"),
    } as User;

    dispatch(editAccount(userData))
      .unwrap()
      .then((_) => {
        toast.info("Berhasil update profile");
        var redirectTo = query.get("redirectTo");
        if (redirectTo != null && redirectTo != undefined) {
          router.replace(redirectTo!);
          return;
        } if (query.get("isFromGoogle") === "true") {
          router.replace("/events");
          return;
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

  // Filter province only show province.code 33 & 34
  const filteredProvince = province.filter(
    (e) => e.code === "33" || e.code === "34"
  );
  return (
    <>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {/* {isComplated() == false ? (
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
        )} */}
        {user?.updated_at != null && new Date(user.updated_at).getTime() < new Date("2025-08-06").getTime() ? (
          <div role="alert" className="p-5 flex flex-row bg-yellow-200 rounded-md items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-current text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-sm text-black">
              Anda terakhir update {" "}
              {format(new Date(user.updated_at!), "dd MMMM yyyy")} silahkan update profile anda. Untuk maping jamaah agar event YukNgaji Solo lebih asik dan seru 🔥🔥🔥
            </p>
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
                No Whatsapp<span className="text-meta-1">*</span>
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
          <div className="text-sm text-black">Digunakan untuk nama yang muncul di QnA bisa diisi nama samaran</div>
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
                htmlFor="age"
                className="text-lg font-semibold text-black"
              >
                Usia<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <select
              value={formData["age"]}
              onChange={handleChange}
              name="age"
              className="select select-bordered py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              required
            >
              <option value="16">{'< 17 Tahun'}</option>
              <option value="17">{'17 - 25 Tahun'}</option>
              <option value="26">{'26 - 35 Tahun'}</option>
              <option value="36">{'> 35 Tahun'}</option>
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
              value={formData?.province_code ?? ""}
              onChange={handleChange}
              name="province_code"
              className="select select-bordered py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
              required
            >
              <option value="">Pilih Provinsi</option>
              {filteredProvince.map((e) => (
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
                htmlFor="province_code"
                className="text-lg font-semibold text-black"
              >
                Kota / Kabupaten<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col relative">
            <input
              type="text"
              placeholder="Ketik nama Kabupaten"
              className="py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] text-lg text-black border-black"
              value={
                district.find((d) => d.code === formData.district_code)?.name ??
                districtQuery
              }
              onChange={(e) => {
                const val = e.target.value;
                setDistrictQuery(val);
              }}
            />
            {districtQuery != "" && districtQuery != formData?.district?.name && (
              <div className="absolute z-10 bg-yellow-200 border border-black mt-10 w-full max-h-[200px] overflow-y-auto rounded shadow">
                {filteredDistricts.map((d) => (
                  <div
                    key={d.code}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, district_code: d.code, district: d, sub_district_code: "", sub_district: null }));
                      setDistrictQuery(d.name)
                      setSubDistrictQuery(""); // Also clear sub-district query
                      setFormErrors(prev => ({ ...prev, district_code: "" })); // Clear error
                      dispatch(getSubDistrict(d.code));
                    }}
                  >
                    {d.name}
                  </div>
                ))}
                {filteredDistricts.length === 0 && (
                  <div className="px-4 py-2 text-gray-500">Tidak ditemukan</div>
                )}
              </div>
            )}
            {formErrors.district_code && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.district_code}
              </p>
            )}
          </div>
        </div>

        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="province_code"
                className="text-lg font-semibold text-black"
              >
                Kecamatan <span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col relative">
            <input
              type="text"
              placeholder="Ketik nama Kecamatan"
              className="py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] text-lg text-black border-black"
              value={
                sub_district.find((sd) => sd.code === formData.sub_district_code)?.name ??
                subDistrictQuery
              }
              onChange={(e) => {
                const val = e.target.value;
                setSubDistrictQuery(val);
              }}
            />
            {subDistrictQuery != "" && subDistrictQuery != formData?.sub_district?.name && (
              <div className="absolute z-10 bg-yellow-200 border border-black mt-10 w-full max-h-[200px] overflow-y-auto rounded shadow">
                {filteredSubDistricts.map((sd) => (
                  <div
                    key={sd.code}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, sub_district_code: sd.code, sub_district: sd }));
                      setSubDistrictQuery(sd.name);
                      setFormErrors(prev => ({ ...prev, sub_district_code: "" })); // Clear error
                    }}
                  >
                    {sd.name}
                  </div>
                ))}
                {filteredSubDistricts.length === 0 && (
                  <div className="px-4 py-2 text-gray-500">Tidak ditemukan</div>
                )}
              </div>
            )}
            {formErrors.sub_district_code && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.sub_district_code}
              </p>
            )}
          </div>
        </div>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal">
            <span className="flex items-center font-semibold">
              <label
                htmlFor="activity"
                className="text-lg font-semibold text-black"
              >
                Aktifitas saat ini apa kak?<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <select
              value={formData?.activity ?? ''}
              onChange={handleChange}
              name="activity"
              className="select select-bordered py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
            >
              <option disabled value="" >Pilih aktifitas keseharian</option>
              <option value="pelajar">Pelajar</option>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="kerja">Kerja</option>
              <option value="bisnis">Bisnis</option>
              <option value="ibu rumah tangga">Ibu Rumah Tangga</option>
              <option value="lainnya">Lainnya</option>
            </select>
            {formErrors.activity && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.activity}
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
                Dapat Info Kajian Darimana<span className="text-meta-1">*</span>
              </label>
            </span>
          </div>
          <div className="flex flex-col">
            <select
              value={formData?.source ?? ''}
              onChange={handleChange}
              name="source"
              className="select select-bordered py-3 px-4 w-full bg-yellow-200 rounded-lg border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg text-black font-normal placeholder-gray-600 flex items-center border-black"
            >
              <option disabled value="">Pilih info kajian darimana</option>
              <option value="sosmed_yns">Sosmed YukNgaji Solo</option>
              <option value="sosmed_ustadz">Sosmed Ustadz Pengisi</option>
              <option value="ajakan_teman">Ajakan Teman</option>
              <option value="jamaah_masjid">Jamaah Masjid</option>
              <option value="lainnya">Lainnya</option>
            </select>
            {formErrors.source && (
              <p className="mt-1 text-danger text-sm font-semibold">
                {formErrors.source}
              </p>
            )}
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
      </form >
    </>
  );
};

export default FormProfileUpdate;
