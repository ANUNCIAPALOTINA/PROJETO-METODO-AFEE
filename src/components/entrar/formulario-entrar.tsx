"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { criarClienteNavegador } from "@/lib/supabase/cliente";

type Estado = "ocioso" | "enviando" | "enviado" | "erro";

const MSG_LINK_INVALIDO = "Esse link expirou ou já foi usado. Peça um novo.";

/**
 * Pedido do link mágico por e-mail. A resposta é NEUTRA: com ou sem compra,
 * quem pede vê a mesma mensagem de "Confira seu e-mail" (não revela quem tem acesso).
 */
export function FormularioEntrar({ linkInvalido = false }: { linkInvalido?: boolean }) {
  const [estado, setEstado] = useState<Estado>("ocioso");
  const [email, setEmail] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    try {
      const supabase = criarClienteNavegador();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          // O usuário nasce quando a compra é aprovada; aqui nunca se cria conta.
          shouldCreateUser: false,
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      // E-mail sem conta (cadastro desligado) responde igual a um e-mail com conta:
      // não dá para descobrir quem comprou. Só falha real (rede, limite) vira erro.
      const semConta =
        error?.code === "otp_disabled" ||
        error?.code === "signup_disabled" ||
        /signups? not allowed/i.test(error?.message ?? "");
      setEstado(error && !semConta ? "erro" : "enviado");
    } catch {
      setEstado("erro");
    }
  }

  if (estado === "enviado") {
    return (
      <div
        role="status"
        className="rounded-sm border border-border bg-card p-6"
      >
        <h2 className="text-[22px] leading-[1.2]">Confira seu e-mail</h2>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Se esse endereço tiver acesso ao ebook, enviamos um link para
          entrar. Pode levar alguns minutos; olhe também a caixa de spam.
        </p>
        <button
          type="button"
          onClick={() => setEstado("ocioso")}
          className="mt-4 inline-flex min-h-11 cursor-pointer items-center font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
        >
          Usar outro e-mail
        </button>
      </div>
    );
  }

  const enviando = estado === "enviando";

  return (
    <form onSubmit={enviar} noValidate={false} className="flex flex-col gap-4">
      {linkInvalido && estado !== "erro" && (
        <p
          role="alert"
          className="rounded-sm border border-destructive p-4 text-[17px] text-destructive"
        >
          {MSG_LINK_INVALIDO}
        </p>
      )}

      <label htmlFor="email" className="text-[17px] font-semibold">
        Seu e-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="voce@exemplo.com"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        disabled={enviando}
        aria-describedby="ajuda-email"
        aria-invalid={estado === "erro" || undefined}
        className="h-14 w-full rounded-sm border border-input bg-card px-4 text-[17px] text-foreground placeholder:text-muted-foreground disabled:opacity-60"
      />
      <p id="ajuda-email" className="-mt-2 text-sm text-muted-foreground">
        Use o mesmo e-mail da compra. Enviamos um link, sem senha.
      </p>

      {estado === "erro" && (
        <p role="alert" className="text-[17px] text-destructive">
          Não foi possível enviar agora. Confira o e-mail e tente de novo em
          instantes.
        </p>
      )}

      <Button
        type="submit"
        disabled={enviando}
        aria-busy={enviando}
        className="h-14 w-full text-[17px] font-semibold"
      >
        {enviando ? "Enviando…" : "Receber link de acesso"}
      </Button>
    </form>
  );
}
