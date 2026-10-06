import type { Metadata } from "next";
import { EmConstrucao } from "@/components/em-construcao";

export const metadata: Metadata = { title: "Checkout · Método AFEE" };

export default function PaginaCheckout() {
  return <EmConstrucao titulo="Checkout" />;
}
