import type { Metadata } from "next";
import { EmConstrucao } from "@/components/em-construcao";

export const metadata: Metadata = { title: "Termos de uso · Método AFEE" };

export default function PaginaTermos() {
  return <EmConstrucao titulo="Termos de uso" />;
}
