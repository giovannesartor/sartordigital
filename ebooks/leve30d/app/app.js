/* ============================================================
   PROJETO LEVE 30D — App PWA
   CONFIG: troque o código de acesso e o link do PDF abaixo.
   ============================================================ */
const CFG = {
  code: 'LEVE30D',                                    // <-- código de acesso (o que você entrega na Cakto)
  pdf : 'https://drive.google.com/file/d/1Yc6UgDF_eA_j5_gpVxe9g1WH0Up3D1vY/view?usp=sharing' // <-- PDF no Drive
};
const D = window.APP_DATA || {recipes:[],cardapio:[],treinos:[],compras:[],guias:[],cats:[]};

/* ---------- storage ---------- */
const store = {
  get:(k,f)=>{ try{const v=localStorage.getItem('l30:'+k); return v==null?f:JSON.parse(v);}catch(e){return f;} },
  set:(k,v)=>{ try{localStorage.setItem('l30:'+k,JSON.stringify(v));}catch(e){} }
};
const today = ()=> new Date().toISOString().slice(0,10);
const esc = (s)=> (s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $ = (s,r=document)=> r.querySelector(s);
const ce = (h)=>{ const t=document.createElement('template'); t.innerHTML=h.trim(); return t.content.firstElementChild; };

/* ---------- service worker ---------- */
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }

/* ---------- install prompt ---------- */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); deferredPrompt=e; });
function isStandalone(){ return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone; }
function isiOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent); }
async function doInstall(){
  if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; return; }
  openInstallModal();
}
function openInstallModal(){
  const ios = isiOS();
  const box = $('#imodalBox');
  box.innerHTML = `
    <h3>Instalar o app</h3>
    <p>Deixe o Projeto Leve 30D como um app na tela do seu celular — abre em tela cheia e funciona offline.</p>
    <div class="os-tabs"><div class="os-tab ${ios?'active':''}" data-os="ios">iPhone</div><div class="os-tab ${ios?'':'active'}" data-os="android">Android</div></div>
    <div id="iosSteps" class="${ios?'':'hide'}">
      <ol><li>Toque no botão <b>Compartilhar</b> (o quadradinho com a seta para cima), na barra do Safari.</li>
      <li>Deslize e toque em <b>“Adicionar à Tela de Início”</b>.</li>
      <li>Confirme em <b>Adicionar</b>. Pronto! O ícone aparece na sua tela.</li></ol>
    </div>
    <div id="andSteps" class="${ios?'hide':''}">
      <ol><li>Toque no menu <b>⋮</b> (três pontinhos) do navegador.</li>
      <li>Toque em <b>“Instalar app”</b> ou <b>“Adicionar à tela inicial”</b>.</li>
      <li>Confirme. O app é instalado como um aplicativo normal.</li></ol>
    </div>
    <button class="close" id="imClose">Entendi</button>`;
  box.querySelectorAll('.os-tab').forEach(t=>t.onclick=()=>{
    box.querySelectorAll('.os-tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
    $('#iosSteps').classList.toggle('hide', t.dataset.os!=='ios');
    $('#andSteps').classList.toggle('hide', t.dataset.os!=='android');
  });
  $('#imClose').onclick=()=>$('#imodal').classList.remove('open');
  $('#imodal').classList.add('open');
}
$('#imodal').addEventListener('click',(e)=>{ if(e.target.id==='imodal') e.target.classList.remove('open'); });

/* ---------- gate ---------- */
function checkGate(){
  if(store.get('unlocked')===1){ showApp(); }
}
function tryUnlock(){
  const val=($('#code').value||'').trim().toUpperCase();
  if(val===CFG.code.toUpperCase()){ store.set('unlocked',1); showApp(); }
  else{ $('#codeErr').textContent='Código incorreto. Confira na sua confirmação de compra.';
        const i=$('#code'); i.style.borderColor='#ffb4a8'; i.value=''; i.focus(); }
}
$('#unlockBtn').onclick=tryUnlock;
$('#code').addEventListener('keydown',(e)=>{ if(e.key==='Enter') tryUnlock(); });
function showApp(){
  $('#gate').classList.add('hide');
  $('#app').style.display='block';
  $('#tabbar').classList.remove('hide');
  $('#topInstall').onclick=doInstall;
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>setView(t.dataset.view));
  setView('home');
}

