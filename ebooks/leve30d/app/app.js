/* ============================================================
   PROJETO LEVE 30D — App PWA (v2)
   CONFIG: troque o código de acesso, o link do PDF e o WhatsApp abaixo.
   ============================================================ */
const CFG = {
  code    : 'Leve30D2026',                                    // código de acesso (entregue na Cakto)
  pdf     : 'https://drive.google.com/file/d/1Yc6UgDF_eA_j5_gpVxe9g1WH0Up3D1vY/view?usp=sharing',
  whatsapp: '5554993031264'                                   // usado no convite de depoimento
};
const D = window.APP_DATA || {recipes:[],cardapio:[],treinos:[],compras:[],guias:[],marmitas:[],lanches:[],desafio:[],cats:[]};

/* ---------- storage & utils ---------- */
const store = {
  get:(k,f)=>{ try{const v=localStorage.getItem('l30:'+k); return v==null?f:JSON.parse(v);}catch(e){return f;} },
  set:(k,v)=>{ try{localStorage.setItem('l30:'+k,JSON.stringify(v));}catch(e){} }
};
const today=()=>new Date().toISOString().slice(0,10);
const esc=(s)=>(s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=(s,r=document)=>r.querySelector(s);
const ce=(h)=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstElementChild;};
const vib=(p)=>{try{if(navigator.vibrate)navigator.vibrate(p);}catch(e){}};

/* ---------- theme ---------- */
function applyTheme(){ document.documentElement.dataset.theme = store.get('theme','light'); }
applyTheme();

/* ---------- toast ---------- */
let toastT=null;
function toast(msg,icon='i-check'){
  const el=$('#toast'); el.innerHTML=`<svg class="ic"><use href="#${icon}"/></svg><span>${msg}</span>`;
  el.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),2600);
}

/* ---------- service worker ---------- */
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }

/* ---------- install ---------- */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); deferredPrompt=e; });
function isiOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent); }
async function doInstall(){ if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; } else openInstallModal(); }
function openInstallModal(){
  const ios=isiOS(); const box=$('#imodalBox');
  box.innerHTML=`<h3>Instalar o app</h3>
    <p>Deixe o Projeto Leve 30D como um app na tela do celular — abre em tela cheia e funciona offline.</p>
    <div class="os-tabs"><div class="os-tab ${ios?'active':''}" data-os="ios">iPhone</div><div class="os-tab ${ios?'':'active'}" data-os="android">Android</div></div>
    <div id="iosSteps" class="${ios?'':'hide'}"><ol><li>Toque em <b>Compartilhar</b> (quadradinho com seta ↑) na barra do Safari.</li><li>Escolha <b>“Adicionar à Tela de Início”</b>.</li><li>Confirme em <b>Adicionar</b>.</li></ol></div>
    <div id="andSteps" class="${ios?'hide':''}"><ol><li>Toque no menu <b>⋮</b> do navegador.</li><li>Toque em <b>“Instalar app”</b> ou <b>“Adicionar à tela inicial”</b>.</li><li>Confirme.</li></ol></div>
    <button class="close" id="imClose">Entendi</button>`;
  box.querySelectorAll('.os-tab').forEach(t=>t.onclick=()=>{ box.querySelectorAll('.os-tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
    $('#iosSteps').classList.toggle('hide',t.dataset.os!=='ios'); $('#andSteps').classList.toggle('hide',t.dataset.os!=='android'); });
  $('#imClose').onclick=()=>$('#imodal').classList.remove('open');
  $('#imodal').classList.add('open');
}
$('#imodal').addEventListener('click',e=>{ if(e.target.id==='imodal') e.target.classList.remove('open'); });

/* ---------- gate ---------- */
function checkGate(){ if(store.get('unlocked')===1) showApp(); }
function tryUnlock(){
  const val=($('#code').value||'').trim();
  if(val.toUpperCase()===CFG.code.toUpperCase()){ store.set('unlocked',1); showApp(); }
  else{ $('#codeErr').textContent='Código incorreto. Confira na sua confirmação de compra.';
        const f=$('#gate .field'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); $('#code').value=''; $('#code').focus(); }
}
$('#unlockBtn').onclick=tryUnlock;
$('#code').addEventListener('keydown',e=>{ if(e.key==='Enter') tryUnlock(); });

function showApp(){
  $('#gate').classList.add('hide'); $('#app').style.display='block'; $('#tabbar').classList.remove('hide');
  $('#topInstall').onclick=doInstall; $('#topCfg').onclick=()=>setView('config');
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>setView(t.dataset.view));
  if(!store.get('onb')) openOnboarding(); else { setView('home'); maybeRemind(); }
}

/* ---------- onboarding ---------- */
function openOnboarding(){
  $('#onbBox').innerHTML=`<h3>Vamos começar! 🌿</h3>
    <p>Duas perguntas rápidas para personalizar seu app e sua meta de água.</p>
    <label>Seu peso atual (kg)</label><input id="onbPeso" type="number" inputmode="decimal" placeholder="Ex.: 78">
    <label>Peso que você quer alcançar (kg) — opcional</label><input id="onbMeta" type="number" inputmode="decimal" placeholder="Ex.: 72">
    <button class="prim" id="onbGo">Começar minha jornada</button>
    <button class="skip" id="onbSkip">Pular por agora</button>`;
  $('#onb').classList.add('open');
  $('#onbGo').onclick=()=>{
    const peso=parseFloat(($('#onbPeso').value||'').replace(',','.'));
    const meta=parseFloat(($('#onbMeta').value||'').replace(',','.'));
    const cfg={}; if(peso&&peso>20&&peso<400){ cfg.peso=peso; cfg.waterGoal=Math.max(6,Math.round(peso*35/250));
      const w=store.get('weights',[]); if(!w.length){ w.push({d:today(),v:peso}); store.set('weights',w);} }
    if(meta&&meta>20&&meta<400) cfg.meta=meta;
    store.set('cfg',cfg); store.set('onb',1); $('#onb').classList.remove('open'); setView('home');
    if(peso) toast('Tudo pronto! Meta de água: '+ (cfg.waterGoal||10) +' copos','i-water');
  };
  $('#onbSkip').onclick=()=>{ store.set('onb',1); $('#onb').classList.remove('open'); setView('home'); };
}

