# Auditoria Crítica — Sartor Digital

**Landing page analisada:** `index.html` (versão PT-BR, sartordigital.online)
**Data:** 06/07/2026
**Perspectiva combinada:** Staff Engineer (Vercel) · Principal Product Designer (Linear) · Head of Brand (Stripe) · CRO Specialist · UX Writer B2B SaaS · Vendas consultivas high-ticket

> Aviso de tom: você pediu crítica sem pena. É o que segue. Nada aqui é sobre você como profissional — é sobre a distância entre o que o site **diz** e o que um CTO de Série A **precisa ver** para confiar um contrato de seis dígitos. Seu portfólio real é bom. O site não faz jus a ele.

---

## 0. Diagnóstico em uma frase

> O site vende um **freelancer rápido e barato** com estética de **dashboard de startup**. Você quer vender uma **empresa de engenharia de software de alto valor**. Esses dois posicionamentos brigam em quase todas as seções — e hoje o freelancer está ganhando.

As três tensões que sabotam a percepção de valor:

1. **Velocidade como argumento central.** "Sites em 5 dias, sistemas em 3 semanas" é linguagem de commodity. Para PME é ótimo. Para um CTO comprando software crítico, *rápido = raso*. Ninguém confia o core de uma fintech a quem se orgulha de entregar em 3 semanas. Velocidade precisa ser **consequência de engenharia**, não a promessa principal.
2. **Canal de conversão errado para o público-alvo.** WhatsApp em todo lugar + "orçamento em 4h" é o padrão do mercado brasileiro de PME. Diretor/CTO de empresa Série A não abre WhatsApp com um fornecedor de software — ele quer agendar uma call técnica, ver um case, receber um one-pager. O canal comunica o ticket.
3. **"Sem agência / direto com o dev".** Isso resolve a objeção de uma PME (medo de intermediário caro), mas *cria* uma objeção no enterprise: "então é uma pessoa só? E o bus factor? E quando escalar?". Você está anunciando sua maior fraqueza percebida como diferencial.

O resto do documento é a execução detalhada de como resolver isso.

---

## 1. Auditoria seção por seção

Para cada seção: ✅ o que está bom · ❌ o que está ruim · 🟡 amadorismo · 🔻 pouca autoridade · 📣 excesso de marketing · ⬜ genérico · ➕ o que falta · 🏆 como as referências fariam.

### 1.1 `<head>` / SEO técnico / meta

✅ **Bom:** hreflang PT/EN/ES bem configurado, canonical presente, OG tags presentes, preconnect nas fontes, `data-theme` server-side (evita flash). Isso já está acima da média de freelancer.

❌ **Ruim:** `<title>` tem 3 promessas numéricas empilhadas ("Sites em até 5 dias. Sistemas em até 3 semanas. Desenvolvemos com IA.") — parece anúncio de Google Ads, não título de empresa de engenharia. Favicon e OG image hospedados em `postimg.cc` (host de imagem grátis) — **isso é um sinal de amadorismo que um dev técnico detecta na hora**. Assets de marca nunca ficam em postimg.cc.

🟡 **Amadorismo:** dependência de 3 CDNs externos no `<head>` (FontAwesome, Devicon, Google Fonts) bloqueando render. Devicon inteiro carregado para usar meia dúzia de ícones.

🔻 **Pouca autoridade:** falta `application/ld+json` (Schema.org). Zero dados estruturados. Um site que se diz "especialista técnico" sem JSON-LD é uma contradição que o Google e um CTO percebem.

⬜ **Genérico:** meta description é uma lista de features ("Dev Full Stack e especialista em IA. Sites em até 5 dias...").

➕ **Falta:** `Organization` + `Person` + `WebSite` + `BreadcrumbList` schema; `og:image` dedicado (1200×630) próprio; `twitter:card`; theme-color; sitemap referenciado.

🏆 **Como fariam:** Stripe/Vercel servem OG images geradas dinamicamente (edge function), fontes self-hosted com `font-display:swap` e subset, e JSON-LD completo. Title é a **marca + proposta**, não uma lista de prazos: `Sartor Digital — Engenharia de software e sistemas com IA`.

---

### 1.2 Navbar

✅ **Bom:** sticky com blur no scroll, seletor de idioma limpo, toggle de tema, âncoras funcionais. Visualmente competente.

❌ **Ruim:** o CTA principal do site inteiro é **"Orçamento em até 4h"** com ícone do WhatsApp. Esse é o CTA de um prestador de serviço local, não de uma empresa de software. "Orçamento" é palavra de marceneiro/gráfica, não de contrato de engenharia.

🟡 **Amadorismo:** logo em `postimg.cc` de novo. "Sartor Digital." com pontinho verde imitando o `.` do Vercel/Linear — é um gesto de marca *emprestado*, não próprio.

📣 **Excesso de marketing:** "em até 4h" na navegação transforma a barra fixa em outdoor.

➕ **Falta:** um item que ancore autoridade técnica — ex. "Arquitetura", "Cases", "Stack". Não há nada para o comprador técnico clicar.

🏆 **Como fariam:** Linear/Vercel têm CTA neutro e confiante — "Contato", "Fale com engenharia", "Agendar call". A navbar da Vercel não grita prazo. O CTA secundário abre um agendamento (Cal.com), não um chat.

---

### 1.3 Hero

Conteúdo atual: badge "IA aplicada · Entrega em dias, não meses" → H1 "Desenvolvemos com *Inteligência* Artificial." → sub "Sites em até 5 dias. Sistemas em até 3 semanas..." → botões WhatsApp/Portfólio → strip de 3 bullets → card lateral com status "Disponível agora" + terminal fake + 4 chips flutuantes.

