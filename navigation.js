/* Add active-page state to the static, CSS-openable navigation. */
(()=>{
  const page=document.body.dataset.page||'home';
  const selected=page==='app'&&location.hash==='#this-week'?'recipes':page==='app'?'dashboard':page;
  document.querySelectorAll('[data-page-link]').forEach(link=>{
    if(link.dataset.pageLink===selected)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  const toggle=document.querySelector('.daily-side-toggle');
  if(toggle)toggle.setAttribute('aria-label',document.documentElement.lang==='de'?'Menü öffnen / schließen':'Open / close menu');
  const drawer=document.querySelector('.daily-navigation');
  if(drawer){
    document.addEventListener('click',event=>{if(drawer.open&&!drawer.contains(event.target))drawer.open=false});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&drawer.open){drawer.open=false;toggle?.focus()}});
  }
  const updateLanguage=()=>{
    if(toggle)toggle.setAttribute('aria-label',document.documentElement.lang==='de'?'Menü öffnen / schließen':'Open / close menu');
  };
  new MutationObserver(updateLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
