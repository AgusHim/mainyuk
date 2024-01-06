import { Metadata } from "next";
import RegisterEventPage from "@/components/Pages/RegisterEventPage";

export const metadata: Metadata = {
  title: "Form Daftar Hadir",
  description: "Formulir daftar hadir event YukNgaji Solo",
  // other metadata
};

const RegisterEvent = ({ params }: { params: { slug: string } }) => {
  return <RegisterEventPage params={params}/>
};

export default RegisterEvent;