✅ **Bom:** o card de status com terminal é o elemento visual mais forte do site. A ideia de mostrar o `const stack = {...}` comunica "eu sou dev" de forma elegante. Layout em grid sólido.

❌ **Ruim:** o **H1 é o problema mais caro da página**. "Desenvolvemos com Inteligência Artificial" é a frase que **todo mundo** escreve em 2026. Não diz o que você faz, para quem, nem por que importa. IA virou tábua rasa — usar IA como manchete é como uma construtora anunciar "usamos furadeira". É invisível.

🟡 **Amadorismo:** os 4 chips flutuantes ("Sem agência", "+3× Velocidade", "Suporte ativo", "Projeto real") são ruído. Chips flutuantes animados = estética de template de portfólio 2021. Diluem o foco e gritam "marketing".

🔻 **Pouca autoridade:** "Disponível agora" com pontinho pulsante é linguagem de freelancer em plataforma (Workana/Fiverr). Comunica *ociosidade*, não demanda. Empresa forte não está "disponível agora" — está com agenda.

📣 **Excesso de marketing:** "+3× Velocidade vs. agências tradicionais" é claim sem fonte, sem metodologia, sem prova. Um CTO lê isso como puffery.

⬜ **Genérico:** "Velocidade real, código de qualidade, IA em cada etapa" — três clichês em sequência. "Código de qualidade" é o "comida gostosa" de restaurante.

➕ **Falta:** uma proposta de valor **específica e vertical**. Nome de clientes reais no hero. Uma métrica dura (ex. "R$ 247M movimentados em produtos que construí"). Um sub-CTA de agendamento.

🏆 **Como fariam:**
- **Stripe:** H1 curto e infraestrutural — "Financial infrastructure for the internet". Aplicado a você: *"Software sob medida para empresas que não podem falhar."*
- **Vercel:** foco no resultado do desenvolvedor + prova de escala ("Trusted by...").
- **Linear:** uma frase de propósito + craft visual extremo, zero chips.
- **OpenAI/Anthropic:** manchete sóbria, quase acadêmica, deixando o produto falar.

Reescrita completa do hero está na **Seção 3**.

---

### 1.4 Stats row (12 projetos / 90%+ recorrentes / 4 anos / ≤4h)

✅ **Bom:** ter números é melhor que não ter. Animação de contagem é agradável.

❌ **Ruim:** os números **enfraquecem** o posicionamento em vez de reforçar. "12 projetos" e "4 anos" são números pequenos e honestos — para enterprise, comunicam *júnior*. "90%+ clientes recorrentes" sobre uma base de 12 é estatisticamente frágil e um CTO faz essa conta na hora.

🔻 **Pouca autoridade:** "≤4h Tempo de Orçamento" como um dos quatro números-chave da empresa? Isso não é uma métrica de engenharia, é uma promessa de vendas travestida de KPI.

⬜ **Genérico:** as 4 métricas são as mesmas de qualquer freelancer.

➕ **Falta:** métricas que só **você** pode reivindicar e que impressionam: volume financeiro processado pelos produtos ("R$ 247M+"), uptime, latência, nº de usuários dos sistemas, requests/dia, etc. Números de **impacto**, não de esforço.

🏆 **Como fariam:** a Vercel mostra "billions of requests", a Stripe mostra "millions of businesses / $1T+ processed". A régua é **impacto no mundo**, não anos de casa. Troque "4 anos de experiência" por "R$ 247M movimentados nos produtos que construí" — muda o jogo.

---

### 1.5 Serviços ("O que a gente constrói")

8 cards: Full Stack, Integração & Automação com IA, Sites Institucionais Premium, Captação de Leads, Sistemas Inteligentes, Manutenção & Suporte, Ebooks Profissionais, + card promo.

✅ **Bom:** grid limpo, ícones consistentes, hover agradável.

❌ **Ruim:** a lista mistura **níveis de ticket incompatíveis**. "Sistemas Inteligentes / SaaS" (contrato de R$ 100k+) está lado a lado com **"Ebooks Profissionais a partir de R$ 297/un."**. Colocar ebook de R$297 na mesma vitrine destrói o valor percebido de tudo em volta. Um CTO vê ebook a R$297 e reprecifica **todo o resto** mentalmente para baixo.

🟡 **Amadorismo:** "O que a gente constrói" — registro "a gente" é casual demais para o público que você quer. "Captação de Leads Estratégicos" e "Ebooks" são serviços de agência de marketing, não de engenharia.

🔻 **Pouca autoridade:** títulos genéricos — "Desenvolvimento Full Stack", "Sistemas Inteligentes", "Sites Institucionais Premium". "Premium" é a palavra que quem **não é** premium usa.

📣 **Excesso de marketing:** "Sites que convertem visitantes em clientes", "sistemas que escalam junto com o crescimento" — frases de brochura.

⬜ **Genérico:** todos os 6 primeiros cards poderiam estar em qualquer site de qualquer dev. Nada aqui é técnico o suficiente para um CTO pensar "esse cara sabe".

➕ **Falta:** profundidade técnica. Onde está arquitetura de sistemas, cloud/DevOps, integrações via API, agentes de IA/RAG, observabilidade? Você tem toda essa competência (está no seu prompt) e **nenhuma aparece nos serviços**.

