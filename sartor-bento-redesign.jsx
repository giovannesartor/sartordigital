import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ────────────────────────────────────────────
const G = "#22c55e";        // green-500
const GD = "#16a34a";       // green-700
const GL = "#86efac";       // green-300
const GLOW = "rgba(34,197,94,0.12)";

// ─── Data ─────────────────────────────────────────────────────
const NAV_LINKS = ["Sobre", "Serviços", "Portfólio", "Processo", "FAQ"];

const STATS = [
  { value: "21+", label: "Projetos Entregues" },
  { value: "100%", label: "Satisfação" },
  { value: "90d", label: "Suporte Garantido" },
  { value: "4", label: "Verticais" },
];

const TECH = ["React", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "OpenAI"];

const SERVICES = [
  {
    icon: "⚡",
    title: "Desenvolvimento Full Stack",
    desc: "Aplicações web completas do backend ao frontend, com arquitetura escalável e código limpo.",
    tags: ["React", "Next.js", "Node", "Python"],
    size: "large",
  },
  {
    icon: "🤖",
    title: "IA & Automação",
    desc: "Integração de modelos de linguagem, automações inteligentes e sistemas que aprendem.",
    tags: ["OpenAI", "LangChain", "Agents"],
    size: "medium",
  },
  {
    icon: "🌐",
    title: "Sites Premium",
    desc: "Landing pages e sites institucionais de alta conversão com design impecável.",
    tags: ["Next.js", "shadcn/ui", "SEO"],
    size: "medium",
  },
  {
    icon: "📊",
    title: "Captação de Leads",
    desc: "Estratégias e sistemas para atrair e converter leads qualificados.",
    tags: ["Analytics", "CRO", "Automação"],
    size: "small",
  },
  {
    icon: "🔧",
    title: "Manutenção & Suporte",
    desc: "Suporte contínuo, monitoramento e evolução dos seus produtos digitais.",
    tags: ["DevOps", "CI/CD", "Monitoring"],
    size: "small",
  },
  {
    icon: "🏗️",
    title: "Sistemas Inteligentes",
    desc: "ERPs, CRMs e plataformas SaaS customizadas para o seu negócio.",
    tags: ["SaaS", "Multi-tenant", "API"],
    size: "small",
  },
];

const PORTFOLIO = [
  { name: "Quanto Vale", cat: "Fintech", desc: "Valuation SaaS + DCF + IA", tech: ["Next.js","Python","OpenAI"], color: "#22c55e" },
  { name: "Vexium", cat: "Web3", desc: "Crypto Trading com IA", tech: ["React","FastAPI","ML"], color: "#6366f1" },
  { name: "ConectCampo", cat: "AgTech", desc: "Marketplace de Crédito Rural", tech: ["Next.js","PostgreSQL"], color: "#f59e0b" },
  { name: "FundFlow", cat: "Fintech", desc: "Captação de Recursos com IA", tech: ["Next.js","OpenAI","Stripe"], color: "#22c55e" },
  { name: "Linkora", cat: "SaaS", desc: "Link-in-Bio SaaS", tech: ["React","Node","PostgreSQL"], color: "#8b5cf6" },
  { name: "AG Digital", cat: "Fintech", desc: "Insurtech / Fintech / SaaS", tech: ["Next.js","FastAPI"], color: "#14b8a6" },
  { name: "Buffalo Capital", cat: "Fintech", desc: "Plataforma de Investimentos", tech: ["React","Python","AWS"], color: "#f97316" },
  { name: "SRT Brasil", cat: "SaaS", desc: "Sistema de Rastreamento", tech: ["React","Node","Maps"], color: "#06b6d4" },
  { name: "Valuora", cat: "Fintech", desc: "Análise de Ativos com IA", tech: ["Python","OpenAI","Next.js"], color: "#22c55e" },
];

const CATS = ["Todos", "Fintech", "AgTech", "MarTech", "Web3", "SaaS"];

const PROCESS = [
  { step: "01", title: "Briefing", sub: "Dia 1", desc: "Entendemos profundamente o seu negócio, objetivos e público-alvo." },
  { step: "02", title: "Prototipagem", sub: "Dias 2–5", desc: "Wireframes e protótipos navegáveis para validar antes de desenvolver." },
  { step: "03", title: "Desenvolvimento", sub: "Semanas 1–4", desc: "Código limpo, testes e revisões constantes com sua participação." },
  { step: "04", title: "Entrega & Suporte", sub: "Go-live", desc: "Deploy, treinamento e 90 dias de suporte garantido pós-entrega." },
];

