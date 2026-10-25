#requires -Version 7.0

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$raiz = Split-Path -Parent $PSScriptRoot
$ebook = Join-Path $raiz "src/content/ebook-app/index.html"

# shortcut: o gerador original nao esta versionado neste repo; restaurar o pipeline completo quando a fonte voltar.
$fotos = [ordered]@{
  "João Garlet em pose de força, fotografado de baixo para cima contra o céu noturno" = "public/fotos/hero-noite-900.webp"
  "João Garlet executando um movimento de força na barra contra o céu azul" = "public/fotos/historia-barra-812.webp"
  "Três fotos lado a lado mostrando a evolução física do autor" = "public/fotos/evolucao-1080.webp"
  "João sentado na mureta à beira do lago" = "public/fotos/sem-academia-mureta-1080.webp"
  "João Garlet em pé no parque à noite, sob o céu iluminado pela lua" = "public/fotos/final-cta-900.webp"
  "João Garlet em pose de força contra o céu noturno" = "public/fotos/hero-noite-900.webp"
}

$html = [IO.File]::ReadAllText($ebook)
foreach ($foto in $fotos.GetEnumerator()) {
  $alt = [regex]::Escape($foto.Key)
  $padrao = '(<img\s+src=")[^"]*("\s+alt="' + $alt + '")'
  if ([regex]::Matches($html, $padrao).Count -ne 1) {
    throw "Imagem unica nao encontrada no ebook: $($foto.Key)"
  }
  $arquivo = Join-Path $raiz $foto.Value
  $dataUri = "data:image/webp;base64," + [Convert]::ToBase64String([IO.File]::ReadAllBytes($arquivo))
  $html = [regex]::Replace(
    $html,
    $padrao,
    { param($match) $match.Groups[1].Value + $dataUri + $match.Groups[2].Value },
    1
  )
}

[IO.File]::WriteAllText($ebook, $html, [Text.UTF8Encoding]::new($false))

foreach ($foto in $fotos.GetEnumerator()) {
  $alt = [regex]::Escape($foto.Key)
  $match = [regex]::Match(
    $html,
    '<img\s+src="data:image/webp;base64,([^"]+)"\s+alt="' + $alt + '"'
  )
  if (-not $match.Success) { throw "Imagem nao embutida: $($foto.Key)" }
  $embutida = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData(
    [Convert]::FromBase64String($match.Groups[1].Value)
  ))
  $arquivo = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData(
    [IO.File]::ReadAllBytes((Join-Path $raiz $foto.Value))
  ))
  if ($embutida -ne $arquivo) {
    throw "Imagem embutida difere do arquivo: $($foto.Value)"
  }
}

Write-Host "Ebook reconstruido com $($fotos.Count) imagens verificadas."
