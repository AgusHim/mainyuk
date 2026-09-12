"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { getDivisi } from "@/redux/slices/divisiSlice";
import { Agenda } from "@/types/agenda";
import {
  editAgenda,
  getAgenda,
  postAgenda,
  setAgendaStartAt,
} from "@/redux/slices/agendaSlice";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Props = {
  toggleDialog: () => void;
};

const FormAgenda: React.FC<Props> = ({ toggleDialog }) => {
  const dispatch = useAppDispatch();

  const agenda = useAppSelector((state) => state.agenda.agenda);
  const agendaStartAt = useAppSelector((state) => state.agenda.agendaStartAt);
  const agendaEndAt = useAppSelector((state) => state.agenda.agendaEndAt);
  const listDivisi = useAppSelector((state) => state.divisi.data);
  const isLoadingDivisi = useAppSelector((state) => state.divisi.loading);
  const isLoadingAgenda = useAppSelector((state) => state.agenda.loading);

  const [formData, setFormData] = useState({
    id: agenda?.id ?? "",
    name: agenda?.name ?? "",
    type: agenda?.type ?? "meeting",
    location: agenda?.location ?? "",
    divisi_id: agenda?.divisi?.id ?? "1",
    start_at: agenda?.start_at!.replace("Z", ""),
  });

  useEffect(() => {
    if (listDivisi == null && !isLoadingDivisi) {
      dispatch(getDivisi());
    }
  }, []);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    var bodyData = {
      id: formData.id,
      name: formData.name,
      type: formData.type,
      location: formData.location,
      divisi_id: formData.divisi_id,
      start_at: format(
        Date.parse(formData.start_at!.replace("Z", "")),
        "yyyy-MM-dd HH:mm"
      ).replace(" ", "T"),
    };

    if (agenda == null) {
      dispatch(postAgenda(bodyData as Agenda))
        .unwrap()
        .then((res) => {
          if (res != null) {
            toggleDialog();
            dispatch(getAgenda({ start_at: agendaStartAt, end_at: agendaEndAt }));
          }
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error("Error fetching data:", error);
        });
    } else {
      dispatch(editAgenda(bodyData as Agenda))
        .unwrap()
        .then((res) => {
          if (res != null) {
            toggleDialog();
            dispatch(getAgenda({ start_at: agendaStartAt, end_at: agendaEndAt }));
          }
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error("Error fetching data:", error);
        });
    }
  };

  return (
    <>
      <h3 className="text-2xl font-bold text-black dark:text-white">
        {agenda != null ? "Edit Agenda" : "Tambah Agenda"}
      </h3>
      <Separator className="my-2" />
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="name" className="font-bold text-black dark:text-white">
            Nama Agenda <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["name"]}
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Masukan nama agenda"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Name */}

        {/* Type */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="type" className="font-bold text-black dark:text-white">
            Kategori <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Select
            name="type"
            required
            value={formData["type"]}
            onValueChange={(value) =>
              handleChange({ target: { name: "type", value } })
            }
          >
            <SelectTrigger
              id="type"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Pilih kategori agenda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="hangout">Hangout</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* End of Type */}

        {/* Divisi */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="divisi_id"
            className="font-bold text-black dark:text-white"
          >
            Divisi <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Select
            name="divisi_id"
            value={formData["divisi_id"]}
            onValueChange={(value) =>
              handleChange({ target: { name: "divisi_id", value } })
            }
          >
            <SelectTrigger
              id="divisi_id"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Pilih divisi agenda" />
            </SelectTrigger>
            <SelectContent>
              {listDivisi?.map((divisi, key) => (
                <SelectItem key={key} value={divisi.id!}>
                  {divisi.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* End of Divisi */}

        {/* Location */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="location"
            className="font-bold text-black dark:text-white"
          >
            Location
          </Label>
          <Input
            value={formData["location"]}
            onChange={handleChange}
            type="text"
            name="location"
            placeholder="Masukan lokasi agenda"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
        </div>
        {/* End of Location */}

        {/* Start At */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="start_at"
            className="font-bold text-black dark:text-white"
          >
            Waktu Pelaksanaan <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["start_at"]}
            onChange={handleChange}
            type="datetime-local"
            name="start_at"
            placeholder="Waktu Pelaksanaan Agenda"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            min="2024-01-01T00:00"
            required
          />
        </div>
        {/* End of Start At */}

        <div className="my-2 mt-10">
          {isLoadingAgenda ? (
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <Button
              type="submit"
              className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              {agenda == null ? "Tambah Agenda Baru" : "Simpan Perubahan"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormAgenda;