const FAQS = [
  { q: "Quanto tempo leva para entregar um projeto?", a: "A maioria dos projetos é entregue em 2 a 6 semanas. Projetos mais complexos como sistemas SaaS podem levar até 3 meses. Definimos um cronograma claro no briefing inicial." },
  { q: "Atendem clientes internacionais?", a: "Sim! Atendemos clientes no Brasil, EUA, Europa e outros países. Trabalhamos em português, inglês e espanhol. Toda documentação e comunicação pode ser feita no idioma de sua preferência." },
  { q: "Quais tecnologias vocês utilizam?", a: "Nosso stack principal é React/Next.js para o frontend, Python (FastAPI) para backend, PostgreSQL para banco de dados e AWS/Cloudflare para infraestrutura. Usamos as melhores ferramentas para cada projeto." },
  { q: "Como funciona a precificação?", a: "Cada projeto é orçado individualmente com base no escopo e complexidade. Trabalhamos com valores fixos por projeto ou contratos mensais de manutenção. Sem surpresas — tudo definido antes de começar." },
  { q: "Vocês oferecem suporte após a entrega?", a: "Sim! Todo projeto inclui 90 dias de suporte gratuito após o go-live. Depois, oferecemos planos de manutenção mensais para evolução contínua do produto." },
];

// ─── Micro Components ─────────────────────────────────────────
function Tag({ children, color = "#3f3f46", textColor = "#a1a1aa" }) {
  return (
    <span style={{
      background: color,
      color: textColor,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 99,
      letterSpacing: "0.04em",
    }}>
      {children}
    </span>
  );
}

function GreenDot() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, display: "inline-block", boxShadow: `0 0 6px ${G}` }} />
    </span>
  );
}

function Chip({ children }) {
  return (
    <span style={{
      border: `1px solid #27272a`,
      color: "#71717a",
      fontSize: 11,
      padding: "2px 10px",
      borderRadius: 99,
      background: "#18181b",
    }}>
      {children}
    </span>
  );
}

// ─── Nav ──────────────────────────────────────────────────────
function Nav({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scroll = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(9,9,11,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid #18181b" : "1px solid transparent",
      transition: "all 0.3s",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div style={{ width: 28, height: 28, background: G, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#000", fontWeight: 900, fontSize: 13 }}>S</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.03em" }}>Sartor Digital</span>
        </div>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => scroll(l.toLowerCase())}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: activeSection === l.toLowerCase() ? G : "#71717a",
                fontSize: 13, fontWeight: 500,
                padding: "6px 12px", borderRadius: 8,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => { if (activeSection !== l.toLowerCase()) e.target.style.color = "#d4d4d8"; }}
              onMouseLeave={e => { if (activeSection !== l.toLowerCase()) e.target.style.color = "#71717a"; }}
            >{l}</button>
          ))}
          <button onClick={() => scroll("contato")} style={{
            background: G, color: "#000", border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 700, padding: "7px 18px", borderRadius: 8,
            marginLeft: 8, transition: "all 0.2s",
          }}
          onMouseEnter={e => e.target.style.background = GL}
          onMouseLeave={e => e.target.style.background = G}
          >Iniciar Projeto</button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────
