import { Divisi } from "./divisi";
import { User } from "./user";

export type Agenda = {
    id?:string | null,
    name: string;
    type: string;
    location: string;
    start_at?:string;
    divisi?: Divisi | null;
    leader?: User | null;
  };
  