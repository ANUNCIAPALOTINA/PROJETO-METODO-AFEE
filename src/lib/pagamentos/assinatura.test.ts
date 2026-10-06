import { describe, expect, it } from "vitest";
import {
  hmacSha256Hex,
  lerAssinatura,
  montarManifesto,
  verificarAssinatura,
} from "./assinatura";

const SEGREDO = "segredo-de-teste";
const REQUEST_ID = "bb56a2f1-6aae-46ac-982e-9dcd3581d08e";
const TS = "1742505638683";

describe("hmacSha256Hex (vetores RFC 4231)", () => {
  it("caso 1: chave de 20 bytes 0x0b", () => {
    const chave = String.fromCharCode(...new Array(20).fill(0x0b));
    expect(hmacSha256Hex(chave, "Hi There")).toBe(
      "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7",
    );
  });

  it("caso 2: chave Jefe", () => {
    expect(hmacSha256Hex("Jefe", "what do ya want for nothing?")).toBe(
      "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
    );
  });
});

describe("montarManifesto", () => {
  it("monta id, request-id e ts nessa ordem", () => {
    expect(montarManifesto({ dataId: "123456", requestId: REQUEST_ID, ts: TS })).toBe(
      `id:123456;request-id:${REQUEST_ID};ts:${TS};`,
    );
  });

  it("põe o id alfanumérico em minúsculas", () => {
    expect(montarManifesto({ dataId: "ABC123", requestId: null, ts: TS })).toBe(
      `id:abc123;ts:${TS};`,
    );
  });

  it("omite partes ausentes", () => {
    expect(montarManifesto({ ts: TS })).toBe(`ts:${TS};`);
  });
});

describe("lerAssinatura", () => {
  it("lê ts e v1", () => {
    expect(lerAssinatura("ts=1742505638683,v1=abcdef")).toEqual({
      ts: "1742505638683",
      v1: "abcdef",
    });
    expect(lerAssinatura("v1=abcdef, ts=10")).toEqual({ ts: "10", v1: "abcdef" });
  });

  it("devolve null se faltar algo", () => {
    expect(lerAssinatura(null)).toBeNull();
    expect(lerAssinatura("")).toBeNull();
    expect(lerAssinatura("ts=1")).toBeNull();
    expect(lerAssinatura("lixo")).toBeNull();
  });
});

describe("verificarAssinatura (vetores calculados fora do código, com Python hmac)", () => {
  const V1_ID_NUMERICO =
    "5023cbe9cab59a771f066474fc4889f3def17cc04e05e8c531946c6b4d61cbe2";
  const V1_ID_ALFA =
    "ce4d0f191b7394e061f80f980f05e77b79c9e4268aa22e67567d2f8952ede128";
  const V1_SEM_REQUEST_ID =
    "fa6f9e8b33f0345014a85b706cdacf4bd3ce200bc0f5d5ac5a43022251154440";

  const base = {
    segredo: SEGREDO,
    xSignature: `ts=${TS},v1=${V1_ID_NUMERICO}`,
    xRequestId: REQUEST_ID,
    dataId: "123456",
  };

  it("aceita assinatura correta", () => {
    expect(verificarAssinatura(base)).toBe(true);
  });

  it("aceita id alfanumérico em maiúsculas (vira minúsculas no manifesto)", () => {
    expect(
      verificarAssinatura({
        ...base,
        xSignature: `ts=${TS},v1=${V1_ID_ALFA}`,
        dataId: "ABC123",
      }),
    ).toBe(true);
  });

  it("aceita quando o MP não manda x-request-id", () => {
    expect(
      verificarAssinatura({
        ...base,
        xSignature: `ts=${TS},v1=${V1_SEM_REQUEST_ID}`,
        xRequestId: null,
      }),
    ).toBe(true);
  });

  it("rejeita segredo errado, id trocado, ts trocado e request-id trocado", () => {
    expect(verificarAssinatura({ ...base, segredo: "outro" })).toBe(false);
    expect(verificarAssinatura({ ...base, dataId: "123457" })).toBe(false);
    expect(
      verificarAssinatura({ ...base, xSignature: `ts=1742505638684,v1=${V1_ID_NUMERICO}` }),
    ).toBe(false);
    expect(verificarAssinatura({ ...base, xRequestId: "outro" })).toBe(false);
  });

  it("rejeita v1 malformado, curto ou vazio, sem lançar erro", () => {
    for (const v1 of ["", "zzzz", V1_ID_NUMERICO.slice(0, 62), V1_ID_NUMERICO + "00"]) {
      expect(verificarAssinatura({ ...base, xSignature: `ts=${TS},v1=${v1}` })).toBe(false);
    }
  });

  it("rejeita sem segredo ou sem header", () => {
    expect(verificarAssinatura({ ...base, segredo: undefined })).toBe(false);
    expect(verificarAssinatura({ ...base, segredo: "" })).toBe(false);
    expect(verificarAssinatura({ ...base, xSignature: null })).toBe(false);
  });
});
