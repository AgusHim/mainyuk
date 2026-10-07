import { redirect } from "next/navigation";

// Halaman ini dulu selalu menampilkan "Event tidak di temukan" — tidak pernah
// membaca apa pun. Live event yang sebenarnya ada di `/live/[slug]`, dan daftar
// event ada di `/events`. Alamat ini hanya diteruskan ke sana.
export default function LiveIndex() {
  redirect("/events");
}
