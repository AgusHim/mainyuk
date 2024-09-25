// Validation functions
const validateName = (name: string): string | undefined => {
  if (!name) {
    return "Nama tidak boleh kosong";
  }
  return "";
};

const validateProvinceCode = (province_code: string): string | undefined => {
  if (!province_code) {
    return "Provinsi tidak boleh kosong";
  }
  return "";
};

const validateDistrictCode = (district_code: string): string | undefined => {
  if (!district_code) {
    return "Kabupaten / Kota tidak boleh kosong";
  }
  return "";
};

const validateSubDistrictCode = (sub_district_code: string): string | undefined => {
  if (!sub_district_code) {
    return "Kecamatan tidak boleh kosong";
  }
  return "";
};

const validateAddress = (address: string): string | undefined => {
  if (!address) {
    return "Alamat tidak boleh kosong";
  }
  return "";
};

const validateBirthDate = (birth_date: string): string | undefined => {
  if (!birth_date) {
    return "Tanggal lahir tidak boleh kosong";
  }
  return "";
};

const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email tidak boleh kosong";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Masukan email yang valid";
  }
  return "";
};

const validatePhone = (phone: string): string | undefined => {
    if (!phone) {
      return "No Handphone tidak boleh kosong";
    }
    return "";
  };

const validateGender = (
  gender: string,
  gender_allowed?: string
): string | undefined => {
  if (!gender) {
    return "Gender tidak boleh kosong";
  }
  if (gender != gender_allowed && gender_allowed != "both") {
    return `Tiket khusus untuk ${
      gender_allowed == "male" ? "Laki-laki" : "Perempuan"
    }`;
  }
  return "";
};

export const ValidateField = (
  name: string,
  value: string,
  gender_allowed?: string
) => {
  switch (name) {
    case "name":
      return validateName(value);
    case "gender":
      return validateGender(value, gender_allowed);
    case "email":
      return validateEmail(value);
      case "phone":
      return validatePhone(value);
      case "province_code":
      return validateProvinceCode(value);
      case "district_code":
      return validateDistrictCode(value);
      case "sub_district_code":
      return validateSubDistrictCode(value);
    case "address":
      return validateAddress(value);
    case "birth_date":
      return validateBirthDate(value);
    default:
      return "";
  }
};