/* ---------- router ---------- */
let currentView='home';
function setView(name){
  currentView=name;
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===name));
  const root=$('#viewRoot'); root.innerHTML=''; (VIEWS[name]||VIEWS.home)(root); window.scrollTo(0,0);
}

/* ---------- sheet ---------- */
function openSheet(html){
  $('#sheetInner').innerHTML='<div class="sheet-grab"></div><button class="sheet-close" id="shClose"><svg class="ic"><use href="#i-close"/></svg></button>'+html;
  $('#sheet').classList.add('open'); $('#shClose').onclick=closeSheet;
}
function closeSheet(){ $('#sheet').classList.remove('open'); stopTimer(); }
$('#sheet').addEventListener('click',e=>{ if(e.target.id==='sheet') closeSheet(); });

/* ---------- estado / helpers de progresso ---------- */
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
function achState(){ return {done:doneDaysCount(),seq:seqFromStart(),workouts:store.get('workouts',0),
  favs:(store.get('favs',[])).length,waterHit:store.get('waterHit',false)}; }
function checkAch(){
  const s=achState(); const un=store.get('ach',{}); let changed=false;
  ACH.forEach(a=>{ if(a.on(s)&&!un[a.id]){ un[a.id]=today(); changed=true; setTimeout(()=>toast('Conquista: '+a.t+' 🏅','i-trophy'),300); } });
  if(changed) store.set('ach',un);
}

/* ============================================================ VIEWS */
const VIEWS={};

/* ----- HOME ----- */
VIEWS.home=(root)=>{
  checkAch();
  const done=doneDaysCount(), seq=seqFromStart(), workouts=store.get('workouts',0);
  const ringC=2*Math.PI*34; const nd=nextDay();
  const depoDismissed=store.get('depoDismiss',false);
  const showDepo=done>=21 && !depoDismissed;
  let html=`<div class="view">
    <div class="hero">
      <svg class="ring" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="8"/>
        <circle cx="40" cy="40" r="34" fill="none" stroke="#7fc8a6" stroke-width="8" stroke-linecap="round"
          stroke-dasharray="${ringC}" stroke-dashoffset="${ringC*(1-done/30)}" transform="rotate(-90 40 40)"/>
        <text x="40" y="38" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="20" fill="#fff">${done}</text>
        <text x="40" y="52" text-anchor="middle" font-family="Inter" font-size="9" fill="#cfe7da">de 30 dias</text>
      </svg>
      <div><div class="h-t">${saudacao()} 🌿</div>
        <div class="h-s">${done===0?'Bora começar? Marque seu Dia 1 abaixo.':(done>=30?'Você concluiu os 30 dias. Que orgulho!':'Você já concluiu '+done+' dia(s). Siga firme!')}</div></div>
    </div>
    <div class="streak">
      <div class="s-item fire"><div class="sn"><svg class="ic"><use href="#i-flame"/></svg>${seq}</div><div class="sl">dias seguidos</div></div>
      <div class="s-item green"><div class="sn">${done}</div><div class="sl">dias concluídos</div></div>
      <div class="s-item gold"><div class="sn"><svg class="ic"><use href="#i-dumbbell"/></svg>${workouts}</div><div class="sl">treinos feitos</div></div>
    </div>`;
  if(showDepo){ html+=`<div class="depo"><b>Você chegou longe! 💛</b>
    <p>Se o Projeto Leve 30D está te ajudando, seu depoimento faz a diferença (e ajuda outras pessoas a começarem).</p>
    <a href="https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent('Quero deixar meu depoimento sobre o Projeto Leve 30D!')}" target="_blank" rel="noopener"><svg class="ic" style="width:18px;height:18px"><use href="#i-share"/></svg> Enviar depoimento</a>
    <a class="dismiss" id="depoX">agora não</a></div>`; }
  // today card
  if(nd){ const d=D.cardapio.find(x=>x.dia===nd);
    const meals=d.ref.slice(0,4).map(r=>`<div class="tmeal"><div class="mw">${esc(r[0])}</div><div class="mt">${esc(vegText(r[1]))}</div></div>`).join('');
    html+=`<div class="section-h"><svg class="ic"><use href="#i-cal"/></svg> Seu dia de hoje</div>
      <div class="today"><div class="tday-h"><b>Dia ${nd}</b><span class="pill">≈${d.kcal} kcal</span></div>
        ${meals}<button class="tbtn" id="doneToday"><svg class="ic" style="width:20px;height:20px"><use href="#i-check"/></svg> Concluir Dia ${nd}</button></div>`;
  } else { html+=`<div class="today" style="text-align:center"><b style="font-family:Poppins;color:var(--g600)">🎉 Você concluiu todos os 30 dias!</b>
      <p style="color:var(--muted);font-size:.88rem;margin-top:6px">Continue com o plano de manutenção nos Guias.</p></div>`; }
  html+=`<div class="actions">
      <a class="abtn pdf" href="${CFG.pdf}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-download"/></svg> Baixar PDF</a>
      <button class="abtn install" id="homeInstall"><svg class="ic"><use href="#i-home"/></svg> Instalar app</button></div>
    <div class="section-h"><svg class="ic"><use href="#i-leaf"/></svg> Seu programa</div>
    <div class="grid2">
      ${tile('cardapio','i-cal','Cardápio 30 dias','Refeições dia a dia')}
      ${tile('receitas','i-food','Receitas','+'+D.recipes.length+' receitas')}
      ${tile('treinos','i-dumbbell','Treinos','3 níveis + timer')}
      ${tile('progresso','i-chart','Progresso','Peso, água, hábitos')}
      ${tile('bonus','i-gift','Bônus','Marmitas, lanches, desafio',true)}
      ${tile('conquistas','i-trophy','Conquistas','Suas medalhas',true)}
      ${tile('compras','i-cart','Lista de compras','Marque o que já tem')}
      ${tile('guias','i-guide','Guias','Mentalidade, nutrição +')}
    </div></div>`;
  root.appendChild(ce(html));
  $('#homeInstall').onclick=doInstall;
  const dt=$('#doneToday'); if(dt) dt.onclick=()=>{ const dd=store.get('days',{}); dd[nd]=true; store.set('days',dd); checkAch(); vib(30); toast('Dia '+nd+' concluído! 🎉'); setView('home'); };
  const dx=$('#depoX'); if(dx) dx.onclick=()=>{ store.set('depoDismiss',true); setView('home'); };
  root.querySelectorAll('[data-goto]').forEach(el=>el.onclick=()=>setView(el.dataset.goto));
};
function saudacao(){ const h=new Date().getHours(); return h<12?'Bom dia!':h<18?'Boa tarde!':'Boa noite!'; }
function tile(view,icon,title,sub,gold){ return `<button class="tile ${gold?'gold':''}" data-goto="${view}"><div class="ic-w"><svg class="ic"><use href="#${icon}"/></svg></div><h4>${title}</h4><p>${sub}</p></button>`; }

