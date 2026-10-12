// Coleta pública de perfis do Instagram com Playwright, SEM login (não usa a conta da AFEE).
// Abre o perfil como um visitante comum e lê a mesma resposta que o site usa para montar a página.
// Volume baixo e pausas longas para não ser bloqueado. Devolve o formato da Business Discovery.
import { chromium } from "playwright";

export async function abrirColetor() {
  const navegador = await chromium.launch();
  const ctx = await navegador.newContext({
    locale: "pt-BR",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  });
  const pagina = await ctx.newPage();
  await pagina.goto("https://www.instagram.com/", { waitUntil: "domcontentloaded" }).catch(() => {});

  async function ler(username) {
    const r = await pagina.request.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`, {
      headers: { "x-ig-app-id": "936619743392459", referer: `https://www.instagram.com/${username}/` },
    });
    if (!r.ok()) throw new Error(`Instagram respondeu ${r.status()}`);
    const u = (await r.json()).data?.user;
    if (!u) throw new Error("perfil não encontrado");
    const posts = (u.edge_owner_to_timeline_media?.edges ?? []).map(({ node: n }) => ({
      caption: n.edge_media_to_caption?.edges?.[0]?.node?.text ?? "",
      like_count: n.edge_liked_by?.count ?? n.edge_media_preview_like?.count,
      comments_count: n.edge_media_to_comment?.count ?? 0,
      views: n.video_view_count,
      media_type: n.__typename === "GraphSidecar" ? "CAROUSEL_ALBUM" : n.is_video ? "VIDEO" : "IMAGE",
      media_product_type: n.product_type === "clips" ? "REELS" : "FEED",
      timestamp: new Date(n.taken_at_timestamp * 1000).toISOString(),
      permalink: `https://www.instagram.com/p/${n.shortcode}/`,
    }));
    return { username: u.username, followers_count: u.edge_followed_by?.count ?? 0, media_count: u.edge_owner_to_timeline_media?.count ?? 0, media: { data: posts } };
  }

  return { ler, fechar: () => navegador.close() };
}
