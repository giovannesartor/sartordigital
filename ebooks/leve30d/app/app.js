/* ============================================================
   PROJETO LEVE 30D — App PWA (v3)
   CONFIG abaixo: código de acesso, PDF e WhatsApp.
   ============================================================ */
const CFG = {
  code    : 'Leve30D2026',
  pdf     : 'https://drive.google.com/file/d/1Yc6UgDF_eA_j5_gpVxe9g1WH0Up3D1vY/view?usp=sharing',
  whatsapp: '5554993031264'
};
const D = window.APP_DATA || {recipes:[],cardapio:[],treinos:[],compras:[],guias:[],marmitas:[],lanches:[],desafio:[],pools:{},exsvg:{},frases:[],secret:[],cats:[]};

/* ---------- storage & utils ---------- */
const store={ get:(k,f)=>{try{const v=localStorage.getItem('l30:'+k);return v==null?f:JSON.parse(v);}catch(e){return f;}},
  set:(k,v)=>{try{localStorage.setItem('l30:'+k,JSON.stringify(v));}catch(e){}} };
const today=()=>new Date().toISOString().slice(0,10);
const esc=(s)=>(s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=(s,r=document)=>r.querySelector(s);
const ce=(h)=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstElementChild;};
const vib=(p)=>{try{if(navigator.vibrate)navigator.vibrate(p);}catch(e){}};
const rnd=(a)=>a[Math.floor(Math.random()*a.length)];

/* ---------- theme ---------- */
function applyTheme(){ document.documentElement.dataset.theme=store.get('theme','light');
  const m=document.querySelector('meta[name=theme-color]'); if(m)m.setAttribute('content',store.get('theme','light')==='dark'?'#08140f':'#0f3d2e'); }
applyTheme();

/* ---------- toast ---------- */
let toastT=null;
function toast(msg,icon='i-check'){ const el=$('#toast'); el.innerHTML=`<svg class="ic"><use href="#${icon}"/></svg><span>${msg}</span>`;
  el.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),2600); }

/* ---------- SW ---------- */
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }

/* ---------- install ---------- */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); deferredPrompt=e; });
function isiOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function isStandalone(){ try{return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone;}catch(e){return false;} }
function isInApp(){ return /instagram|fban|fbav|line\/|micromessenger|tiktok|snapchat/i.test(navigator.userAgent); }
async function doInstall(){ if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; } else openInstallModal(); }
function openInstallModal(){
  const ios=isiOS(); const box=$('#imodalBox');
  const inapp=isInApp()?`<p style="background:#fdf6ec;border:1px solid #f0dfc0;color:#9a6a14;padding:10px;border-radius:10px;font-size:.85rem"><b>Atenção:</b> você abriu por um navegador interno (Instagram/Facebook). Para instalar, toque em <b>⋯</b> e escolha <b>“Abrir no navegador”</b> (Safari no iPhone, Chrome no Android).</p>`:'';
  box.innerHTML=`<h3>Instalar o app</h3><p>Deixe o Projeto Leve 30D na tela do celular — abre em tela cheia e funciona offline.</p>${inapp}
    <div class="os-tabs"><div class="os-tab ${ios?'active':''}" data-os="ios">iPhone</div><div class="os-tab ${ios?'':'active'}" data-os="android">Android</div></div>
    <div id="iosSteps" class="${ios?'':'hide'}"><ol><li>Abra no <b>Safari</b> (não no Instagram).</li><li>Toque em <b>Compartilhar</b> (quadradinho com seta ↑).</li><li>Escolha <b>“Adicionar à Tela de Início”</b> e confirme.</li></ol></div>
    <div id="andSteps" class="${ios?'hide':''}"><ol><li>Abra no <b>Chrome</b>.</li><li>Toque no menu <b>⋮</b>.</li><li>Toque em <b>“Instalar app”</b> e confirme.</li></ol></div>
    <button class="close" id="imClose">Entendi</button>`;
  box.querySelectorAll('.os-tab').forEach(t=>t.onclick=()=>{ box.querySelectorAll('.os-tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
    $('#iosSteps').classList.toggle('hide',t.dataset.os!=='ios'); $('#andSteps').classList.toggle('hide',t.dataset.os!=='android'); });
  $('#imClose').onclick=()=>$('#imodal').classList.remove('open');
  $('#imodal').classList.add('open');
}
$('#imodal').addEventListener('click',e=>{ if(e.target.id==='imodal') e.target.classList.remove('open'); });

/* ---------- gate ---------- */
function checkGate(){ if(store.get('unlocked')===1) showApp(); }
function tryUnlock(){ const v=($('#code').value||'').trim();
  if(v.toUpperCase()===CFG.code.toUpperCase()){ store.set('unlocked',1); showApp(); }
  else{ $('#codeErr').textContent='Código incorreto. Confira na sua área de membros da Cakto.';
    const f=$('#gate .field'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); $('#code').value=''; $('#code').focus(); } }
$('#unlockBtn').onclick=tryUnlock;
$('#code').addEventListener('keydown',e=>{ if(e.key==='Enter') tryUnlock(); });
function showApp(){ $('#gate').classList.add('hide'); $('#app').style.display='block'; $('#tabbar').classList.remove('hide');
  $('#topInstall').onclick=doInstall; $('#topCfg').onclick=()=>setView('config'); $('#topSearch').onclick=()=>setView('busca');
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>setView(t.dataset.view));
  if(!store.get('onb')) openOnboarding(); else { setView('home'); maybeRemind(); } }

/* ---------- perfil / cálculos ---------- */
function calc(){
  const c=store.get('cfg',{}); const ws=store.get('weights',[]);
  const pesoAtual=ws.length?ws[ws.length-1].v:(c.peso||null);
  const pesoIni=ws.length?ws[0].v:(c.peso||null);
  let imc=null,metaCal=c.metaCal||null,pct=null,imcCls='';
  if(c.altura&&pesoAtual){ imc=pesoAtual/Math.pow(c.altura/100,2); imc=Math.round(imc*10)/10;
    imcCls=imc<18.5?'':(imc<25?'':(imc<30?'warn':'warn')); }
  if(c.meta&&pesoIni&&pesoAtual&&pesoIni!==c.meta){ pct=Math.round(Math.min(100,Math.max(0,(pesoIni-pesoAtual)/(pesoIni-c.meta)*100))); }
  return {c,pesoAtual,pesoIni,imc,imcCls,metaCal,pct};
}
function projecao(){
  const ws=store.get('weights',[]); const c=store.get('cfg',{}); if(ws.length<2||!c.meta) return null;
  const first=ws[0],last=ws[ws.length-1]; const days=(new Date(last.d)-new Date(first.d))/86400000||1;
  const perWeek=(first.v-last.v)/days*7; if(perWeek<=0.05) return {perWeek,txt:null};
  const weeks=Math.ceil((last.v-c.meta)/perWeek); if(weeks<=0) return {perWeek,done:true};
  return {perWeek:Math.round(perWeek*100)/100,weeks};
}

/* ---------- onboarding ---------- */
function openOnboarding(edit){
  const c=store.get('cfg',{}); const sx=c.sexo||'F';
  $('#onbBox').innerHTML=`<h3>${edit?'Editar perfil':'Vamos começar! 🌿'}</h3>
    <p>Isso personaliza sua meta de calorias, água e o cálculo de IMC.</p>
    <label>Peso atual (kg)</label><input id="onbPeso" type="number" inputmode="decimal" placeholder="Ex.: 78" value="${c.peso||''}">
    <label>Altura (cm)</label><input id="onbAlt" type="number" inputmode="numeric" placeholder="Ex.: 168" value="${c.altura||''}">
    <label>Idade</label><input id="onbIdade" type="number" inputmode="numeric" placeholder="Ex.: 32" value="${c.idade||''}">
    <label>Sexo</label><div class="moods" id="onbSexo"><div class="mood ${sx==='F'?'on':''}" data-s="F" style="font-size:.95rem;font-family:var(--head)">Feminino</div><div class="mood ${sx==='M'?'on':''}" data-s="M" style="font-size:.95rem;font-family:var(--head)">Masculino</div></div>
    <label>Peso que quer alcançar (kg) — opcional</label><input id="onbMeta" type="number" inputmode="decimal" placeholder="Ex.: 72" value="${c.meta||''}">
    <button class="prim" id="onbGo">${edit?'Salvar':'Começar minha jornada'}</button>
    ${edit?'<button class="skip" id="onbSkip">Cancelar</button>':'<button class="skip" id="onbSkip">Pular por agora</button>'}`;
  $('#onb').classList.add('open');
  let sexo=sx; $('#onbSexo').querySelectorAll('.mood').forEach(m=>m.onclick=()=>{ sexo=m.dataset.s; $('#onbSexo').querySelectorAll('.mood').forEach(x=>x.classList.toggle('on',x===m)); });
  $('#onbGo').onclick=()=>{
    const peso=parseFloat(($('#onbPeso').value||'').replace(',','.')), alt=parseFloat($('#onbAlt').value), idade=parseInt($('#onbIdade').value), meta=parseFloat(($('#onbMeta').value||'').replace(',','.'));
    const cfg=Object.assign({},store.get('cfg',{}));
    if(peso>20&&peso<400){ cfg.peso=peso; cfg.waterGoal=Math.max(6,Math.round(peso*35/250)); }
    if(alt>100&&alt<250) cfg.altura=alt; if(idade>10&&idade<100) cfg.idade=idade; cfg.sexo=sexo;
    if(meta>20&&meta<400) cfg.meta=meta;
    if(cfg.peso&&cfg.altura&&cfg.idade){ const tmb=10*cfg.peso+6.25*cfg.altura-5*cfg.idade+(sexo==='M'?5:-161); cfg.metaCal=Math.round((tmb*1.375-400)/10)*10; }
    store.set('cfg',cfg);
    if(!edit){ const w=store.get('weights',[]); if(!w.length&&cfg.peso){ w.push({d:today(),v:cfg.peso}); store.set('weights',w);} }
    store.set('onb',1); $('#onb').classList.remove('open'); setView(edit?'config':'home');
    toast('Perfil salvo!'+(cfg.metaCal?(' Meta: ~'+cfg.metaCal+' kcal/dia'):''),'i-target');
  };
  $('#onbSkip').onclick=()=>{ store.set('onb',1); $('#onb').classList.remove('open'); setView(edit?'config':'home'); };
}