/* ---------- router ---------- */
let currentView='home';
function setView(name){
  currentView=name;
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===name));
  const root=$('#viewRoot'); root.innerHTML='';
  (VIEWS[name]||VIEWS.home)(root);
  window.scrollTo(0,0);
}

/* ---------- sheet ---------- */
function openSheet(html){
  $('#sheetInner').innerHTML='<div class="sheet-grab"></div><button class="sheet-close" id="shClose"><svg class="ic"><use href="#i-close"/></svg></button>'+html;
  $('#sheet').classList.add('open');
  $('#shClose').onclick=closeSheet;
}
function closeSheet(){ $('#sheet').classList.remove('open'); }
$('#sheet').addEventListener('click',(e)=>{ if(e.target.id==='sheet') closeSheet(); });

/* ============================================================
   VIEWS
   ============================================================ */
const VIEWS={};

/* ----- HOME ----- */
VIEWS.home=(root)=>{
  const days=store.get('days',{}); const done=Object.values(days).filter(Boolean).length;
  const pct=Math.round(done/30*100);
  const ringC=2*Math.PI*34;
  root.appendChild(ce(`<div class="view">
    <div class="hero">
      <svg class="ring" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="8"/>
        <circle cx="40" cy="40" r="34" fill="none" stroke="#7fc8a6" stroke-width="8" stroke-linecap="round"
          stroke-dasharray="${ringC}" stroke-dashoffset="${ringC*(1-done/30)}" transform="rotate(-90 40 40)"/>
        <text x="40" y="38" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="20" fill="#fff">${done}</text>
        <text x="40" y="52" text-anchor="middle" font-family="Inter" font-size="9" fill="#cfe7da">de 30 dias</text>
      </svg>
      <div><div class="h-t">Bem-vindo(a)! 🌿</div>
        <div class="h-s">${done===0?'Comece marcando o Dia 1 no cardápio.':'Você já concluiu '+done+' dia(s). Siga firme!'}</div></div>
    </div>
    <div class="actions">
      <a class="abtn pdf" href="${CFG.pdf}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-download"/></svg> Baixar PDF</a>
      <button class="abtn install" id="homeInstall"><svg class="ic"><use href="#i-home"/></svg> Instalar app</button>
    </div>
    <div class="section-h">Seu programa</div>
    <div class="grid2">
      ${tile('cardapio','i-cal','Cardápio 30 dias','Refeições dia a dia')}
      ${tile('receitas','i-food','Receitas','+'+D.recipes.length+' receitas fit')}
      ${tile('treinos','i-dumbbell','Treinos em casa','3 níveis, com timer')}
      ${tile('progresso','i-chart','Progresso','Peso, água e hábitos')}
      ${tile('compras','i-cart','Lista de compras','Marque o que já tem')}
      ${tile('guias','i-guide','Guias','Mentalidade, nutrição e +')}
    </div>
    <div class="section-h">Precisa do arquivo?</div>
    <div class="card" style="font-size:.9rem;color:var(--muted)">
      Você pode <a href="${CFG.pdf}" target="_blank" rel="noopener" style="color:var(--g700);font-weight:600">baixar o PDF completo</a> para ler ou imprimir,
      ou usar tudo por aqui no app — o que preferir. Para ter o app sempre à mão, toque em <b>Instalar app</b>.
    </div>
  </div>`));
  $('#homeInstall').onclick=doInstall;
  root.querySelectorAll('[data-goto]').forEach(el=>el.onclick=()=>setView(el.dataset.goto));
};
function tile(view,icon,title,sub){
  return `<button class="tile" data-goto="${view}"><div class="ic-w"><svg class="ic"><use href="#${icon}"/></svg></div>
    <h4>${title}</h4><p>${sub}</p></button>`;
}

