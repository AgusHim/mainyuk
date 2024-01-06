import { Divisi } from "./divisi";

export type Event = {
    id?:string;
    slug?:string;
    code?:string;
    title?: string;
    desc?: string;
    image_url?: string;
    speaker?:string;
    participant?:number;
    divisi?:Divisi;
    start_at?:string;
    end_at?:string;
  };
  