import type { Metadata } from "next";
import { EmConstrucao } from "@/components/em-construcao";

export const metadata: Metadata = { title: "Suporte · Método AFEE" };

export default function PaginaSuporte() {
  return <EmConstrucao titulo="Suporte" />;
}