🏆 **Como fariam:** Supabase/Railway descrevem serviços pela **capacidade técnica** ("Postgres, Auth, Realtime, Edge Functions"), não pelo genérico. Reescrita completa dos serviços em blocos técnicos está na **Seção 3** e **Seção 6**. **Recomendação forte:** tire ebooks da landing de software (crie uma página separada) ou remova.

---

### 1.6 Sobre

✅ **Bom:** honestidade ("IA como copiloto"), menção a startups reais (AG Digital, ConectCampo, FundFlow, Valuora) — isso é **ouro de credibilidade** e está subaproveitado. Card de status repetido dá consistência.

❌ **Ruim:** repetir o mesmo card de status/terminal do hero na seção sobre é preguiça visual — o usuário já viu esse componente. E de novo "Disponível agora".

🟡 **Amadorismo:** a nuvem de 14 tech-tags (React, Next.js, Node, Python, FastAPI, Postgres, Docker, AWS, GPT-4, Claude API, LangChain, Stripe, Tailwind, MongoDB) é **sticker soup** — a lista de tecnologias jogada sem hierarquia é o gesto mais freelancer que existe. Todo júnior lista Docker e AWS. Não prova domínio, prova que você sabe os nomes.

🔻 **Pouca autoridade:** "com mais de 4 anos de experiência" — de novo ancorando em tempo, que é seu ponto fraco. "participação ativa em startups" é vago (sócio? contratado? fundador técnico?).

⬜ **Genérico:** "Código com propósito e resultado mensurável" — headline de LinkedIn.

➕ **Falta:** prova de profundidade. Um CTO quer ver **decisões de arquitetura**, não logos de tecnologia. "Migrei o matching da ConectCampo de X para Y e cortei p95 de 800ms para 90ms" vale mais que 14 tags.

🏆 **Como fariam:** a página "about" da Anthropic/Linear conta uma **tese** (por que existimos, no que acreditamos sobre software). Substitua a nuvem de tags por 3–4 **princípios de engenharia** com uma frase cada. Reescrita na Seção 3.

---

### 1.7 Portfólio

9 cards: Buffalo Capital, Vexium, Valuora, ConectCampo, FundFlow, Linkora, AG Digital, Pró Sorrir, ESG360. Filtros por vertical. Modal ao clicar.

✅ **Bom:** **este é o seu maior ativo.** Produtos reais, verticais impressionantes (fintech, agtech, valuation, ESG, crypto), com jargão que denota competência real (DCF v7.1, Monte Carlo, Damodaran, GRI/SASB, Binance API, Risk Score). Filtros por vertical são um bom toque. A diversidade prova range.

❌ **Ruim — e é grave:** as imagens vêm de **`image.thum.io`** (serviço terceiro de screenshot ao vivo). Isso é (a) lento, (b) frequentemente falha — e você tem `onerror="this.style.display='none'"`, ou seja, **quando falha o card fica sem imagem**, parecendo quebrado; (c) tecnicamente é você admitindo que não tem screenshots próprios curados. Um dev que inspeciona o `<img>` (e CTOs inspecionam) vê `thum.io` e desconta pontos na hora.

🟡 **Amadorismo:** descrições de uma linha + 2–3 tech-tags. Sem contexto de problema/solução/resultado. "R$ 247M+" aparece no FundFlow mas não vira headline. Sem depoimento do cliente, sem link para case study.

🔻 **Pouca autoridade:** nenhuma métrica de engenharia. Que escala? Quantos usuários? Que stack real? Que desafio técnico foi resolvido? "Dashboard interativo e APIs financeiras" não prova nada.

⬜ **Genérico:** o formato card-imagem-título-3tags é o template de portfólio padrão.

➕ **Falta:** **case studies de verdade.** Cada projeto forte (Valuora, ConectCampo, Vexium, FundFlow) merece uma página `/cases/valuora` com: contexto → desafio técnico → arquitetura → decisões → resultado com número → depoimento. Screenshots próprios de alta qualidade. Logos dos clientes.

🏆 **Como fariam:** a página de customers da Vercel/Stripe é **estudo de caso com métrica no título** ("Empresa X cut build times 40%"). Cada logo é clicável para um case. Screenshots são curados, com `next/image`, nunca de serviço terceiro. Recomendação: escolha os **4 melhores** e faça cases profundos; os outros viram uma grade menor de "outros projetos".

---

### 1.8 Processo (4 passos)

✅ **Bom:** clareza, numeração, timeboxes. Transparência é boa.

❌ **Ruim:** o processo é **comercial** (Briefing → Proposta → Design/Dev → Entrega), não **de engenharia**. Não há menção a arquitetura, code review, testes, CI/CD, staging, observabilidade, handover técnico. Para um CTO, esse processo parece o de uma agência de sites.

🟡 **Amadorismo:** "Orçamento detalhado em até 4h. Contrato claro, sem letras miúdas ou surpresas." — linguagem de tranquilizar PME desconfiada, não de engenharia.

⬜ **Genérico:** Briefing/Proposta/Dev/Entrega é o processo de literalmente qualquer prestador.

➕ **Falta:** a camada técnica do "como". Discovery técnico, ADRs (Architecture Decision Records), ambientes, pipeline de CI/CD, testes automatizados, security review, observabilidade, SLA de suporte.

🏆 **Como fariam:** empresas de engenharia mostram o **rigor** — "Discovery → Arquitetura & ADRs → Sprints com CI/CD → Staging & QA → Deploy com observabilidade → Handover & SLA". Reescrita na Seção 3.

---

### 1.9 Diferenciais

4 cards: IA em cada etapa, Garantia 90 dias, 90%+ recorrentes, Velocidade Real.

