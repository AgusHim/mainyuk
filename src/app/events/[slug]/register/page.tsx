import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Daftar Hadir",
  description: "Formulir daftar hadir event MainYuk Solo",
  // other metadata
};

const RegisterEvent = () => {
  return (
    <>
      <div className="my-10 min-w-screen flex flex-col items-center justify-center">
        <div className="sm:w-2/3 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Form Daftar Hadir
            </h3>
          </div>
          <form action="#">
            <div className="p-6.5">
              <Image
                className="mx-auto mb-5"
                width={300}
                height={300}
                alt="Gambar event"
                src="https://scontent-cgk1-2.cdninstagram.com/v/t51.2885-15/413893817_1104389514062218_8435652700476609878_n.webp?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDEwODAuc2RyIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=QIG6esl36tQAX--Nvd8&edm=ACWDqb8BAAAA&ccb=7-5&ig_cache_key=MzI2NjgxODcyNDA1MDkwNTAwMg%3D%3D.2-ccb7-5&oh=00_AfADSEC7LdC2fraWsBUQz26zmY7eoLhOGZlhM7RE1eJobA&oe=659398C3&_nc_sid=ee9879"
              ></Image>
              <h1 className="flex w-full justify-center text-2xl font-bold text-black dark:text-white">
                Nama Event
              </h1>
              <p className="flex w-full justify-center text-lg font-light text-black dark:text-white">
                Ustadz Iqbal Tantowi
              </p>
              <div className="mt-4 mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nama <span className="text-meta-1">*</span>
                </label>
                <input
                  type="name"
                  placeholder="Masukan nama kamu"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="mt-4 mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Username Q&A
                </label>
                <input
                  type="name"
                  placeholder="Masukan nama kamu"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <p className="mt-1">
                  Optional bila kosong akan muncul "Anonim"
                </p>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Gender <span className="text-meta-1">*</span>
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                    <option value="">Ikhwan</option>
                    <option value="">Akhwat</option>
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Umur <span className="text-meta-1">*</span>
                </label>
                <input
                  type="age"
                  placeholder="Masukan umur kamu"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Alamat
                </label>
                <input
                  type="text"
                  placeholder="Masukan alamat kamu"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nomor Whatsapp
                </label>
                <input
                  type="text"
                  placeholder="Masukan nomor Whatsapp kamu"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <p className="mt-1">
                  Optional untuk memberikan update info event selanjutnya
                </p>
              </div>
              <button className="flex w-full justify-center rounded-3xl bg-primary p-3 mt-10 font-medium text-gray">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterEvent;