function Hero() {
  const [count, setCount] = useState({ projects: 0, satisfaction: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      let p = 0; let s = 0;
      const interval = setInterval(() => {
        p = Math.min(p + 1, 21);
        s = Math.min(s + 5, 100);
        setCount({ projects: p, satisfaction: s });
        if (p >= 21 && s >= 100) clearInterval(interval);
      }, 40);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" style={{ paddingTop: 80, paddingBottom: 60, padding: "100px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Top badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          border: `1px solid ${G}40`, background: GLOW,
          borderRadius: 99, padding: "6px 16px",
        }}>
          <GreenDot />
          <span style={{ fontSize: 12, color: GL, fontWeight: 500 }}>Disponível para novos projetos em 2026</span>
        </div>
      </div>

      {/* Main headline */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{
          fontSize: "clamp(32px, 6vw, 60px)", fontWeight: 900,
          letterSpacing: "-0.04em", lineHeight: 1.05,
          color: "#fff", margin: "0 0 16px",
        }}>
          Engenharia de Software<br />
          <span style={{
            backgroundImage: `linear-gradient(90deg, ${G}, ${GL})`,
            WebkitBackgroundClip: "text", backgroundClip: "text",
            color: "transparent",
          }}>& IA Aplicada</span>
          {" "}para escalar<br />seu negócio.
        </h1>
        <p style={{ color: "#71717a", fontSize: 16, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.6 }}>
          Construímos produtos digitais completos — do backend ao design — com foco em resultado e escalabilidade real.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button style={{
            background: G, color: "#000", border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 10,
          }}>Iniciar Projeto →</button>
          <button style={{
            background: "transparent", color: "#d4d4d8", border: "1px solid #3f3f46",
            cursor: "pointer", fontWeight: 500, fontSize: 14, padding: "12px 28px", borderRadius: 10,
          }}>Ver Portfólio</button>
        </div>
      </div>

      {/* ─── BENTO GRID ─── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "auto auto",
        gap: 14,
      }}>

        {/* Card 1: Projects counter — span 1 */}
        <div style={{ gridColumn: "1", gridRow: "1", ...card(), background: G, border: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px" }}>
          <div style={{ color: "#000", fontSize: 11, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em" }}>Projetos</div>
          <div>
            <div style={{ color: "#000", fontWeight: 900, fontSize: 52, lineHeight: 1, letterSpacing: "-0.04em" }}>{count.projects}+</div>
            <div style={{ color: "#000", opacity: 0.6, fontSize: 12, marginTop: 4 }}>entregues com sucesso</div>
          </div>
        </div>

        {/* Card 2: Main feature — span 2 */}
        <div style={{ gridColumn: "2 / 4", gridRow: "1", ...card(), padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {TECH.slice(0, 5).map(t => <Chip key={t}>{t}</Chip>)}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#fff", marginBottom: 12 }}>
              Stack moderno, código limpo,<br />produtos que escalam.
            </div>
            <div style={{ color: "#71717a", fontSize: 13, lineHeight: 1.5 }}>
              React, Next.js, Python, FastAPI, PostgreSQL, Docker, AWS — e tudo que seu projeto precisa para crescer sem dor.
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
            {TECH.slice(5).map(t => <Chip key={t}>{t}</Chip>)}
          </div>
        </div>

        {/* Card 3: Satisfaction — span 1 */}
        <div style={{ gridColumn: "4", gridRow: "1", ...card(), padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ color: "#71717a", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Satisfação</div>
          <div>
            <div style={{ color: G, fontWeight: 900, fontSize: 48, lineHeight: 1, letterSpacing: "-0.04em" }}>{count.satisfaction}%</div>
            <div style={{ color: "#52525b", fontSize: 12, marginTop: 4 }}>dos clientes recomendam</div>
          </div>
        </div>

        {/* Card 4: Services quick — span 2 */}
        <div style={{ gridColumn: "1 / 3", gridRow: "2", ...card(), padding: "24px" }}>
          <div style={{ color: "#71717a", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>O que fazemos</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {SERVICES.slice(0, 3).map(s => (
              <div key={s.title} style={{ background: "#18181b", borderRadius: 10, padding: "14px 12px", border: "1px solid #27272a" }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ color: "#d4d4d8", fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{s.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 5: CTA/AI highlight — span 1 */}
        <div style={{ gridColumn: "3", gridRow: "2", ...card(), padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: -20, right: -20, width: 80, height: 80,
            background: `radial-gradient(circle, ${G}30 0%, transparent 70%)`,
          }} />
          <div style={{ fontSize: 28, marginBottom: 12 }}>🤖</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em", marginBottom: 6 }}>IA Aplicada</div>
          <div style={{ color: "#71717a", fontSize: 12, lineHeight: 1.5 }}>Integramos modelos de linguagem e automações inteligentes nos seus sistemas.</div>
        </div>

        {/* Card 6: Suporte 90d — span 1 */}
        <div style={{ gridColumn: "4", gridRow: "2", ...card(), padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ color: "#71717a", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Suporte Pós-entrega</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 42, lineHeight: 1, letterSpacing: "-0.04em" }}>90</div>
            <div style={{ color: G, fontWeight: 700, fontSize: 16 }}>dias</div>
            <div style={{ color: "#52525b", fontSize: 11, marginTop: 4 }}>garantidos gratuitamente</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────
function About() {
  return (
    <section id="sobre" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <div style={{ color: G, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>Quem Somos</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 20px" }}>
            Tecnologia, design e<br />
            <span style={{ color: G }}>inteligência artificial</span><br />
            para transformar negócios.
          </h2>
          <p style={{ color: "#71717a", lineHeight: 1.7, fontSize: 14, marginBottom: 24 }}>
            Somos uma software house especializada em construir produtos digitais que realmente funcionam. Combinamos engenharia sólida com design moderno e IA aplicada para entregar soluções que escalam junto com seu negócio.
          </p>
          <p style={{ color: "#71717a", lineHeight: 1.7, fontSize: 14, marginBottom: 32 }}>
            Atuamos em Fintech, AgTech, MarTech, Web3 e SaaS — com projetos entregues para clientes no Brasil e no exterior.
          </p>
          <button style={{
            background: "transparent", color: G, border: `1px solid ${G}`,
            cursor: "pointer", fontWeight: 600, fontSize: 13,
            padding: "10px 24px", borderRadius: 8,
          }}>Ver Portfólio Completo →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ ...card(), padding: "28px 24px" }}>
              <div style={{ color: G, fontWeight: 900, fontSize: 36, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: "#71717a", fontSize: 12, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────
function Services() {
  const [active, setActive] = useState(null);
  return (
    <section id="serviços" style={{ padding: "80px 24px", background: "#060608" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader label="Serviços" title="O que fazemos" subtitle="Soluções completas de engenharia e IA para cada fase do seu crescimento." />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto", gap: 14 }}>
          {/* Large card */}
          <div style={{ gridColumn: "1 / 3", ...card(), padding: "32px", cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${G}60`}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ fontSize: 36 }}>{SERVICES[0].icon}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {SERVICES[0].tags.map(t => <Tag key={t} color={GLOW} textColor={G}>{t}</Tag>)}
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>{SERVICES[0].title}</div>
            <div style={{ color: "#71717a", fontSize: 14, lineHeight: 1.6 }}>{SERVICES[0].desc}</div>
          </div>

          {/* Medium card */}
          <div style={{ gridColumn: "3", gridRow: "1 / 3", ...card(), padding: "32px", cursor: "pointer", transition: "border-color 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${G}60`}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}
          >
            <div>
              <div style={{ fontSize: 36, marginBottom: 20 }}>{SERVICES[1].icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>{SERVICES[1].title}</div>
              <div style={{ color: "#71717a", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{SERVICES[1].desc}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SERVICES[1].tags.map(t => <Tag key={t} color={GLOW} textColor={G}>{t}</Tag>)}
              </div>
            </div>
            <div style={{ marginTop: 32, padding: "16px", background: GLOW, borderRadius: 10, border: `1px solid ${G}30` }}>
              <div style={{ color: G, fontSize: 13, fontWeight: 700 }}>Diferencial</div>
              <div style={{ color: "#d4d4d8", fontSize: 12, marginTop: 4 }}>Usamos os modelos mais avançados do mercado com infraestrutura própria e segura.</div>
            </div>
          </div>

          {/* 4 small cards */}
          {SERVICES.slice(2).map(s => (
            <div key={s.title} style={{ ...card(), padding: "24px", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${G}60`}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.title}</div>
              <div style={{ color: "#71717a", fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>{s.desc}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {s.tags.map(t => <Chip key={t}>{t}</Chip>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio ────────────────────────────────────────────────
function Portfolio() {
  const [cat, setCat] = useState("Todos");
  const filtered = cat === "Todos" ? PORTFOLIO : PORTFOLIO.filter(p => p.cat === cat);

  return (
    <section id="portfólio" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <SectionHeader label="Portfólio" title="Projetos em destaque" subtitle="21+ produtos entregues em Fintech, AgTech, MarTech, Web3 e SaaS." />

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            background: cat === c ? G : "#18181b",
            color: cat === c ? "#000" : "#71717a",
            border: `1px solid ${cat === c ? G : "#3f3f46"}`,
            borderRadius: 99, padding: "6px 18px",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s",
          }}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {filtered.map((p, i) => (
          <div key={p.name} style={{
            ...card(),
            padding: "22px",
            cursor: "pointer",
            gridColumn: i === 0 && cat === "Todos" ? "1 / 3" : "auto",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "80"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {/* Color bar */}
            <div style={{ height: 3, background: p.color, borderRadius: 99, marginBottom: 16, width: "40%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>{p.name}</div>
              <span style={{ background: "#27272a", color: "#a1a1aa", fontSize: 10, padding: "2px 8px", borderRadius: 99 }}>{p.cat}</span>
            </div>
            <div style={{ color: "#71717a", fontSize: 12, marginBottom: 14 }}>{p.desc}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {p.tech.map(t => <Chip key={t}>{t}</Chip>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Process ─────────────────────────────────────────────────
function Process() {
  return (
    <section id="processo" style={{ padding: "80px 24px", background: "#060608" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader label="Processo" title="Como trabalhamos" subtitle="Um processo claro e colaborativo do briefing ao go-live." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {PROCESS.map((p, i) => (
            <div key={p.step} style={{ ...card(), padding: "28px 24px", position: "relative", overflow: "hidden" }}>
              {/* Step number background */}
              <div style={{
                position: "absolute", top: -10, right: -10,
                fontSize: 80, fontWeight: 900, color: "#18181b",
                lineHeight: 1, userSelect: "none",
              }}>{p.step}</div>
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: GLOW, border: `1px solid ${G}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: G, fontSize: 11, fontWeight: 800 }}>{p.step}</span>
                  </div>
                  <span style={{ color: "#52525b", fontSize: 11 }}>{p.sub}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>{p.title}</div>
                <div style={{ color: "#71717a", fontSize: 13, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: "80px 24px", maxWidth: 760, margin: "0 auto" }}>
      <SectionHeader label="FAQ" title="Perguntas frequentes" subtitle="Tudo que você precisa saber antes de começar." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAQS.map((f, i) => (
          <div key={i} style={{
            ...card(),
            overflow: "hidden",
            cursor: "pointer",
            transition: "border-color 0.2s",
            borderColor: open === i ? `${G}50` : "#27272a",
          }} onClick={() => setOpen(open === i ? null : i)}>
            <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#d4d4d8" }}>{f.q}</span>
              <span style={{ color: G, fontSize: 18, fontWeight: 700, flexShrink: 0, marginLeft: 16, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
            </div>
            {open === i && (
              <div style={{ padding: "0 24px 20px", color: "#71717a", fontSize: 13, lineHeight: 1.7 }}>
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contato" style={{ padding: "80px 24px", background: "#060608" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div style={{ color: G, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>Contato</div>
        <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 16px" }}>
          Vamos construir algo<br />
          <span style={{ color: G }}>incrível juntos.</span>
        </h2>
        <p style={{ color: "#71717a", fontSize: 15, marginBottom: 40, lineHeight: 1.6 }}>
          Conte seu projeto e responderemos em até 15 minutos via WhatsApp.
        </p>

        {/* Contact cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
          {[
            { icon: "💬", label: "WhatsApp", value: "+55 54 9930-1264" },
            { icon: "📧", label: "E-mail", value: "contato@sartordigital.online" },
            { icon: "📷", label: "Instagram", value: "@sartordigital" },
          ].map(c => (
            <div key={c.label} style={{ ...card(), padding: "20px 16px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ color: "#52525b", fontSize: 11, marginBottom: 4 }}>{c.label}</div>
              <div style={{ color: "#d4d4d8", fontSize: 12, fontWeight: 600 }}>{c.value}</div>
            </div>
          ))}
        </div>

        <button style={{
          background: G, color: "#000", border: "none", cursor: "pointer",
          fontWeight: 800, fontSize: 15, padding: "16px 40px", borderRadius: 12,
          display: "inline-flex", alignItems: "center", gap: 10,
        }}>
          💬 Falar no WhatsApp
        </button>
        <div style={{ marginTop: 12, color: "#52525b", fontSize: 12 }}>
          ⚡ Respondemos em até 15 minutos
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #18181b", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, background: G, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#000", fontWeight: 900, fontSize: 11 }}>S</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Sartor Digital</span>
        </div>
        <div style={{ color: "#52525b", fontSize: 12 }}>© 2026 sartordigital.online · Desenvolvido com ❤ por Sartor Digital</div>
        <div style={{ display: "flex", gap: 16 }}>
          {["Instagram", "WhatsApp", "LinkedIn"].map(s => (
            <span key={s} style={{ color: "#52525b", fontSize: 12, cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = G}
              onMouseLeave={e => e.target.style.color = "#52525b"}
            >{s}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Section Header ───────────────────────────────────────────
function SectionHeader({ label, title, subtitle }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ color: G, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
        <GreenDot /> {label}
      </div>
      <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 12px", lineHeight: 1.1 }}>{title}</h2>
      {subtitle && <p style={{ color: "#71717a", fontSize: 15, maxWidth: 500, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

// ─── Card style ───────────────────────────────────────────────
function card() {
  return {
    background: "#0f0f10",
    border: "1px solid #27272a",
    borderRadius: 16,
  };
}

// ─── Scroll progress bar ──────────────────────────────────────
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((window.scrollY / total) * 100);
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 2 }}>
      <div style={{ height: "100%", width: `${progress}%`, background: G, transition: "width 0.1s" }} />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────
export default function SartorDigital() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll("section[id]").forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: "#09090b", color: "#fff", minHeight: "100vh", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <ScrollProgress />
      <Nav activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Process />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