/* ----- CARDÁPIO ----- */
VIEWS.cardapio=(root)=>{
  const days=store.get('days',{});
  const done=Object.values(days).filter(Boolean).length;
  const items=D.cardapio.map(d=>{
    const alm=d.ref.find(r=>r[0]==='Almoço');
    return `<div class="day-item ${days[d.dia]?'done':''}" data-day="${d.dia}">
      <div class="dn">${d.dia}</div>
      <div class="di"><b>Dia ${d.dia}</b><span>${esc(alm?alm[1]:'')}</span></div>
      <span style="font-family:Poppins;font-size:.72rem;color:var(--muted)">≈${d.kcal}</span>
      <svg class="ic chev"><use href="#i-chev"/></svg></div>`;
  }).join('');
  root.appendChild(ce(`<div class="view">
    <div class="vtitle">Cardápio de 30 dias</div>
    <div class="vsub">${done}/30 dias concluídos · toque em um dia para ver as refeições</div>
    ${items}</div>`));
  root.querySelectorAll('.day-item').forEach(el=>el.onclick=()=>openDay(+el.dataset.day));
};
function openDay(n){
  const d=D.cardapio.find(x=>x.dia===n); if(!d) return;
  const days=store.get('days',{}); const isDone=!!days[n];
  const meals=d.ref.map(r=>`<div class="meal"><div class="mw">${esc(r[0])}</div><div class="mt">${esc(r[1])}</div><div class="mk">${r[2]} kcal</div></div>`).join('');
  openSheet(`<h3>Dia ${n}</h3><div class="rm"><span><b>Total:</b> ≈${d.kcal} kcal</span></div>
    <div class="card" style="padding:4px 14px">${meals}</div>
    <button class="abtn ${isDone?'install':'pdf'}" id="markDay" style="width:100%;margin-top:16px">
      <svg class="ic"><use href="#i-check"/></svg> ${isDone?'Concluído — desmarcar':'Marcar dia como concluído'}</button>`);
  $('#markDay').onclick=()=>{ const dd=store.get('days',{}); dd[n]=!dd[n]; store.set('days',dd); closeSheet(); if(currentView==='cardapio')setView('cardapio'); };
}

/* ----- RECEITAS ----- */
let recFilter={cat:'Todos',q:''};
VIEWS.receitas=(root)=>{
  root.appendChild(ce(`<div class="view">
    <div class="vtitle">Receitas</div>
    <div class="searchbar"><svg class="ic"><use href="#i-food"/></svg>
      <input id="recQ" type="search" placeholder="Buscar receita..." value="${esc(recFilter.q)}"></div>
    <div class="chips" id="recChips"></div>
    <div id="recList"></div></div>`));
  const chips=['Todos',...D.cats];
  $('#recChips').innerHTML=chips.map(c=>`<button class="chip ${recFilter.cat===c?'active':''}" data-c="${c}">${c}</button>`).join('');
  $('#recChips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{ recFilter.cat=b.dataset.c; renderRecList();
    $('#recChips').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b)); });
  $('#recQ').oninput=(e)=>{ recFilter.q=e.target.value; renderRecList(); };
  renderRecList();
};
function renderRecList(){
  const q=recFilter.q.toLowerCase();
  const list=D.recipes.filter(r=>(recFilter.cat==='Todos'||r.cat===recFilter.cat) && (!q||r.nome.toLowerCase().includes(q)));
  const el=$('#recList'); if(!el) return;
  if(!list.length){ el.innerHTML='<div class="empty">Nenhuma receita encontrada.</div>'; return; }
  el.innerHTML=list.map(r=>`<div class="rec-item" data-id="${r.id}">
    <span class="cat-tag">${esc(r.cat)}</span>
    <h4>${esc(r.nome)}</h4>
    <div class="rm"><span><b>${esc(r.tempo)}</b></span><span><b>${r.kcal}</b> kcal</span></div></div>`).join('');
  el.querySelectorAll('.rec-item').forEach(x=>x.onclick=()=>openRecipe(+x.dataset.id));
}
function openRecipe(id){
  const r=D.recipes.find(x=>x.id===id); if(!r) return;
  const ings=r.ings.map(i=>`<li>${esc(i)}</li>`).join('');
  const modo=r.modo.map(m=>`<li>${esc(m)}</li>`).join('');
  openSheet(`<span class="cat-tag" style="display:inline-block;margin-bottom:8px">${esc(r.cat)}</span>
    <h3>${esc(r.nome)}</h3>
    <div class="rm"><span><b>Tempo:</b> ${esc(r.tempo)}</span><span><b>${r.kcal}</b> kcal</span></div>
    <div class="sub-h">Ingredientes</div><ul>${ings}</ul>
    <div class="sub-h">Modo de preparo</div><ol>${modo}</ol>`);
}

