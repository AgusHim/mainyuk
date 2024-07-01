import { Divisi } from "./divisi";
import { User } from "./user";

export type Ranger = {
    id:string,
    user?:User|null,
    divisi?:Divisi|null,
    present?:number |0,
    absent?:number |0,
  };

  export type CreateRanger = {
    divisi_id:string,
    user?:User|null,
  };
  