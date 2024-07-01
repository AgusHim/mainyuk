"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { getDivisi } from "@/redux/slices/divisiSlice";
import { Agenda } from "@/types/agenda";
import { editAgenda, getAgenda, postAgenda } from "@/redux/slices/agendaSlice";
import { formatStrToDateTime } from "@/utils/convert";
type Props = {
  toggleDialog:()=>void;
}

const FormAgenda: React.FC<Props> = ({ toggleDialog }) =>  {
  const dispatch = useAppDispatch();

  const agenda = useAppSelector((state) => state.agenda.agenda);
  const listDivisi = useAppSelector((state) => state.divisi.data);
  const isLoadingDivisi = useAppSelector((state) => state.divisi.loading);
  const isLoadingAgenda = useAppSelector((state) => state.agenda.loading);

  const [formData, setFormData] = useState(agenda != null?{
    id:agenda.id,
    name: agenda.name,
    type: agenda.type,
    location: agenda.location,
    divisi_id: agenda.divisi?.id ?? "",
    start_at: agenda.start_at!.replace('Z',''),
  }:{
    name: "",
    type: "meeting",
    location: "",
    divisi_id: "1",
    start_at: "",
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

    if(agenda == null){
      dispatch(postAgenda(formData as Agenda))
      .unwrap()
      .then((res) => {
        if (res != null) {
          toggleDialog();
          dispatch(getAgenda());
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error fetching data:", error);
      });  
    }else{
      dispatch(editAgenda(formData as Agenda))
      .unwrap()
      .then((res) => {
        if (res != null) {
          toggleDialog();
          dispatch(getAgenda());
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
      <h3 className="font-bold text-2xl text-black dark:text-white">
        {agenda != null?"Edit Agenda":"Tambah Agenda"}
      </h3>
      <div className="divider"></div>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="name">
            <span className="label-text text-black dark:text-white">
              Nama Agenda <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["name"]}
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Masukan nama lengkap ranger"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          />
        </div>
        {/* End of Name */}

        {/* Type */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="type">
            <span className="label-text text-black dark:text-white">
              Kategori <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <select
            value={formData["type"]}
            onChange={handleChange}
            name="type"
            className="select select-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          >
            <option disabled>Pilih kategori agenda</option>
            <option value="meeting">Meeting</option>
            <option value="hangout">Hangout</option>
            <option value="event">Event</option>
          </select>
        </div>
        {/* End of Type */}

        {/* Divisi */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="divisi_id">
            <span className="label-text text-black dark:text-white">
              Divisi <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <select
            value={formData["divisi_id"]}
            onChange={handleChange}
            name="divisi_id"
            className="select select-bordered bg-white dark:bg-boxdark focus:border-primary"
          >
            <option disabled>Pilih divisi agenda</option>
            {listDivisi?.map((divisi, key) => (
              <option key={key} value={divisi.id}>
                {divisi.name}
              </option>
            ))}
          </select>
        </div>
        {/* End of Divisi */}

        {/* Location */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="location">
            <span className="label-text text-black dark:text-white">
              Location
            </span>
          </label>
          <input
            value={formData["location"]}
            onChange={handleChange}
            type="text"
            name="location"
            placeholder="Masukan lokasi agenda"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
          />
        </div>
        {/* End of Location */}

        {/* Start At */}
        <div className="form-control my-2">
          <label className="label font-bold" htmlFor="start_at">
            <span className="label-text text-black dark:text-white">
              Waktu Pelaksanaan <span className="text-meta-1 text-lg">*</span>
            </span>
          </label>
          <input
            value={formData["start_at"]}
            onChange={handleChange}
            type="datetime-local"
            name="start_at"
            placeholder="Waktu Pelaksanaan Agenda"
            className="input input-bordered bg-white dark:bg-boxdark focus:border-primary"
            required
          />
        </div>
        {/* End of Start At */}

        <div className="form-control my-2 mt-10">
          {isLoadingAgenda ? (
            <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <button
              type="submit"
              className="btn btn-primary text-white border-2 border-black"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              {agenda == null?"Tambah Agenda Baru":"Simpan Perubahan"}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormAgenda;