/* ----- TREINOS ----- */
VIEWS.treinos=(root)=>{
  const cards=D.treinos.map((t,i)=>`<button class="tile" data-t="${i}" style="margin-bottom:12px">
    <div class="ic-w"><svg class="ic"><use href="#i-dumbbell"/></svg></div>
    <h4>Treino ${esc(t.nivel)}</h4><p>${esc(t.info)}</p></button>`).join('');
  root.appendChild(ce(`<div class="view">
    <div class="vtitle">Treinos em casa</div>
    <div class="vsub">Sem equipamento. Escolha seu nível e treine com o timer.</div>
    ${cards}
    <div class="card" style="font-size:.88rem;color:var(--muted);margin-top:6px">
      <b style="font-family:Poppins;color:var(--g800)">Como usar o timer:</b> abra um treino e toque nos botões de descanso
      (30/45/60s) entre as séries. O celular vibra ao terminar.</div></div>`));
  root.querySelectorAll('[data-t]').forEach(el=>el.onclick=()=>openWorkout(+el.dataset.t));
};
function openWorkout(i){
  const t=D.treinos[i]; if(!t) return;
  const aq=t.aquecimento.map(x=>`<li>${esc(x)}</li>`).join('');
  const ex=t.ex.map(e=>`<div class="ex-row"><div class="exn"><b>${esc(e[0])}</b><span>${e[1]} séries</span></div>
    <div class="exs">${esc(e[2])} reps<br>${esc(e[3])} desc.</div></div>`).join('');
  const ca=t.calma.map(x=>`<li>${esc(x)}</li>`).join('');
  openSheet(`<h3>Treino ${esc(t.nivel)}</h3><div class="rm"><span>${esc(t.info)}</span></div>
    <div class="timer card">
      <div class="tt" id="tDisp">00:30</div><div class="ts" id="tLbl">Descanso — escolha o tempo</div>
      <div class="timer-ctrls">
        <button class="rs" data-sec="30">30s</button><button class="rs" data-sec="45">45s</button>
        <button class="rs" data-sec="60">60s</button><button class="go" id="tToggle">Iniciar</button></div>
    </div>
    <div class="sub-h">Aquecimento (5 min)</div><ul>${aq}</ul>
    <div class="sub-h">Circuito principal</div><div class="card" style="padding:2px 14px">${ex}</div>
    <div class="sub-h">Volta à calma</div><ul>${ca}</ul>`);
  initTimer();
}
let timerState={id:null,left:30,total:30,running:false};
function initTimer(){
  timerState={id:null,left:30,total:30,running:false};
  const disp=()=>{ const m=String(Math.floor(timerState.left/60)).padStart(2,'0'),s=String(timerState.left%60).padStart(2,'0'); const d=$('#tDisp'); if(d)d.textContent=m+':'+s; };
  document.querySelectorAll('.timer-ctrls .rs').forEach(b=>b.onclick=()=>{ stopTimer(); timerState.left=+b.dataset.sec; timerState.total=+b.dataset.sec; disp(); $('#tLbl').textContent='Descanso de '+b.dataset.sec+'s — toque em Iniciar'; });
  $('#tToggle').onclick=()=>{
    if(timerState.running){ stopTimer(); $('#tToggle').textContent='Iniciar'; }
    else{ timerState.running=true; $('#tToggle').textContent='Pausar'; $('#tLbl').textContent='Contando...';
      timerState.id=setInterval(()=>{ timerState.left--; disp();
        if(timerState.left<=0){ stopTimer(); $('#tToggle').textContent='Iniciar'; $('#tLbl').textContent='Descanso concluído! 💪';
          if(navigator.vibrate)navigator.vibrate([200,80,200]); timerState.left=timerState.total; disp(); } },1000); }
  };
  disp();
}
function stopTimer(){ if(timerState.id){clearInterval(timerState.id);timerState.id=null;} timerState.running=false; }

