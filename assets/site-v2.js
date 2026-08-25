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

  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const syncThemeColor=()=>{
    if(themeMeta)themeMeta.content=document.documentElement.dataset.theme==='dark'?'#0A100D':'#F6F7F4';
  };
  syncThemeColor();
  new MutationObserver(syncThemeColor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
