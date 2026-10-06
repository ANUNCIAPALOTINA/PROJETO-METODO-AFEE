"""Converte o ebook (.docx revisado) nos 12 capítulos do leitor.

Uso (a partir da raiz do projeto):
    python3 -I scripts/converter-ebook.py

Lê assets/ebook/EBOOK_AFEE_revisado.docx e grava:
  - src/content/ebook/capitulos.ts       (os 12 capítulos, em Markdown simples)
  - src/content/ebook/integridade.json   (impressão digital do texto, usada pelo teste)

Os títulos dos capítulos são os mesmos da lista "O que você vai encontrar" da
página de vendas (o teste confere). Os títulos de seção do documento são
descartados quando viram título de capítulo; "O que eu descobri?" fica como
subtítulo dentro do capítulo 2. Nenhum outro texto é alterado ou removido.
"""
import hashlib
import json
import re
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DOCX = RAIZ / "assets" / "ebook" / "EBOOK_AFEE_revisado.docx"
SAIDA = RAIZ / "src" / "content" / "ebook"
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

# (slug, título do capítulo, início da seção no documento)
# O início é o texto exato (sem acento/caixa) do título de seção que abre o capítulo.
CAPITULOS = [
    ("trajetoria", "Minha trajetória na calistenia", "trajetoria na calistenia"),
    ("o-que-e-calistenia", "O que é, e no que consiste, treinar calistenia", "mas, afinal, o que e e no que consiste treinar calistenia?"),
    ("calistenia-e-academia", "Por que começar pela calistenia e não pela academia", "por que treinar calistenia e nao iniciar na academia?"),
    ("dividir-treinos", "Como dividir os treinos na semana (puxar e empurrar)", "divisao do treino"),
    ("tempo-pausas-descansos", "Tempo de treino, pausas e descansos", "tempo de treino - pausas e descansos"),
    ("metodo-afee", "O método AFEE de fato: Aquecer, Forçar, Estimular, Exaustar", "o metodo afee de fato"),
    ("termometro", "O Termômetro", "termometro"),
    ("alimentacao", "Alimentação, para quem tem metabolismo acelerado e para quem não tem", "alimentacao"),
    ("motivacao-disciplina", "Motivação e disciplina", "motivacao e disciplina"),
    ("rotina", "Rotina", "rotina"),
    ("local-de-treino", "Local de treino", "local de treino"),
    ("acumulo-de-conhecimento", "Acúmulo de conhecimento: por que colocar em prática vale mais que saber tudo", "acumulo de conhecimento"),
]
# Títulos de seção que permanecem dentro do capítulo, como subtítulo.
SUBTITULOS = {"o que eu descobri?"}


def normalizar(texto: str) -> str:
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    texto = texto.replace("–", "-").replace("—", "-")
    return re.sub(r"\s+", " ", texto).strip().lower()


def paragrafos(caminho: Path):
    """Lista de (markdown, texto_puro, tudo_em_negrito) por parágrafo não vazio."""
    raiz = ET.fromstring(zipfile.ZipFile(caminho).read("word/document.xml"))
    saida = []
    for p in raiz.find(W + "body").iter(W + "p"):
        trechos = []  # (texto, negrito, italico)
        for r in p.iter(W + "r"):
            partes = []
            for el in r:
                if el.tag == W + "t":
                    partes.append(el.text or "")
                elif el.tag in (W + "tab", W + "br"):
                    partes.append(" ")
            texto = "".join(partes)
            if not texto:
                continue
            rpr = r.find(W + "rPr")

            def ligado(tag):
                if rpr is None:
                    return False
                no = rpr.find(W + tag)
                return no is not None and no.get(W + "val") not in ("0", "false")

            trechos.append((texto, ligado("b"), ligado("i")))
        if not trechos or not "".join(t for t, _, _ in trechos).strip():
            continue
        puro = re.sub(r"\s+", " ", "".join(t for t, _, _ in trechos)).strip()
        todo_negrito = all(b for t, b, _ in trechos if t.strip())
        # junta trechos vizinhos de mesma formatação
        fundidos = []
        for t, b, i in trechos:
            if fundidos and fundidos[-1][1:] == (b, i):
                fundidos[-1] = (fundidos[-1][0] + t, b, i)
            else:
                fundidos.append((t, b, i))
        md = ""
        for t, b, i in fundidos:
            miolo = t.strip(" ")
            if not miolo:
                md += t
                continue
            esq = t[: len(t) - len(t.lstrip(" "))]
            dir_ = t[len(t.rstrip(" ")):]
            marca = ("**" if b else "") + ("*" if i else "")
            fecha = ("*" if i else "") + ("**" if b else "")
            md += f"{esq}{marca}{miolo}{fecha}{dir_}"
        md = re.sub(r"\s+", " ", md).strip()
        saida.append((md, puro, todo_negrito))
    return saida


