import type { Metadata } from "next";
import { EmConstrucao } from "@/components/em-construcao";

export const metadata: Metadata = { title: "Entrar · Método AFEE" };

export default function PaginaEntrar() {
  return <EmConstrucao titulo="Entrar" />;
}
