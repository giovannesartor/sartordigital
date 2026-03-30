import { useState } from "react";

const GREEN = "#22c55e";
const GREEN_DARK = "#16a34a";
const GREEN_GLOW = "rgba(34,197,94,0.18)";

const concepts = [
  {
    id: "bento",
    name: "Bento Grid",
    tag: "Moderno · Apple-style",
    emoji: "⬛",
    description:
      "Layout em grid assimétrico tipo Apple/Vercel. Cards grandes com hierarquia visual clara. Super sofisticado para agência tech.",
    pros: ["Portfólio impactante", "Fácil de escalar", "Muito na moda em 2026"],
    cons: ["Mais complexo de implementar", "Requer boas imagens"],
    preview: (
      <div className="relative w-full h-full bg-zinc-950 p-3 overflow-hidden rounded-xl">
        {/* Nav */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-green-400 font-bold text-xs tracking-widest">SARTOR DIGITAL</div>
          <div className="flex gap-2">
            {["Sobre","Serviços","Portfólio"].map(n => (
              <div key={n} className="text-zinc-500 text-[8px]">{n}</div>
            ))}
            <div className="bg-green-500 text-black text-[8px] px-2 py-0.5 rounded-full font-bold">Contato</div>
          </div>
        </div>
        {/* Bento Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[calc(100%-32px)]">
          {/* Hero large */}
          <div className="col-span-2 row-span-1 bg-zinc-900 rounded-xl p-3 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="text-[8px] text-green-400 tracking-widest mb-1">ENGENHARIA DIGITAL · IA APLICADA</div>
              <div className="text-white font-bold text-xs leading-tight">Software & IA para<br/>escalar seu negócio</div>
            </div>
            <div className="flex gap-1">
              <div className="bg-green-500 text-black text-[7px] px-2 py-0.5 rounded-full font-bold">Iniciar Projeto</div>
              <div className="border border-zinc-600 text-zinc-400 text-[7px] px-2 py-0.5 rounded-full">Portfólio</div>
            </div>
          </div>
          {/* Stat card */}
          <div className="col-span-1 row-span-1 bg-green-500 rounded-xl p-2 flex flex-col justify-between">
            <div className="text-black text-[8px] font-semibold">Projetos</div>
            <div className="text-black font-black text-2xl">21+</div>
            <div className="text-black/60 text-[7px]">Entregues com sucesso</div>
          </div>
          {/* Tech stack card */}
          <div className="col-span-1 row-span-1 bg-zinc-900 rounded-xl p-2 border border-zinc-800">
            <div className="text-[7px] text-zinc-500 mb-1">STACK</div>
            <div className="flex flex-wrap gap-1">
              {["React","Next","Python","AI","AWS"].map(t => (
                <div key={t} className="bg-zinc-800 text-zinc-300 text-[6px] px-1 py-0.5 rounded">{t}</div>
              ))}
            </div>
          </div>
          {/* Service cards */}
          <div className="col-span-2 row-span-1 bg-zinc-900 rounded-xl p-2 border border-zinc-800 flex gap-2">
            {["Full Stack","IA & Automação","Sites Premium"].map(s => (
              <div key={s} className="flex-1 bg-zinc-800 rounded-lg p-1.5">
                <div className="w-3 h-3 bg-green-500/20 rounded mb-1 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"/>
                </div>
                <div className="text-[7px] text-white font-medium">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "glass",
    name: "Glassmorphism Premium",
    tag: "Luxo · Futurista",
    emoji: "✨",
    description:
      "Cards com efeito vidro fosco, gradientes sutis e glows verdes. Visual premium que transmite inovação e sofisticação.",
    pros: ["Visual deslumbrante", "Muito premium", "Diferenciate da concorrência"],
    cons: ["Pode pesar no mobile", "Requer atenção ao contraste"],
    preview: (
      <div className="relative w-full h-full overflow-hidden rounded-xl" style={{background: "linear-gradient(135deg, #0a0a0a 0%, #0d1a12 50%, #050f0a 100%)"}}>
        {/* Glow blobs */}
        <div className="absolute top-4 left-8 w-24 h-24 rounded-full opacity-30" style={{background: "radial-gradient(circle, #22c55e 0%, transparent 70%)", filter:"blur(20px)"}}/>
        <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full opacity-20" style={{background: "radial-gradient(circle, #22c55e 0%, transparent 70%)", filter:"blur(15px)"}}/>

        <div className="relative z-10 p-3 h-full flex flex-col">
          {/* Nav */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-green-400 font-bold text-xs tracking-widest">SARTOR DIGITAL</div>
            <div className="rounded-full px-2 py-0.5 text-[8px] text-green-300 border border-green-500/30" style={{backdropFilter:"blur(8px)", background:"rgba(34,197,94,0.08)"}}>
              Iniciar Projeto →
            </div>
          </div>
          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[8px] text-green-400 tracking-[0.2em] mb-2">● ENGENHARIA · IA APLICADA</div>
            <div className="text-white font-black text-sm leading-tight mb-3">
              Software & IA<br/>
              <span style={{color:"transparent", backgroundImage:"linear-gradient(90deg, #22c55e, #86efac)", WebkitBackgroundClip:"text", backgroundClip:"text"}}>
                para escalar
              </span><br/>
              seu negócio
            </div>
            {/* Glass cards row */}
            <div className="flex gap-2 mt-2">
              {[
                {label:"Projetos", value:"21+"},
                {label:"Satisfação", value:"100%"},
                {label:"Suporte", value:"90d"},
              ].map(s => (
                <div key={s.label} className="flex-1 rounded-xl p-2 border" style={{
                  backdropFilter:"blur(12px)",
                  background:"rgba(255,255,255,0.04)",
                  borderColor:"rgba(34,197,94,0.2)"
                }}>
                  <div className="text-green-400 font-black text-sm">{s.value}</div>
                  <div className="text-zinc-500 text-[7px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "terminal",
    name: "Terminal / Dev Mode",
    tag: "Geek · Autêntico",
    emoji: "💻",
    description:
      "Visual inspirado em code editor. Tipografia monospace, efeito de digitação, syntax highlight verde. Autentico para agência dev.",
    pros: ["Super original", "Perfeito para dev audience", "Fácil de implementar"],
    cons: ["Menos apelo para não-devs", "Pode parecer nichado"],
    preview: (
      <div className="relative w-full h-full bg-[#0d0d0d] rounded-xl overflow-hidden font-mono">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-b border-zinc-800">
          <div className="w-2 h-2 rounded-full bg-red-500"/>
          <div className="w-2 h-2 rounded-full bg-yellow-500"/>
          <div className="w-2 h-2 rounded-full bg-green-500"/>
          <div className="text-[7px] text-zinc-500 ml-2">sartor-digital ~ portfolio</div>
        </div>
        {/* Terminal content */}
        <div className="p-3 text-[8px] leading-relaxed">
          <div className="text-green-400">$ whoami</div>
          <div className="text-zinc-300 mt-0.5">sartor_digital — software engineering + AI</div>
          <div className="text-green-400 mt-1.5">$ ls ./services</div>
          <div className="mt-0.5">
            <span className="text-blue-400">full-stack/</span>
            <span className="text-blue-400 ml-2">ia-automation/</span>
            <span className="text-blue-400 ml-2">sites-premium/</span>
          </div>
          <div className="text-green-400 mt-1.5">$ cat ./stats.json</div>
          <div className="text-zinc-400 mt-0.5">{"{"}</div>
          <div className="ml-2">
            <span className="text-red-400">"projects"</span>
            <span className="text-zinc-400">: </span>
            <span className="text-green-300">21</span>
            <span className="text-zinc-400">,</span>
          </div>
          <div className="ml-2">
            <span className="text-red-400">"satisfaction"</span>
            <span className="text-zinc-400">: </span>
            <span className="text-green-300">"100%"</span>
            <span className="text-zinc-400">,</span>
          </div>
          <div className="ml-2">
            <span className="text-red-400">"stack"</span>
            <span className="text-zinc-400">: </span>
            <span className="text-yellow-300">["React","Next","Python","AI"]</span>
          </div>
          <div className="text-zinc-400">{"}"}</div>
          <div className="text-green-400 mt-1.5 flex items-center gap-1">$ <span className="bg-green-400 w-1.5 h-3 inline-block animate-pulse ml-0.5"/></div>
        </div>
      </div>
    ),
  },
  {
    id: "saas",
    name: "Minimal SaaS",
    tag: "Linear · Vercel-inspired",
    emoji: "◻",
    description:
      "Ultra minimalista, tipografia agressiva, muito espaçamento. Estilo Vercel/Linear/Stripe. Transmite confiança e maturidade de produto.",
    pros: ["Atemporal e elegante", "Carrega rápido", "Alta credibilidade"],
    cons: ["Mais frio/corporativo", "Menos chamativo"],
    preview: (
      <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
        <div className="p-3 h-full flex flex-col">
          {/* Nav */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900">
            <div className="text-white font-semibold text-xs tracking-tight">Sartor Digital</div>
            <div className="flex items-center gap-3">
              {["Serviços","Portfólio"].map(n => (
                <div key={n} className="text-zinc-500 text-[8px]">{n}</div>
              ))}
              <div className="border border-zinc-700 text-white text-[7px] px-2 py-0.5 rounded-md">Contato</div>
            </div>
          </div>
          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1 mb-3">
              <div className="w-1 h-1 rounded-full bg-green-400"/>
              <div className="text-[7px] text-zinc-400 tracking-widest uppercase">Disponível para projetos</div>
            </div>
            <div className="text-white font-black leading-none mb-2" style={{fontSize:"18px", letterSpacing:"-0.04em"}}>
              Engenharia de<br/>software & IA.
            </div>
            <div className="text-zinc-500 text-[8px] mb-3 leading-relaxed max-w-[180px]">
              Construímos produtos digitais que escalam. Full stack + AI aplicada.
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white text-black text-[7px] px-2.5 py-1 rounded-md font-semibold">Iniciar Projeto</div>
              <div className="text-[7px] text-zinc-500 flex items-center gap-1">Ver portfólio <span>→</span></div>
            </div>
            {/* Stats line */}
            <div className="flex gap-4 mt-4 pt-3 border-t border-zinc-900">
              {[["21+","projetos"],["100%","satisfação"],["4","verticais"]].map(([v,l]) => (
                <div key={l}>
                  <div className="text-white font-bold text-xs">{v}</div>
                  <div className="text-zinc-600 text-[6px] uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const improvements = [
  { icon: "⚡", title: "Migrar para Next.js + shadcn/ui", desc: "Roteamento, SEO nativo, Server Components. Muito mais profissional que HTML estático." },
  { icon: "🔍", title: "SEO Técnico", desc: "Meta tags dinâmicas, sitemap, schema markup para aparecer melhor no Google." },
  { icon: "📊", title: "Página de Case Studies", desc: "Em vez de cards simples, criar páginas completas por projeto com resultados reais." },
  { icon: "🤖", title: "Chat de IA no site", desc: "Um chatbot que responde perguntas sobre seus serviços 24/7 e captura leads." },
  { icon: "📱", title: "Mobile First Rewrite", desc: "O site atual funciona no mobile mas foi pensado para desktop. Inverter essa lógica." },
  { icon: "🎯", title: "Landing Pages por Nicho", desc: "Páginas dedicadas para Fintech, AgTech, etc. com copy específico por segmento." },
  { icon: "📈", title: "Testimonials com Prova Social", desc: "Depoimentos reais de clientes, preferencialmente com foto e cargo." },
  { icon: "⚙️", title: "Blog / Artigos Técnicos", desc: "Conteúdo técnico gera tráfego orgânico e posiciona como autoridade." },
];

export default function RedesignShowcase() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [tab, setTab] = useState("concepts");

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", color: "white", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #18181b", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: GREEN, fontSize: 11, letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Sartor Digital</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Redesign Concepts</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["concepts", "improvements"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? GREEN : "transparent",
              color: tab === t ? "#000" : "#71717a",
              border: `1px solid ${tab === t ? GREEN : "#3f3f46"}`,
              borderRadius: 8,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.2s"
            }}>
              {t === "concepts" ? "🎨 Direções" : "⚡ Melhorias"}
            </button>
          ))}
        </div>
      </div>

      {tab === "concepts" && (
        <div style={{ padding: "32px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 13, color: "#71717a", maxWidth: 500, margin: "0 auto" }}>
              4 direções de redesign mantendo suas cores. Clique para selecionar a favorita.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 900, margin: "0 auto" }}>
            {concepts.map(c => (
              <div
                key={c.id}
                onClick={() => setSelected(selected === c.id ? null : c.id)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  border: `2px solid ${selected === c.id ? GREEN : hovered === c.id ? "#3f3f46" : "#27272a"}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: "#0f0f10",
                  boxShadow: selected === c.id ? `0 0 0 4px ${GREEN_GLOW}` : "none",
                }}
              >
                {/* Preview */}
                <div style={{ height: 200, position: "relative" }}>
                  {c.preview}
                  {selected === c.id && (
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      background: GREEN, color: "#000", borderRadius: "50%",
                      width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800
                    }}>✓</div>
                  )}
                </div>
                {/* Info */}
                <div style={{ padding: "16px 18px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>{c.emoji} {c.name}</div>
                    <div style={{ background: "#18181b", color: "#a1a1aa", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>{c.tag}</div>
                  </div>
                  <div style={{ color: "#a1a1aa", fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>{c.description}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <div style={{ color: GREEN, fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>✓ Vantagens</div>
                      {c.pros.map(p => <div key={p} style={{ color: "#d4d4d8", fontSize: 11, marginBottom: 2 }}>· {p}</div>)}
                    </div>
                    <div>
                      <div style={{ color: "#f87171", fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>⚠ Pontos</div>
                      {c.cons.map(p => <div key={p} style={{ color: "#71717a", fontSize: 11, marginBottom: 2 }}>· {p}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{
              maxWidth: 900, margin: "24px auto 0",
              background: GREEN_GLOW,
              border: `1px solid ${GREEN}40`,
              borderRadius: 12,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ color: GREEN, fontWeight: 700, fontSize: 13 }}>
                  ✓ Você selecionou: <strong>{concepts.find(c => c.id === selected)?.name}</strong>
                </div>
                <div style={{ color: "#a1a1aa", fontSize: 12, marginTop: 2 }}>
                  Me diga e eu construo um protótipo completo em React/shadcn!
                </div>
              </div>
              <div style={{
                background: GREEN,
                color: "#000",
                padding: "8px 20px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13
              }}>
                Construir este →
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "improvements" && (
        <div style={{ padding: "32px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 13, color: "#71717a", maxWidth: 500, margin: "0 auto" }}>
              Melhorias técnicas e de UX independentes do redesign escolhido.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 800, margin: "0 auto" }}>
            {improvements.map((imp, i) => (
              <div key={i} style={{
                background: "#0f0f10",
                border: "1px solid #27272a",
                borderRadius: 12,
                padding: "16px 20px",
                transition: "border-color 0.2s",
                cursor: "default"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#3f3f46"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{imp.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, letterSpacing: "-0.01em" }}>{imp.title}</div>
                <div style={{ color: "#71717a", fontSize: 12, lineHeight: 1.5 }}>{imp.desc}</div>
              </div>
            ))}
          </div>

          <div style={{
            maxWidth: 800, margin: "24px auto 0",
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            padding: "20px 24px",
            textAlign: "center"
          }}>
            <div style={{ color: GREEN, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💡 Recomendação Principal</div>
            <div style={{ color: "#d4d4d8", fontSize: 13, lineHeight: 1.6 }}>
              Migrar de HTML estático para <strong>Next.js + shadcn/ui</strong> é o maior salto de qualidade que você pode dar.<br/>
              SEO nativo, performance muito superior e componentes prontos de alto nível.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
