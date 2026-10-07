/** Endereço e rotas do site. */
export const site = {
  /** Em produção, defina NEXT_PUBLIC_SITE_URL (ver .env.example). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  rotas: {
    vendas: "/",
    checkout: "/checkout",
    obrigado: "/obrigado",
    entrar: "/entrar",
    ebook: "/ebook",
    suporte: "/suporte",
    termos: "/termos",
    privacidade: "/privacidade",
  },
} as const;
