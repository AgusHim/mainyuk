export default function Footer() {
  const year = new Date().getFullYear();

  const navigation = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Aktivitas", href: "#aktivitas" },
    { label: "Tentang", href: "#temanbahagia" },
  ];

  const support = [
    {
      label: "Kepoin Admin",
      href: "https://api.whatsapp.com/send/?phone=%2B6281241000056&text=Assalamu'alaikum, min",
      external: true,
    },
    {
      label: "Donasi & Support",
      href: "https://api.whatsapp.com/send/?phone=%2B6281241000056&text=Assalamu'alaikum, Saya ingin support dakwah YN Solo",
      external: true,
    },
  ];

  const social = [
    { label: "Instagram", href: "https://www.instagram.com/solofunsport/" },
  ];

  return (
    <footer className="bg-[#171717] pb-12 pt-4 text-white">
      <div className="yn-container">
        <div className="grid grid-cols-1 gap-10 border-t border-white/10 pt-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo/yn_logo.png"
                alt="Logo YukNgaji Solo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-lg font-semibold tracking-tight">
                YukNgaji Solo
              </span>
            </div>
            <p className="mt-4 max-w-[280px] text-sm leading-[1.65] text-white/50">
              Komunitas yang tumbuh bersama. #TemanBahagia
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Navigasi footer">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Navigasi
            </p>
            <ul className="mt-4 space-y-3">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label="Dukungan">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Support
            </p>
            <ul className="mt-4 space-y-3">
              {support.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label="Media sosial">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Social
            </p>
            <ul className="mt-4 space-y-3">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t border-white/10 pt-8 text-xs text-white/40">
          &copy; {year} YukNgaji Solo
        </p>
      </div>
    </footer>
  );
}