/* ----- veg ----- */
const VEGMAP=[[/peito de frango|frango desfiado|frango grelhado|frango/gi,'grão-de-bico'],
 [/carne moída magra|carne moída|carne magra|patinho|bife|carne de panela|almôndegas de frango|almôndegas/gi,'lentilha'],
 [/tilápia|salmão|sardinha|peixe|atum/gi,'tofu'],[/peito de peru/gi,'tofu']];
function vegText(t){ if(!store.get('veg',false)) return t; let s=t; VEGMAP.forEach(([re,r])=>s=s.replace(re,r)); return s; }

/* ----- CARDÁPIO ----- */
VIEWS.cardapio=(root)=>{
  const days=store.get('days',{}); const done=doneDaysCount(); const veg=store.get('veg',false);
  const items=D.cardapio.map(d=>{ const alm=d.ref.find(r=>r[0]==='Almoço');
    return `<div class="day-item ${days[d.dia]?'done':''}" data-day="${d.dia}"><div class="dn">${d.dia}</div>
      <div class="di"><b>Dia ${d.dia}</b><span>${esc(vegText(alm?alm[1]:''))}</span></div>
      <span class="kbadge">≈${d.kcal}</span><svg class="ic chev"><use href="#i-chev"/></svg></div>`; }).join('');
  root.appendChild(ce(`<div class="view"><div class="vtitle">Cardápio de 30 dias</div>
    <div class="vsub">${done}/30 dias concluídos · toque para ver as refeições</div>
    <div class="card" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding:13px 16px">
      <div style="display:flex;align-items:center;gap:10px"><svg class="ic" style="color:var(--g600)"><use href="#i-leaf"/></svg>
        <div><b style="font-family:Poppins;font-size:.92rem">Modo vegetariano</b><div style="font-size:.76rem;color:var(--muted)">Troca proteínas animais por vegetais</div></div></div>
      <div class="switch ${veg?'on':''}" id="vegSw"></div></div>
    ${items}</div>`));
  $('#vegSw').onclick=()=>{ store.set('veg',!veg); setView('cardapio'); toast(veg?'Modo vegetariano desligado':'Modo vegetariano ligado','i-leaf'); };
  root.querySelectorAll('.day-item').forEach(el=>el.onclick=()=>openDay(+el.dataset.day));
};
function openDay(n){
  const d=D.cardapio.find(x=>x.dia===n); if(!d) return; const days=store.get('days',{}); const isDone=!!days[n];
  const meals=d.ref.map(r=>`<div class="meal"><div class="mw">${esc(r[0])}</div><div class="mt">${esc(vegText(r[1]))}</div><div class="mk">${r[2]} kcal</div></div>`).join('');
  openSheet(`<h3>Dia ${n}</h3><div class="rm"><span><b>Total:</b> ≈${d.kcal} kcal</span></div>
    <div class="card" style="padding:4px 14px">${meals}</div>
    <button class="abtn ${isDone?'install':'pdf'}" id="markDay" style="width:100%;margin-top:16px"><svg class="ic"><use href="#i-check"/></svg> ${isDone?'Concluído — desmarcar':'Marcar como concluído'}</button>`);
  $('#markDay').onclick=()=>{ const dd=store.get('days',{}); dd[n]=!dd[n]; store.set('days',dd); checkAch(); if(dd[n]){vib(30);toast('Dia '+n+' concluído! 🎉');} closeSheet(); if(currentView==='cardapio')setView('cardapio'); };
}

