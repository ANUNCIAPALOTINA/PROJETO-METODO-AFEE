"""Trata as fotos do Método AFEE: recorta a interface do Instagram, gera
tamanhos para celular e computador e salva em WebP.

Uso (a partir da raiz do projeto):
    python3 -I scripts/tratar-fotos.py <pasta com as fotos originais>

Lê os originais pelo nome (1.webp ... 10.jpg), copia para assets/fotos/originais
e grava as versões tratadas em assets/fotos/tratadas. Nada é filtrado ou
retocado: só recorte e redução de tamanho.
"""
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "assets" / "fotos"

# nome final -> (arquivo original, recorte (esq, topo, dir, base) ou None, larguras)
FOTOS = {
    "hero-noite": ("5.jpg", None, [450, 900]),
    "historia-barra": ("2.webp", (68, 22, 880, 888), [480, 812]),
    "evolucao": ("10.jpg", None, [540, 1080]),
    "metodo-parque": ("1.webp", (14, 10, 864, 860), [480, 850]),
    "sem-academia-mureta": ("8.jpg", None, [540, 800, 1080]),
    "termometro-paradamao": ("4.png", None, [240, 472]),
    "faixa-grama": ("9.jpg", (0, 330, 1080, 780), [540, 800, 1080]),
    "final-cta": ("6.jpg", None, [540, 800, 1080]),
    "obrigado-noite": ("7.jpg", None, [450, 900]),
}

QUALIDADE_WEBP = 82


def main(pasta_origem: Path) -> None:
    originais = DESTINO / "originais"
    tratadas = DESTINO / "tratadas"
    originais.mkdir(parents=True, exist_ok=True)
    tratadas.mkdir(parents=True, exist_ok=True)

    for nome, (arquivo, recorte, larguras) in FOTOS.items():
        origem = pasta_origem / arquivo
        shutil.copy2(origem, originais / arquivo)

        imagem = ImageOps.exif_transpose(Image.open(origem)).convert("RGB")
        if recorte:
            imagem = imagem.crop(recorte)

        for largura in larguras:
            if largura > imagem.width:
                continue  # nunca amplia
            altura = round(imagem.height * largura / imagem.width)
            versao = imagem.resize((largura, altura), Image.LANCZOS)
            saida = tratadas / f"{nome}-{largura}.webp"
            versao.save(saida, "WEBP", quality=QUALIDADE_WEBP, method=6)
            print(f"{saida.name:38s} {largura}x{altura}  {saida.stat().st_size // 1024} KB")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
