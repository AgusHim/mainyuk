import Image from "next/image";
import QnaList from "@/components/QnaList";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event - MainYuk Solo",
  description: "Formulir daftar hadir event MainYuk Solo",
  // other metadata
};

export default function Event() {
  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row items-center md:items-start">
        <div className="w-auto md:w-1/4 h-1/2 m-2 mb-5 md:m-5 p-10 rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <Image
            className="mx-auto mb-5"
            width={300}
            height={300}
            alt="Gambar event"
            src="https://scontent-cgk1-2.cdninstagram.com/v/t51.2885-15/413893817_1104389514062218_8435652700476609878_n.webp?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDEwODAuc2RyIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=QIG6esl36tQAX--Nvd8&edm=ACWDqb8BAAAA&ccb=7-5&ig_cache_key=MzI2NjgxODcyNDA1MDkwNTAwMg%3D%3D.2-ccb7-5&oh=00_AfADSEC7LdC2fraWsBUQz26zmY7eoLhOGZlhM7RE1eJobA&oe=659398C3&_nc_sid=ee9879"
          />
          <h1 className="flex w-full justify-center text-2xl font-bold text-black dark:text-white">
            Nama Event
          </h1>
          <p className="flex w-full justify-center text-lg font-light text-black dark:text-white">
            Ustadz Iqbal Tantowi
          </p>
        </div>
        <div className="w-auto md:w-2/4 mx-2 flex flex-col mb-5 md:my-5 md:mr-5 p-5 md:p-10 rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <h1 className="mb-5 text-2xl font-bold text-black dark:text-white">
            Q&A
          </h1>
          <div className="w-full flex justify-center">
            <textarea
              className="w-full max-h-14 focus:max-h-40 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary resize-none"
              rows={4}
              cols={50}
              maxLength={300}
              placeholder="Tulis Pertanyaan ..."
            />
            <button className="max-h-12 ml-4 w-20 btn bg-primary text-white p-2 rounded-md ">
              Kirim
            </button>
          </div>
          <div className="mt-5">
            <QnaList></QnaList>
          </div>
        </div>
      </div>
    </>
  );
}