def main() -> None:
    itens = paragrafos(DOCX)
    inicios = {slug: normalizar(ini) for slug, _, ini in CAPITULOS}

    capitulos = {slug: [] for slug, _, _ in CAPITULOS}
    atual = None
    descartados = []
    for md, puro, negrito in itens:
        chave = normalizar(puro)
        slug_novo = next((s for s, ini in inicios.items() if chave == ini), None)
        if slug_novo:
            atual = slug_novo
            descartados.append(puro)
            continue
        if atual is None:
            raise SystemExit(f"Texto antes do primeiro capítulo: {puro[:60]!r}")
        if negrito and chave in SUBTITULOS:
            capitulos[atual].append(("## " + puro, puro))
        else:
            capitulos[atual].append((md, puro))

    faltando = [s for s, c in capitulos.items() if not c]
    if faltando:
        raise SystemExit(f"Capítulos vazios: {faltando}")
    if len(descartados) != len(CAPITULOS):
        raise SystemExit(f"Esperava {len(CAPITULOS)} títulos de seção, achei {len(descartados)}")

    lista = []
    texto_integridade = []
    for slug, titulo, _ in CAPITULOS:
        blocos = capitulos[slug]
        markdown = "\n\n".join(m for m, _ in blocos)
        puro = [p for _, p in blocos]
        palavras = sum(len(p.split()) for p in puro)
        texto_integridade.extend(puro)
        lista.append({
            "numero": len(lista) + 1,
            "slug": slug,
            "titulo": titulo,
            "palavras": palavras,
            "minutos": max(1, round(palavras / 200)),
            "markdown": markdown,
        })

    SAIDA.mkdir(parents=True, exist_ok=True)
    corpo = json.dumps(lista, ensure_ascii=False, indent=2)
    (SAIDA / "capitulos.ts").write_text(
        "// GERADO por scripts/converter-ebook.py a partir de assets/ebook/EBOOK_AFEE_revisado.docx.\n"
        "// Não edite à mão: mude o .docx e rode o script de novo.\n"
        "// Conteúdo PAGO: só importe isto em código de servidor (ver index.ts).\n\n"
        "export type Capitulo = {\n  numero: number;\n  slug: string;\n  titulo: string;\n  palavras: number;\n  minutos: number;\n  markdown: string;\n};\n\n"
        f"export const capitulos: Capitulo[] = {corpo};\n",
        encoding="utf-8",
    )
    completo = "\n".join(texto_integridade)
    (SAIDA / "integridade.json").write_text(json.dumps({
        "fonte": "assets/ebook/EBOOK_AFEE_revisado.docx",
        "capitulos": len(lista),
        "paragrafos": len(texto_integridade),
        "palavras": sum(c["palavras"] for c in lista),
        "titulosDeSecaoDescartados": descartados,
        "sha256": hashlib.sha256(normalizar(completo).encode("utf-8")).hexdigest(),
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"{len(lista)} capítulos, {len(texto_integridade)} parágrafos, {sum(c['palavras'] for c in lista)} palavras")
    for c in lista:
        print(f"  {c['numero']:2d}. {c['palavras']:5d} palavras · {c['minutos']:2d} min · {c['titulo'][:60]}")


if __name__ == "__main__":
    main()