/* ---------- router / sheet ---------- */
let currentView='home';
function setView(name){ currentView=name; document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===name));
  const root=$('#viewRoot'); root.innerHTML=''; (VIEWS[name]||VIEWS.home)(root); window.scrollTo(0,0); }
function openSheet(html){ $('#sheetInner').innerHTML='<div class="sheet-grab"></div><button class="sheet-close" id="shClose"><svg class="ic"><use href="#i-close"/></svg></button>'+html;
  $('#sheet').classList.add('open'); $('#shClose').onclick=closeSheet; }
function closeSheet(){ $('#sheet').classList.remove('open'); stopTimer(); }
$('#sheet').addEventListener('click',e=>{ if(e.target.id==='sheet') closeSheet(); });

/* ---------- progresso helpers ---------- */
const waterGoal=()=> (store.get('cfg',{}).waterGoal)||10;
function doneDaysCount(){ return Object.values(store.get('days',{})).filter(Boolean).length; }
function seqFromStart(){ const d=store.get('days',{}); let n=0; for(let i=1;i<=30;i++){ if(d[i])n++; else break; } return n; }
function nextDay(){ const d=store.get('days',{}); for(let i=1;i<=30;i++){ if(!d[i]) return i; } return null; }

/* ---------- conquistas ---------- */
const ACH=[
 {id:'d1',icon:'i-check',t:'Primeiro passo',d:'Concluiu o Dia 1',on:s=>s.done>=1},
 {id:'seq3',icon:'i-flame',t:'Pegando o ritmo',d:'3 dias seguidos',on:s=>s.seq>=3},
 {id:'w1',icon:'i-star',t:'1ª semana',d:'7 dias concluídos',on:s=>s.done>=7},
 {id:'half',icon:'i-medal',t:'Metade do caminho',d:'15 dias concluídos',on:s=>s.done>=15},
 {id:'d30',icon:'i-trophy',t:'Missão cumprida',d:'30 dias completos',on:s=>s.done>=30},
 {id:'train10',icon:'i-dumbbell',t:'Guerreiro',d:'10 treinos feitos',on:s=>s.workouts>=10},
 {id:'fav5',icon:'i-heart',t:'Sabor favorito',d:'5 receitas favoritas',on:s=>s.favs>=5},
 {id:'hydro',icon:'i-water',t:'Hidratado',d:'Bateu a meta de água',on:s=>s.waterHit},
];
function achState(){ return {done:doneDaysCount(),seq:seqFromStart(),workouts:store.get('workouts',0),favs:(store.get('favs',[])).length,waterHit:store.get('waterHit',false)}; }
function checkAch(){ const s=achState(); const un=store.get('ach',{}); let ch=false;
  ACH.forEach(a=>{ if(a.on(s)&&!un[a.id]){ un[a.id]=today(); ch=true; setTimeout(()=>toast('Conquista: '+a.t+' 🏅','i-trophy'),300); } }); if(ch)store.set('ach',un); }

/* ---------- cardápio: refeição efetiva (override) ---------- */
const POOLKEY=['cafe','lm','almoco','lt','jantar','ceia'];
function getMeal(dia,idx){ const ov=store.get('dayOv',{}); if(ov[dia]&&ov[dia][idx]) return ov[dia][idx];
  const d=D.cardapio.find(x=>x.dia===dia); const r=d.ref[idx]; return [r[1],r[2]]; }
function dayMeals(dia){ const d=D.cardapio.find(x=>x.dia===dia); return d.ref.map((r,idx)=>{ const m=getMeal(dia,idx); return [r[0],m[0],m[1]]; }); }
function dayKcal(dia){ return dayMeals(dia).reduce((a,m)=>a+(m[2]||0),0); }
function swapMeal(dia,idx){ const pool=D.pools[POOLKEY[idx]]||[]; const cur=getMeal(dia,idx); const kc=cur[1];
  const cand=pool.filter(p=>Math.abs(p[1]-kc)<=90&&p[0]!==cur[0]); const pick=cand.length?rnd(cand):rnd(pool);
  const ov=store.get('dayOv',{}); ov[dia]=ov[dia]||{}; ov[dia][idx]=[pick[0],pick[1]]; store.set('dayOv',ov); }
function shuffleAll(){ const ov={}; for(let dia=1;dia<=30;dia++){ ov[dia]={}; POOLKEY.forEach((k,idx)=>{ const p=rnd(D.pools[k]); ov[dia][idx]=[p[0],p[1]]; }); } store.set('dayOv',ov); }

/* ---------- veg / restrições ---------- */
const VEGMAP=[[/peito de frango|frango desfiado|frango grelhado|frango/gi,'grão-de-bico'],[/carne moída magra|carne moída|carne magra|patinho|bife|carne de panela|almôndegas de frango|almôndegas/gi,'lentilha'],[/tilápia|salmão|sardinha|peixe|atum/gi,'tofu'],[/peito de peru/gi,'tofu']];
function vegText(t){ if(!store.get('veg',false)) return t; let s=t; VEGMAP.forEach(([re,r])=>s=s.replace(re,r)); return s; }
function hasLactose(ings){ return /leite|queijo|iogurte|requeij|ricota|cottage|whey|coalho|nata|creme de leite|manteiga|parmes/i.test(ings.join(' ')); }
function hasGluten(ings){ return /p[ãa]o|trigo|farinha|macarr|aveia|granola|torrada|wrap|tortilha|biscoito|cuscuz|floc[ãa]o|centeio|cevada/i.test(ings.join(' ')); }
function isVeg(ings){ return !/frango|carne|patinho|bife|peru|peixe|til[áa]pia|salm[ãa]o|sardinha|atum|mo[íi]d|m[úu]sculo|ac[ée]m|camar[ãa]o|presunto|linguic|bacon|peru/i.test(ings.join(' ')); }

/* ============================================================ VIEWS */
const VIEWS={};

