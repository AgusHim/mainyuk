export default function HomeLinktree() {
  // change the variable here
  const links = [
    {
      color: "bg-[#7CE87C]",
      text: "Daftar Events 🍿",
      link: "https://darisini.com/circles/Q2lyY2xlUHJvZmlsZTpjbTNvMnI3em0wMDBvbWkwM3luamVpN3kz",
    },
    {
      color: "bg-pink-400",
      text: "Daftar KEY #13 🔑",
      link: "https://darisini.com/events/cm4jd8hn00010jp034o73501r",
    },
    {
      color: "bg-red-300",
      text: "Kepoin Admin 💬",
      link: "https://api.whatsapp.com/send/?phone=%2B6281241000056&text=Assalamu'alaikum, min",
    },
    {
      color: "bg-[#7DD3FC]",
      text: "Fun Sport ⚽",
      link: "https://www.instagram.com/solofunsport/",
    },
    {
      color: "bg-[#86AB89]",
      text: "Donasi & Support 💌",
      link: "https://api.whatsapp.com/send/?phone=%2B6281241000056&text=Assalamu'alaikum, Saya ingin support dakwah YN Solo",
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-2xl mx-auto my-20 flex flex-col gap-5">
        <div className="h-30 w-30 mx-auto mb-5">
          <img
            src="/images/logo/yn_logo.png"
            className="object-cover  object-center"
          />
        </div>
        <div className="text-center p-3">
          <h1 className="text-4xl font-bold text-black">YukNgaji Solo</h1>
          <p className="text-lg mt-3  text-black">#TemanBahagia</p>
        </div>
        <div className="flex flex-col gap-10">
          {links.map(({ text, color, link }, index) => {
            return (
              <a href={link} key={index} target="_blank">
                <div
                  className={`w-80 mx-auto ${color} text-center text-xl text-black font-bold py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1`}
                >
                  {text}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
