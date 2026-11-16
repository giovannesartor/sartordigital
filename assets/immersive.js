/* Sartor Digital — native-scroll project tunnel. Original scene, local Three.js. */
import * as THREE from './vendor/three.js';

(() => {
  'use strict';
  const hero = document.querySelector('#home.immersive-hero');
  const host = document.querySelector('#immersive-canvas');
  if (!hero || !host) return;
  const html = document.documentElement;
  const pin = hero.querySelector('.immersive-pin');
  const intro = hero.querySelector('.immersive-intro');
  const featureCopy = hero.querySelector('.immersive-feature');
  const progressBar = hero.querySelector('.immersive-progress > span');
  const wordmark = hero.querySelector('.immersive-wordmark');
  const vignette = hero.querySelector('.immersive-vignette');
  const hint = hero.querySelector('.immersive-scroll-hint');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer:fine)');
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, value) => { const x = clamp((value - a) / (b - a)); return x * x * (3 - 2 * x); };
  let renderer, scene, camera, frame = 0, failed = false, visible = true, staticMode = false;
  let width = 1, height = 1, heroTop = 0, travel = 1, targetProgress = 0, currentProgress = 0;
  let cursorX = 0, cursorY = 0, cameraX = 0, cameraY = 0, lastTime = 0, activeFeature = -1;
  let texturesLoaded = 0, texturesFailed = 0, allTextures = 0;
  const cards = [], features = [], textures = new Map();
  const disposables = [];
  const path = [[0,7],[.10,3],[.18,-6],[.28,-6],[.38,-17],[.43,-22],[.53,-22],[.63,-33],[.68,-38],[.78,-38],[.88,-49],[1,-57]];

  function opacity(el, value, interactive = false) {
    if (!el) return;
    el.style.opacity = String(value);
    el.style.visibility = value < .005 ? 'hidden' : 'visible';
    if (interactive) {
      const hidden = value < .08;
      el.inert = hidden; el.style.pointerEvents = hidden ? 'none' : 'auto';
      el.setAttribute('aria-hidden', String(hidden));
      if (el === featureCopy) el.querySelectorAll('a').forEach(link => { link.tabIndex = hidden ? -1 : 0; });
    }
  }
  function fallback() {
    if (failed) return;
    failed = true;
    cancelAnimationFrame(frame); frame = 0;
    hero.classList.add('immersive-static', 'immersive-failed');
    host.classList.add('immersive-failed');
    host.dataset.ready = 'fallback';
    if (renderer) { renderer.domElement.style.display = 'none'; renderer.dispose(); }
    opacity(intro, 1, true); if (intro) { intro.style.removeProperty('transform'); intro.style.translate = 'none'; }
    opacity(vignette, 1);
    opacity(featureCopy, 0, true); opacity(hint, 0); opacity(wordmark, 1);
    if (progressBar) progressBar.style.transform = 'scaleX(0)';
  }
  function requestFrame() {
    if (!failed && !frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function readScroll() {
    targetProgress = staticMode ? 0 : clamp((scrollY - heroTop) / travel);
    requestFrame();
  }
  function measure() {
    if (failed || !renderer) return;
    const box = host.getBoundingClientRect();
    width = Math.max(1, box.width || innerWidth); height = Math.max(1, box.height || innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.fov = width < height ? 65 : 55; camera.updateProjectionMatrix();
    heroTop = hero.getBoundingClientRect().top + scrollY;
    travel = Math.max(1, hero.offsetHeight - (pin?.offsetHeight || innerHeight));
    readScroll();
  }
  function syncTheme() {
    if (failed || !scene) return;
    const style = getComputedStyle(hero);
    const bg = style.getPropertyValue('--bg').trim() || '#101613';
    const accent = style.getPropertyValue('--green').trim() || '#b9f77a';
    scene.background = new THREE.Color(bg);
    scene.fog = new THREE.Fog(bg, 16, 48);
    cards.concat(features).forEach(item => item.border.material.color.set(accent));
    requestFrame();
  }
  function syncMotion() {
    if (failed) return;
    const next = reduce.matches || html.classList.contains('motion-paused');
    if (next === staticMode) return;
    const withinHero = scrollY >= heroTop && scrollY <= heroTop + travel;
    staticMode = next;
    hero.classList.toggle('immersive-static', next);
    cursorX = cursorY = cameraX = cameraY = 0;
    currentProgress = targetProgress = 0;
    if (next && withinHero && scrollY > heroTop + 1) scrollTo({ top: heroTop, behavior: 'instant' });
    measure();
  }
  function cameraDepth(progress) {
    for (let i = 1; i < path.length; i++) {
      if (progress <= path[i][0]) {
        const [p0,z0] = path[i-1], [p1,z1] = path[i];
        return mix(z0,z1,smooth(p0,p1,progress));
      }
    }
    return path.at(-1)[1];
  }
  function updateCopy(progress) {
    const introAlpha = staticMode ? 1 : 1 - smooth(.025,.105,progress);
    opacity(intro,introAlpha,true);
    hero.style.setProperty('--intro-alpha',introAlpha.toFixed(3));
    const openingAlpha = staticMode ? 1 : 1-smooth(.008,.09,progress);
    hero.style.setProperty('--opening-alpha',openingAlpha.toFixed(3));
    hero.style.setProperty('--scene-alpha',(1-openingAlpha).toFixed(3));
    hero.style.setProperty('--signal-x',`${(cameraX*12).toFixed(2)}px`);
    hero.style.setProperty('--signal-y',`${(-cameraY*12).toFixed(2)}px`);
    hero.style.setProperty('--signal-tilt',`${(cameraX*.35).toFixed(3)}deg`);
    hero.style.setProperty('--signal-play',openingAlpha>.01&&!staticMode&&!document.hidden?'running':'paused');
    hero.style.setProperty('--intro-blur',`${(introAlpha*5).toFixed(2)}px`);
    if (intro) intro.style.translate = `0 ${staticMode ? 0 : -smooth(0,.12,progress)*55}px`;
    opacity(vignette, introAlpha);
    opacity(hint, staticMode ? 0 : 1 - smooth(.02,.1,progress));
    opacity(wordmark, staticMode ? .92 : .92 * (1-smooth(.02,.15,progress)));
    let index = -1, alpha = 0;
    features.forEach((item,i) => {
      const a = smooth(item.start+.045,item.start+.09,progress) * (1-smooth(item.start+.19,item.start+.235,progress));
      if (!staticMode && a > alpha) { alpha = a; index = i; }
    });
    if (index >= 0 && index !== activeFeature && featureCopy) {
      const item = features[index].project;
      const put = (selector, text) => { const el = featureCopy.querySelector(selector); if (el) el.textContent = text; };
      put('.immersive-feature-kicker',item.tag);
      put('.immersive-feature-title',item.name);
      put('.immersive-feature-description',item.description);
      const link = featureCopy.querySelector('.immersive-feature-link');
      if (link) link.href = item.url;
    }
    activeFeature = index;
    opacity(featureCopy,alpha,true);
    if (featureCopy) featureCopy.style.transform = `translate3d(0,${(1-alpha)*18}px,0)`;
    if (progressBar) { progressBar.style.transformOrigin = 'left center'; progressBar.style.transform = `scaleX(${progress})`; }
    host.dataset.feature = index >= 0 && alpha > .05 ? features[index].project.name : '';
  }
  function placeCard(item, x,y,z,w,rx,ry,rz,alpha) {
    item.group.position.set(x,y,z);
    item.group.rotation.set(rx,ry,rz);
    const ratio = item.asset.ratio || 16/9;
    item.group.scale.set(w,w/ratio,1);
    item.image.material.opacity = alpha;
    item.border.material.opacity = alpha*.48;
    item.group.visible = alpha > .005 && item.asset.ready;
  }
  function draw(time) {
    frame = 0;
    if (failed || !visible || document.hidden) return;
    try {
      const dt = lastTime ? Math.min(50,time-lastTime) : 16; lastTime = time;
      const lerp = 1-Math.exp(-dt/95);
      currentProgress = staticMode ? 0 : mix(currentProgress,targetProgress,lerp);
      const featureFocus = features.reduce((value,item) => Math.max(value,smooth(item.start,item.start+.075,currentProgress)*(1-smooth(item.start+.18,item.start+.25,currentProgress))),0);
      const pointerWeight = staticMode ? 0 : 1-featureFocus*.78;
      cameraX = mix(cameraX,cursorX*pointerWeight,lerp);
      cameraY = mix(cameraY,cursorY*pointerWeight,lerp);
      const z = staticMode ? 7 : cameraDepth(currentProgress);
      camera.position.set(cameraX,cameraY,z);
      camera.lookAt(cameraX*.2,cameraY*.2,z-18);
      const portrait = width < height;
      cards.forEach(item => {
        const dist = z-item.z;
        const fade = smooth(.65,2.4,dist)*(1-smooth(27,46,dist));
        const side = portrait ? .62 : 1;
        const w = item.w*(portrait ? .82 : 1);
        placeCard(item,item.x*side,item.y*(portrait ? .9 : 1),item.z,w,item.rx,item.ry,item.rz,fade*.92*(1-featureFocus*.5));
      });
      features.forEach(item => {
        const center = staticMode ? 0 : smooth(item.start,item.start+.085,currentProgress);
        const dist = z-item.z;
        const targetDistance = Math.max(.1,dist);
        // Size at the six-unit hold distance remains fixed as the camera passes through.
        const viewH = 2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*6;
        const ratio = item.asset.ratio || 16/9;
        const targetW = Math.min(viewH*camera.aspect*(portrait ? .87 : .70),viewH*.50*ratio);
        const w = mix(item.w,targetW,center);
        const x = mix(item.x*(portrait ? .62 : 1),0,center);
        const y = mix(item.y,viewH*(portrait ? .105 : .10),center);
        const alpha = smooth(.45,1.8,targetDistance)*(1-smooth(30,47,dist));
        placeCard(item,x,y,item.z,w,mix(.06,0,center),mix(item.x>0?-.3:.3,0,center),mix(item.x>0?-.06:.06,0,center),alpha);
      });
      updateCopy(currentProgress);
      renderer.render(scene,camera);
      host.dataset.ready = texturesLoaded ? 'true' : 'loading';
      host.dataset.progress = currentProgress.toFixed(4);
      host.dataset.cameraX = cameraX.toFixed(3);
      host.dataset.cameraZ = z.toFixed(3);
      host.dataset.loaded = String(texturesLoaded);
      const unsettled = Math.abs(currentProgress-targetProgress)>.00008 || Math.abs(cameraX-cursorX*pointerWeight)>.001 || Math.abs(cameraY-cursorY*pointerWeight)>.001;
      if (unsettled && !staticMode) requestFrame();
    } catch (error) { console.warn('Sartor scene unavailable; using static presentation.',error); fallback(); }
  }

  try {
    const data = JSON.parse(document.querySelector('#explorer-data')?.textContent || '{}');
    const projects = data.projects;
    if (!Array.isArray(projects) || !projects.length) { fallback(); return; }
    renderer = new THREE.WebGLRenderer({alpha:false,antialias:true,powerPreference:'low-power'});
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearAlpha(1);
    renderer.domElement.setAttribute('aria-hidden','true');
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();fallback()});
    host.append(renderer.domElement);
    scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(55,1,.1,80);
    const geometry = new THREE.PlaneGeometry(1,1); disposables.push(geometry);
    const loader = new THREE.TextureLoader();
    function asset(project) {
      const url = new URL(project.image,document.baseURI).href;
      if (textures.has(url)) return textures.get(url);
      const entry = {texture:null,ready:false,ratio:16/9}; textures.set(url,entry); allTextures++;
      entry.texture = loader.load(url,texture=>{
        entry.ready = true; entry.ratio = texture.image.width/texture.image.height;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(4,renderer.capabilities.getMaxAnisotropy());
        texturesLoaded++; requestFrame();
      },undefined,()=>{texturesFailed++; if(texturesFailed===allTextures&&!texturesLoaded)fallback();else requestFrame()});
      entry.texture.colorSpace = THREE.SRGBColorSpace;
      disposables.push(entry.texture); return entry;
    }
    function makeCard(project,props) {
      const imageAsset = asset(project);
      const group = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({map:imageAsset.texture,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});
      const borderMat = new THREE.MeshBasicMaterial({color:'#b9f77a',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false});
      const image = new THREE.Mesh(geometry,mat), border = new THREE.Mesh(geometry,borderMat);
      border.position.z = -.012; border.scale.set(1.014,1.024,1);
      group.add(border,image); scene.add(group); disposables.push(mat,borderMat);
      return {group,image,border,asset:imageAsset,project,...props};
    }
    let seed = 9173;
    const random = () => { seed = (seed*16807)%2147483647; return (seed-1)/2147483646; };
    for(let i=0;i<42;i++) {
      const angle = i*2.3999632297 + (random()-.5)*.35;
      const radius = 3.5+random()*1.5;
      const x = Math.cos(angle)*radius;
      const y = Math.sin(angle)*radius*.68;
      cards.push(makeCard(projects[i%projects.length],{x,y,z:2-i*1.48,w:2.25+random()*1.15,rx:-y*.025,ry:x>0?-.32:.32,rz:(random()-.5)*.13}));
    }
    const names=['AgentCore','Trilha Livre','UseAvalIA'];
    names.forEach((name,i)=>{
      const project=projects.find(p=>p.name.toLowerCase()===name.toLowerCase())||projects[i%projects.length];
      const item=makeCard(project,{x:i%2?-4.2:4.2,y:.2,z:-12-i*16,w:2.45,start:.10+i*.25});
      item.image.renderOrder=20; item.border.renderOrder=19; features.push(item);
    });
    staticMode = reduce.matches || html.classList.contains('motion-paused');
    hero.classList.toggle('immersive-static',staticMode);
    hero.classList.add('immersive-enabled');
    syncTheme(); measure();
    const resize = new ResizeObserver(measure); resize.observe(host); resize.observe(hero);
    const observer = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){lastTime=0;readScroll()}else{hero.style.setProperty('--signal-play','paused');cancelAnimationFrame(frame);frame=0}},{rootMargin:'100px'}); observer.observe(hero);
    new MutationObserver(records=>{if(records.some(r=>r.attributeName==='data-theme'))syncTheme();syncMotion()}).observe(html,{attributes:true,attributeFilter:['class','data-theme']});
    reduce.addEventListener('change',syncMotion);
    addEventListener('scroll',readScroll,{passive:true}); addEventListener('resize',measure,{passive:true});
    addEventListener('pointermove',event=>{
      if(staticMode||!fine.matches||event.pointerType==='touch'||!visible)return;
      const r=pin?.getBoundingClientRect()||host.getBoundingClientRect();
      if(event.clientY<r.top||event.clientY>r.bottom)return;
      cursorX=(event.clientX/innerWidth-.5)*1.4;
      cursorY=-(event.clientY/innerHeight-.5)*.8;
      requestFrame();
    },{passive:true});
    document.documentElement.addEventListener('pointerleave',()=>{cursorX=cursorY=0;requestFrame()});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)hero.style.setProperty('--signal-play','paused');if(document.hidden){cancelAnimationFrame(frame);frame=0}else{lastTime=0;readScroll()}});
    addEventListener('pageshow',()=>{lastTime=0;measure()});
    document.fonts?.ready.then(measure);
  } catch(error) { console.warn('Sartor scene unavailable; using static presentation.',error); fallback(); }
})();