/* ----- RECEITAS ----- */
let recFilter={cat:'Todos',q:''};
VIEWS.receitas=(root)=>{
  root.appendChild(ce(`<div class="view"><div class="vtitle">Receitas</div>
    <div class="searchbar"><svg class="ic"><use href="#i-food"/></svg><input id="recQ" type="search" placeholder="Buscar receita..." value="${esc(recFilter.q)}"></div>
    <div class="chips" id="recChips"></div><div id="recList"></div></div>`));
  const chips=['Todos','Favoritas',...D.cats];
  $('#recChips').innerHTML=chips.map(c=>`<button class="chip ${recFilter.cat===c?'active':''}" data-c="${c}">${c==='Favoritas'?'<svg class=\"ic\"><use href=\"#i-heart\"/></svg>':''}${c}</button>`).join('');
  $('#recChips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{ recFilter.cat=b.dataset.c; $('#recChips').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b)); renderRecList(); });
  $('#recQ').oninput=e=>{ recFilter.q=e.target.value; renderRecList(); };
  renderRecList();
};
function renderRecList(){
  const q=recFilter.q.toLowerCase(); const favs=store.get('favs',[]);
  let list=D.recipes.filter(r=>(!q||r.nome.toLowerCase().includes(q)));
  if(recFilter.cat==='Favoritas') list=list.filter(r=>favs.includes(r.id));
  else if(recFilter.cat!=='Todos') list=list.filter(r=>r.cat===recFilter.cat);
  const el=$('#recList'); if(!el) return;
  if(!list.length){ el.innerHTML=`<div class="empty">${recFilter.cat==='Favoritas'?'Você ainda não favoritou receitas. Toque no ♥ em uma receita.':'Nenhuma receita encontrada.'}</div>`; return; }
  el.innerHTML=list.map(r=>`<div class="rec-item"><div class="rc-main" data-id="${r.id}">
      <span class="cat-tag">${esc(r.cat)}</span><h4>${esc(r.nome)}</h4>
      <div class="rm"><span><b>${esc(r.tempo)}</b></span><span><b>${r.kcal}</b> kcal</span></div></div>
      <button class="fav-btn ${favs.includes(r.id)?'on':''}" data-fav="${r.id}"><svg class="ic"><use href="#i-heart"/></svg></button></div>`).join('');
  el.querySelectorAll('.rc-main').forEach(x=>x.onclick=()=>openRecipe(+x.dataset.id));
  el.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{ toggleFav(+b.dataset.fav); renderRecList(); });
}
function toggleFav(id){ const f=store.get('favs',[]); const i=f.indexOf(id); if(i>=0)f.splice(i,1); else{f.push(id);toast('Adicionada aos favoritos ♥');} store.set('favs',f); checkAch(); }
function openRecipe(id){
  const r=D.recipes.find(x=>x.id===id); if(!r) return; const fav=store.get('favs',[]).includes(id);
  openSheet(`<span class="cat-tag" style="display:inline-block;margin-bottom:8px">${esc(r.cat)}</span>
    <h3>${esc(r.nome)}</h3><div class="rm"><span><b>Tempo:</b> ${esc(r.tempo)}</span><span><b>${r.kcal}</b> kcal</span></div>
    <div class="sub-h">Ingredientes</div><ul>${r.ings.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
    <div class="sub-h">Modo de preparo</div><ol>${r.modo.map(m=>`<li>${esc(m)}</li>`).join('')}</ol>
    <button class="abtn ${fav?'install':'pdf'}" id="favSheet" style="width:100%;margin-top:16px"><svg class="ic"><use href="#i-heart"/></svg> ${fav?'Remover dos favoritos':'Salvar nos favoritos'}</button>`);
  $('#favSheet').onclick=()=>{ toggleFav(id); closeSheet(); if(currentView==='receitas')renderRecList(); };
}

/* ----- TREINOS ----- */
VIEWS.treinos=(root)=>{
  const workouts=store.get('workouts',0);
  const cards=D.treinos.map((t,i)=>`<button class="tile" data-t="${i}" style="margin-bottom:12px;flex-direction:row;align-items:center">
    <div class="ic-w"><svg class="ic"><use href="#i-dumbbell"/></svg></div>
    <div style="flex:1"><h4>Treino ${esc(t.nivel)}</h4><p>${esc(t.info)}</p></div><svg class="ic chev" style="color:var(--g300)"><use href="#i-chev"/></svg></button>`).join('');
  root.appendChild(ce(`<div class="view"><div class="vtitle">Treinos em casa</div>
    <div class="vsub">Sem equipamento · você já fez ${workouts} treino(s)</div>${cards}
    <div class="card" style="font-size:.86rem;color:var(--muted)"><b style="font-family:Poppins;color:var(--ink)">Timer em modo circuito:</b> abra um treino e toque em <b>Iniciar circuito</b> — o app guia trabalho e descanso automaticamente, com bipe e vibração.</div></div>`));
  root.querySelectorAll('[data-t]').forEach(el=>el.onclick=()=>openWorkout(+el.dataset.t));
};
function openWorkout(i){
  const t=D.treinos[i]; if(!t) return;
  const aq=t.aquecimento.map(x=>`<li>${esc(x)}</li>`).join('');
  const ex=t.ex.map((e,k)=>`<div class="ex-row" data-ex="${k}"><div class="exn"><b>${esc(e[0])}</b><span>${e[1]} séries</span></div><div class="exs">${esc(e[2])} reps<br>${esc(e[3])} desc.</div></div>`).join('');
  const ca=t.calma.map(x=>`<li>${esc(x)}</li>`).join('');
  openSheet(`<h3>Treino ${esc(t.nivel)}</h3><div class="rm"><span>${esc(t.info)}</span></div>
    <div class="timer card"><div class="tt" id="tDisp">00:00</div><div class="ts" id="tLbl">Timer de descanso ou circuito completo</div><div class="tround" id="tRound"></div>
      <div class="timer-ctrls"><button class="rs" data-sec="30">30s</button><button class="rs" data-sec="45">45s</button><button class="rs" data-sec="60">60s</button>
        <button class="go" id="tCircuit">▶ Circuito</button></div>
      <div class="timer-ctrls" id="tRunCtrls" style="display:none"><button class="rs" id="tPause">Pausar</button><button class="rs" id="tStop">Parar</button></div></div>
    <div class="sub-h">Aquecimento (5 min)</div><ul>${aq}</ul>
    <div class="sub-h">Circuito principal</div><div class="card" style="padding:2px 14px" id="exList">${ex}</div>
    <div class="sub-h">Volta à calma</div><ul>${ca}</ul>
    <button class="abtn pdf" id="wDone" style="width:100%;margin-top:16px"><svg class="ic"><use href="#i-check"/></svg> Marcar treino como feito</button>`);
  initTimer(t);
  $('#wDone').onclick=()=>{ store.set('workouts',store.get('workouts',0)+1); checkAch(); vib(30); toast('Treino registrado! 💪'); closeSheet(); };
}
/* timer engine (descanso + circuito) */
let tState={id:null,running:false};
let actx=null;
function beep(f=880,d=.15){ try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); const o=actx.createOscillator(),g=actx.createGain(); o.frequency.value=f; o.connect(g);g.connect(actx.destination);
  g.gain.setValueAtTime(.0001,actx.currentTime); g.gain.exponentialRampToValueAtTime(.35,actx.currentTime+.01); g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d); o.start(); o.stop(actx.currentTime+d);}catch(e){} }