✅ **Bom:** garantia de 90 dias é um diferencial concreto e defensável — mantenha.

❌ **Ruim:** 3 dos 4 diferenciais são **repetição** (IA, velocidade, recorrência já apareceram 3x cada). "Não somos uma agência. Somos uma operação enxuta" — reforça o "é uma pessoa só", que assusta enterprise.

📣 **Excesso de marketing:** "Enquanto outros ainda planejam, a gente já entregou" — bravata. "3× mais rápidos que agências" de novo, sem prova.

⬜ **Genérico:** velocidade, IA, garantia, retenção — nada aqui é tecnicamente diferenciável.

➕ **Falta:** diferenciais **técnicos reais**: "Arquitetura pensada para escalar", "Observabilidade desde o dia 1", "Segurança e LGPD by design", "Código seu, sem lock-in", "Testes automatizados". Esses convertem CTO.

🏆 **Como fariam:** diferenciais viram **garantias de engenharia**, não adjetivos. Reescrita na Seção 3.

---

### 1.10 Contato / CTA final

✅ **Bom:** ter formulário + email + WhatsApp cobre preferências.

❌ **Ruim — bug crítico:** o form aponta para `https://formspree.io/f/YOUR_FORM_ID` — **placeholder não configurado. O formulário não funciona.** Isso é um erro que sozinho destrói credibilidade e perde leads. Corrija hoje.

🟡 **Amadorismo:** "Sem burocracia, sem enrolação" — de novo linguagem anti-agência para PME.

🔻 **Pouca autoridade:** nenhuma opção de **agendar uma call** (Cal.com/Calendly). Para high-ticket, o CTA ideal não é "manda mensagem", é "agende 30 min com engenharia".

➕ **Falta:** agendamento, resposta esperada ("respondo em X"), o que acontece depois de enviar, garantia de NDA/confidencialidade.

🏆 **Como fariam:** Stripe/enterprise: "Talk to sales" → formulário qualificador (empresa, tamanho, orçamento) → agendamento. Para você: dois caminhos claros — "Agendar call técnica" (Cal.com) e "Enviar briefing".

---

### 1.11 Footer

✅ **Bom:** limpo, funcional.

❌ **Ruim/Falta:** footer é onde autoridade se ancora e você desperdiça. Falta: CNPJ, endereço/localização, "feito com [stack]", link para status page, política de privacidade/LGPD, links para cases, selo de segurança. Um footer magro comunica empresa magra.

🏆 **Como fariam:** footer denso e organizado por colunas (Produto/Empresa/Recursos/Legal), com status do sistema, compliance, e localização. Comunica solidez.

---

### 1.12 Estética global (tema, cores, motion)

✅ **Bom:** tipografia (Space Grotesk + Inter + JetBrains Mono) é uma escolha moderna e correta — é literalmente o stack de fontes de produtos como Linear/Vercel. Grid de fundo, orbs, scroll bar: competente.

❌ **Ruim — e você mesmo pediu para evitar:** o tema dark usa **verde neon `#00FF87` com glow** (`--green-glow:0 0 40px rgba(0,255,135,.25)`). Você escreveu explicitamente "nada neon". **Isso é neon.** O verde brilhante + glow puxa para a estética "hacker/gamer/crypto" — o oposto de Linear/Stripe/Anthropic, que usam cores dessaturadas e contraste sóbrio.

🟡 **Amadorismo:** orbs desfocados animados (`blur(120px)` flutuando) são o cliché de fundo SaaS 2020–2022. Referências atuais (Linear, Vercel, Anthropic) abandonaram isso por superfícies limpas, grão sutil, e gradientes quase imperceptíveis.

🏆 **Como fariam:** paleta quase monocromática, um único accent dessaturado, contraste vindo da tipografia e do espaçamento — não de glow. Detalhes na Seção 4.

---

## 2. Reposicionamento técnico (sem pesar para o empresário)

Você pediu para transmitir dezenas de capacidades técnicas (arquitetura, cloud, DevOps, CI/CD, RAG, MCP, vector DB, event-driven, etc.) **sem** afastar o cliente comum. A solução não é despejar os termos — é **camadas de leitura**:

- **Camada 1 (empresário/CEO):** headlines em linguagem de negócio → "Software que aguenta o crescimento sem quebrar."
- **Camada 2 (diretor/gestor):** subtexto com benefício técnico traduzido → "Arquitetura escalável, monitoramento em tempo real e segurança desde o primeiro commit."
- **Camada 3 (CTO/dev):** detalhe técnico em elementos "opt-in" — tooltips, blocos de código, diagramas de arquitetura, uma página `/stack` e `/arquitetura`. O CTO **procura** esse nível; ele não precisa estar gritando na home.

**Regra de ouro:** o empresário lê os títulos e entende o valor. O CTO clica nos detalhes e pensa "esse cara sabe". Ninguém é afastado porque o técnico está em **profundidade opcional**, não na superfície.

### Mapa: termo técnico → tradução de negócio (para usar no site)

