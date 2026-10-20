(function(){
  document.body.classList.add('design-v2');
  const script=document.currentScript;
  const markUrl=new URL('sartor-mark.svg',script.src).href;
  document.querySelectorAll('link[rel~="icon"]').forEach(icon=>{
    icon.href=markUrl;
    icon.type='image/svg+xml';
  });
  document.querySelectorAll('.logo-mark').forEach(mark=>{
    const img=document.createElement('img');
    img.className='logo-mark';
    img.src=markUrl;
    img.alt='';
    img.width=34;
    img.height=34;
    mark.replaceWith(img);
  });

  document.querySelectorAll('.arch-diagram').forEach(diagram=>{
    diagram.querySelectorAll('.arch-flow').forEach((flow,index)=>{
      flow.style.setProperty('--flow-order',index);
    });
    diagram.querySelectorAll('.arch-node').forEach((node,index)=>{
      node.style.setProperty('--node-order',index);
    });
  });

  document.querySelectorAll('.stack-layer').forEach((layer,layerIndex)=>{
    layer.style.setProperty('--stack-order',layerIndex);
    layer.querySelectorAll('.stack-tag').forEach((tag,tagIndex)=>{
      tag.style.setProperty('--chip-order',tagIndex);
    });
  });

  const spotlightSelector='.g-card,.svc-detail-card,.plan-card';
  document.querySelectorAll(spotlightSelector).forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--spot-x',(event.clientX-rect.left)+'px');
      card.style.setProperty('--spot-y',(event.clientY-rect.top)+'px');
    },{passive:true});
  });


  // Carry reading progress between translated pages, whose text heights differ.
  const languagePositionKey='sd-language-position';
  const readingSections=()=>Array.from(document.querySelectorAll('section,footer'));
  const readingInset=()=>Math.max(0,document.querySelector('.nav')?.getBoundingClientRect().bottom||0)+16;
  const pagePath=path=>path.replace(/index\.html$/,'');
  document.querySelectorAll('.lang-pill a,.lang-banner-link').forEach(link=>{
    link.addEventListener('click',event=>{
      if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const target=new URL(link.href);
      if(target.origin!==location.origin)return;
      event.preventDefault();
      if(pagePath(target.pathname)===pagePath(location.pathname))return;
      const sections=readingSections(),inset=readingInset();
      const section=sections.filter(el=>el.getBoundingClientRect().top<=inset).pop()||sections[0];
      if(section){
        const rect=section.getBoundingClientRect();
        const position={
          path:pagePath(target.pathname),time:Date.now(),id:section.id,
          index:sections.indexOf(section),progress:Math.max(0,Math.min(1,(inset-rect.top)/rect.height)),
          top:window.scrollY<1
        };
        // The section hash still works if browser storage is unavailable.
        if(section.id&&!position.top)target.hash=section.id;
        try{sessionStorage.setItem(languagePositionKey,JSON.stringify(position));}catch{}
      }
      location.assign(target.href);
    });
  });

  let languagePosition;
  try{
    languagePosition=JSON.parse(sessionStorage.getItem(languagePositionKey));
    sessionStorage.removeItem(languagePositionKey);
  }catch{}
  if(languagePosition&&languagePosition.path===pagePath(location.pathname)&&Date.now()-languagePosition.time<30000){
    const section=document.getElementById(languagePosition.id)||readingSections()[languagePosition.index];
    if(section){
      let restoring=true;
      const restore=()=>{
        if(!restoring)return;
        const rect=section.getBoundingClientRect();
        const top=languagePosition.top?0:window.scrollY+rect.top+rect.height*languagePosition.progress-readingInset();
        window.scrollTo({top:Math.max(0,top),behavior:'instant'});
      };
      const stop=()=>{
        restoring=false;
        observer.disconnect();
        ['wheel','touchstart','pointerdown','keydown'].forEach(type=>window.removeEventListener(type,stop));
      };
      // Fonts and lazy-loaded images can change section positions after parsing.
      const observer=new ResizeObserver(restore);
      observer.observe(document.body);
      ['wheel','touchstart','pointerdown','keydown'].forEach(type=>window.addEventListener(type,stop,{passive:true}));
      restore();
      requestAnimationFrame(restore);
      window.addEventListener('load',restore,{once:true});
      document.fonts?.ready.then(restore);
      setTimeout(stop,3000);
    }
  }

  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const syncThemeColor=()=>{
    if(themeMeta)themeMeta.content=document.documentElement.dataset.theme==='dark'?'#0A100D':'#F6F7F4';
  };
  syncThemeColor();
  new MutationObserver(syncThemeColor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