/* ----- HOME ----- */
VIEWS.home=(root)=>{
  checkAch();
  const done=doneDaysCount(), seq=seqFromStart(), workouts=store.get('workouts',0);
  const ringC=2*Math.PI*34; const nd=nextDay();
  const frase=D.frases.length?D.frases[(new Date().getDate())%D.frases.length]:'';
  const showDepo=done>=21 && !store.get('depoDismiss',false);
  let html=`<div class="view">`;
  // banner de instalação (não instalado)
  if(!isStandalone() && !store.get('bannerDismiss',false)){
    html+=`<div class="ibanner"><svg class="ic"><use href="#i-download"/></svg>
      <div style="flex:1"><b>Instale o app</b><span>${isInApp()?'Abra no Safari/Chrome e adicione à tela':'Tenha o Leve 30D na tela do celular'}</span></div>
      <button class="act" id="bnInstall">Instalar</button><button class="x" id="bnX"><svg class="ic" style="width:18px;height:18px"><use href="#i-close"/></svg></button></div>`;
  }
  html+=`<div class="hero">
      <svg class="ring" viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="8"/>
        <circle cx="40" cy="40" r="34" fill="none" stroke="#7fc8a6" stroke-width="8" stroke-linecap="round" stroke-dasharray="${ringC}" stroke-dashoffset="${ringC*(1-done/30)}" transform="rotate(-90 40 40)"/>
        <text x="40" y="38" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="20" fill="#fff">${done}</text>
        <text x="40" y="52" text-anchor="middle" font-family="Inter" font-size="9" fill="#cfe7da">de 30 dias</text></svg>
      <div><div class="h-t">${saudacao()} 🌿</div><div class="h-s">${done===0?'Bora começar? Marque seu Dia 1 abaixo.':(done>=30?'Você concluiu os 30 dias. Que orgulho!':'Você já concluiu '+done+' dia(s). Siga firme!')}</div></div></div>
    <div class="streak">
      <div class="s-item fire"><div class="sn"><svg class="ic"><use href="#i-flame"/></svg>${seq}</div><div class="sl">dias seguidos</div></div>
      <div class="s-item green"><div class="sn">${done}</div><div class="sl">dias concluídos</div></div>
      <div class="s-item gold"><div class="sn"><svg class="ic"><use href="#i-dumbbell"/></svg>${workouts}</div><div class="sl">treinos feitos</div></div></div>
    <div class="frase"><svg class="ic" style="width:20px;height:20px"><use href="#i-leaf"/></svg><span>${esc(frase)}</span></div>`;
  if(showDepo){ html+=`<div class="depo"><b>Você chegou longe! 💛</b><p>Se o Projeto Leve 30D está te ajudando, seu depoimento faz a diferença.</p>
      <a href="https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent('Quero deixar meu depoimento sobre o Projeto Leve 30D!')}" target="_blank" rel="noopener"><svg class="ic" style="width:18px;height:18px"><use href="#i-share"/></svg> Enviar depoimento</a>
      <a class="dismiss" id="depoX">agora não</a></div>`; }
  if(nd){ const meals=dayMeals(nd).slice(0,4).map(r=>`<div class="tmeal"><div class="mw">${esc(r[0])}</div><div class="mt">${esc(vegText(r[1]))}</div></div>`).join('');
    html+=`<div class="section-h"><svg class="ic"><use href="#i-cal"/></svg> Seu dia de hoje</div>
      <div class="today"><div class="tday-h"><b>Dia ${nd}</b><span class="pill">≈${dayKcal(nd)} kcal</span></div>${meals}
        <button class="tbtn" id="doneToday"><svg class="ic" style="width:20px;height:20px"><use href="#i-check"/></svg> Concluir Dia ${nd}</button></div>`;
  } else { html+=`<div class="today" style="text-align:center"><b style="font-family:Poppins;color:var(--g600)">🎉 Você concluiu todos os 30 dias!</b><p style="color:var(--muted);font-size:.88rem;margin-top:6px">Veja a Fase de Manutenção nos guias.</p></div>`; }
  html+=`<div class="actions"><a class="abtn pdf" href="${CFG.pdf}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-download"/></svg> Baixar PDF</a>
      <button class="abtn install" id="homeInstall"><svg class="ic"><use href="#i-home"/></svg> Instalar app</button></div>
    <div class="section-h"><svg class="ic"><use href="#i-leaf"/></svg> Seu programa</div>
    <div class="grid2">
      ${tile('cardapio','i-cal','Cardápio 30 dias','Refeições dia a dia')}
      ${tile('receitas','i-food','Receitas','+'+D.recipes.length+' receitas')}
      ${tile('treinos','i-dumbbell','Treinos','3 níveis + timer')}
      ${tile('progresso','i-chart','Progresso','Peso, fotos, IMC')}
      ${tile('bonus','i-gift','Bônus','Marmitas, desafio +',true)}
      ${tile('conquistas','i-trophy','Conquistas','Suas medalhas',true)}
      ${tile('compras','i-cart','Lista de compras','Marque e compartilhe')}
      ${tile('guias','i-guide','Guias','Mentalidade, nutrição +')}
    </div></div>`;
  root.appendChild(ce(html));
  const bi=$('#bnInstall'); if(bi)bi.onclick=doInstall; const bx=$('#bnX'); if(bx)bx.onclick=()=>{ store.set('bannerDismiss',true); setView('home'); };
  $('#homeInstall').onclick=doInstall;
  const dt=$('#doneToday'); if(dt)dt.onclick=()=>{ const dd=store.get('days',{}); dd[nd]=true; store.set('days',dd); checkAch(); rewardCheck(); vib(30); toast('Dia '+nd+' concluído! 🎉'); setView('home'); };
  const dx=$('#depoX'); if(dx)dx.onclick=()=>{ store.set('depoDismiss',true); setView('home'); };
  root.querySelectorAll('[data-goto]').forEach(el=>el.onclick=()=>setView(el.dataset.goto));
};
function saudacao(){ const h=new Date().getHours(); return h<12?'Bom dia!':h<18?'Boa tarde!':'Boa noite!'; }
function tile(view,icon,title,sub,gold){ return `<button class="tile ${gold?'gold':''}" data-goto="${view}"><div class="ic-w"><svg class="ic"><use href="#${icon}"/></svg></div><h4>${title}</h4><p>${sub}</p></button>`; }
function rewardCheck(){ const done=doneDaysCount(); const un=store.get('rewards',{}); [7,14,21,28].forEach((m,i)=>{ if(done>=m&&!un[m]){ un[m]=1; store.set('rewards',un); setTimeout(()=>toast('Recompensa liberada: receita secreta! 🎁','i-gift'),600); } }); }

/* ----- CARDÁPIO ----- */
VIEWS.cardapio=(root)=>{
  const days=store.get('days',{}); const done=doneDaysCount(); const veg=store.get('veg',false); const k=calc();
  const meta=k.metaCal?`<div class="metabar"><div class="m"><b>${k.metaCal}</b><span>meta kcal/dia</span></div>
      ${k.imc?`<div class="m ${k.imcCls}"><b>${k.imc}</b><span>seu IMC</span></div>`:''}
      <div class="m"><b>${waterGoal()}</b><span>copos de água</span></div></div>`:'';
  const items=D.cardapio.map(d=>{ const alm=dayMeals(d.dia).find(r=>r[0]==='Almoço');
    return `<div class="day-item ${days[d.dia]?'done':''}" data-day="${d.dia}"><div class="dn">${d.dia}</div>
      <div class="di"><b>Dia ${d.dia}</b><span>${esc(vegText(alm?alm[1]:''))}</span></div>
      <span class="kbadge">≈${dayKcal(d.dia)}</span><svg class="ic chev"><use href="#i-chev"/></svg></div>`; }).join('');
  root.appendChild(ce(`<div class="view"><div class="vtitle">Cardápio de 30 dias</div>
    <div class="vsub">${done}/30 dias concluídos${k.metaCal?' · meta ~'+k.metaCal+' kcal':''}</div>${meta}
    <div class="card" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:12px 16px">
      <div style="display:flex;align-items:center;gap:10px"><svg class="ic" style="color:var(--g600)"><use href="#i-leaf"/></svg>
        <div><b style="font-family:Poppins;font-size:.92rem">Modo vegetariano</b><div style="font-size:.76rem;color:var(--muted)">Troca proteínas por vegetais</div></div></div>
      <div class="switch ${veg?'on':''}" id="vegSw"></div></div>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button class="abtn install" id="shuffle" style="flex:1;font-size:.85rem"><svg class="ic" style="width:18px;height:18px"><use href="#i-refresh"/></svg> Gerar novo</button>
      <button class="abtn install" id="restore" style="flex:1;font-size:.85rem"><svg class="ic" style="width:18px;height:18px"><use href="#i-swap"/></svg> Restaurar</button></div>
    ${items}</div>`));
  $('#vegSw').onclick=()=>{ store.set('veg',!veg); setView('cardapio'); };
  $('#shuffle').onclick=()=>{ if(confirm('Gerar um novo cardápio com variações? Suas marcações de dias concluídos são mantidas.')){ shuffleAll(); setView('cardapio'); toast('Novo cardápio gerado! 🍽️','i-refresh'); } };
  $('#restore').onclick=()=>{ store.set('dayOv',{}); setView('cardapio'); toast('Cardápio original restaurado'); };
  root.querySelectorAll('.day-item').forEach(el=>el.onclick=()=>openDay(+el.dataset.day));
};
function openDay(n){
  const days=store.get('days',{}); const isDone=!!days[n]; const dr=store.get('diary',{})[n]||{};
  const meals=dayMeals(n).map((r,idx)=>`<div class="meal"><div class="mw">${esc(r[0])}</div><div class="mt">${esc(vegText(r[1]))}</div>
    <button class="fav-btn" data-swap="${idx}" title="Trocar" style="width:30px;height:30px"><svg class="ic" style="width:18px;height:18px;color:var(--g500)"><use href="#i-swap"/></svg></button></div>`).join('');
  const moods=['😞','😐','🙂','😃','🤩'];
  openSheet(`<h3>Dia ${n}</h3><div class="rm"><span><b>Total:</b> ≈${dayKcal(n)} kcal</span><span style="color:var(--g500)">toque em ⇆ para trocar</span></div>
    <div class="card" style="padding:4px 14px" id="dayMeals">${meals}</div>
    <div class="sub-h">Como foi seu dia?</div>
    <div class="moods" id="dayMood">${moods.map((m,i)=>`<div class="mood ${dr.mood===i?'on':''}" data-m="${i}">${m}</div>`).join('')}</div>
    <textarea class="diary-in" id="dayNote" placeholder="Anote algo sobre hoje (opcional)...">${esc(dr.note||'')}</textarea>
    <button class="abtn ${isDone?'install':'pdf'}" id="markDay" style="width:100%;margin-top:14px"><svg class="ic"><use href="#i-check"/></svg> ${isDone?'Concluído — desmarcar':'Marcar como concluído'}</button>`);
  $('#dayMeals').querySelectorAll('[data-swap]').forEach(b=>b.onclick=()=>{ swapMeal(n,+b.dataset.swap); openDay(n); });
  let mood=dr.mood; $('#dayMood').querySelectorAll('.mood').forEach(m=>m.onclick=()=>{ mood=+m.dataset.m; $('#dayMood').querySelectorAll('.mood').forEach(x=>x.classList.toggle('on',x===m)); saveDiary(n,mood); });
  $('#dayNote').onchange=()=>saveDiary(n,mood);
  $('#markDay').onclick=()=>{ const dd=store.get('days',{}); dd[n]=!dd[n]; store.set('days',dd); checkAch(); rewardCheck(); if(dd[n]){vib(30);toast('Dia '+n+' concluído! 🎉');} closeSheet(); if(currentView==='cardapio')setView('cardapio'); };
}
function saveDiary(n,mood){ const d=store.get('diary',{}); d[n]={mood,note:($('#dayNote')?$('#dayNote').value:'')}; store.set('diary',d); }