/* ----- PROGRESSO ----- */
VIEWS.progresso=(root)=>{
  root.appendChild(ce(`<div class="view">
    <div class="vtitle">Seu progresso</div>
    <div class="vsub">Tudo salvo no seu aparelho, funciona offline.</div>
    <div class="section-h">Água de hoje</div><div class="card" id="waterCard"></div>
    <div class="section-h">Hábitos de hoje</div><div class="card" id="habitCard"></div>
    <div class="section-h">Peso</div><div class="card" id="weightCard"></div>
    <div class="section-h">Medidas (cm)</div><div class="card" id="medCard"></div>
  </div>`));
  renderWater(); renderHabits(); renderWeight(); renderMed();
};
function renderWater(){
  const key='water:'+today(); const goal=10; let n=store.get(key,0);
  const cups=Array.from({length:goal},(_,i)=>`<div class="wcup ${i<n?'full':''}"></div>`).join('');
  $('#waterCard').innerHTML=`<div class="counter">
      <button class="cbtn" id="wMinus">−</button>
      <div class="cval"><b>${n}</b><span>de ${goal} copos (250ml)</span></div>
      <button class="cbtn" id="wPlus">+</button></div>
    <div class="watergrid">${cups}</div>`;
  $('#wPlus').onclick=()=>{ store.set(key,Math.min(goal+4,n+1)); renderWater(); if(navigator.vibrate)navigator.vibrate(20); };
  $('#wMinus').onclick=()=>{ store.set(key,Math.max(0,n-1)); renderWater(); };
}
const HABITS=['Comi proteína nas refeições','Enchi metade do prato de vegetais','Me movimentei / treinei','Dormi 7h+','Sem furos hoje'];
function renderHabits(){
  const key='hab:'+today(); const st=store.get(key,{});
  $('#habitCard').innerHTML=HABITS.map((h,i)=>`<div class="hab ${st[i]?'on':''}" data-i="${i}">
    <div class="box">${st[i]?'<svg class="ic" style="width:16px;height:16px"><use href="#i-check"/></svg>':''}</div>
    <span>${h}</span></div>`).join('');
  $('#habitCard').querySelectorAll('.hab').forEach(el=>el.onclick=()=>{ const s=store.get(key,{}); const i=el.dataset.i; s[i]=!s[i]; store.set(key,s); renderHabits(); });
}
function renderWeight(){
  const arr=store.get('weights',[]);
  $('#weightCard').innerHTML=`<div class="winput"><input id="wIn" type="number" inputmode="decimal" placeholder="Peso de hoje (kg)"><button id="wAdd">Salvar</button></div>
    ${arr.length>1?weightChart(arr):''}
    <div class="wlog">${arr.slice().reverse().slice(0,8).map(e=>`<div class="wlog-row"><span>${fmtDate(e.d)}</span><b>${e.v} kg</b></div>`).join('')||'<div class="empty" style="padding:16px">Registre seu peso para ver a evolução.</div>'}</div>`;
  $('#wAdd').onclick=()=>{ const v=parseFloat(($('#wIn').value||'').replace(',','.')); if(!v||v<20||v>400)return; const a=store.get('weights',[]);
    const t=today(); const ex=a.find(x=>x.d===t); if(ex)ex.v=v; else a.push({d:t,v}); store.set('weights',a); renderWeight(); };
}
function weightChart(arr){
  const data=arr.slice(-12); const vs=data.map(x=>x.v); const mn=Math.min(...vs),mx=Math.max(...vs); const rng=(mx-mn)||1;
  const W=320,H=140,pad=10; const step=(W-pad*2)/Math.max(1,data.length-1);
  const pts=data.map((x,i)=>[pad+i*step, H-pad-((x.v-mn)/rng)*(H-pad*2)]);
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const dots=pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="#1f6b4f"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <path d="${line}" fill="none" stroke="#2e8b62" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}
    <text x="${pad}" y="14" font-family="Inter" font-size="10" fill="#9aa8a1">${mx} kg</text>
    <text x="${pad}" y="${H-2}" font-family="Inter" font-size="10" fill="#9aa8a1">${mn} kg</text></svg>`;
}
const MEDS=[['cintura','Cintura'],['abdomen','Abdômen'],['quadril','Quadril'],['bracoD','Braço'],['coxaD','Coxa']];
function renderMed(){
  const m=store.get('medidas',{});
  $('#medCard').innerHTML=MEDS.map(([k,l])=>`<div class="winput" style="margin-top:8px">
    <input data-k="${k}" type="number" inputmode="decimal" placeholder="${l}${m[k]?' — atual: '+m[k]+' cm':''}"></div>`).join('')
    +`<button id="medSave" class="abtn pdf" style="width:100%;margin-top:12px"><svg class="ic"><use href="#i-check"/></svg> Salvar medidas</button>`;
  $('#medSave').onclick=()=>{ const m2=store.get('medidas',{}); $('#medCard').querySelectorAll('input').forEach(inp=>{ const v=parseFloat((inp.value||'').replace(',','.')); if(v)m2[inp.dataset.k]=v; }); store.set('medidas',m2); renderMed(); if(navigator.vibrate)navigator.vibrate(20); };
}
function fmtDate(d){ const [y,mo,da]=d.split('-'); return da+'/'+mo; }

/* ----- COMPRAS ----- */
VIEWS.compras=(root)=>{
  const st=store.get('shop',{});
  const cats=D.compras.map((c,ci)=>{
    const items=c[1].map((it,ii)=>{ const k=ci+':'+ii; return `<div class="shop-item ${st[k]?'on':''}" data-k="${k}">
      <div class="box">${st[k]?'<svg class="ic" style="width:15px;height:15px"><use href="#i-check"/></svg>':''}</div><span>${esc(it)}</span></div>`;}).join('');
    return `<div class="shopcat">${esc(c[0])}</div>${items}`;
  }).join('');
  root.appendChild(ce(`<div class="view">
    <button class="chip" id="backHome" style="margin-bottom:12px">‹ Início</button>
    <div class="vtitle">Lista de compras</div>
    <div class="vsub">Marque o que você já tem em casa.</div>
    ${cats}
    <button class="abtn install" id="clearShop" style="width:100%;margin-top:18px">Limpar marcações</button>
  </div>`));
  $('#backHome').onclick=()=>setView('home');
  $('#clearShop').onclick=()=>{ store.set('shop',{}); setView('compras'); };
  root.querySelectorAll('.shop-item').forEach(el=>el.onclick=()=>{ const s=store.get('shop',{}); const k=el.dataset.k; s[k]=!s[k]; store.set('shop',s);
    el.classList.toggle('on',s[k]); el.querySelector('.box').innerHTML=s[k]?'<svg class="ic" style="width:15px;height:15px"><use href="#i-check"/></svg>':''; });
};

/* ----- GUIAS ----- */
VIEWS.guias=(root)=>{
  const list=D.guias.map((g,i)=>`<button class="tile" data-g="${i}" style="margin-bottom:10px;flex-direction:row;align-items:center">
    <div class="ic-w"><svg class="ic"><use href="#i-guide"/></svg></div>
    <h4 style="flex:1">${esc(g.titulo)}</h4><svg class="ic chev"><use href="#i-chev"/></svg></button>`).join('');
  root.appendChild(ce(`<div class="view">
    <button class="chip" id="backHome" style="margin-bottom:12px">‹ Início</button>
    <div class="vtitle">Guias</div><div class="vsub">O conteúdo de leitura do programa.</div>${list}</div>`));
  $('#backHome').onclick=()=>setView('home');
  root.querySelectorAll('[data-g]').forEach(el=>el.onclick=()=>{ const g=D.guias[+el.dataset.g];
    const r=$('#viewRoot'); r.innerHTML=''; r.appendChild(ce(`<div class="view">
      <button class="chip" id="bkG" style="margin-bottom:12px">‹ Guias</button>
      <div class="vtitle">${esc(g.titulo)}</div><div class="article">${g.html}</div></div>`));
    $('#bkG').onclick=()=>setView('guias'); window.scrollTo(0,0); });
};

/* ---------- boot ---------- */
checkGate();
