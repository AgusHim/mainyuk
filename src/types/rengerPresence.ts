import { Agenda } from "./agenda";
import { Divisi } from "./divisi";
import { Ranger } from "./ranger";

export type RangerPresence = {
    id?:string,
    ranger_id:string |null,
    agenda_id:string |null,
    divisi_id:string | null,
    ranger?:Ranger|null,
    agenda?:Agenda|null,
    divisi?:Divisi|null,
    created_at?: string|null
  };
  