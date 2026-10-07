import {Event} from "@/types/event";
import { Region } from "./Region";

export type User = {
  id?: string;
  name?: string;
  username?: string;
  gender?: string;
  phone?:string;
  age?:number|string;
  birth_date?:string|null;
  address?:string;
  role?:string;
  activity?:string|null;
  event?:Event;
  created_at?:string;
  email?:string |null;
  instagram?:string |null;
  province_code?:string |null;
  province?:Region |null;
  district_code?:string |null;
  district?:Region |null;
  sub_district_code?:string|null;
  sub_district?:Region |null;
  source?:string |null;
  updated_at?:string |null;
};

// Satu baris pada `GET /admin_api/users`.
//
// Bentuknya mengikuti `AccountResponse` di server (`internal/user/user.go`).
// Password dan GoogleID memang tidak ada di sana, jadi tidak ada yang perlu
// dibuang di sisi klien.
export type AccountRow = {
  id: string;
  name: string;
  username: string;
  gender: string;
  birth_date: string;
  age: number;
  phone: string;
  email: string | null;
  instagram: string;
  address: string;
  role: string;
  activity: string | null;
  source: string | null;
  image_url: string | null;
  province_code: string;
  district_code: string;
  sub_district_code: string;
  province: Region | null;
  district: Region | null;
  sub_district: Region | null;
  created_at: string;
  updated_at: string;
};

// Amplop respons `GET /admin_api/users`.
export type AccountPage = {
  users: AccountRow[];
  page: number;
  per_page: number;
  has_more: boolean;
};

export type VerifyOTP = {
  email?: string;
  code?: string;
};