/* ----- RECEITAS ----- */
let recFilter={cat:'Todos',q:'',sort:'padrao',diet:''};
VIEWS.receitas=(root)=>{
  root.appendChild(ce(`<div class="view"><div class="vtitle">Receitas</div>
    <div class="searchbar"><svg class="ic"><use href="#i-search"/></svg><input id="recQ" type="search" placeholder="Buscar receita..." value="${esc(recFilter.q)}"></div>
    <div class="chips" id="recChips"></div>
    <div class="chips" id="dietChips"></div>
    <div class="sortbar"><span class="lbl">Ordenar:</span><div class="chips" id="sortChips" style="padding-bottom:0"></div></div>
    <div id="recList"></div></div>`));
  $('#recChips').innerHTML=['Todos','Favoritas',...D.cats].map(c=>`<button class="chip ${recFilter.cat===c?'active':''}" data-c="${c}">${c==='Favoritas'?'<svg class="ic"><use href="#i-heart"/></svg>':''}${c}</button>`).join('');
  $('#dietChips').innerHTML=[['','Todas'],['veg','Vegetariana'],['lac','Sem lactose'],['glu','Sem glúten']].map(([v,l])=>`<button class="chip ${recFilter.diet===v?'active':''}" data-d="${v}">${l}</button>`).join('');
  $('#sortChips').innerHTML=[['padrao','Padrão'],['rapido','Mais rápidas'],['cal','Menos calorias']].map(([v,l])=>`<button class="chip ${recFilter.sort===v?'active':''}" data-s="${v}">${l}</button>`).join('');
  $('#recChips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{ recFilter.cat=b.dataset.c; $('#recChips').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b)); renderRecList(); });
  $('#dietChips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{ recFilter.diet=b.dataset.d; $('#dietChips').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b)); renderRecList(); });
  $('#sortChips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{ recFilter.sort=b.dataset.s; $('#sortChips').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b)); renderRecList(); });
  $('#recQ').oninput=e=>{ recFilter.q=e.target.value; renderRecList(); };
  renderRecList();
};
function mins(t){ const m=(''+t).match(/\d+/); return m?+m[0]:999; }
function renderRecList(){
  const q=recFilter.q.toLowerCase(); const favs=store.get('favs',[]);
  let list=D.recipes.filter(r=>(!q||r.nome.toLowerCase().includes(q)));
  if(recFilter.cat==='Favoritas') list=list.filter(r=>favs.includes(r.id)); else if(recFilter.cat!=='Todos') list=list.filter(r=>r.cat===recFilter.cat);
  if(recFilter.diet==='veg') list=list.filter(r=>isVeg(r.ings)); else if(recFilter.diet==='lac') list=list.filter(r=>!hasLactose(r.ings)); else if(recFilter.diet==='glu') list=list.filter(r=>!hasGluten(r.ings));
  if(recFilter.sort==='rapido') list=list.slice().sort((a,b)=>mins(a.tempo)-mins(b.tempo)); else if(recFilter.sort==='cal') list=list.slice().sort((a,b)=>a.kcal-b.kcal);
  const el=$('#recList'); if(!el)return;
  if(!list.length){ el.innerHTML=`<div class="empty">${recFilter.cat==='Favoritas'?'Você ainda não favoritou receitas. Toque no ♥.':'Nenhuma receita encontrada.'}</div>`; return; }
  el.innerHTML=list.map(r=>`<div class="rec-item"><div class="rc-main" data-id="${r.id}"><span class="cat-tag">${esc(r.cat)}</span><h4>${esc(r.nome)}</h4>
      <div class="rm"><span><b>${esc(r.tempo)}</b></span><span><b>${r.kcal}</b> kcal</span></div></div>
      <button class="fav-btn ${favs.includes(r.id)?'on':''}" data-fav="${r.id}"><svg class="ic"><use href="#i-heart"/></svg></button></div>`).join('');
  el.querySelectorAll('.rc-main').forEach(x=>x.onclick=()=>openRecipe(+x.dataset.id));
  el.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{ toggleFav(+b.dataset.fav); renderRecList(); });
}
function toggleFav(id){ const f=store.get('favs',[]); const i=f.indexOf(id); if(i>=0)f.splice(i,1); else{f.push(id);toast('Adicionada aos favoritos ♥');} store.set('favs',f); checkAch(); }
function openRecipe(id){ const r=D.recipes.find(x=>x.id===id); if(!r)return; const fav=store.get('favs',[]).includes(id);
  openSheet(`<span class="cat-tag" style="display:inline-block;margin-bottom:8px">${esc(r.cat)}</span><h3>${esc(r.nome)}</h3>
    <div class="rm"><span><b>Tempo:</b> ${esc(r.tempo)}</span><span><b>${r.kcal}</b> kcal</span></div>
    <div class="sub-h">Ingredientes</div><ul>${r.ings.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
    <div class="sub-h">Modo de preparo</div><ol>${r.modo.map(m=>`<li>${esc(m)}</li>`).join('')}</ol>
    <button class="abtn ${fav?'install':'pdf'}" id="favSheet" style="width:100%;margin-top:16px"><svg class="ic"><use href="#i-heart"/></svg> ${fav?'Remover dos favoritos':'Salvar nos favoritos'}</button>`);
  $('#favSheet').onclick=()=>{ toggleFav(id); closeSheet(); if(currentView==='receitas')renderRecList(); };
}

/* ----- BUSCA GLOBAL ----- */
VIEWS.busca=(root)=>{
  root.appendChild(ce(`<div class="view"><div class="vtitle">Buscar</div>
    <div class="searchbar"><svg class="ic"><use href="#i-search"/></svg><input id="gq" type="search" placeholder="Receitas, guias, treinos..." autofocus></div>
    <div id="gres"><div class="empty">Digite para buscar em todo o app.</div></div></div>`));
  $('#gq').oninput=e=>{ const q=e.target.value.toLowerCase().trim(); const el=$('#gres'); if(!q){ el.innerHTML='<div class="empty">Digite para buscar em todo o app.</div>'; return; }
    const rec=D.recipes.filter(r=>r.nome.toLowerCase().includes(q)).slice(0,12);
    const gui=D.guias.filter(g=>g.titulo.toLowerCase().includes(q)||g.html.toLowerCase().includes(q));
    let h='';
    if(rec.length){ h+='<div class="section-h">Receitas</div>'+rec.map(r=>`<div class="rec-item"><div class="rc-main" data-id="${r.id}"><span class="cat-tag">${esc(r.cat)}</span><h4>${esc(r.nome)}</h4><div class="rm"><span><b>${esc(r.tempo)}</b></span><span><b>${r.kcal}</b> kcal</span></div></div></div>`).join(''); }
    if(gui.length){ h+='<div class="section-h">Guias</div>'+gui.map((g,i)=>`<button class="tile" data-gi="${D.guias.indexOf(g)}" style="margin-bottom:8px;flex-direction:row;align-items:center"><div class="ic-w"><svg class="ic"><use href="#i-guide"/></svg></div><h4 style="flex:1">${esc(g.titulo)}</h4></button>`).join(''); }
    if(!h)h='<div class="empty">Nada encontrado para "'+esc(q)+'".</div>';
    el.innerHTML=h;
    el.querySelectorAll('.rc-main').forEach(x=>x.onclick=()=>openRecipe(+x.dataset.id));
    el.querySelectorAll('[data-gi]').forEach(x=>x.onclick=()=>openGuia(+x.dataset.gi));
  };
};

/* ----- TREINOS ----- */
VIEWS.treinos=(root)=>{
  const workouts=store.get('workouts',0); const log=store.get('wlog',[]); const kcalEst=workouts*220;
  const week=log.filter(d=>daysAgo(d)<7).length;
  const cards=D.treinos.map((t,i)=>`<button class="tile" data-t="${i}" style="margin-bottom:12px;flex-direction:row;align-items:center">
    <div class="ic-w"><svg class="ic"><use href="#i-dumbbell"/></svg></div><div style="flex:1"><h4>Treino ${esc(t.nivel)}</h4><p>${esc(t.info)}</p></div><svg class="ic chev" style="color:var(--g300)"><use href="#i-chev"/></svg></button>`).join('');
  root.appendChild(ce(`<div class="view"><div class="vtitle">Treinos em casa</div><div class="vsub">Sem equipamento · treine com timer em circuito</div>
    <div class="metabar"><div class="m"><b>${workouts}</b><span>treinos feitos</span></div><div class="m"><b>${week}</b><span>nesta semana</span></div><div class="m"><b>~${kcalEst}</b><span>kcal estimadas</span></div></div>
    ${cards}
    <div class="card" style="font-size:.86rem;color:var(--muted)"><b style="font-family:Poppins;color:var(--ink)">Modo circuito:</b> abra um treino, ajuste trabalho/descanso se quiser e toque em <b>Circuito</b> — o app guia tudo com bipe e vibração, mostrando o exercício.</div></div>`));
  root.querySelectorAll('[data-t]').forEach(el=>el.onclick=()=>openWorkout(+el.dataset.t));
};
function daysAgo(d){ return (Date.now()-new Date(d).getTime())/86400000; }
function exKey(name){ const n=name.toLowerCase();
  if(n.includes('agach'))return'agachamento'; if(n.includes('flex'))return'flexao'; if(n.includes('pranch'))return'prancha';
  if(n.includes('afundo')||n.includes('lunge'))return'afundo'; if(n.includes('abdominal')||n.includes('bicicleta'))return'abdominal';
  if(n.includes('polichinelo'))return'polichinelo'; if(n.includes('ponte'))return'ponte'; if(n.includes('eleva'))return'elevacao';
  if(n.includes('burpee'))return'burpee'; if(n.includes('montanhista')||n.includes('mountain'))return'montanhista';
  if(n.includes('marcha')||n.includes('corrida'))return'polichinelo'; return null; }
function exFig(name){ const k=exKey(name); const s=k&&D.exsvg[k]; if(!s)return'<div class="ex-fig"></div>'; return `<div class="ex-fig">${s.replace(/#1f6b4f/g,'currentColor').replace(/stroke-width="[^"]*"/,'stroke-width="2.6"')}</div>`; }
function openWorkout(i){
  const t=D.treinos[i]; if(!t)return;
  const aq=t.aquecimento.map(x=>`<li>${esc(x)}</li>`).join('');
  const ex=t.ex.map((e,k)=>`<div class="ex-row" data-ex="${k}">${exFig(e[0])}<div class="exn"><b>${esc(e[0])}</b><span>${e[1]} séries</span></div><div class="exs">${esc(e[2])} reps<br>${esc(e[3])} desc.</div></div>`).join('');
  const ca=t.calma.map(x=>`<li>${esc(x)}</li>`).join('');
  const cc=store.get('circ',{w:40,r:20});
  openSheet(`<h3>Treino ${esc(t.nivel)}</h3><div class="rm"><span>${esc(t.info)}</span></div>
    <div class="timer card"><div class="tt" id="tDisp">00:00</div><div class="ts" id="tLbl">Descanso rápido ou circuito completo</div><div class="tround" id="tRound"></div>
      <div class="timer-ctrls"><button class="rs" data-sec="30">30s</button><button class="rs" data-sec="45">45s</button><button class="rs" data-sec="60">60s</button><button class="go" id="tCircuit">▶ Circuito</button></div>
      <div class="circ-cfg">Trabalho <input id="cW" type="number" value="${cc.w}" min="10" max="120">s · Descanso <input id="cR" type="number" value="${cc.r}" min="5" max="90">s</div>
      <div class="timer-ctrls" id="tRunCtrls" style="display:none"><button class="rs" id="tPause">Pausar</button><button class="rs" id="tStop">Parar</button></div></div>
    <div class="sub-h">Aquecimento (5 min)</div><ul>${aq}</ul>
    <div class="sub-h">Circuito principal</div><div class="card" style="padding:2px 14px" id="exList">${ex}</div>
    <div class="sub-h">Volta à calma</div><ul>${ca}</ul>
    <button class="abtn pdf" id="wDone" style="width:100%;margin-top:16px"><svg class="ic"><use href="#i-check"/></svg> Marcar treino como feito</button>`);
  initTimer(t);
  $('#wDone').onclick=()=>{ registerWorkout(); closeSheet(); };
}
function registerWorkout(){ store.set('workouts',store.get('workouts',0)+1); const l=store.get('wlog',[]); l.push(today()); store.set('wlog',l); checkAch(); vib(30); toast('Treino registrado! 💪'); }
/* timer */
let tState={id:null,running:false}; let actx=null;
function beep(f=880,d=.15){ try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); const o=actx.createOscillator(),g=actx.createGain(); o.frequency.value=f; o.connect(g);g.connect(actx.destination); g.gain.setValueAtTime(.0001,actx.currentTime); g.gain.exponentialRampToValueAtTime(.35,actx.currentTime+.01); g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d); o.start(); o.stop(actx.currentTime+d);}catch(e){} }
function fmt(s){ return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
function initTimer(t){ tState={id:null,running:false};
  document.querySelectorAll('.timer-ctrls .rs[data-sec]').forEach(b=>b.onclick=()=>{ startRest(+b.dataset.sec); document.querySelectorAll('.rs[data-sec]').forEach(x=>x.classList.toggle('active',x===b)); });
  $('#tCircuit').onclick=()=>{ const w=Math.max(10,+$('#cW').value||40),r=Math.max(5,+$('#cR').value||20); store.set('circ',{w,r}); startCircuit(t,w,r); };
  $('#tPause').onclick=()=>{ if(tState.running){ pauseTimer(); $('#tPause').textContent='Retomar'; } else { resumeTimer(); $('#tPause').textContent='Pausar'; } };
  $('#tStop').onclick=()=>{ stopTimer(); $('#tLbl').textContent='Parado'; $('#tRound').textContent=''; $('#tRunCtrls').style.display='none'; $('#tDisp').textContent='00:00'; highlightEx(-1); };
  $('#tDisp').textContent='00:00';
}
function tick(){ tState.left--; const d=$('#tDisp'); if(d)d.textContent=fmt(Math.max(0,tState.left)); if(tState.left<=0&&tState.onZero)tState.onZero(); }
function startRest(sec){ stopTimer(); tState.left=sec; tState.running=true; $('#tLbl').textContent='Descanso — respire'; $('#tRound').textContent=''; $('#tRunCtrls').style.display='flex'; $('#tPause').textContent='Pausar';
  tState.onZero=()=>{ stopTimer(); beep(760,.25); vib([200,80,200]); $('#tLbl').textContent='Descanso concluído! 💪'; $('#tRunCtrls').style.display='none'; }; tState.id=setInterval(tick,1000); $('#tDisp').textContent=fmt(sec); }
function startCircuit(t,W,R){ stopTimer(); const PREP=8; const q=[{p:'prep',s:PREP}]; t.ex.forEach((e,i)=>{ q.push({p:'work',s:W,name:e[0],idx:i}); if(i<t.ex.length-1)q.push({p:'rest',s:R}); });
  tState.running=true; $('#tRunCtrls').style.display='flex'; $('#tPause').textContent='Pausar'; const total=t.ex.length; let qi=0;
  const load=()=>{ if(qi>=q.length){ stopTimer(); beep(980,.3); setTimeout(()=>beep(1180,.3),180); vib([250,100,250]); $('#tLbl').textContent='Circuito concluído! 🎉'; $('#tRound').textContent=''; $('#tRunCtrls').style.display='none'; highlightEx(-1); registerWorkout(); return; }
    const ph=q[qi]; tState.left=ph.s;
    if(ph.p==='work'){ $('#tLbl').textContent='▶ '+ph.name; $('#tRound').textContent='Exercício '+(ph.idx+1)+' de '+total; highlightEx(ph.idx); beep(880,.15); }
    else if(ph.p==='rest'){ $('#tLbl').textContent='Descanso'; $('#tRound').textContent='Próximo: '+(q[qi+1]?q[qi+1].name:''); highlightEx(-1); beep(600,.15); }
    else { $('#tLbl').textContent='Prepare-se!'; $('#tRound').textContent='Começando...'; }
    $('#tDisp').textContent=fmt(ph.s); };
  tState.onZero=()=>{ qi++; load(); }; load(); tState.id=setInterval(tick,1000);
}
function highlightEx(idx){ document.querySelectorAll('#exList .ex-row').forEach(r=>r.classList.toggle('now',+r.dataset.ex===idx)); }
function pauseTimer(){ if(tState.id){clearInterval(tState.id);tState.id=null;} tState.running=false; }
function resumeTimer(){ if(!tState.running&&tState.left>0){ tState.running=true; tState.id=setInterval(tick,1000); } }
function stopTimer(){ if(tState.id){clearInterval(tState.id);tState.id=null;} tState.running=false; }

/* ----- PROGRESSO ----- */
VIEWS.progresso=(root)=>{
  root.appendChild(ce(`<div class="view"><div class="vtitle">Seu progresso</div><div class="vsub">Tudo salvo no seu aparelho, funciona offline.</div>
    <div id="statCard"></div>
    <div class="section-h"><svg class="ic"><use href="#i-check"/></svg> Aderência (30 dias)</div><div class="card" id="heatCard"></div>
    <div class="section-h"><svg class="ic"><use href="#i-camera"/></svg> Fotos de progresso</div><div class="card" id="photoCard"></div>
    <div class="section-h"><svg class="ic"><use href="#i-water"/></svg> Água de hoje</div><div class="card" id="waterCard"></div>
    <div class="section-h"><svg class="ic"><use href="#i-check"/></svg> Hábitos de hoje</div><div class="card" id="habitCard"></div>
    <div class="section-h"><svg class="ic"><use href="#i-chart"/></svg> Peso</div><div class="card" id="weightCard"></div>
    <div class="section-h"><svg class="ic"><use href="#i-scale"/></svg> Medidas (cm)</div><div class="card" id="medCard"></div>
    <button class="abtn pdf" id="shareBtn" style="width:100%;margin-top:16px"><svg class="ic"><use href="#i-share"/></svg> Compartilhar meu progresso</button>
    <canvas class="sharecv" id="shareCv" width="1080" height="1080"></canvas></div>`));
  renderStat();renderHeat();renderPhotos();renderWater();renderHabits();renderWeight();renderMed();
  $('#shareBtn').onclick=shareProgress;
};
function renderStat(){
  const k=calc(); if(!k.metaCal&&!k.imc&&k.pct==null){ $('#statCard').innerHTML=`<div class="card" style="text-align:center"><p style="color:var(--muted);font-size:.9rem">Complete seu perfil para ver IMC, meta calórica e projeção.</p><button class="cfg-btn" id="edPerfil"><svg class="ic" style="width:18px;height:18px"><use href="#i-target"/></svg> Completar perfil</button></div>`; const e=$('#edPerfil'); if(e)e.onclick=()=>openOnboarding(true); return; }
  const pj=projecao();
  $('#statCard').innerHTML=`<div class="metabar">
      ${k.imc?`<div class="m ${k.imcCls}"><b>${k.imc}</b><span>IMC atual</span></div>`:''}
      ${k.metaCal?`<div class="m"><b>${k.metaCal}</b><span>meta kcal</span></div>`:''}
      ${k.pct!=null?`<div class="m"><b>${k.pct}%</b><span>da meta</span></div>`:''}</div>
    ${pj&&pj.weeks?`<div class="proj">📉 No ritmo atual (~<b>${pj.perWeek} kg/semana</b>), você atinge sua meta em cerca de <b>${pj.weeks} semana(s)</b>.</div>`:(pj&&pj.done?`<div class="proj">🎯 Você já atingiu sua meta de peso. Parabéns!</div>`:'')}`;
}
function renderHeat(){ const days=store.get('days',{}); const water=k=>store.get('water:'+k,0);
  const cells=[]; for(let i=1;i<=30;i++){ let cls=''; if(days[i])cls='l2'; cells.push(`<div class="hc ${cls}">${i}</div>`); }
  $('#heatCard').innerHTML=`<div class="heat">${cells.join('')}</div><p style="font-size:.76rem;color:var(--muted);margin-top:10px">Verde = dia concluído. Preencha a fileira e transforme constância em resultado.</p>`;
}
function renderPhotos(){ const ph=store.get('photos',[]);
  const thumbs=ph.map((p,i)=>`<div class="photo-wrap"><img class="photo" src="${p.data}"><div class="plabel">${fmtDate(p.d)}</div><button class="pdel" data-i="${i}"><svg class="ic" style="width:13px;height:13px"><use href="#i-close"/></svg></button></div>`).join('');
  const compare=ph.length>=2?`<div class="compare"><div class="cc"><img src="${ph[0].data}"><span>Antes · ${fmtDate(ph[0].d)}</span></div><div class="cc"><img src="${ph[ph.length-1].data}"><span>Depois · ${fmtDate(ph[ph.length-1].d)}</span></div></div>`:'';
  $('#photoCard').innerHTML=`<div class="photos">${thumbs}<label class="addphoto"><svg class="ic" style="width:24px;height:24px"><use href="#i-camera"/></svg>Adicionar<input type="file" accept="image/*" id="photoIn" class="hide"></label></div>${compare}
    <p style="font-size:.74rem;color:var(--muted);margin-top:8px">As fotos ficam só no seu aparelho. Tire na mesma posição/luz para comparar melhor.</p>`;
  const inp=$('#photoIn'); if(inp)inp.onchange=addPhoto;
  $('#photoCard').querySelectorAll('.pdel').forEach(b=>b.onclick=()=>{ const a=store.get('photos',[]); a.splice(+b.dataset.i,1); store.set('photos',a); renderPhotos(); });
}
function addPhoto(e){ const f=e.target.files[0]; if(!f)return; const rd=new FileReader();
  rd.onload=()=>{ const img=new Image(); img.onload=()=>{ try{ const c=document.createElement('canvas'); const mx=560; let w=img.width,h=img.height; if(w>h){ if(w>mx){h=h*mx/w;w=mx;} } else { if(h>mx){w=w*mx/h;h=mx;} } c.width=w;c.height=h; c.getContext('2d').drawImage(img,0,0,w,h); const data=c.toDataURL('image/jpeg',.6); const a=store.get('photos',[]); if(a.length>=8){ toast('Máximo de 8 fotos','i-close'); return;} a.push({d:today(),data}); try{store.set('photos',a);}catch(err){toast('Sem espaço para mais fotos','i-close');return;} renderPhotos(); toast('Foto adicionada!'); }catch(err){ toast('Não foi possível processar a foto','i-close'); } }; img.src=rd.result; };
  rd.readAsDataURL(f);
}
function renderWater(){ const key='water:'+today(); const goal=waterGoal(); let n=store.get(key,0);
  const cups=Array.from({length:goal},(_,i)=>`<div class="wcup ${i<n?'full':''}"></div>`).join('');
  $('#waterCard').innerHTML=`<div class="counter"><button class="cbtn" id="wMinus">−</button><div class="cval"><b>${n}</b><span>de ${goal} copos (250ml)</span></div><button class="cbtn" id="wPlus">+</button></div><div class="watergrid">${cups}</div>`;
  $('#wPlus').onclick=()=>{ const v=Math.min(goal+6,n+1); store.set(key,v); if(v>=goal&&!store.get('waterHit',false)){store.set('waterHit',true);checkAch();} vib(15); renderWater(); };
  $('#wMinus').onclick=()=>{ store.set(key,Math.max(0,n-1)); renderWater(); };
}
const HABITS=['Comi proteína nas refeições','Enchi metade do prato de vegetais','Me movimentei / treinei','Dormi 7h+','Sem furos hoje'];
function renderHabits(){ const key='hab:'+today(); const st=store.get(key,{});
  $('#habitCard').innerHTML=HABITS.map((h,i)=>`<div class="hab ${st[i]?'on':''}" data-i="${i}"><div class="box">${st[i]?'<svg class="ic" style="width:16px;height:16px"><use href="#i-check"/></svg>':''}</div><span>${h}</span></div>`).join('');
  $('#habitCard').querySelectorAll('.hab').forEach(el=>el.onclick=()=>{ const s=store.get(key,{}); s[el.dataset.i]=!s[el.dataset.i]; store.set(key,s); renderHabits(); });
}
function renderWeight(){ const arr=store.get('weights',[]);
  $('#weightCard').innerHTML=`<div class="winput"><input id="wIn" type="number" inputmode="decimal" placeholder="Peso de hoje (kg)"><button id="wAdd">Salvar</button></div>
    ${arr.length>1?weightChart(arr):''}
    <div class="wlog">${arr.slice().reverse().slice(0,8).map(e=>`<div class="wlog-row"><span>${fmtDate(e.d)}</span><b>${e.v} kg</b></div>`).join('')||'<div class="empty" style="padding:16px">Registre seu peso para ver a evolução.</div>'}</div>`;
  $('#wAdd').onclick=()=>{ const v=parseFloat(($('#wIn').value||'').replace(',','.')); if(!v||v<20||v>400)return; const a=store.get('weights',[]); const t=today(); const ex=a.find(x=>x.d===t); if(ex)ex.v=v; else a.push({d:t,v}); store.set('weights',a); checkAch(); toast('Peso salvo!'); if(currentView==='progresso'){renderWeight();renderStat();} };
}
function weightChart(arr){ const data=arr.slice(-12); const vs=data.map(x=>x.v); const mn=Math.min(...vs),mx=Math.max(...vs); const rng=(mx-mn)||1; const W=320,H=140,pad=12; const step=(W-pad*2)/Math.max(1,data.length-1);
  const pts=data.map((x,i)=>[pad+i*step,H-pad-((x.v-mn)/rng)*(H-pad*2)]);
  const area=`M${pts[0][0]},${H-pad} `+pts.map(p=>'L'+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')+` L${pts[pts.length-1][0]},${H-pad} Z`;
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const dots=pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="#1f6b4f"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${area}" fill="rgba(46,139,98,.12)"/><path d="${line}" fill="none" stroke="#2e8b62" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}
    <text x="${pad}" y="14" font-family="Inter" font-size="10" fill="#9aa8a1">${mx} kg</text><text x="${pad}" y="${H-3}" font-family="Inter" font-size="10" fill="#9aa8a1">${mn} kg</text></svg>`;
}
const MEDS=[['cintura','Cintura'],['abdomen','Abdômen'],['quadril','Quadril'],['bracoD','Braço'],['coxaD','Coxa']];
function renderMed(){ const hist=store.get('medHist',[]); const last=hist.length?hist[hist.length-1].v:{};
  const chart=medChart(hist);
  $('#medCard').innerHTML=MEDS.map(([kk,l])=>`<div class="winput" style="margin-top:8px"><input data-k="${kk}" type="number" inputmode="decimal" placeholder="${l}${last[kk]?' — atual: '+last[kk]+' cm':''}"></div>`).join('')
    +`<button id="medSave" class="abtn pdf" style="width:100%;margin-top:12px"><svg class="ic"><use href="#i-check"/></svg> Salvar medidas de hoje</button>${chart}`;
  $('#medSave').onclick=()=>{ const v={}; $('#medCard').querySelectorAll('input').forEach(inp=>{ const val=parseFloat((inp.value||'').replace(',','.')); if(val)v[inp.dataset.k]=val; }); if(!Object.keys(v).length)return; const h=store.get('medHist',[]); const prev=h.length?h[h.length-1].v:{}; h.push({d:today(),v:Object.assign({},prev,v)}); store.set('medHist',h); store.set('medidas',Object.assign({},prev,v)); toast('Medidas salvas!'); vib(15); renderMed(); };
}
function medChart(hist){ if(hist.length<2)return''; const data=hist.slice(-10).map(x=>({d:x.d,v:x.v.cintura})).filter(x=>x.v); if(data.length<2)return''; const vs=data.map(x=>x.v); const mn=Math.min(...vs),mx=Math.max(...vs); const rng=(mx-mn)||1; const W=320,H=110,pad=12; const step=(W-pad*2)/Math.max(1,data.length-1);
  const pts=data.map((x,i)=>[pad+i*step,H-pad-((x.v-mn)/rng)*(H-pad*2)]); const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  return `<p style="font-size:.76rem;color:var(--muted);margin:12px 0 2px;font-family:Poppins">Cintura (cm)</p><svg class="chart" style="height:110px" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${line}" fill="none" stroke="#b8975a" stroke-width="2.5" stroke-linecap="round"/>${pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#b8975a"/>`).join('')}</svg>`;
}
function fmtDate(d){ const p=(''+d).split('-'); return p[2]+'/'+p[1]; }
function shareProgress(){
  const k=calc(); const done=doneDaysCount(); const perdido=(k.pesoIni&&k.pesoAtual)?Math.max(0,Math.round((k.pesoIni-k.pesoAtual)*10)/10):0;
  try{ const c=$('#shareCv'); const x=c.getContext('2d'); const g=x.createLinearGradient(0,0,1080,1080); g.addColorStop(0,'#0f3d2e');g.addColorStop(1,'#1f6b4f'); x.fillStyle=g; x.fillRect(0,0,1080,1080);
    x.fillStyle='#7fc8a6'; x.font='700 40px Poppins,sans-serif'; x.textAlign='center'; x.fillText('PROJETO LEVE 30D',540,150);
    x.fillStyle='#fff'; x.font='800 130px Poppins,sans-serif'; x.fillText(done+'/30',540,420); x.font='500 44px Inter,sans-serif'; x.fillStyle='#dff0e6'; x.fillText('dias concluídos',540,480);
    if(perdido>0){ x.fillStyle='#fff'; x.font='800 150px Poppins,sans-serif'; x.fillText('-'+perdido+' kg',540,720); x.font='500 44px Inter,sans-serif'; x.fillStyle='#dff0e6'; x.fillText('de progresso 💪',540,780); }
    x.fillStyle='#c2a15e'; x.font='700 40px Poppins,sans-serif'; x.fillText('minha jornada leve',540,960);
    c.toBlob(b=>{ const f=new File([b],'meu-progresso.png',{type:'image/png'});
      if(navigator.canShare&&navigator.canShare({files:[f]})){ navigator.share({files:[f],title:'Meu progresso'}); }
      else { const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='meu-progresso.png'; a.click(); toast('Imagem salva! Compartilhe nos stories 📲'); } },'image/png');
  }catch(e){ toast('Não foi possível gerar a imagem','i-close'); }
}

/* ----- COMPRAS ----- */
VIEWS.compras=(root)=>{
  const st=store.get('shop',{});
  const cats=D.compras.map((c,ci)=>{ const items=c[1].map((it,ii)=>{ const key=ci+':'+ii; return `<div class="shop-item ${st[key]?'on':''}" data-k="${key}"><div class="box">${st[key]?ckIcon():''}</div><span>${esc(it)}</span></div>`;}).join(''); return `<div class="shopcat">${esc(c[0])}</div>${items}`; }).join('');
  const favs=store.get('favs',[]); const favRec=D.recipes.filter(r=>favs.includes(r.id)); const ingSet=[...new Set(favRec.flatMap(r=>r.ings))]; const favSt=store.get('shopFav',{});
  const favList=ingSet.length?`<div class="shopcat" style="background:linear-gradient(90deg,var(--gold),#a9863f)"><svg class="ic" style="width:17px;height:17px;vertical-align:-3px"><use href="#i-heart"/></svg> Das suas receitas favoritas</div>`+ingSet.map((it,ii)=>`<div class="shop-item ${favSt['f'+ii]?'on':''}" data-fk="f${ii}"><div class="box">${favSt['f'+ii]?ckIcon():''}</div><span>${esc(it)}</span></div>`).join(''):'';
  root.appendChild(ce(`<div class="view"><button class="backlink" id="backHome"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Início</button>
    <div class="vtitle">Lista de compras</div><div class="vsub">Marque o que já tem e compartilhe o restante.</div>
    <button class="abtn pdf" id="shareList" style="width:100%;margin-bottom:14px"><svg class="ic"><use href="#i-share"/></svg> Enviar lista (WhatsApp)</button>
    ${favList}${cats}
    <button class="abtn install" id="clearShop" style="width:100%;margin-top:18px">Limpar marcações</button></div>`));
  $('#backHome').onclick=()=>setView('home');
  $('#shareList').onclick=shareShopping;
  $('#clearShop').onclick=()=>{ store.set('shop',{}); store.set('shopFav',{}); setView('compras'); };
  root.querySelectorAll('.shop-item[data-k]').forEach(el=>el.onclick=()=>{ const s=store.get('shop',{}); const key=el.dataset.k; s[key]=!s[key]; store.set('shop',s); el.classList.toggle('on',s[key]); el.querySelector('.box').innerHTML=s[key]?ckIcon():''; });
  root.querySelectorAll('.shop-item[data-fk]').forEach(el=>el.onclick=()=>{ const s=store.get('shopFav',{}); const key=el.dataset.fk; s[key]=!s[key]; store.set('shopFav',s); el.classList.toggle('on',s[key]); el.querySelector('.box').innerHTML=s[key]?ckIcon():''; });
};
function ckIcon(){ return '<svg class="ic" style="width:15px;height:15px"><use href="#i-check"/></svg>'; }
function shareShopping(){ const st=store.get('shop',{}); let txt='🛒 Lista de compras — Projeto Leve 30D\n';
  D.compras.forEach((c,ci)=>{ const pend=c[1].filter((it,ii)=>!st[ci+':'+ii]); if(pend.length){ txt+='\n*'+c[0]+'*\n'+pend.map(x=>'• '+x).join('\n')+'\n'; } });
  const url='https://wa.me/?text='+encodeURIComponent(txt);
  if(navigator.share){ navigator.share({text:txt}).catch(()=>window.open(url,'_blank')); } else window.open(url,'_blank');
}

/* ----- BÔNUS ----- */
VIEWS.bonus=(root)=>{
  root.appendChild(ce(`<div class="view"><button class="backlink" id="backHome"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Início</button>
    <div class="vtitle">Bônus</div><div class="vsub">Conteúdos extras do seu programa.</div>
    <div class="grid2">${tile('bonusMarmitas','i-gift','30 Marmitas','Para congelar',true)}${tile('bonusLanches','i-food','50 Lanches','Até 200 kcal',true)}${tile('bonusDesafio','i-flame','Desafio 21 dias','Seca barriga',true)}${tile('recompensas','i-star','Recompensas','Receitas secretas',true)}</div>
    <div class="section-h">Depois dos 30 dias</div><div class="grid2">${tile('manutencao','i-leaf','Manutenção','Como manter o resultado')}${tile('receitas','i-food','+100 Receitas','Nas Receitas')}</div></div>`));
  $('#backHome').onclick=()=>setView('home');
  root.querySelectorAll('[data-goto]').forEach(el=>el.onclick=()=>setView(el.dataset.goto));
};
VIEWS.bonusMarmitas=(root)=>{ const rows=D.marmitas.map(m=>`<div class="bcard"><span class="bk">≈${m.kcal} kcal</span><div class="bn">Marmita ${m.n}: ${esc(m.prot)}</div><div class="bd">${esc(m.carbo)} + ${esc(m.leg)}</div></div>`).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="bk"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Bônus</button><div class="vtitle">30 Marmitas Fit</div><div class="vsub">Cozinhe uma vez, coma a semana.</div>${rows}</div>`)); $('#bk').onclick=()=>setView('bonus'); };
VIEWS.bonusLanches=(root)=>{ const rows=D.lanches.map((l,i)=>`<div class="bcard"><span class="bk">${l.kcal} kcal</span><div class="bn">${i+1}. ${esc(l.nome)}</div></div>`).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="bk"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Bônus</button><div class="vtitle">50 Lanches até 200 kcal</div><div class="vsub">Opções rápidas para não cair em besteira.</div>${rows}</div>`)); $('#bk').onclick=()=>setView('bonus'); };
VIEWS.bonusDesafio=(root)=>{ const st=store.get('desafio',{}); const done=Object.values(st).filter(Boolean).length;
  const rows=D.desafio.map(d=>`<div class="desafio-item ${st[d.dia]?'on':''}" data-d="${d.dia}"><div class="dn">${d.dia}</div><div class="di"><b>${esc(d.missao)}</b><span>${esc(d.porque)}</span></div><div class="box">${st[d.dia]?ckIcon():''}</div></div>`).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="bk"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Bônus</button><div class="vtitle">Desafio Seca Barriga</div><div class="vsub">${done}/21 missões · uma por dia</div>${rows}</div>`));
  $('#bk').onclick=()=>setView('bonus');
  root.querySelectorAll('.desafio-item').forEach(el=>el.onclick=()=>{ const s=store.get('desafio',{}); const d=el.dataset.d; s[d]=!s[d]; store.set('desafio',s); el.classList.toggle('on',s[d]); el.querySelector('.box').innerHTML=s[d]?ckIcon():''; if(s[d])vib(15); });
};
VIEWS.recompensas=(root)=>{ const done=doneDaysCount(); const rw=[7,14,21,28];
  const rows=rw.map((m,i)=>{ const unlocked=done>=m; const rid=D.secret[i]; const rec=D.recipes.find(r=>r.id===rid);
    return `<div class="reward ${unlocked?'':'lock'}" ${unlocked?`data-r="${rid}"`:''}><svg class="ic"><use href="#${unlocked?'i-gift':'i-trophy'}"/></svg>
      <div style="flex:1"><b>${unlocked?'Receita secreta desbloqueada!':'Complete '+m+' dias'}</b><span>${unlocked?esc(rec?rec.nome:'Toque para ver'):'Faltam '+(m-done)+' dia(s)'}</span></div>${unlocked?'<svg class="ic" style="width:18px;height:18px"><use href="#i-chev"/></svg>':''}</div>`; }).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="bk"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Bônus</button>
    <div class="vtitle">Recompensas</div><div class="vsub">Conclua semanas do programa e desbloqueie receitas secretas.</div>${rows}</div>`));
  $('#bk').onclick=()=>setView('bonus');
  root.querySelectorAll('[data-r]').forEach(el=>el.onclick=()=>openRecipe(+el.dataset.r));
};

