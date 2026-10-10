// Preço lido da fonte única do site (src/config/produto.ts), usado pelo gerador e pelo robô.
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const produtoTs = readFileSync(join(RAIZ, "src/config/produto.ts"), "utf8");
const centavos = (chave) => Number(produtoTs.match(new RegExp(`${chave}:\\s*(\\d+)`))[1]);
const brl = (c) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(c / 100);

export const precos = { preco: brl(centavos("precoCentavos")), precoDe: brl(centavos("precoOriginalCentavos")) };
