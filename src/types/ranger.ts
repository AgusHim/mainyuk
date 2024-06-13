import { Divisi } from "./divisi";
import { User } from "./user";

export type Ranger = {
    id:string,
    user?:User|null,
    divisi?:Divisi|null,
    present:number |null,
    absent:number |null
  };
  