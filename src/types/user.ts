import {Event} from "@/types/event";

export type User = {
  name: string;
  gender: string;
  phone:string;
  age:number;
  address:string;
  event:Event;
  createdAt:string;
};