/* ----- MANUTENÇÃO ----- */
VIEWS.manutencao=(root)=>{ const g=D.guias.find(x=>/come[çc]o|manuten|dia 30/i.test(x.titulo))||D.guias[D.guias.length-1];
  root.appendChild(ce(`<div class="view"><button class="backlink" id="bk"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Voltar</button>
    <div class="vtitle">Fase de Manutenção</div><div class="vsub">Como manter (e evoluir) depois dos 30 dias.</div>
    <div class="article">${g?g.html:'<p>Continue com o método: proteína em todas as refeições, água, treino 3x/semana e regra do nunca duas vezes seguidas.</p>'}</div></div>`));
  $('#bk').onclick=()=>setView(currentViewBack||'bonus');
};
let currentViewBack='bonus';

/* ----- GUIAS ----- */
VIEWS.guias=(root)=>{ const list=D.guias.map((g,i)=>`<button class="tile" data-g="${i}" style="margin-bottom:10px;flex-direction:row;align-items:center"><div class="ic-w"><svg class="ic"><use href="#i-guide"/></svg></div><h4 style="flex:1">${esc(g.titulo)}</h4><svg class="ic chev" style="color:var(--g300)"><use href="#i-chev"/></svg></button>`).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="backHome"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Início</button><div class="vtitle">Guias</div><div class="vsub">O conteúdo de leitura do programa.</div>${list}</div>`));
  $('#backHome').onclick=()=>setView('home');
  root.querySelectorAll('[data-g]').forEach(el=>el.onclick=()=>openGuia(+el.dataset.g));
};
function openGuia(i){ const g=D.guias[i]; if(!g)return; const r=$('#viewRoot'); r.innerHTML='';
  r.appendChild(ce(`<div class="view"><button class="backlink" id="bkG"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Guias</button><div class="vtitle">${esc(g.titulo)}</div><div class="article">${g.html}</div></div>`));
  $('#bkG').onclick=()=>setView('guias'); window.scrollTo(0,0); }

/* ----- CONFIG ----- */
VIEWS.config=(root)=>{ const dark=store.get('theme','light')==='dark'; const rem=store.get('reminders',false);
  root.appendChild(ce(`<div class="view"><button class="backlink" id="backHome"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Início</button>
    <div class="vtitle">Ajustes</div>
    <div class="card"><div class="cfg-row" id="edProf" style="cursor:pointer"><div class="ci"><svg class="ic"><use href="#i-target"/></svg><div><b>Editar perfil</b><span>Peso, altura, meta e calorias</span></div></div><svg class="ic chev" style="color:var(--g300)"><use href="#i-chev"/></svg></div>
      <div class="cfg-row"><div class="ci"><svg class="ic"><use href="#i-moon"/></svg><div><b>Modo escuro</b><span>Tema escuro para os olhos</span></div></div><div class="switch ${dark?'on':''}" id="swDark"></div></div>
      <div class="cfg-row"><div class="ci"><svg class="ic"><use href="#i-bell"/></svg><div><b>Lembretes</b><span>Aviso para não esquecer o dia</span></div></div><div class="switch ${rem?'on':''}" id="swRem"></div></div></div>
    <div class="section-h"><svg class="ic"><use href="#i-download"/></svg> Seus dados</div>
    <div class="card"><p style="font-size:.86rem;color:var(--muted);margin-bottom:4px">Seu progresso fica só neste aparelho. Faça backup para não perder ou levar para outro celular.</p>
      <button class="cfg-btn" id="btnExport"><svg class="ic" style="width:18px;height:18px"><use href="#i-download"/></svg> Exportar backup</button>
      <button class="cfg-btn" id="btnImport"><svg class="ic" style="width:18px;height:18px"><use href="#i-share"/></svg> Importar backup</button>
      <input type="file" id="importFile" accept="application/json" class="hide"></div>
    <div class="section-h">Sobre</div>
    <div class="card" style="font-size:.86rem;color:var(--muted)"><b style="font-family:Poppins;color:var(--ink)">Projeto Leve 30D</b> · app v3.0<br>Feito com carinho pela Sartor Digital.
      <button class="cfg-btn" id="btnLock" style="margin-top:14px"><svg class="ic" style="width:18px;height:18px"><use href="#i-close"/></svg> Bloquear app (sair)</button></div></div>`));
  $('#backHome').onclick=()=>setView('home');
  $('#edProf').onclick=()=>openOnboarding(true);
  $('#swDark').onclick=()=>{ const nv=store.get('theme','light')==='dark'?'light':'dark'; store.set('theme',nv); applyTheme(); $('#swDark').classList.toggle('on',nv==='dark'); };
  $('#swRem').onclick=()=>toggleReminders();
  $('#btnExport').onclick=exportData; $('#btnImport').onclick=()=>$('#importFile').click(); $('#importFile').onchange=importData;
  $('#btnLock').onclick=()=>{ if(confirm('Bloquear o app? Você precisará digitar o código novamente.')){ store.set('unlocked',0); location.reload(); } };
};
function exportData(){ const o={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k.startsWith('l30:'))o[k]=localStorage.getItem(k); }
  const blob=new Blob([JSON.stringify(o)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='leve30d-backup.json'; a.click(); URL.revokeObjectURL(url); toast('Backup exportado!'); }
function importData(e){ const f=e.target.files[0]; if(!f)return; const rd=new FileReader();
  rd.onload=()=>{ try{ const o=JSON.parse(rd.result); Object.keys(o).forEach(k=>{ if(k.startsWith('l30:'))localStorage.setItem(k,o[k]); }); applyTheme(); toast('Backup importado!'); setView('home'); }catch(err){ toast('Arquivo inválido','i-close'); } };
  rd.readAsText(f); }
function toggleReminders(){ const cur=store.get('reminders',false); if(cur){ store.set('reminders',false); $('#swRem').classList.remove('on'); return; }
  if(!('Notification'in window)){ toast('Seu navegador não suporta lembretes','i-close'); return; }
  Notification.requestPermission().then(p=>{ if(p==='granted'){ store.set('reminders',true); const s=$('#swRem'); if(s)s.classList.add('on'); toast('Lembretes ativados!','i-bell'); } else toast('Permissão negada','i-close'); }); }
function maybeRemind(){ if(!store.get('reminders',false))return; if(!('Notification'in window)||Notification.permission!=='granted')return; const t=today(); if(store.get('remindedOn','')===t)return; const nd=nextDay(); if(!nd)return;
  if(new Date().getHours()>=12){ try{ new Notification('Projeto Leve 30D',{body:'Bora marcar seu Dia '+nd+' e sua água? 💪',icon:'icons/icon-192.png'}); store.set('remindedOn',t); }catch(e){} } }

/* ---------- boot ---------- */
checkGate();