| Capacidade técnica | Como o CTO vê | Como o empresário entende (copy) |
|---|---|---|
| Arquitetura escalável / Microservices / Serverless | Cresce sem reescrever | "Seu sistema aguenta 10 ou 10 milhões de usuários." |
| Observabilidade / Métricas / Logs | Sabe o que está acontecendo | "Monitoramento em tempo real — problemas detectados antes do cliente." |
| CI/CD / Testes / Deployment | Entrega segura e contínua | "Atualizações sem derrubar o sistema, testadas automaticamente." |
| Segurança / OAuth / SSO / LGPD | Não vaza dado | "Segurança e conformidade LGPD desde o primeiro dia." |
| RAG / Vector DB / Semantic Search | IA que usa os dados do cliente | "IA que responde com base nos SEUS dados, não em achismo." |
| Agentes de IA / Multi-Agent / MCP | Automação sofisticada | "Assistentes de IA que executam tarefas, não só conversam." |
| Redis / Caching / Queues / Workers | Rápido e resiliente | "Rápido mesmo sob pico de acesso." |
| Edge / Cloudflare / Performance | Latência baixa global | "Carrega instantâneo em qualquer lugar do mundo." |
| Clean Architecture / DDD / Event-Driven | Código que dá manutenção | "Código organizado que qualquer time futuro consegue evoluir." |
| IaC / Terraform / Docker / K8s | Infra reproduzível | "Infraestrutura profissional, sem 'gambiarra'." |

Essa tabela é o **dicionário editorial** do site inteiro. Toda copy nova sai dela.

---

## 3. Reescrita de copy (seção por seção)

Mantendo sua energia direta, mas elevando registro e autoridade. **Regra:** cortei "a gente", "orçamento", "enrolação", "premium", e todo superlativo sem prova.

### 3.1 `<title>` e meta

```
<title>Sartor Digital — Engenharia de software e sistemas com IA para empresas que não podem falhar</title>
<meta name="description" content="Projeto, arquiteto e construo sistemas sob medida — fintech, healthtech, agtech e SaaS. Arquitetura escalável, IA aplicada e segurança LGPD por padrão. R$ 247M+ movimentados em produtos que desenvolvi.">
```

### 3.2 Hero

**Badge (substituir):**
> ~~IA aplicada · Entrega em dias, não meses~~
> **Engenharia de software · IA aplicada · Produção-ready**

**H1 — três opções (escolha uma):**

**Opção A — infraestrutural (estilo Stripe):**
> # Software sob medida para empresas que **não podem falhar**.

**Opção B — competência + escopo (estilo Vercel):**
> # Sistemas, plataformas e IA aplicada — **arquitetados para escalar**.

**Opção C — direta com prova (estilo Linear):**
> # Da arquitetura ao deploy. **Engenharia de software que aguenta produção.**

**Subtítulo (substituir a promessa de prazo):**
> ~~Sites em até 5 dias. Sistemas em até 3 semanas. Velocidade real, código de qualidade, IA em cada etapa.~~
> **Projeto e construo produtos digitais completos — arquitetura escalável, IA integrada aos seus dados e segurança LGPD por padrão. Já ajudei a movimentar R$ 247M+ em fintechs, agtechs e SaaS.**

**Botões:**
> Primário: **Agendar call técnica** (→ Cal.com, não WhatsApp)
> Secundário: **Ver cases** →

**Strip (trocar por sinais de engenharia):**
> `Arquitetura escalável` · `IA aplicada aos seus dados` · `Segurança & LGPD por padrão`

> A velocidade não some — ela migra para a **prova** ("entrego rápido porque a engenharia é boa"), deixando de ser a promessa de capa. Ex.: uma linha discreta "Ciclos de entrega curtos, sem dívida técnica."

### 3.3 Stats (reescrever as 4 métricas)

| Antes | Depois |
|---|---|
| 12 Projetos Entregues | **12+ produtos em produção** |
| 90%+ Clientes Recorrentes | **R$ 247M+ movimentados** (nos produtos que construí) |
| 4 Anos de Experiência | **6 verticais** (fintech, agtech, healthtech, ESG, SaaS, insurtech) |
| ≤4h Tempo de Orçamento | **99,9% uptime** nos sistemas em produção *(use só se for verdade)* |

> Cada número precisa ser **verdadeiro e verificável**. Se não tiver o dado de uptime, troque por "3 idiomas / atendo o mundo" ou "100% dos projetos com testes automatizados". Nunca invente métrica — CTO checa.

### 3.4 Serviços — reescrita dos títulos e descrições

> Estrutura nova: menos cards genéricos, mais **blocos técnicos**. Retire "Ebooks" e "Captação de Leads" da home (movê-los para outra página).

| Card | Título novo | Descrição nova (camada negócio + técnica) |
|---|---|---|
| 1 | **Plataformas & SaaS sob medida** | "Sistemas multi-tenant que escalam com o negócio. Arquitetura limpa, Postgres, filas e workers, testes automatizados e deploy contínuo." |
| 2 | **IA aplicada aos seus dados** | "Agentes, RAG e busca semântica sobre a SUA base — não respostas genéricas. Vector database, avaliações de qualidade e guardrails." |
| 3 | **Arquitetura & Cloud** | "Infra que não te prende: AWS/Cloudflare, containers, IaC com Terraform, CI/CD e observabilidade desde o dia 1." |
| 4 | **Integrações & APIs** | "Conecto o que você já usa: pagamentos, ERPs, bancos, webhooks e APIs próprias documentadas. Event-driven quando faz sentido." |
| 5 | **Produtos web de alta performance** | "Front-ends rápidos no edge, SEO técnico e Core Web Vitals no verde. Experiência que carrega instantâneo em qualquer lugar." |
| 6 | **Evolução & SLA** | "Garantia técnica de 90 dias e planos de suporte com SLA. Monitoramento, correções e roadmap contínuo." |

**Headline da seção:**
> ~~O que a gente constrói~~ → **O que eu construo** (ou **O que construímos**, mantendo consistência formal)

### 3.5 Sobre — reescrita

> Cortar a nuvem de 14 tags. Substituir por **princípios de engenharia**.