function fmt(s){ return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
function initTimer(t){
  tState={id:null,running:false,mode:null};
  const disp=()=>{ const d=$('#tDisp'); if(d)d.textContent=fmt(Math.max(0,tState.left||0)); };
  document.querySelectorAll('.timer-ctrls .rs[data-sec]').forEach(b=>b.onclick=()=>{ startRest(+b.dataset.sec,disp); document.querySelectorAll('.rs[data-sec]').forEach(x=>x.classList.toggle('active',x===b)); });
  $('#tCircuit').onclick=()=>startCircuit(t,disp);
  $('#tPause').onclick=()=>{ if(tState.running){ pauseTimer(); $('#tPause').textContent='Retomar'; } else { resumeTimer(); $('#tPause').textContent='Pausar'; } };
  $('#tStop').onclick=()=>{ stopTimer(); $('#tLbl').textContent='Parado'; $('#tRound').textContent=''; $('#tRunCtrls').style.display='none'; $('#tDisp').textContent='00:00'; highlightEx(-1); };
  disp();
}
function tick(){ tState.left--; const d=$('#tDisp'); if(d)d.textContent=fmt(Math.max(0,tState.left)); if(tState.left<=0) tState.onZero&&tState.onZero(); }
function startRest(sec){
  stopTimer(); tState.mode='rest'; tState.left=sec; tState.running=true;
  $('#tLbl').textContent='Descanso — respire'; $('#tRound').textContent=''; $('#tRunCtrls').style.display='flex'; $('#tPause').textContent='Pausar';
  tState.onZero=()=>{ stopTimer(); beep(760,.25); vib([200,80,200]); $('#tLbl').textContent='Descanso concluído! 💪'; $('#tRunCtrls').style.display='none'; };
  tState.id=setInterval(tick,1000);
}
function startCircuit(t){
  stopTimer(); const WORK=40,REST=20,PREP=8; const q=[]; q.push({p:'prep',s:PREP,name:'Prepare-se'});
  t.ex.forEach((e,i)=>{ q.push({p:'work',s:WORK,name:e[0],idx:i}); if(i<t.ex.length-1)q.push({p:'rest',s:REST,name:'Descanso',idx:i}); });
  tState.mode='circuit'; tState.q=q; tState.qi=0; tState.running=true; $('#tRunCtrls').style.display='flex'; $('#tPause').textContent='Pausar';
  const total=t.ex.length;
  const loadPhase=()=>{ if(tState.qi>=q.length){ stopTimer(); beep(980,.3); setTimeout(()=>beep(1180,.3),180); vib([250,100,250]); $('#tLbl').textContent='Circuito concluído! 🎉'; $('#tRound').textContent=''; $('#tRunCtrls').style.display='none'; highlightEx(-1);
      store.set('workouts',store.get('workouts',0)+1); checkAch(); return; }
    const ph=q[tState.qi]; tState.left=ph.s;
    $('#tLbl').textContent=ph.p==='prep'?'Prepare-se: '+ (q[1]?q[1].name:''): ph.p==='work'?'▶ '+ph.name : 'Descanso';
    if(ph.p==='work'){ $('#tRound').textContent='Exercício '+(ph.idx+1)+' de '+total; highlightEx(ph.idx); beep(880,.15); }
    else if(ph.p==='rest'){ $('#tRound').textContent='Próximo: '+(q[tState.qi+1]?q[tState.qi+1].name:''); highlightEx(-1); beep(600,.15); }
    else { $('#tRound').textContent='Começando...'; }
    $('#tDisp').textContent=fmt(ph.s); };
  tState.onZero=()=>{ tState.qi++; loadPhase(); };
  loadPhase(); tState.id=setInterval(tick,1000);
}
function highlightEx(idx){ document.querySelectorAll('#exList .ex-row').forEach(r=>r.classList.toggle('now',+r.dataset.ex===idx)); }
function pauseTimer(){ if(tState.id){clearInterval(tState.id);tState.id=null;} tState.running=false; }
function resumeTimer(){ if(!tState.running&&tState.left>0){ tState.running=true; tState.id=setInterval(tick,1000); } }
function stopTimer(){ if(tState.id){clearInterval(tState.id);tState.id=null;} tState.running=false; }

/* ----- PROGRESSO ----- */
VIEWS.progresso=(root)=>{
  root.appendChild(ce(`<div class="view"><div class="vtitle">Seu progresso</div>
    <div class="vsub">Tudo salvo no seu aparelho, funciona offline.</div>
    <div class="section-h"><svg class="ic"><use href="#i-water"/></svg> Água de hoje</div><div class="card" id="waterCard"></div>
    <div class="section-h"><svg class="ic"><use href="#i-check"/></svg> Hábitos de hoje</div><div class="card" id="habitCard"></div>
    <div class="section-h"><svg class="ic"><use href="#i-chart"/></svg> Peso</div><div class="card" id="weightCard"></div>
    <div class="section-h"><svg class="ic"><use href="#i-scale"/></svg> Medidas (cm)</div><div class="card" id="medCard"></div></div>`));
  renderWater();renderHabits();renderWeight();renderMed();
};
function renderWater(){
  const key='water:'+today(); const goal=waterGoal(); let n=store.get(key,0);
  const cups=Array.from({length:goal},(_,i)=>`<div class="wcup ${i<n?'full':''}"></div>`).join('');
  $('#waterCard').innerHTML=`<div class="counter"><button class="cbtn" id="wMinus">−</button>
    <div class="cval"><b>${n}</b><span>de ${goal} copos (250ml)</span></div><button class="cbtn" id="wPlus">+</button></div>
    <div class="watergrid">${cups}</div>`;
  $('#wPlus').onclick=()=>{ const v=Math.min(goal+6,n+1); store.set(key,v); if(v>=goal&&!store.get('waterHit',false)){store.set('waterHit',true);checkAch();} vib(15); renderWater(); };
  $('#wMinus').onclick=()=>{ store.set(key,Math.max(0,n-1)); renderWater(); };
}
const HABITS=['Comi proteína nas refeições','Enchi metade do prato de vegetais','Me movimentei / treinei','Dormi 7h+','Sem furos hoje'];
function renderHabits(){
  const key='hab:'+today(); const st=store.get(key,{});
  $('#habitCard').innerHTML=HABITS.map((h,i)=>`<div class="hab ${st[i]?'on':''}" data-i="${i}"><div class="box">${st[i]?'<svg class="ic" style="width:16px;height:16px"><use href="#i-check"/></svg>':''}</div><span>${h}</span></div>`).join('');
  $('#habitCard').querySelectorAll('.hab').forEach(el=>el.onclick=()=>{ const s=store.get(key,{}); s[el.dataset.i]=!s[el.dataset.i]; store.set(key,s); renderHabits(); });
}
function renderWeight(){
  const arr=store.get('weights',[]);
  $('#weightCard').innerHTML=`<div class="winput"><input id="wIn" type="number" inputmode="decimal" placeholder="Peso de hoje (kg)"><button id="wAdd">Salvar</button></div>
    ${arr.length>1?weightChart(arr):''}
    <div class="wlog">${arr.slice().reverse().slice(0,8).map(e=>`<div class="wlog-row"><span>${fmtDate(e.d)}</span><b>${e.v} kg</b></div>`).join('')||'<div class="empty" style="padding:16px">Registre seu peso para ver a evolução.</div>'}</div>`;
  $('#wAdd').onclick=()=>{ const v=parseFloat(($('#wIn').value||'').replace(',','.')); if(!v||v<20||v>400)return; const a=store.get('weights',[]); const t=today(); const ex=a.find(x=>x.d===t); if(ex)ex.v=v; else a.push({d:t,v}); store.set('weights',a); checkAch(); toast('Peso salvo!'); renderWeight(); };
}
function weightChart(arr){
  const data=arr.slice(-12); const vs=data.map(x=>x.v); const mn=Math.min(...vs),mx=Math.max(...vs); const rng=(mx-mn)||1;
  const W=320,H=140,pad=12; const step=(W-pad*2)/Math.max(1,data.length-1);
  const pts=data.map((x,i)=>[pad+i*step,H-pad-((x.v-mn)/rng)*(H-pad*2)]);
  const area=`M${pts[0][0]},${H-pad} `+pts.map(p=>'L'+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')+` L${pts[pts.length-1][0]},${H-pad} Z`;
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const dots=pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="#1f6b4f"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <path d="${area}" fill="rgba(46,139,98,.12)"/><path d="${line}" fill="none" stroke="#2e8b62" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}
    <text x="${pad}" y="14" font-family="Inter" font-size="10" fill="#9aa8a1">${mx} kg</text>
    <text x="${pad}" y="${H-3}" font-family="Inter" font-size="10" fill="#9aa8a1">${mn} kg</text></svg>`;
}
const MEDS=[['cintura','Cintura'],['abdomen','Abdômen'],['quadril','Quadril'],['bracoD','Braço'],['coxaD','Coxa']];
function renderMed(){
  const m=store.get('medidas',{});
  $('#medCard').innerHTML=MEDS.map(([k,l])=>`<div class="winput" style="margin-top:8px"><input data-k="${k}" type="number" inputmode="decimal" placeholder="${l}${m[k]?' — atual: '+m[k]+' cm':''}"></div>`).join('')
    +`<button id="medSave" class="abtn pdf" style="width:100%;margin-top:12px"><svg class="ic"><use href="#i-check"/></svg> Salvar medidas</button>`;
  $('#medSave').onclick=()=>{ const m2=store.get('medidas',{}); $('#medCard').querySelectorAll('input').forEach(inp=>{ const v=parseFloat((inp.value||'').replace(',','.')); if(v)m2[inp.dataset.k]=v; }); store.set('medidas',m2); toast('Medidas salvas!'); vib(15); renderMed(); };
}
function fmtDate(d){ const p=d.split('-'); return p[2]+'/'+p[1]; }

/* ----- COMPRAS ----- */
VIEWS.compras=(root)=>{
  const st=store.get('shop',{});
  const cats=D.compras.map((c,ci)=>{ const items=c[1].map((it,ii)=>{ const k=ci+':'+ii; return `<div class="shop-item ${st[k]?'on':''}" data-k="${k}"><div class="box">${st[k]?ck():''}</div><span>${esc(it)}</span></div>`;}).join('');
    return `<div class="shopcat">${esc(c[0])}</div>${items}`; }).join('');
  // lista automática das favoritas
  const favs=store.get('favs',[]); const favRec=D.recipes.filter(r=>favs.includes(r.id));
  const ingSet=[...new Set(favRec.flatMap(r=>r.ings))];
  const favSt=store.get('shopFav',{});
  const favList=ingSet.length?`<div class="shopcat" style="background:linear-gradient(90deg,var(--gold),#a9863f)"><svg class="ic" style="width:17px;height:17px;vertical-align:-3px"><use href="#i-heart"/></svg> Ingredientes das suas favoritas</div>`
    +ingSet.map((it,ii)=>`<div class="shop-item ${favSt['f'+ii]?'on':''}" data-fk="f${ii}"><div class="box">${favSt['f'+ii]?ck():''}</div><span>${esc(it)}</span></div>`).join(''):'';
  root.appendChild(ce(`<div class="view"><button class="backlink" id="backHome"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Início</button>
    <div class="vtitle">Lista de compras</div><div class="vsub">Marque o que já tem em casa.</div>
    ${favList}${cats}
    <button class="abtn install" id="clearShop" style="width:100%;margin-top:18px">Limpar marcações</button></div>`));
  $('#backHome').onclick=()=>setView('home');
  $('#clearShop').onclick=()=>{ store.set('shop',{}); store.set('shopFav',{}); setView('compras'); };
  root.querySelectorAll('.shop-item[data-k]').forEach(el=>el.onclick=()=>{ const s=store.get('shop',{}); const k=el.dataset.k; s[k]=!s[k]; store.set('shop',s); el.classList.toggle('on',s[k]); el.querySelector('.box').innerHTML=s[k]?ck():''; });
  root.querySelectorAll('.shop-item[data-fk]').forEach(el=>el.onclick=()=>{ const s=store.get('shopFav',{}); const k=el.dataset.fk; s[k]=!s[k]; store.set('shopFav',s); el.classList.toggle('on',s[k]); el.querySelector('.box').innerHTML=s[k]?ck():''; });
};
function ck(){ return '<svg class="ic" style="width:15px;height:15px"><use href="#i-check"/></svg>'; }

/* ----- BÔNUS ----- */
VIEWS.bonus=(root)=>{
  root.appendChild(ce(`<div class="view"><button class="backlink" id="backHome"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Início</button>
    <div class="vtitle">Bônus</div><div class="vsub">Conteúdos extras do seu programa.</div>
    <div class="grid2">
      ${tile('bonusMarmitas','i-gift','30 Marmitas','Para congelar',true)}
      ${tile('bonusLanches','i-food','50 Lanches','Até 200 kcal',true)}
      ${tile('bonusDesafio','i-flame','Desafio 21 dias','Seca barriga',true)}
      ${tile('receitas','i-food','+100 Receitas','Já nas Receitas')}
    </div></div>`));
  $('#backHome').onclick=()=>setView('home');
  root.querySelectorAll('[data-goto]').forEach(el=>el.onclick=()=>setView(el.dataset.goto));
};
VIEWS.bonusMarmitas=(root)=>{
  const rows=D.marmitas.map(m=>`<div class="bcard"><span class="bk">≈${m.kcal} kcal</span><div class="bn">Marmita ${m.n}: ${esc(m.prot)}</div><div class="bd">${esc(m.carbo)} + ${esc(m.leg)}</div></div>`).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="bk"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Bônus</button>
    <div class="vtitle">30 Marmitas Fit</div><div class="vsub">Cozinhe uma vez, coma a semana. Congele em porções.</div>${rows}</div>`));
  $('#bk').onclick=()=>setView('bonus');
};
VIEWS.bonusLanches=(root)=>{
  const rows=D.lanches.map((l,i)=>`<div class="bcard"><span class="bk">${l.kcal} kcal</span><div class="bn">${i+1}. ${esc(l.nome)}</div></div>`).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="bk"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Bônus</button>
    <div class="vtitle">50 Lanches até 200 kcal</div><div class="vsub">Opções rápidas para não cair em besteira.</div>${rows}</div>`));
  $('#bk').onclick=()=>setView('bonus');
};
VIEWS.bonusDesafio=(root)=>{
  const st=store.get('desafio',{}); const done=Object.values(st).filter(Boolean).length;
  const rows=D.desafio.map(d=>`<div class="desafio-item ${st[d.dia]?'on':''}" data-d="${d.dia}"><div class="dn">${d.dia}</div>
    <div class="di"><b>${esc(d.missao)}</b><span>${esc(d.porque)}</span></div><div class="box">${st[d.dia]?ck():''}</div></div>`).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="bk"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Bônus</button>
    <div class="vtitle">Desafio Seca Barriga</div><div class="vsub">${done}/21 missões concluídas · uma por dia</div>${rows}</div>`));
  $('#bk').onclick=()=>setView('bonus');
  root.querySelectorAll('.desafio-item').forEach(el=>el.onclick=()=>{ const s=store.get('desafio',{}); const d=el.dataset.d; s[d]=!s[d]; store.set('desafio',s);
    el.classList.toggle('on',s[d]); el.querySelector('.box').innerHTML=s[d]?ck():''; if(s[d])vib(15); });
};

