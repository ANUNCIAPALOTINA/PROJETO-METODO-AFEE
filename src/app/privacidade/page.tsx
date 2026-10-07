import type { Metadata } from "next";
import { EmConstrucao } from "@/components/em-construcao";

export const metadata: Metadata = {
  title: "Política de privacidade · Método AFEE",
};

export default function PaginaPrivacidade() {
  return <EmConstrucao titulo="Política de privacidade" />;
}