**Headline:**
> ~~Código com propósito e resultado mensurável.~~ → **Engenharia de verdade, não improviso.**

**Parágrafo:**
> "Sou Giovanne Sartor. Projeto e construo sistemas que rodam em produção movimentando dinheiro real — de motores de valuation (Valuora) a marketplaces de crédito rural (ConectCampo) e plataformas de análise ESG (ESG360). Uso IA como acelerador, mas o que sustenta um produto é arquitetura, testes e observabilidade — e é aí que está meu foco."

**Substituir sticker soup por 4 princípios (cada um 1 frase):**
> **Arquitetura primeiro.** Decisões documentadas (ADRs), não improviso.
> **Produção-ready por padrão.** Testes, CI/CD e observabilidade desde o commit 1.
> **Segurança & LGPD by design.** Dado sensível tratado como sensível.
> **Sem lock-in.** O código é seu, a stack é aberta, o time futuro consegue evoluir.

### 3.6 Processo — reescrita técnica

| Passo | Título novo | Descrição |
|---|---|---|
| 01 | **Discovery técnico** | "Entendo o problema, os dados e as restrições. Saio com escopo e riscos mapeados." |
| 02 | **Arquitetura & ADRs** | "Defino stack, modelo de dados e decisões de arquitetura documentadas antes de escrever código." |
| 03 | **Sprints com CI/CD** | "Desenvolvimento em ciclos curtos, com testes automatizados e ambiente de staging a cada entrega." |
| 04 | **Deploy & Observabilidade** | "Go-live com monitoramento, logs e alertas. Handover completo + 90 dias de garantia e SLA." |

### 3.7 Diferenciais — reescrita

| Antes | Depois |
|---|---|
| IA em cada etapa | **IA aplicada aos seus dados** — RAG e agentes sobre a sua base, com avaliação de qualidade. |
| Garantia 90 dias | **Garantia técnica de 90 dias** (manter — é ótimo). |
| 90%+ recorrentes | **Escala sem reescrever** — arquitetura pensada para 10 ou 10M de usuários. |
| Velocidade Real | **Sem lock-in, sem dívida técnica** — código seu, testado, documentado. |

### 3.8 CTA final — reescrita

**Headline:**
> ~~Pronto para construir seu próximo produto?~~ → **Vamos arquitetar seu próximo sistema.**

**Sub:**
> "Me conte o problema. Em uma call de 30 minutos eu já devolvo direção técnica — arquitetura sugerida, riscos e caminho de entrega."

**CTAs:** `Agendar call técnica` (primário, Cal.com) · `Enviar briefing` (secundário, form funcionando).

---

## 4. Elevação visual (minimalismo Linear/Vercel/Anthropic)

### Correções de estética (alinhadas ao que você pediu: nada neon, nada gamer)

1. **Mate o neon.** Troque `#00FF87` por um accent dessaturado. Sugestão de paleta:
   - Accent único: um verde-esmeralda sóbrio `#10B981` no light / `#34D399` suave no dark, **sem glow**. Ou migre para um accent mais "engenharia" — grafite + um azul-aço `#3B82F6` dessaturado.
   - Remova todos os `box-shadow` de glow (`--green-glow`). Contraste vem de tipografia e espaço, não de brilho.
2. **Aposente os orbs.** Troque `blur(120px)` flutuante por: superfície lisa + grão sutil (noise SVG a 3% de opacidade) + um gradiente radial **quase imperceptível**. É o que Vercel/Anthropic fazem.
3. **Reduza o grid de fundo.** 60px é ok, mas baixe a opacidade e faça-o sumir suavemente nas bordas (mask radial).
4. **Corte os chips flutuantes** do hero. Substitua por **um** elemento de credibilidade estático (logos de clientes ou uma métrica).
5. **Um único componente de destaque, não repetido.** Não reuse o mesmo card de terminal no hero E no sobre.

### Novos componentes/microinterações (todos minimalistas)

- **Terminal interativo de verdade** no hero: em vez de texto estático, um `npm create sartor@latest` que "digita" e mostra o scaffold de um projeto (typewriter). Anthropic/Warp fazem isso com sobriedade.
- **Diagrama de arquitetura animado** (SVG): cliente → edge → API → fila/worker → DB → observabilidade. Linhas que "acendem" suavemente no scroll. Comunica competência técnica em 2 segundos ao CTO.
- **Bento grid** (estilo Linear/Vercel) para os diferenciais: caixas de tamanhos diferentes, uma com mini-gráfico de latência, uma com snippet de código, uma com o mapa de stack.
- **Logo wall** de clientes/verticais em grayscale, que ganha cor no hover.
- **Comparativo "com/sem"** — tabela sóbria: "Agência tradicional vs. Engenharia sob medida" (prazo, dívida técnica, lock-in, observabilidade).
- **Contadores de impacto** com `tabular-nums` e easing suave (você já tem contador — refine o easing).
- **Command menu (⌘K)** estilo Linear/Raycast para navegar o site — é um "flex" técnico que CTO nota e adora. Baixo custo, alto sinal.
- **Hover states com spring physics** sutis, não `scale(1.1) rotate(-5deg)` (que é brincalhão demais).
- **Code blocks com syntax highlight real** (Shiki) mostrando trechos reais de arquitetura.
- **Status dot real** puxando de uma status page (uptime) em vez de "Disponível agora".
- **Dark mode como padrão** — o público técnico espera dark; sirva dark primeiro, sóbrio.

### Motion — regras

