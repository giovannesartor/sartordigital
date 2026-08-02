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

  const spotlightSelector='.g-card,.svc-detail-card,.plan-card';
  document.querySelectorAll(spotlightSelector).forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--spot-x',(event.clientX-rect.left)+'px');
      card.style.setProperty('--spot-y',(event.clientY-rect.top)+'px');
    },{passive:true});
  });

  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const syncThemeColor=()=>{
    if(themeMeta)themeMeta.content=document.documentElement.dataset.theme==='dark'?'#0A100D':'#F6F7F4';
  };
  syncThemeColor();
  new MutationObserver(syncThemeColor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
