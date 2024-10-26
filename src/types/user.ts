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
  createdAt?:string;
  email?:string |null;
  google_id?:string |null;
  instagram?:string |null;
  province_code?:string |null;
  province?:Region |null;
  district_code?:string |null;
  district?:Region |null;
  sub_district_code?:string|null;
  sub_district?:Region |null;
  password?:string |null;
};

export type VerifyOTP = {
  email?: string;
  code?: string;
};