Duração 150–250ms, `ease-out`, respeitar `prefers-reduced-motion`. Nada de bounce, nada de rotação, nada de pulse neon. O motion deve ser **quase imperceptível** — é o que separa Linear de template.

---

## 5. SEO — estrutura semântica, headings, schema

### Hierarquia de headings (hoje bagunçada — múltiplos H2 sem H1 único claro por seção)

```
H1 (único): Software sob medida para empresas que não podem falhar
  H2: O que eu construo
    H3: Plataformas & SaaS · IA aplicada · Arquitetura & Cloud · Integrações · Web performance · Evolução & SLA
  H2: Engenharia de verdade, não improviso   (sobre)
  H2: Cases em produção   (portfólio)
    H3: Valuora · ConectCampo · Vexium · FundFlow ...
  H2: Como eu trabalho   (processo)
    H3: Discovery · Arquitetura · Sprints · Deploy
  H2: Por que engenharia sob medida   (diferenciais)
  H2: Vamos arquitetar seu próximo sistema   (CTA)
```

### Keywords a atacar (cauda média, intenção comercial, PT-BR)

Primárias: `desenvolvimento de software sob medida`, `empresa de desenvolvimento de sistemas`, `desenvolvedor full stack sênior`, `consultoria de arquitetura de software`, `desenvolvimento de SaaS`.
IA: `integração de IA em sistemas`, `desenvolvimento de agentes de IA`, `RAG para empresas`, `chatbot com IA sobre meus dados`, `automação com LLM`.
Vertical (ouro — pouca concorrência): `desenvolvimento de software para fintech`, `sistema para agtech`, `plataforma de valuation`, `software para crédito rural`, `plataforma ESG`.

### Schema.org (JSON-LD a adicionar no `<head>`)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Sartor Digital",
      "url": "https://sartordigital.online",
      "logo": "https://sartordigital.online/assets/logo.png",
      "founder": {"@type": "Person", "name": "Giovanne Sartor"},
      "sameAs": [
        "https://www.linkedin.com/in/giovannesartor/",
        "https://www.instagram.com/sartordigital"
      ]
    },
    {
      "@type": "ProfessionalService",
      "name": "Sartor Digital",
      "serviceType": "Desenvolvimento de software sob medida e IA aplicada",
      "areaServed": "Worldwide",
      "priceRange": "$$$"
    },
    {
      "@type": "Person",
      "name": "Giovanne Sartor",
      "jobTitle": "Engenheiro de Software · Especialista em IA",
      "knowsAbout": ["Arquitetura de Software","Cloud","DevOps","LLMs","RAG","PostgreSQL","AWS"]
    }
  ]
}
```

> Adicione também `FAQPage` schema (ganha rich snippet) e `BreadcrumbList` nas páginas de case. Hospede logo/OG em domínio próprio, **não postimg.cc**.

### Meta técnico

- `og:image` dedicada 1200×630 no seu domínio.
- `twitter:card = summary_large_image`.
- Self-host das fontes (subset) — ganha LCP e tira dependência de CDN.
- Substituir Devicon inteiro por SVGs inline dos ~10 ícones usados.

---

## 6. Auditoria de conversão (CRO)

### Onde o visitante abandona

1. **Hero genérico** ("Desenvolvemos com IA") — o CTO não vê relevância nos primeiros 3s e sai. **Maior ponto de fuga.**
2. **CTA de WhatsApp/orçamento** — enterprise não converte por WhatsApp; falta o caminho "agendar call". Perde o lead alto-ticket silenciosamente.
3. **Ebook R$297 no meio dos serviços** — reancoragem de preço para baixo; o lead high-ticket desqualifica você.
4. **Portfólio sem prova** (imagens quebrando via thum.io) — quebra de confiança visual.
5. **Formulário quebrado** (`YOUR_FORM_ID`) — conversões literalmente perdidas.

### Onde falta prova social

- **Zero depoimentos.** Nenhum. Para high-ticket isso é fatal. Precisa de 3–5 quotes com nome, cargo, empresa e foto.
- **Zero logos de clientes** reconhecíveis exibidos como logo wall.
- **Nenhum resultado quantificado** por case ("reduzimos X", "processamos Y").
- **Nenhum sinal de terceiro** (GitHub, contribuições, artigos, palestras, estrelas de repo, certificações cloud).

### Onde falta confiança

- Sem CNPJ, sem localização, sem "quem já confiou".
- Sem página de segurança/LGPD/compliance.
- Sem status page / uptime real.
- "Uma pessoa só" implícito e não endereçado (bus factor).

### Onde falta CTA

- Falta CTA de **agendamento** (Cal.com) — o CTA certo para o ticket.
- Falta CTA intermediário no meio da página (depois do portfólio).
- Falta micro-CTA de baixo compromisso ("Baixe um case study em PDF").

### Onde falta escassez/urgência (com sobriedade — nada de countdown falso)

- Escassez honesta: "Aceito 2–3 projetos novos por trimestre" comunica demanda e exclusividade sem apelação. **Muito** mais forte que "Disponível agora" (que comunica o oposto).

### Onde falta diferenciação

- Todo o site poderia ser de qualquer dev. A diferenciação real — **seus cases em fintech/valuation/agtech** — está subaproveitada. Sua vertical financeira é o diferencial; hoje ele está enterrado no portfólio.

---

## 7. Auditoria técnica — componentes a adicionar

Priorizados por impacto na percepção de autoridade técnica:

| Componente | O que é | Por que importa | Esforço |
|---|---|---|---|
| **Página de Arquitetura** | Diagrama + explicação de como você desenha sistemas | Converte CTO como nada mais | Médio |
| **Stack page** (`/stack`) | Suas tecnologias organizadas por camada com o *porquê* de cada escolha | Prova domínio (vs. sticker soup) | Baixo |
| **Case studies profundos** | 4 cases com problema→arquitetura→resultado | Prova social + técnica | Médio-alto |
| **Status page** | Uptime real dos sistemas | Sinal de operação séria | Médio |
| **Roadmap público** | O que você está construindo/estudando | Estilo Linear, comunica seriedade | Baixo |
| **Benchmarks/Performance** | Core Web Vitals, latências, cobertura de testes | Prova mensurável | Baixo |
| **Comparativo** | Você vs. agência vs. contratar time interno | Ajuda decisão de compra | Baixo |
| **Bloco de segurança/LGPD** | Como você trata dados, compliance | Destrava fintech/healthtech | Baixo |
| **SLA & Garantia** | Termos claros de suporte pós-entrega | Reduz risco percebido | Baixo |
| **Página de Integrações** | Logos: Stripe, AWS, Cloudflare, OpenAI, Postgres... | Prova ecossistema | Baixo |
| **Terminal/CLI demo** | Interação real no hero | "Flex" técnico sóbrio | Médio |
| **Command menu ⌘K** | Navegação estilo Raycast/Linear | Sinal de craft | Médio |

---

## 8. Plano de melhoria priorizado

### 🔴 Prioridade ALTA (fazer esta semana — maior impacto, menor esforço)

| Ação | Impacto marca | Impacto conversão |
|---|---|---|
| **Corrigir o formulário** (`YOUR_FORM_ID` → Formspree real ou backend próprio) | — | **Crítico** — hoje perde 100% dos leads do form |
| **Reescrever o H1 e subtítulo** (Seção 3.2) | Alto | Alto |
| **Adicionar CTA de agendamento** (Cal.com) ao lado do WhatsApp | Médio | **Alto** (destrava público high-ticket) |
| **Tirar "Ebooks R$297" da home** (mover para outra página) | Alto | Alto (para reancoragem de preço) |
| **Trocar imagens do portfólio** (thum.io → screenshots próprios curados) | Alto | Médio |
| **Matar o neon** (`#00FF87`+glow → accent dessaturado, sem glow) | Alto | Baixo |
| **Trocar "Disponível agora"** por "Aceito 2–3 projetos/trimestre" | Médio | Médio |
| **Hospedar logo/OG fora do postimg.cc** | Médio (dev nota) | Baixo |