/* ----- CONQUISTAS ----- */
VIEWS.conquistas=(root)=>{
  checkAch(); const un=store.get('ach',{}); const nUn=Object.keys(un).length;
  const grid=ACH.map(a=>`<div class="ach ${un[a.id]?'on':''}"><div class="medal"><svg class="ic" style="width:26px;height:26px"><use href="#${a.icon}"/></svg></div><b>${a.t}</b><span>${a.d}</span></div>`).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="backHome"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Início</button>
    <div class="vtitle">Conquistas</div><div class="vsub">${nUn} de ${ACH.length} desbloqueadas · continue firme!</div>
    <div class="ach-grid">${grid}</div></div>`));
  $('#backHome').onclick=()=>setView('home');
};

/* ----- GUIAS ----- */
VIEWS.guias=(root)=>{
  const list=D.guias.map((g,i)=>`<button class="tile" data-g="${i}" style="margin-bottom:10px;flex-direction:row;align-items:center">
    <div class="ic-w"><svg class="ic"><use href="#i-guide"/></svg></div><h4 style="flex:1">${esc(g.titulo)}</h4><svg class="ic chev" style="color:var(--g300)"><use href="#i-chev"/></svg></button>`).join('');
  root.appendChild(ce(`<div class="view"><button class="backlink" id="backHome"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Início</button>
    <div class="vtitle">Guias</div><div class="vsub">O conteúdo de leitura do programa.</div>${list}</div>`));
  $('#backHome').onclick=()=>setView('home');
  root.querySelectorAll('[data-g]').forEach(el=>el.onclick=()=>{ const g=D.guias[+el.dataset.g]; const r=$('#viewRoot'); r.innerHTML='';
    r.appendChild(ce(`<div class="view"><button class="backlink" id="bkG"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Guias</button>
      <div class="vtitle">${esc(g.titulo)}</div><div class="article">${g.html}</div></div>`)); $('#bkG').onclick=()=>setView('guias'); window.scrollTo(0,0); });
};

/* ----- CONFIG ----- */
VIEWS.config=(root)=>{
  const dark=store.get('theme','light')==='dark'; const rem=store.get('reminders',false);
  root.appendChild(ce(`<div class="view"><button class="backlink" id="backHome"><svg class="ic" style="width:15px;height:15px"><use href="#i-chev"/></svg>Início</button>
    <div class="vtitle">Ajustes</div>
    <div class="card">
      <div class="cfg-row"><div class="ci"><svg class="ic"><use href="#i-moon"/></svg><div><b>Modo escuro</b><span>Tema escuro para os olhos</span></div></div><div class="switch ${dark?'on':''}" id="swDark"></div></div>
      <div class="cfg-row"><div class="ci"><svg class="ic"><use href="#i-bell"/></svg><div><b>Lembretes</b><span>Aviso para não esquecer o dia</span></div></div><div class="switch ${rem?'on':''}" id="swRem"></div></div>
    </div>
    <div class="section-h"><svg class="ic"><use href="#i-download"/></svg> Seus dados</div>
    <div class="card">
      <p style="font-size:.86rem;color:var(--muted);margin-bottom:4px">Seu progresso fica salvo só neste aparelho. Faça um backup para não perder ou levar para outro celular.</p>
      <button class="cfg-btn" id="btnExport"><svg class="ic" style="width:18px;height:18px"><use href="#i-download"/></svg> Exportar backup</button>
      <button class="cfg-btn" id="btnImport"><svg class="ic" style="width:18px;height:18px"><use href="#i-share"/></svg> Importar backup</button>
      <input type="file" id="importFile" accept="application/json" class="hide">
    </div>
    <div class="section-h">Sobre</div>
    <div class="card" style="font-size:.86rem;color:var(--muted)">
      <b style="font-family:Poppins;color:var(--ink)">Projeto Leve 30D</b> · versão do app 2.0<br>
      Feito com carinho pela Sartor Digital.
      <button class="cfg-btn" id="btnLock" style="margin-top:14px"><svg class="ic" style="width:18px;height:18px"><use href="#i-close"/></svg> Bloquear app (sair)</button>
    </div></div>`));
  $('#backHome').onclick=()=>setView('home');
  $('#swDark').onclick=()=>{ const nv=store.get('theme','light')==='dark'?'light':'dark'; store.set('theme',nv); applyTheme(); $('#swDark').classList.toggle('on',nv==='dark'); document.querySelector('meta[name=theme-color]').setAttribute('content',nv==='dark'?'#08140f':'#0f3d2e'); };
  $('#swRem').onclick=()=>toggleReminders();
  $('#btnExport').onclick=exportData;
  $('#btnImport').onclick=()=>$('#importFile').click();
  $('#importFile').onchange=importData;
  $('#btnLock').onclick=()=>{ if(confirm('Bloquear o app? Você precisará digitar o código novamente.')){ store.set('unlocked',0); location.reload(); } };
};
function exportData(){
  const o={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k.startsWith('l30:'))o[k]=localStorage.getItem(k); }
  const blob=new Blob([JSON.stringify(o)],{type:'application/json'}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='leve30d-backup.json'; a.click(); URL.revokeObjectURL(url); toast('Backup exportado!');
}
function importData(e){
  const f=e.target.files[0]; if(!f)return; const rd=new FileReader();
  rd.onload=()=>{ try{ const o=JSON.parse(rd.result); Object.keys(o).forEach(k=>{ if(k.startsWith('l30:'))localStorage.setItem(k,o[k]); }); applyTheme(); toast('Backup importado!'); setView('home'); }catch(err){ toast('Arquivo inválido','i-close'); } };
  rd.readAsText(f);
}
function toggleReminders(){
  const cur=store.get('reminders',false);
  if(cur){ store.set('reminders',false); $('#swRem').classList.remove('on'); return; }
  if(!('Notification' in window)){ toast('Seu navegador não suporta lembretes','i-close'); return; }
  Notification.requestPermission().then(p=>{ if(p==='granted'){ store.set('reminders',true); $('#swRem')&&$('#swRem').classList.add('on'); toast('Lembretes ativados!','i-bell'); }
    else toast('Permissão negada','i-close'); });
}
function maybeRemind(){
  if(!store.get('reminders',false)) return; if(!('Notification'in window)||Notification.permission!=='granted') return;
  const t=today(); if(store.get('remindedOn','')===t) return; const nd=nextDay(); if(!nd) return;
  if(new Date().getHours()>=12){ try{ new Notification('Projeto Leve 30D',{body:'Bora marcar seu Dia '+nd+' e sua água de hoje? 💪',icon:'icons/icon-192.png'}); store.set('remindedOn',t); }catch(e){} }
}

/* ---------- boot ---------- */
checkGate();
