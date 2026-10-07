-- Passo 16: compras e controle de acesso pago ao ebook.
--
-- Quem escreve: SÓ o servidor, com a service role (webhook do Mercado Pago).
-- A service role ignora o RLS, então não existe política de escrita para ninguém.
-- Quem lê: o aluno logado lê apenas a PRÓPRIA linha de `acessos` (política abaixo).
-- `compras` não tem nenhuma política: o navegador nunca enxerga essa tabela.

-- ---------------------------------------------------------------------------
-- compras: um registro por pagamento do gateway (histórico, auditoria e reembolso)
-- ---------------------------------------------------------------------------
create table public.compras (
  id                 uuid primary key default gen_random_uuid(),
  -- E-mail sempre normalizado (minúsculo, sem espaços). A checagem barra gravação fora do padrão.
  email              text not null
                       constraint compras_email_normalizado check (email = lower(btrim(email)) and email <> ''),
  -- Id do pagamento no Mercado Pago. Único: o mesmo aviso repetido não duplica a compra.
  gateway_payment_id text not null unique,
  status             text not null default 'aprovada'
                       constraint compras_status_valido check (status in ('pendente', 'aprovada', 'reembolsada', 'cancelada')),
  -- Valor em centavos (inteiro, sem arredondamento de ponto flutuante). Nulo se o gateway não informar.
  valor_centavos     integer
                       constraint compras_valor_nao_negativo check (valor_centavos is null or valor_centavos >= 0),
  criado_em          timestamptz not null default now()
);

create index compras_email_idx on public.compras (email);

-- ---------------------------------------------------------------------------
-- acessos: o direito de ler o ebook. Uma linha por e-mail.
-- ---------------------------------------------------------------------------
create table public.acessos (
  email               text primary key
                        constraint acessos_email_normalizado check (email = lower(btrim(email)) and email <> ''),
  concedido_em        timestamptz not null default now(),
  -- Nulo = acesso vitalício. Preenchido = vale até essa data.
  expira_em           timestamptz,
  -- Preenchido quando o acesso é revogado (ex.: reembolso). Nulo = não revogado.
  revogado_em         timestamptz,
  -- Pagamento que originou/renovou o acesso. Serve para a concessão e a revogação serem idempotentes
  -- e para um reembolso antigo não derrubar o acesso de uma compra mais nova.
  origem_payment_id   text
);

-- ---------------------------------------------------------------------------
-- RLS: ligado nas duas tabelas. Sem política = ninguém (anon/authenticated) lê nem escreve.
-- `force` faz até o dono da tabela respeitar o RLS; a service role continua com bypass.
-- ---------------------------------------------------------------------------
alter table public.compras enable row level security;
alter table public.acessos enable row level security;
alter table public.compras force row level security;
alter table public.acessos force row level security;

-- Defesa em profundidade: tira os privilégios de tabela dos papéis públicos do Supabase,
-- para que um RLS configurado errado no futuro não exponha as tabelas.
revoke all on public.compras from anon, authenticated;
revoke all on public.acessos from anon, authenticated;

-- O aluno logado só precisa de SELECT na própria linha de `acessos`.
grant select on public.acessos to authenticated;

-- A única política do sistema: o e-mail do JWT (claim `email`) tem de ser igual ao da linha.
-- `(select ...)` faz o Postgres avaliar o JWT uma vez por consulta, não por linha.
-- O `lower` protege contra e-mail com maiúsculas vindo do provedor de login.
create policy acessos_aluno_le_a_propria_linha
  on public.acessos
  for select
  to authenticated
  using (email = lower((select auth.jwt() ->> 'email')));

comment on table public.compras is 'Pagamentos do gateway. Escrita só pela service role; sem política de leitura.';
comment on table public.acessos is 'Direito de acesso ao ebook, por e-mail. expira_em nulo = vitalício. Aluno lê só a própria linha.';