### 🟡 Prioridade MÉDIA (próximas 2–4 semanas)

| Ação | Impacto marca | Impacto conversão |
|---|---|---|
| **Reescrever serviços em blocos técnicos** (Seção 3.4) | Alto | Médio |
| **Reescrever processo para técnico** (Seção 3.6) | Alto | Médio |
| **Substituir sticker soup por 4 princípios de engenharia** | Alto | Baixo |
| **Adicionar 3–5 depoimentos** com nome/cargo/empresa | **Alto** | **Alto** |
| **Logo wall** de clientes/verticais | Alto | Médio |
| **Adicionar JSON-LD** (Organization/Person/Service/FAQ) | Médio (SEO) | Médio |
| **Reescrever stats** para métricas de impacto (Seção 3.3) | Alto | Médio |
| **Aposentar orbs + chips flutuantes**, superfícies limpas | Médio | Baixo |
| **Bloco de segurança/LGPD** | Médio | Alto (fintech/health) |

### 🟢 Prioridade BAIXA (backlog — diferenciação de longo prazo)

| Ação | Impacto marca | Impacto conversão |
|---|---|---|
| **Página de Arquitetura** com diagrama animado | **Alto** | Médio |
| **4 case studies profundos** (`/cases/...`) | Alto | Alto |
| **Status page** com uptime real | Médio | Médio |
| **Roadmap público** estilo Linear | Médio | Baixo |
| **Command menu ⌘K** | Médio (craft) | Baixo |
| **Terminal interativo** real no hero | Médio | Baixo |
| **Página /stack** com o "porquê" das escolhas | Alto | Baixo |
| **Comparativo com/sem** | Médio | Médio |
| **Self-host de fontes + SVGs inline** (perf) | Baixo | Baixo (LCP) |

---

## 9. Resumo executivo (se você ler só uma coisa)

**O que te mantém parecendo agência pequena / freelancer hoje:**
1. Velocidade e "orçamento em 4h" como argumento central.
2. WhatsApp como canal principal de conversão.
3. "Sem agência / direto com o dev" (vira fraqueza no enterprise).
4. Ebook de R$297 na mesma vitrine dos sistemas.
5. Imagens de portfólio via serviço terceiro que quebram.
6. Formulário quebrado.
7. Verde neon + orbs + chips flutuantes (estética 2021).
8. Sticker soup de tecnologias em vez de profundidade.

**O que já é forte e você deve amplificar:**
1. Portfólio real e impressionante em fintech/agtech/valuation/ESG.
2. Tipografia e base de layout competentes.
3. Garantia de 90 dias.
4. Menção a startups reais.
5. R$ 247M+ movimentados (enterre isso no hero — é seu melhor número).

**A mudança de mentalidade, em uma linha:**
> Pare de vender *rapidez a preço acessível*. Comece a vender *engenharia que aguenta produção* — e deixe a velocidade ser a **prova**, não a promessa.

Faça os 8 itens de Prioridade Alta primeiro. Sozinhos, eles já movem a percepção do "freelancer rápido" para "engenheiro sério" — que é exatamente o salto de 10x que você pediu.
